// ============================================================
// Windows 固有の回避策
//
// JIS 配列の Windows では、日本語キーボードドライバーが一部の IME キーについて
// 「押した」イベントしか送らず「離した」イベントを送らない (kanata --debug で確認済み)。
// Kanata からは押しっぱなしに見えるため、tap-hold は常にホールドになり修飾キーが押されたままになる。
//
//   英数 (Caps Lock, スキャンコード 0x3A)       → Kanata では caps。離したイベントが届かない
//   カタカナ/ひらがな (スキャンコード 0x70)    → winIOv2 では KEY_KATAKANA(241) として届き、
//                                               Windows の kanata 名 `kana` (= KEY_HANGEUL) と一致しない。
//                                               さらに離したイベントも届かない
//
// レジストリの Scancode Map でキー自体を F13/F14 に置き換えると、通常どおり押す/離すが届く。
// Scancode Map は 1 つの値なので、置き換えはまとめて 1 ファイルで設定する。
// ============================================================

// セット1 スキャンコード
export const SCANCODES = { caps: 0x3A, kana: 0x70, f13: 0x64, f14: 0x65, f15: 0x66, f16: 0x67 }

// 回避が必要なキー: Kanata のキー名 → { 元スキャンコード, 置き換え先 }
export const WIN_PROBLEM_KEYS = {
  caps: { name: '英数', scancode: SCANCODES.caps, replacement: 'f13' },
  kana: { name: 'カタカナ/ひらがな', scancode: SCANCODES.kana, replacement: 'f14' },
}

function hexBytes(n, len) {
  const out = []
  for (let i = 0; i < len; i++) out.push(((n >> (8 * i)) & 0xFF).toString(16).padStart(2, '0'))
  return out
}

/**
 * Scancode Map (.reg) を生成
 * @param {Array<[number, number]>} remaps [[元のスキャンコード, 置き換え後], ...]
 */
export function scancodeMapReg(remaps, description) {
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
    `; vil2kanata: ${description} (サインアウト/再起動後に有効)`,
    '; 既存の Scancode Map は上書きされます。元に戻すには vil2kanata-restore-keyboard.reg を実行してください',
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

// 英数 → F13、カタカナ/ひらがな → F14 をまとめて設定
export const JIS_IME_KEYS_REG = scancodeMapReg(
  Object.values(WIN_PROBLEM_KEYS).map((k) => [k.scancode, SCANCODES[k.replacement]]),
  'JIS の英数キーを F13、カタカナ/ひらがなキーを F14 に置き換え',
)
export const JIS_IME_KEYS_REG_FILENAME = 'vil2kanata-jis-ime-keys-to-f13-f14.reg'

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
 * Windows で正しく扱えない JIS の IME キーなら、その回避情報を返す (該当しなければ null)
 * JIS プリセット由来のキー (winNoRelease フラグ、または旧バージョンのラベル) のみ対象
 */
export function winProblemKey(tk) {
  if (!tk) return null
  const info = WIN_PROBLEM_KEYS[tk.kanataKey]
  if (!info) return null
  const fromJisPreset = tk.winNoRelease || tk.label === '英数' || tk.label === 'かな'
  return fromJisPreset ? info : null
}
