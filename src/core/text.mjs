// ============================================================
// マクロの text アクション: 文字 → Kanata キーストローク
//
// us  : QMK send_string と同じ (US 配列のキーコード) = Vial 本来の動作
// jis : OS 側が JIS 配列のとき、その文字が入力されるようなキーを選ぶ
// キー名は US 配列上の物理位置名 (Kanata の命名規則) で表す
// ============================================================

const LETTERS = {}
for (const c of 'abcdefghijklmnopqrstuvwxyz') {
  LETTERS[c] = c
  LETTERS[c.toUpperCase()] = `S-${c}`
}
const DIGITS = {}
for (const d of '0123456789') DIGITS[d] = d

const COMMON = { ...LETTERS, ...DIGITS, ' ': 'spc', '\n': 'ret', '\t': 'tab', ',': ',', '.': '.', '/': '/', '<': 'S-,', '>': 'S-.', '?': 'S-/', ';': ';', '-': '-' }

export const TEXT_TO_KEYS = {
  us: {
    ...COMMON,
    '!': 'S-1', '@': 'S-2', '#': 'S-3', '$': 'S-4', '%': 'S-5', '^': 'S-6', '&': 'S-7',
    '*': 'S-8', '(': 'S-9', ')': 'S-0', '_': 'S--', '=': '=', '+': 'S-=',
    '[': '[', '{': 'S-[', ']': ']', '}': 'S-]', '\\': '\\', '|': 'S-\\',
    ':': 'S-;', "'": "'", '"': "S-'", '`': 'grv', '~': 'S-grv',
  },
  jis: {
    ...COMMON,
    '!': 'S-1', '"': 'S-2', '#': 'S-3', '$': 'S-4', '%': 'S-5', '&': 'S-6', "'": 'S-7',
    '(': 'S-8', ')': 'S-9', '=': 'S--', '^': '=', '~': 'S-=', '|': 'S-¥', '¥': '¥',
    '@': '[', '`': 'S-[', '[': ']', '{': 'S-]', '+': 'S-;', ':': "'", '*': "S-'",
    ']': '\\', '}': 'S-\\', '\\': 'ro', '_': 'S-ro',
  },
}

/**
 * 文字列 → キー表現の配列 (変換できない文字は { unicode: c })
 */
export function textToKeys(text, layout = 'jis') {
  const table = TEXT_TO_KEYS[layout] || TEXT_TO_KEYS.jis
  const out = []
  for (const ch of text) {
    out.push(table[ch] !== undefined ? table[ch] : { unicode: ch })
  }
  return out
}
