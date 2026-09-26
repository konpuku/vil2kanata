// ============================================================
// Windows 固有の回避策
//
// JIS 配列の Windows では、英数 (Caps Lock) キーは日本語キーボードドライバーが
// VK_DBE_ALPHANUMERIC (240) として「押した」イベントだけを送り、「離した」イベントを送らない。
// Kanata からは押しっぱなしに見えるため、tap-hold はホールド扱いになり修飾キーが押されたままになる。
// レジストリの Scancode Map でキー自体を F13 等に置き換えると、通常どおり押す/離すが届く。
// ============================================================

// セット1 スキャンコード
export const SCANCODES = { caps: 0x3A, f13: 0x64, f14: 0x65, f15: 0x66, f16: 0x67 }

function hexBytes(n, len) {
  const out = []
  for (let i = 0; i < len; i++) out.push(((n >> (8 * i)) & 0xFF).toString(16).padStart(2, '0'))
  return out
}

/**
 * Scancode Map (.reg) を生成
 * @param {Array<[number, number]>} remaps [[元のスキャンコード, 置き換え後], ...]
 */
export function scancodeMapReg(remaps) {
  const bytes = [
    ...hexBytes(0, 4), // version
    ...hexBytes(0, 4), // flags
    ...hexBytes(remaps.length + 1, 4),
  ]
  for (const [from, to] of remaps) bytes.push(...hexBytes(to, 2), ...hexBytes(from, 2))
  bytes.push(...hexBytes(0, 4))
  return [
    'Windows Registry Editor Version 5.00',
    '',
    '; vil2kanata: JIS 英数キーを F13 に置き換え (サインアウト/再起動後に有効)',
    '; 元に戻すには vil2kanata-restore-keyboard.reg を実行してください',
    '[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]',
    `"Scancode Map"=hex:${bytes.join(',')}`,
    '',
  ].join('\r\n')
}

export function scancodeMapRestoreReg() {
  return [
    'Windows Registry Editor Version 5.00',
    '',
    '; vil2kanata: Scancode Map を削除してキー配置を元に戻す (サインアウト/再起動後に有効)',
    '[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]',
    '"Scancode Map"=-',
    '',
  ].join('\r\n')
}

export const EISU_TO_F13_REG = scancodeMapReg([[SCANCODES.caps, SCANCODES.f13]])

/**
 * regedit が確実に読める UTF-16LE (BOM 付き) に変換
 */
export function toUtf16le(text) {
  const bytes = new Uint8Array(2 + text.length * 2)
  bytes[0] = 0xFF
  bytes[1] = 0xFE
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    bytes[2 + i * 2] = c & 0xFF
    bytes[3 + i * 2] = c >> 8
  }
  return bytes
}

/**
 * Windows で「離した」イベントが届かない JIS 英数キーか
 * (旧バージョンで保存したプロジェクトはフラグが無いのでラベルでも判定)
 */
export function isWinNoReleaseKey(tk) {
  if (!tk || tk.kanataKey !== 'caps') return false
  return !!tk.winNoRelease || tk.label === '英数'
}
