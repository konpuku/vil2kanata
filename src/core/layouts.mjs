// ============================================================
// ターゲット (ノートPC 等) の物理配列プリセット
//
// 行定義: [y, items, h?]  items の要素は
//   'kanataKey|ラベル|幅'  (ラベル・幅は省略可)
//   数値                    → 横方向の隙間 (キー単位)
//   { k, l, w, h, dy }      → 高さ・縦位置の個別指定
// kanataKey が空のキー ('' ) は OS から見えないキー (Fn 等) として扱い、対応付け対象外になる
// ============================================================

function row(y, items, h = 1) {
  let x = 0
  const keys = []
  for (const item of items) {
    if (typeof item === 'number') {
      x += item
      continue
    }
    let spec = item
    if (typeof item === 'string') {
      const [k, l, w] = item.split('|')
      spec = { k, l, w: w ? parseFloat(w) : 1 }
    }
    const w = spec.w ?? 1
    const key = {
      x,
      y: y + (spec.dy || 0),
      w,
      h: spec.h ?? h,
      kanataKey: spec.k,
      label: spec.l || spec.k,
    }
    if (!spec.k) key.fixed = true
    if (spec.winNoRelease) key.winNoRelease = true
    keys.push(key)
    if (!spec.stack) x += w
  }
  return keys
}

// Fn 行は 16 キーを 15u 幅に収める
const fnWidth = (item) => `${item}|${15 / 16}`

// JIS の英数キー: Windows の日本語キーボードドライバーはこのキーの「離した」イベントを送らない
const EISU = { k: 'caps', l: '英数', w: 1.75, winNoRelease: true }
// カタカナ/ひらがなキー: 同様に離したイベントが届かず、Windows の kanata 名 kana とも一致しない
const KANA = { k: 'kana', l: 'かな', w: 1.25, winNoRelease: true }

const NUM_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
const Q_ROW = ['q|Q', 'w|W', 'e|E', 'r|R', 't|T', 'y|Y', 'u|U', 'i|I', 'o|O', 'p|P']
const A_ROW = ['a|A', 's|S', 'd|D', 'f|F', 'g|G', 'h|H', 'j|J', 'k|K', 'l|L']
const Z_ROW = ['z|Z', 'x|X', 'c|C', 'v|V', 'b|B', 'n|N', 'm|M']
const F_ROW = ['esc|Esc', 1, 'f1|F1', 'f2|F2', 'f3|F3', 'f4|F4', 0.5, 'f5|F5', 'f6|F6', 'f7|F7', 'f8|F8', 0.5,
  'f9|F9', 'f10|F10', 'f11|F11', 'f12|F12']

const US_ROWS = (y) => [
  row(y, ['grv|`', ...NUM_ROW, '-', '=', 'bspc|Bksp|2']),
  row(y + 1, ['tab|Tab|1.5', ...Q_ROW, '[', ']', '\\|\\|1.5']),
  row(y + 2, ['caps|Caps|1.75', ...A_ROW, ';', "'", 'ret|Enter|2.25']),
  row(y + 3, ['lsft|LShift|2.25', ...Z_ROW, ',', '.', '/', 'rsft|RShift|2.75']),
  row(y + 4, ['lctl|LCtrl|1.25', 'lmet|Win|1.25', 'lalt|LAlt|1.25', 'spc|Space|6.25',
    'ralt|RAlt|1.25', 'rmet|Win|1.25', 'menu|Menu|1.25', 'rctl|RCtrl|1.25']),
]

export const LAYOUT_PRESETS = {
  'jis-laptop': {
    name: 'JIS ノートPC (Fn・矢印付き)',
    keyLabelMode: 'jis',
    rows: [
      row(0, ['esc|Esc', 'f1|F1', 'f2|F2', 'f3|F3', 'f4|F4', 'f5|F5', 'f6|F6', 'f7|F7', 'f8|F8',
        'f9|F9', 'f10|F10', 'f11|F11', 'f12|F12', 'prnt|PrtSc', 'ins|Insert', 'del|Delete'].map(fnWidth), 0.75),
      row(0.75, ['grv|半/全', ...NUM_ROW, '-', '=|^', '¥|¥', 'bspc|BS']),
      row(1.75, ['tab|Tab|1.5', ...Q_ROW, '[|@', ']|[', 0.25, { k: 'ret', l: 'Enter', w: 1.25, h: 2 }]),
      row(2.75, [EISU, ...A_ROW, ';', "'|:", '\\|]']),
      row(3.75, ['lsft|Shift|2.25', ...Z_ROW, ',', '.', '/', 'ro|\\ ろ', 'rsft|Shift|1.75']),
      row(4.75, [{ k: '', l: 'Fn', w: 1 }, 'lctl|Ctrl', 'lmet|Win', 'lalt|Alt', 'mhnk|無変換|1.25', 'spc|Space|3.25',
        'henk|変換|1.25', KANA, 'menu|Menu', 'left|←',
        { k: 'up', l: '↑', h: 0.5, stack: true }, { k: 'down', l: '↓', h: 0.5, dy: 0.5 }, 'rght|→']),
    ],
  },
  'jis-60': {
    name: 'JIS 60%',
    keyLabelMode: 'jis',
    rows: [
      row(0, ['grv|半/全', ...NUM_ROW, '-', '=|^', '¥|¥', 'bspc|BS']),
      row(1, ['tab|Tab|1.5', ...Q_ROW, '[|@', ']|[', 0.25, { k: 'ret', l: 'Enter', w: 1.25, h: 2 }]),
      row(2, [EISU, ...A_ROW, ';', "'|:", '\\|]']),
      row(3, ['lsft|Shift|2.25', ...Z_ROW, ',', '.', '/', 'ro|\\ ろ', 'rsft|Shift|1.75']),
      row(4, ['lctl|Ctrl|1.25', 'lmet|Win|1.25', 'lalt|Alt|1.25', 'mhnk|無変換|1.25', 'spc|Space|3.5',
        'henk|変換|1.25', KANA, 'ralt|Alt|1.25', 'menu|Menu|1.25', 'rctl|Ctrl|1.25']),
    ],
  },
  'us-ansi-60': {
    name: 'US ANSI 60%',
    keyLabelMode: 'us',
    rows: US_ROWS(0),
  },
  'us-ansi-fn': {
    name: 'US ANSI Fn Row',
    keyLabelMode: 'us',
    rows: [row(0, F_ROW), ...US_ROWS(1.5)],
  },
  'us-ansi-tkl': {
    name: 'US ANSI TKL',
    keyLabelMode: 'us',
    rows: [
      row(0, [...F_ROW, 0.5, 'prnt|PrtSc', 'slck|ScrLk', 'pause|Pause']),
      row(1.5, ['grv|`', ...NUM_ROW, '-', '=', 'bspc|Bksp|2', 0.5, 'ins|Ins', 'home|Home', 'pgup|PgUp']),
      row(2.5, ['tab|Tab|1.5', ...Q_ROW, '[', ']', '\\|\\|1.5', 0.5, 'del|Del', 'end|End', 'pgdn|PgDn']),
      row(3.5, ['caps|Caps|1.75', ...A_ROW, ';', "'", 'ret|Enter|2.25']),
      row(4.5, ['lsft|LShift|2.25', ...Z_ROW, ',', '.', '/', 'rsft|RShift|2.75', 1.5, 'up|↑']),
      row(5.5, ['lctl|LCtrl|1.25', 'lmet|Win|1.25', 'lalt|LAlt|1.25', 'spc|Space|6.25',
        'ralt|RAlt|1.25', 'rmet|Win|1.25', 'menu|Menu|1.25', 'rctl|RCtrl|1.25', 0.5, 'left|←', 'down|↓', 'rght|→']),
    ],
  },
}

export function getLayoutPresets() {
  return Object.entries(LAYOUT_PRESETS).map(([id, p]) => ({ id, name: p.name }))
}

/**
 * プリセット → フラットな物理キー配列
 */
export function getPresetKeys(layoutId) {
  const preset = LAYOUT_PRESETS[layoutId]
  if (!preset) throw new Error(`未知のレイアウト: ${layoutId}`)
  return preset.rows.flat().map((k) => ({ ...k }))
}
