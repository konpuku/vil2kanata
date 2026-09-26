// ============================================================
// KLE (keyboard-layout-editor) 形式の解析と vial.json の読み込み
//
// vial-gui の kle_serial.py / keyboard_comm.py の挙動に準拠:
//  - labels[0] が "row,col" のキーがマトリクス上のキー
//  - labels[4] == "e" のキーはエンコーダー
//  - labels[8] が "layoutIndex,option" のキーはレイアウトオプション依存
// ============================================================

const LABEL_MAP = [
  [0, 6, 2, 8, 9, 11, 3, 5, 1, 4, 7, 10],
  [1, 7, -1, -1, 9, 11, 4, -1, -1, -1, -1, 10],
  [3, -1, 5, -1, 9, 11, -1, -1, 4, -1, -1, 10],
  [4, -1, -1, -1, 9, 11, -1, -1, -1, -1, -1, 10],
  [0, 6, 2, 8, 10, -1, 3, 5, 1, 4, 7, -1],
  [1, 7, -1, -1, 10, -1, 4, -1, -1, -1, -1, -1],
  [3, -1, 5, -1, 10, -1, -1, -1, 4, -1, -1, -1],
  [4, -1, -1, -1, 10, -1, -1, -1, -1, -1, -1, -1],
]

function reorderLabels(labels, align) {
  const out = new Array(12).fill(null)
  const map = LABEL_MAP[align] || LABEL_MAP[4]
  labels.forEach((label, i) => {
    if (label && i < 12 && map[i] >= 0) out[map[i]] = label
  })
  return out
}

/**
 * KLE の rows 配列 → キー配列 [{x, y, w, h, r, rx, ry, labels, decal}]
 */
export function deserializeKle(rows) {
  const keys = []
  const current = { x: 0, y: 0, w: 1, h: 1, r: 0, rx: 0, ry: 0, decal: false }
  const cluster = { x: 0, y: 0 }
  let align = 4

  for (const row of rows) {
    if (!Array.isArray(row)) continue
    for (const item of row) {
      if (typeof item === 'string') {
        keys.push({
          x: current.x,
          y: current.y,
          w: current.w,
          h: current.h,
          r: current.r,
          rx: current.rx,
          ry: current.ry,
          decal: current.decal,
          labels: reorderLabels(item.split('\n'), align),
        })
        current.x += current.w
        current.w = 1
        current.h = 1
        current.decal = false
      } else if (item && typeof item === 'object') {
        if ('r' in item) current.r = item.r
        if ('rx' in item) {
          current.rx = cluster.x = item.rx
          current.x = cluster.x
          current.y = cluster.y
        }
        if ('ry' in item) {
          current.ry = cluster.y = item.ry
          current.x = cluster.x
          current.y = cluster.y
        }
        if ('a' in item) align = item.a
        if ('x' in item) current.x += item.x
        if ('y' in item) current.y += item.y
        if ('w' in item) current.w = item.w
        if ('h' in item) current.h = item.h
        if ('d' in item) current.decal = item.d
      }
    }
    current.y += 1
    current.x = current.rx
  }
  return keys
}

/**
 * 回転を考慮したキー中心座標 (キー単位)
 */
export function keyCenter(key) {
  const cx = key.x + key.w / 2
  const cy = key.y + key.h / 2
  if (!key.r) return { cx, cy }
  const rad = (key.r * Math.PI) / 180
  const dx = cx - key.rx
  const dy = cy - key.ry
  return {
    cx: key.rx + dx * Math.cos(rad) - dy * Math.sin(rad),
    cy: key.ry + dx * Math.sin(rad) + dy * Math.cos(rad),
  }
}

/**
 * layout_labels と layout_options (整数) → 各レイアウトの選択肢インデックス配列
 * (vial-gui layout_editor.py の unpack と同じビット順)
 */
export function decodeLayoutOptions(labels, value) {
  if (!Array.isArray(labels) || labels.length === 0) return []
  const sizes = labels.map((label) => {
    if (typeof label === 'string') return 1
    const n = Math.max(1, label.length - 1)
    return Math.max(1, (n - 1).toString(2).length)
  })
  const bits = (value >>> 0).toString(2).padStart(sizes.reduce((a, b) => a + b, 0) + 64, '0')
  const choices = new Array(labels.length).fill(0)
  let end = bits.length
  for (let i = labels.length - 1; i >= 0; i--) {
    const chunk = bits.slice(end - sizes[i], end)
    choices[i] = parseInt(chunk, 2) || 0
    end -= sizes[i]
  }
  return choices
}

/**
 * vial.json → { name, matrix, keys: [{row, col, x, y, w, h, r, rx, ry}], encoders, customKeycodes, layoutLabels }
 * layoutOptions (.vil の layout_options) を渡すと、選択されていないオプションのキーを除外し位置を補正する
 */
export function parseVialJson(json, layoutOptions = -1) {
  const data = typeof json === 'string' ? JSON.parse(json) : json
  const kleRows = data?.layouts?.keymap
  if (!Array.isArray(kleRows)) throw new Error('vial.json に layouts.keymap がありません')

  const raw = deserializeKle(kleRows)
  const layoutLabels = data.layouts.labels || null
  const choices = layoutLabels && layoutOptions >= 0 ? decodeLayoutOptions(layoutLabels, layoutOptions) : []

  const entries = []
  const encoders = []
  for (const key of raw) {
    const l0 = key.labels[0]
    let layoutIndex = -1
    let layoutOption = -1
    if (key.labels[8] && key.labels[8].includes(',')) {
      const [idx, opt] = key.labels[8].split(',').map((s) => parseInt(s, 10))
      layoutIndex = idx
      layoutOption = opt
    }
    if (key.labels[4] === 'e' && l0 && l0.includes(',')) {
      const [idx, dir] = l0.split(',').map((s) => parseInt(s, 10))
      encoders.push({ ...key, index: idx, direction: dir, layoutIndex, layoutOption })
      continue
    }
    if (key.decal) continue
    if (!l0 || !l0.includes(',')) continue
    const [row, col] = l0.split(',').map((s) => parseInt(s, 10))
    entries.push({ ...key, row, col, layoutIndex, layoutOption })
  }

  // レイアウトオプションの選択: 選択肢 0 の位置へシフト (vial-gui と同じ)
  const topLeft = new Map()
  for (const k of entries) {
    if (k.layoutIndex < 0) continue
    const id = `${k.layoutIndex},${k.layoutOption}`
    const tl = topLeft.get(id) || { x: Infinity, y: Infinity }
    tl.x = Math.min(tl.x, k.x)
    tl.y = Math.min(tl.y, k.y)
    topLeft.set(id, tl)
  }
  const selected = entries.filter((k) => {
    if (k.layoutIndex < 0) return true
    const choice = choices[k.layoutIndex] ?? 0
    return k.layoutOption === choice
  }).map((k) => {
    if (k.layoutIndex < 0 || k.layoutOption === 0) return k
    const base = topLeft.get(`${k.layoutIndex},0`)
    const own = topLeft.get(`${k.layoutIndex},${k.layoutOption}`)
    if (!base || !own) return k
    const dx = own.x - base.x
    const dy = own.y - base.y
    return { ...k, x: k.x - dx, y: k.y - dy, rx: k.rx ? k.rx - dx : k.rx, ry: k.ry ? k.ry - dy : k.ry }
  })

  // 同じマトリクス位置が複数ある場合は先頭のみ採用
  const seen = new Set()
  const keys = []
  for (const k of selected) {
    const id = `${k.row},${k.col}`
    if (seen.has(id)) continue
    seen.add(id)
    keys.push({ row: k.row, col: k.col, x: k.x, y: k.y, w: k.w, h: k.h, r: k.r, rx: k.rx, ry: k.ry })
  }

  // 左上を原点に正規化
  normalizeOrigin(keys)

  return {
    name: data.name || '',
    matrix: data.matrix || null,
    keys,
    encoders,
    customKeycodes: Array.isArray(data.customKeycodes) ? data.customKeycodes : [],
    layoutLabels,
  }
}

export function normalizeOrigin(keys) {
  if (keys.length === 0) return keys
  let minX = Infinity
  let minY = Infinity
  for (const k of keys) {
    const corners = keyCorners(k)
    for (const [x, y] of corners) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
    }
  }
  for (const k of keys) {
    k.x -= minX
    k.y -= minY
    if (k.r) {
      k.rx -= minX
      k.ry -= minY
    }
  }
  return keys
}

export function keyCorners(k) {
  const pts = [[k.x, k.y], [k.x + k.w, k.y], [k.x, k.y + k.h], [k.x + k.w, k.y + k.h]]
  if (!k.r) return pts
  const rad = (k.r * Math.PI) / 180
  return pts.map(([x, y]) => {
    const dx = x - k.rx
    const dy = y - k.ry
    return [k.rx + dx * Math.cos(rad) - dy * Math.sin(rad), k.ry + dx * Math.sin(rad) + dy * Math.cos(rad)]
  })
}
