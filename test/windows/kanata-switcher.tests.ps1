# kanata-switcher のロジックテスト (Pester 不要。pwsh / Windows PowerShell で実行)
$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot '..\..\tools\windows\kanata-switcher\kanata-switcher.ps1'
$script = [System.IO.Path]::GetFullPath(($script -replace '\\', [System.IO.Path]::DirectorySeparatorChar))

# 構文チェック (トレイ部分を含むファイル全体)
$tokens = $null; $errors = $null
[System.Management.Automation.Language.Parser]::ParseFile($script, [ref]$tokens, [ref]$errors) | Out-Null
if ($errors.Count -gt 0) { throw "構文エラー: $($errors | ForEach-Object { $_.Message + ' @' + $_.Extent.StartLineNumber })" }

. $script -NoRun

$failed = 0
function Assert-Equal($Actual, $Expected, [string]$Name) {
    if ("$Actual" -ne "$Expected") {
        Write-Host "FAIL: $Name`n  expected: $Expected`n  actual:   $Actual"
        $script:failed++
    } else {
        Write-Host "ok: $Name"
    }
}

# VID/PID 抽出
Assert-Equal (Get-VidPid 'USB\VID_FEED&PID_6060\6&1A2B3C&0&2') 'VID_FEED&PID_6060' 'USB の VID/PID'
Assert-Equal (Get-VidPid 'HID\VID_feed&PID_6060&MI_00\7&abc&0&0000') 'VID_FEED&PID_6060' 'HID (小文字) の VID/PID'
Assert-Equal (Get-VidPid 'HID\{00001812-0000-1000-8000-00805F9B34FB}_VID&0002046D_PID&B342&COL01\8&x') 'VID&0002046D_PID&B342' 'Bluetooth の VID/PID'
Assert-Equal (Get-VidPid 'ACPI\PNP0303\4&1D9E62C1&0') '' 'ACPI (内蔵キーボード) は対象外'

# 接続判定
$devices = @(
    [pscustomobject]@{ Name = 'HID キーボード デバイス'; DeviceID = 'HID\VID_FEED&PID_6060&MI_00\7&1'; PNPClass = 'Keyboard' },
    [pscustomobject]@{ Name = 'USB 入力デバイス'; DeviceID = 'USB\VID_FEED&PID_6060&MI_01\7&2'; PNPClass = 'HIDClass' },
    [pscustomobject]@{ Name = 'Standard PS/2 Keyboard'; DeviceID = 'ACPI\PNP0303\4&1'; PNPClass = 'Keyboard' },
    [pscustomobject]@{ Name = 'USB マウス'; DeviceID = 'HID\VID_046D&PID_C52B&MI_01\8&3'; PNPClass = 'Mouse' }
)
Assert-Equal (Test-DeviceConnected @('VID_FEED&PID_6060') $devices) 'True' '登録キーボード接続中'
Assert-Equal (Test-DeviceConnected @('vid_feed&pid_6060') $devices) 'True' '大文字小文字を区別しない'
Assert-Equal (Test-DeviceConnected @('VID_1234&PID_5678') $devices) 'False' '未接続'
Assert-Equal (Test-DeviceConnected @() $devices) 'False' '未登録'

# 登録候補 (キーボードを先頭、マウスは除外、VID/PID ごとにまとめる)
$cands = Get-KeyboardCandidates $devices
Assert-Equal $cands.Count 1 '候補数'
Assert-Equal $cands[0].Id 'VID_FEED&PID_6060' '候補の ID'
Assert-Equal $cands[0].IsKeyboard 'True' 'キーボードとして認識'
Assert-Equal $cands[0].Names.Count 2 '同じ VID/PID の名前をまとめる'

# 状態判定
Assert-Equal (Get-DesiredState 'auto' $true $true).Enabled 'False' '自動: 接続中は無効'
Assert-Equal (Get-DesiredState 'auto' $false $true).Enabled 'True' '自動: 未接続は有効'
Assert-Equal (Get-DesiredState 'auto' $false $false).Enabled 'True' '自動: 未登録は有効'
Assert-Equal (Get-DesiredState 'on' $true $true).Enabled 'True' '常に有効'
Assert-Equal (Get-DesiredState 'off' $false $true).Enabled 'False' '常に無効'

# 設定の読み書き (既定値の補完・不正値の修正・相対パス解決)
$tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("ks-" + [guid]::NewGuid() + '.json')
Set-Content -LiteralPath $tmp -Value '{ "deviceIds": "VID_FEED&PID_6060", "mode": "bogus", "pollIntervalMs": 10 }' -Encoding UTF8
$cfg = Read-SwitcherConfig $tmp
Assert-Equal $cfg.deviceIds.Count 1 '単一の deviceIds を配列に'
Assert-Equal $cfg.mode 'auto' '不正な mode は auto'
Assert-Equal $cfg.pollIntervalMs 500 'ポーリング間隔の下限'
Assert-Equal $cfg.kanataArgs '-n' '既定値の補完'
$cfg.deviceIds = @('VID_FEED&PID_6060', 'VID_1111&PID_2222')
Save-SwitcherConfig $cfg $tmp
$cfg2 = Read-SwitcherConfig $tmp
Assert-Equal ($cfg2.deviceIds -join ',') 'VID_FEED&PID_6060,VID_1111&PID_2222' '保存と再読込'
Remove-Item -LiteralPath $tmp
$abs = if ($IsWindows -or $env:OS -eq 'Windows_NT') { 'C:\kanata\kanata.exe' } else { '/opt/kanata/kanata' }
Assert-Equal (Resolve-ConfigPath $abs) $abs '絶対パスはそのまま'
Assert-Equal ([System.IO.Path]::IsPathRooted((Resolve-ConfigPath 'keymap.kbd'))) 'True' '相対パスはスクリプトのフォルダ基準'

if ($failed -gt 0) { throw "$failed 件失敗" }
Write-Host 'all passed'
