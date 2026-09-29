<#
============================================================
 kanata-switcher
 自作キーボードの接続状態に応じて kanata を自動で起動/停止するタスクトレイ常駐ツール

 - 自作キーボードが接続されている間は kanata を停止 (リマップ無効)
 - 自作キーボードが外れると kanata を起動 (リマップ有効)
 - タスクトレイのアイコンで 自動 / 常に有効 / 常に無効 を切り替え
   (アイコンのダブルクリックで有効/無効を切り替え)

 設定は同じフォルダの kanata-switcher.json に保存されます。
 起動は start-kanata-switcher.vbs から (PowerShell のウィンドウを出さずに起動できます)。

 必要なもの: Windows 10/11 標準の Windows PowerShell 5.1 (追加インストール不要)
============================================================
#>
param(
    # テスト用: 関数定義だけ読み込み、トレイアプリは起動しない
    [switch]$NoRun
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

$script:AppName = 'kanata-switcher'
$script:BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$script:ConfigPath = Join-Path $script:BaseDir 'kanata-switcher.json'

# ============================================================
# 設定
# ============================================================

function New-DefaultConfig {
    [ordered]@{
        kanataExe      = 'kanata_windows_tty_winIOv2_x64.exe'
        kanataConfig   = 'keymap.kbd'
        kanataArgs     = '-n'
        deviceIds      = @()
        mode           = 'auto'
        pollIntervalMs = 2000
    }
}

function Read-SwitcherConfig([string]$Path) {
    $cfg = New-DefaultConfig
    if (Test-Path -LiteralPath $Path) {
        $raw = Get-Content -LiteralPath $Path -Raw -Encoding UTF8
        if ($raw.Trim()) {
            $json = $raw | ConvertFrom-Json
            foreach ($key in @($cfg.Keys)) {
                if ($json.PSObject.Properties.Name -contains $key) { $cfg[$key] = $json.$key }
            }
        }
    }
    $cfg.deviceIds = @($cfg.deviceIds | Where-Object { $_ } | ForEach-Object { [string]$_ })
    if (@('auto', 'on', 'off') -notcontains $cfg.mode) { $cfg.mode = 'auto' }
    $cfg.pollIntervalMs = [Math]::Max(500, [int]$cfg.pollIntervalMs)
    return $cfg
}

function Save-SwitcherConfig($Config, [string]$Path) {
    $json = $Config | ConvertTo-Json -Depth 4
    # PowerShell 5.1 でも日本語パスを正しく読めるよう BOM 付き UTF-8 で保存
    [System.IO.File]::WriteAllText($Path, $json, (New-Object System.Text.UTF8Encoding($true)))
}

# 相対パスは kanata-switcher のフォルダ基準で解決
function Resolve-ConfigPath([string]$Value) {
    if (-not $Value) { return $null }
    $expanded = [Environment]::ExpandEnvironmentVariables($Value)
    if ([System.IO.Path]::IsPathRooted($expanded)) { return $expanded }
    return [System.IO.Path]::GetFullPath((Join-Path $script:BaseDir $expanded))
}

# ============================================================
# デバイス検出
# ============================================================

# デバイス ID から VID/PID 部分を取り出す
#   USB:       USB\VID_FEED&PID_6060\...          → VID_FEED&PID_6060
#   HID:       HID\VID_FEED&PID_6060&MI_00\...    → VID_FEED&PID_6060
#   Bluetooth: HID\{...}_VID&0002046D_PID&B342... → VID&0002046D_PID&B342
function Get-VidPid([string]$DeviceId) {
    if (-not $DeviceId) { return $null }
    $m = [regex]::Match($DeviceId, 'VID[_&][0-9A-F]{4,8}[&_]PID[_&][0-9A-F]{4}', 'IgnoreCase')
    if ($m.Success) { return $m.Value.ToUpperInvariant() }
    return $null
}

# 現在接続されている (Present な) PnP デバイス
function Get-PresentDevices {
    Get-CimInstance -ClassName Win32_PnPEntity -Filter "DeviceID LIKE '%VID%PID%'" -ErrorAction SilentlyContinue |
        Select-Object Name, DeviceID, PNPClass
}

# 登録済みの自作キーボードが 1 つでも接続されているか
function Test-DeviceConnected([string[]]$DeviceIds, $Devices) {
    if (-not $DeviceIds -or $DeviceIds.Count -eq 0) { return $false }
    foreach ($dev in @($Devices)) {
        $id = [string]$dev.DeviceID
        foreach ($want in $DeviceIds) {
            if ($id.IndexOf($want, [StringComparison]::OrdinalIgnoreCase) -ge 0) { return $true }
        }
    }
    return $false
}

# 登録ダイアログ用: キーボード/HID デバイスを VID/PID ごとにまとめる
function Get-KeyboardCandidates($Devices) {
    $groups = [ordered]@{}
    foreach ($dev in @($Devices)) {
        $class = [string]$dev.PNPClass
        if (@('Keyboard', 'HIDClass', 'USB') -notcontains $class) { continue }
        $vp = Get-VidPid ([string]$dev.DeviceID)
        if (-not $vp) { continue }
        if (-not $groups.Contains($vp)) {
            $groups[$vp] = [pscustomobject]@{ Id = $vp; Names = New-Object System.Collections.Generic.List[string]; IsKeyboard = $false }
        }
        if ($dev.Name -and -not $groups[$vp].Names.Contains([string]$dev.Name)) { $groups[$vp].Names.Add([string]$dev.Name) }
        if ($class -eq 'Keyboard') { $groups[$vp].IsKeyboard = $true }
    }
    # キーボードとして認識されているものを先頭に
    return @($groups.Values | Sort-Object @{ Expression = { -not $_.IsKeyboard } }, Id)
}

# ============================================================
# 状態判定 (純粋関数: テスト可能)
# ============================================================

# 戻り値: @{ Enabled = bool; Reason = string }
function Get-DesiredState([string]$Mode, [bool]$DeviceConnected, [bool]$HasDevices) {
    switch ($Mode) {
        'on' { return @{ Enabled = $true; Reason = '常に有効' } }
        'off' { return @{ Enabled = $false; Reason = '常に無効' } }
        default {
            if (-not $HasDevices) { return @{ Enabled = $true; Reason = '自動 (自作キーボード未登録)' } }
            if ($DeviceConnected) { return @{ Enabled = $false; Reason = '自動: 自作キーボード接続中' } }
            return @{ Enabled = $true; Reason = '自動: 自作キーボード未接続' }
        }
    }
}

if ($NoRun) { return }

# ============================================================
# ここからトレイアプリ本体
# ============================================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
[System.Windows.Forms.Application]::EnableVisualStyles()

# 多重起動防止 (2 つ動くと kanata も 2 重に起動してしまうため)
$createdNew = $false
$script:Mutex = New-Object System.Threading.Mutex($true, 'Local\kanata-switcher-vil2kanata', [ref]$createdNew)
if (-not $createdNew) {
    [System.Windows.Forms.MessageBox]::Show('kanata-switcher は既に起動しています (タスクトレイを確認してください)。', $script:AppName) | Out-Null
    return
}

$script:FirstRun = -not (Test-Path -LiteralPath $script:ConfigPath)
$script:Config = Read-SwitcherConfig $script:ConfigPath
if ($script:FirstRun) { Save-SwitcherConfig $script:Config $script:ConfigPath }

$script:Process = $null        # 起動した kanata プロセス
$script:Failures = @()         # 直近の異常終了時刻 (連続失敗の検出用)
$script:ErrorMessage = $null   # エラー状態のメッセージ
$script:LastState = $null

# ------------------------------------------------------------
# アイコン (色 + 文字で状態を表示)
# ------------------------------------------------------------
function New-StateIcon([System.Drawing.Color]$Color, [string]$Text) {
    $bmp = New-Object System.Drawing.Bitmap 32, 32
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.TextRenderingHint = 'AntiAliasGridFit'
    $brush = New-Object System.Drawing.SolidBrush $Color
    $g.FillEllipse($brush, 1, 1, 30, 30)
    $font = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = 'Center'
    $fmt.LineAlignment = 'Center'
    $g.DrawString($Text, $font, [System.Drawing.Brushes]::White, (New-Object System.Drawing.RectangleF(0, 1, 32, 32)), $fmt)
    $g.Dispose()
    return [System.Drawing.Icon]::FromHandle($bmp.GetHicon())
}

$script:Icons = @{
    enabled  = New-StateIcon ([System.Drawing.Color]::FromArgb(46, 158, 79)) 'K'    # 緑: 有効
    disabled = New-StateIcon ([System.Drawing.Color]::FromArgb(120, 120, 120)) 'K'  # 灰: 無効
    external = New-StateIcon ([System.Drawing.Color]::FromArgb(0, 119, 187)) 'K'    # 青: 自作キーボード接続中で無効
    error    = New-StateIcon ([System.Drawing.Color]::FromArgb(204, 51, 17)) '!'    # 赤: エラー
}

# ------------------------------------------------------------
# kanata の起動/停止
# ------------------------------------------------------------
function Test-KanataRunning {
    return ($null -ne $script:Process) -and (-not $script:Process.HasExited)
}

function Start-Kanata {
    if (Test-KanataRunning) { return }
    $exe = Resolve-ConfigPath $script:Config.kanataExe
    $cfg = Resolve-ConfigPath $script:Config.kanataConfig
    if (-not $exe -or -not (Test-Path -LiteralPath $exe)) {
        Set-Error "kanata の実行ファイルが見つかりません: $exe`n設定ファイルの kanataExe を確認してください。"
        return
    }
    if (-not $cfg -or -not (Test-Path -LiteralPath $cfg)) {
        Set-Error "kanata の設定ファイルが見つかりません: $cfg`n設定ファイルの kanataConfig を確認してください。"
        return
    }
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $exe
    $psi.Arguments = ('--cfg "{0}" {1}' -f $cfg, $script:Config.kanataArgs).Trim()
    $psi.WorkingDirectory = Split-Path -Parent $cfg
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $script:Process = [System.Diagnostics.Process]::Start($psi)
    $script:ProcessStartedAt = Get-Date
}

function Stop-Kanata {
    if (Test-KanataRunning) {
        try {
            $script:Process.Kill()
            $script:Process.WaitForExit(3000) | Out-Null
        } catch {
            # 既に終了している場合など
            $null = $_
        }
    }
    $script:Process = $null
}

# 前回異常終了などで残った kanata (同じ実行ファイル) を停止する。2 重起動すると 2 重にリマップされるため
function Stop-OrphanKanata {
    $exe = Resolve-ConfigPath $script:Config.kanataExe
    if (-not $exe) { return }
    $name = [System.IO.Path]::GetFileNameWithoutExtension($exe)
    Get-Process -Name $name -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            if ($_.Path -and ([System.IO.Path]::GetFullPath($_.Path) -eq [System.IO.Path]::GetFullPath($exe))) { $_.Kill() }
        } catch {
            # 他ユーザーのプロセス等でパスを取得できない場合は無視
            $null = $_
        }
    }
}

function Set-Error([string]$Message) {
    $script:ErrorMessage = $Message
    $script:Tray.ShowBalloonTip(8000, $script:AppName, $Message, [System.Windows.Forms.ToolTipIcon]::Error)
}

# ------------------------------------------------------------
# 状態の更新 (タイマーから定期実行)
# ------------------------------------------------------------
function Update-State {
    $devices = if ($script:Config.mode -eq 'auto' -and $script:Config.deviceIds.Count -gt 0) { Get-PresentDevices } else { @() }
    $connected = Test-DeviceConnected $script:Config.deviceIds $devices
    $desired = Get-DesiredState $script:Config.mode $connected ($script:Config.deviceIds.Count -gt 0)

    if ($desired.Enabled) {
        # 起動直後に終了した場合は設定エラーとみなして再起動を止める
        if ($null -ne $script:Process -and $script:Process.HasExited) {
            $lived = ((Get-Date) - $script:ProcessStartedAt).TotalSeconds
            $script:Process = $null
            if ($lived -lt 5) {
                $script:Failures = @($script:Failures | Where-Object { ((Get-Date) - $_).TotalSeconds -lt 60 }) + @(Get-Date)
                if ($script:Failures.Count -ge 3 -and -not $script:ErrorMessage) {
                    Set-Error "kanata が起動直後に終了しました。設定ファイルにエラーがないか、コマンドプロンプトで`n  kanata.exe --cfg <設定ファイル> --check`nを実行して確認してください。修正後はメニューの「kanata を再起動」を押してください。"
                }
            }
        }
        if (-not $script:ErrorMessage) { Start-Kanata }
    } else {
        Stop-Kanata
    }

    $running = Test-KanataRunning
    $stateKey = if ($script:ErrorMessage) { 'error' } elseif ($running) { 'enabled' } elseif ($connected) { 'external' } else { 'disabled' }
    $label = switch ($stateKey) {
        'error' { 'エラー' }
        'enabled' { 'リマップ有効' }
        default { 'リマップ無効' }
    }
    $text = "$label ($($desired.Reason))"
    if ($script:LastState -ne "$stateKey|$text") {
        $script:LastState = "$stateKey|$text"
        $script:Tray.Icon = $script:Icons[$stateKey]
        # NotifyIcon.Text は 63 文字まで
        $tip = "kanata: $text"
        $script:Tray.Text = if ($tip.Length -gt 63) { $tip.Substring(0, 63) } else { $tip }
        $script:StatusItem.Text = "状態: $text"
    }
    foreach ($item in $script:ModeItems.GetEnumerator()) { $item.Value.Checked = ($item.Key -eq $script:Config.mode) }
}

function Set-Mode([string]$Mode) {
    $script:Config.mode = $Mode
    Save-SwitcherConfig $script:Config $script:ConfigPath
    Update-State
}

function Restart-Kanata {
    $script:ErrorMessage = $null
    $script:Failures = @()
    $script:Config = Read-SwitcherConfig $script:ConfigPath
    $script:Timer.Interval = $script:Config.pollIntervalMs
    Stop-Kanata
    Update-State
}

# ------------------------------------------------------------
# 自作キーボードの登録ダイアログ
# ------------------------------------------------------------
function Show-DeviceDialog {
    $form = New-Object System.Windows.Forms.Form
    $form.Text = '自作キーボードの登録'
    $form.Size = New-Object System.Drawing.Size(640, 440)
    $form.StartPosition = 'CenterScreen'
    $form.TopMost = $true

    $label = New-Object System.Windows.Forms.Label
    $label.Text = "接続中のデバイスです。自作キーボードにチェックを入れてください (ノートPC本体のキーボードは選ばないでください)。`n分からない場合は、自作キーボードを抜き差しして [更新] を押し、増減した項目を選んでください。"
    $label.SetBounds(10, 8, 610, 40)
    $form.Controls.Add($label)

    $list = New-Object System.Windows.Forms.CheckedListBox
    $list.SetBounds(10, 52, 605, 300)
    $list.CheckOnClick = $true
    $form.Controls.Add($list)

    $fill = {
        $list.Items.Clear()
        $script:DialogCandidates = Get-KeyboardCandidates (Get-PresentDevices)
        foreach ($c in $script:DialogCandidates) {
            $kind = if ($c.IsKeyboard) { '[キーボード] ' } else { '' }
            $idx = $list.Items.Add(('{0}{1}  —  {2}' -f $kind, $c.Id, ($c.Names -join ' / ')))
            if ($script:Config.deviceIds -contains $c.Id) { $list.SetItemChecked($idx, $true) }
        }
        # 登録済みだが現在未接続のもの
        foreach ($id in $script:Config.deviceIds) {
            if (-not ($script:DialogCandidates | Where-Object { $_.Id -eq $id })) {
                $script:DialogCandidates += [pscustomobject]@{ Id = $id; Names = @('(未接続)'); IsKeyboard = $false }
                $idx = $list.Items.Add("$id  —  (登録済み・未接続)")
                $list.SetItemChecked($idx, $true)
            }
        }
    }
    & $fill

    $refresh = New-Object System.Windows.Forms.Button
    $refresh.Text = '更新'
    $refresh.SetBounds(10, 362, 90, 28)
    $refresh.Add_Click($fill)
    $form.Controls.Add($refresh)

    $ok = New-Object System.Windows.Forms.Button
    $ok.Text = '保存'
    $ok.SetBounds(425, 362, 90, 28)
    $ok.DialogResult = [System.Windows.Forms.DialogResult]::OK
    $form.Controls.Add($ok)
    $form.AcceptButton = $ok

    $cancel = New-Object System.Windows.Forms.Button
    $cancel.Text = 'キャンセル'
    $cancel.SetBounds(525, 362, 90, 28)
    $cancel.DialogResult = [System.Windows.Forms.DialogResult]::Cancel
    $form.Controls.Add($cancel)
    $form.CancelButton = $cancel

    if ($form.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $ids = @()
        foreach ($i in $list.CheckedIndices) { $ids += $script:DialogCandidates[$i].Id }
        $script:Config.deviceIds = @($ids | Select-Object -Unique)
        Save-SwitcherConfig $script:Config $script:ConfigPath
        Update-State
    }
    $form.Dispose()
}

# ------------------------------------------------------------
# スタートアップ登録 (Windows 起動時に自動実行)
# ------------------------------------------------------------
$script:StartupLink = Join-Path ([Environment]::GetFolderPath('Startup')) 'kanata-switcher.lnk'

function Set-Startup([bool]$Enable) {
    if ($Enable) {
        $shell = New-Object -ComObject WScript.Shell
        $lnk = $shell.CreateShortcut($script:StartupLink)
        $lnk.TargetPath = Join-Path $env:WINDIR 'System32\wscript.exe'
        $lnk.Arguments = '"{0}"' -f (Join-Path $script:BaseDir 'start-kanata-switcher.vbs')
        $lnk.WorkingDirectory = $script:BaseDir
        $lnk.Description = 'kanata-switcher'
        $lnk.Save()
    } elseif (Test-Path -LiteralPath $script:StartupLink) {
        Remove-Item -LiteralPath $script:StartupLink -Force
    }
}

# ------------------------------------------------------------
# トレイアイコンとメニュー
# ------------------------------------------------------------
$script:Tray = New-Object System.Windows.Forms.NotifyIcon
$script:Tray.Icon = $script:Icons.disabled
$script:Tray.Text = 'kanata-switcher'
$script:Tray.Visible = $true

$menu = New-Object System.Windows.Forms.ContextMenuStrip
$script:StatusItem = New-Object System.Windows.Forms.ToolStripMenuItem '状態: -'
$script:StatusItem.Enabled = $false
[void]$menu.Items.Add($script:StatusItem)
[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))

$script:ModeItems = [ordered]@{}
foreach ($m in @(
        @{ Key = 'auto'; Text = '自動 (自作キーボード接続中は無効)' },
        @{ Key = 'on'; Text = '常に有効' },
        @{ Key = 'off'; Text = '常に無効' })) {
    $item = New-Object System.Windows.Forms.ToolStripMenuItem $m.Text
    $item.Tag = $m.Key
    $item.Add_Click({ param($menuItem) Set-Mode ([string]$menuItem.Tag) })
    $script:ModeItems[$m.Key] = $item
    [void]$menu.Items.Add($item)
}
[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))

$regItem = New-Object System.Windows.Forms.ToolStripMenuItem '自作キーボードを登録...'
$regItem.Add_Click({ Show-DeviceDialog })
[void]$menu.Items.Add($regItem)

$restartItem = New-Object System.Windows.Forms.ToolStripMenuItem 'kanata を再起動 (設定を再読み込み)'
$restartItem.Add_Click({ Restart-Kanata })
[void]$menu.Items.Add($restartItem)

$openItem = New-Object System.Windows.Forms.ToolStripMenuItem '設定ファイルを開く'
$openItem.Add_Click({ Start-Process notepad.exe -ArgumentList ('"{0}"' -f $script:ConfigPath) })
[void]$menu.Items.Add($openItem)

$startupItem = New-Object System.Windows.Forms.ToolStripMenuItem 'Windows 起動時に自動実行'
$startupItem.Checked = Test-Path -LiteralPath $script:StartupLink
$startupItem.Add_Click({
        param($menuItem)
        $enable = -not (Test-Path -LiteralPath $script:StartupLink)
        Set-Startup $enable
        $menuItem.Checked = $enable
    })
[void]$menu.Items.Add($startupItem)
[void]$menu.Items.Add((New-Object System.Windows.Forms.ToolStripSeparator))

$exitItem = New-Object System.Windows.Forms.ToolStripMenuItem '終了 (kanata も停止)'
$exitItem.Add_Click({
        $script:Timer.Stop()
        Stop-Kanata
        $script:Tray.Visible = $false
        [System.Windows.Forms.Application]::Exit()
    })
[void]$menu.Items.Add($exitItem)

$script:Tray.ContextMenuStrip = $menu

# ダブルクリック: 今の状態の逆を「常に有効/常に無効」で固定 (自動に戻すにはメニューから)
$script:Tray.Add_MouseDoubleClick({
        if (Test-KanataRunning) { Set-Mode 'off' } else { Set-Mode 'on' }
    })

$script:Timer = New-Object System.Windows.Forms.Timer
$script:Timer.Interval = $script:Config.pollIntervalMs
$script:Timer.Add_Tick({
        try { Update-State } catch { $script:Tray.Text = 'kanata-switcher: 状態の取得に失敗' }
    })

Stop-OrphanKanata
Update-State
$script:Timer.Start()

if ($script:FirstRun -or $script:Config.deviceIds.Count -eq 0) {
    $script:Tray.ShowBalloonTip(8000, $script:AppName,
        'タスクトレイのアイコンを右クリックし「自作キーボードを登録...」から自作キーボードを選んでください。kanata の実行ファイルと設定ファイルの場所は「設定ファイルを開く」で指定します。',
        [System.Windows.Forms.ToolTipIcon]::Info)
}

try {
    [System.Windows.Forms.Application]::Run()
} finally {
    Stop-Kanata
    $script:Tray.Dispose()
    $script:Mutex.ReleaseMutex()
}
