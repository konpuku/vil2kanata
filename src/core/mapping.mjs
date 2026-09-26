// ============================================================
// 自作キーボード (ソース) → ノートPC (ターゲット) のキー位置対応付け
//
// 手順:
//  1. ソースのキーを「行セグメント」(同じ行で隙間なく並ぶキーの塊) に分ける
//     分割キーボードなら左手・右手が別セグメントになる
//  2. 各セグメントの「始点」(先頭キーがノートPCのどのキーに当たるか) を決める
//     - ユーザー指定 (ヒアリング回答) が最優先
//     - 無ければベースレイヤーのキー名一致から自動推定 (q ↔ q など)
//     - それも無ければ近くのセグメントの行ずれ・横位置から推定
//  3. 始点から横方向に順番に割り当てる
//  4. 個別の手動割り当て (ピン) は常に最優先
// ============================================================

import { keyCenter } from './kle.mjs'
import { tapKeyName } from './qmk.mjs'

const ROW_TOLERANCE = 0.45
const SEGMENT_GAP = 0.6

function centersOf(keys) {
  return keys.map((k) => keyCenter({ r: 0, rx: 0, ry: 0, ...k }))
}

/**
 * キーを行ごとにまとめる。戻り値: [[index, ...], ...] (上から順、行内は左から順)
 */
export function groupRows(keys) {
  const centers = centersOf(keys)
  const order = keys.map((_, i) => i).sort((a, b) => centers[a].cy - centers[b].cy || centers[a].cx - centers[b].cx)
  const rows = []
  for (const i of order) {
    const last = rows[rows.length - 1]
    if (last && Math.abs(last.cy - centers[i].cy) <= ROW_TOLERANCE) {
      last.items.push(i)
      last.cy = last.items.reduce((s, j) => s + centers[j].cy, 0) / last.items.length
    } else {
      rows.push({ cy: centers[i].cy, items: [i] })
    }
  }
  return rows.map((row) => row.items.sort((a, b) => centers[a].cx - centers[b].cx))
}

/**
 * ソースキーを行セグメントに分割
 * 戻り値: [{ id, row, keys: [srcIndex...] }]
 */
export function buildSegments(sourceKeys) {
  const centers = centersOf(sourceKeys)
  const rows = groupRows(sourceKeys)
  const segments = []
  rows.forEach((row, r) => {
    let current = []
    let segIdx = 0
    row.forEach((i, pos) => {
      if (pos > 0) {
        const prev = row[pos - 1]
        const gap = (centers[i].cx - centers[prev].cx) - (sourceKeys[i].w + sourceKeys[prev].w) / 2
        if (gap > SEGMENT_GAP) {
          segments.push({ id: `r${r}s${segIdx++}`, row: r, keys: current })
          current = []
        }
      }
      current.push(i)
    })
    if (current.length) segments.push({ id: `r${r}s${segIdx}`, row: r, keys: current })
  })
  return segments
}

/**
 * ターゲット (ノートPC) キーの行・列位置
 */
function targetGrid(targetKeys) {
  const rows = groupRows(targetKeys)
  const pos = new Map()
  rows.forEach((row, r) => row.forEach((idx, c) => pos.set(idx, { row: r, col: c })))
  return { rows, pos }
}

/**
 * 自動対応付け
 * @param {object} args
 * @param {Array}  args.sourceKeys     ソース物理キー
 * @param {Array}  args.sourceBase     ソースのベースレイヤー keyConfig 配列
 * @param {Array}  args.targetKeys     ターゲット物理キー ({kanataKey, x, y, w, h})
 * @param {object} [args.starts]       { segmentId: targetIndex | null } ユーザー指定の始点 (null = 割り当てない)
 * @param {object} [args.pins]         { srcIndex: targetIndex | null } 個別指定
 * @returns {{ map: Array<number|null>, segments: Array }}
 */
export function computeMapping({ sourceKeys, sourceBase = [], targetKeys, starts = {}, pins = {} }) {
  const segments = buildSegments(sourceKeys)
  const { rows: tRows, pos: tPos } = targetGrid(targetKeys)
  const sCenters = centersOf(sourceKeys)
  const tCenters = centersOf(targetKeys)

  const map = new Array(sourceKeys.length).fill(null)
  const taken = new Set()

  // 1. ピン
  const pinned = new Set()
  for (const [src, tgt] of Object.entries(pins)) {
    const s = Number(src)
    if (s < 0 || s >= sourceKeys.length) continue
    pinned.add(s)
    if (tgt !== null && tgt !== undefined && tgt >= 0 && tgt < targetKeys.length && !taken.has(tgt)) {
      map[s] = tgt
      taken.add(tgt)
    }
  }

  // 2. 始点の決定
  const nameIndex = new Map()
  targetKeys.forEach((k, i) => {
    if (!k.kanataKey) return
    if (!nameIndex.has(k.kanataKey)) nameIndex.set(k.kanataKey, [])
    nameIndex.get(k.kanataKey).push(i)
  })

  const resolved = new Map() // segId → { tRow, tCol, method }
  for (const seg of segments) {
    if (Object.prototype.hasOwnProperty.call(starts, seg.id)) {
      const t = starts[seg.id]
      if (t === null || t === undefined || !tPos.has(t)) {
        resolved.set(seg.id, { method: 'skip' })
      } else {
        resolved.set(seg.id, { ...tPos.get(t), method: 'user' })
      }
      continue
    }
    const votes = new Map()
    seg.keys.forEach((src, j) => {
      const name = tapKeyName(sourceBase[src])
      if (!name) return
      for (const t of nameIndex.get(name) || []) {
        const p = tPos.get(t)
        const id = `${p.row},${p.col - j}`
        votes.set(id, (votes.get(id) || 0) + 1)
      }
    })
    let best = null
    for (const [id, count] of votes) {
      if (!best || count > best.count) best = { id, count }
    }
    // 1 キーだけの一致は誤検出しやすいので、セグメントが長い場合は 2 票以上を要求
    const minVotes = seg.keys.length >= 4 ? 2 : 1
    if (best && best.count >= minVotes) {
      const [row, col] = best.id.split(',').map(Number)
      resolved.set(seg.id, { row, col, method: 'auto' })
    }
  }

  // 3. 近傍セグメントから推定
  const anchorSegs = () => segments.filter((s) => {
    const r = resolved.get(s.id)
    return r && (r.method === 'user' || r.method === 'auto' || r.method === 'inferred')
  })
  let progress = true
  while (progress) {
    progress = false
    for (const seg of segments) {
      if (resolved.has(seg.id)) continue
      const anchors = anchorSegs()
      if (anchors.length === 0) break
      // 行の近さ → 横位置の近さ で最も近いアンカーを選ぶ
      const first = seg.keys[0]
      let best = null
      for (const a of anchors) {
        const d = Math.abs(a.row - seg.row) * 100 + Math.abs(sCenters[a.keys[0]].cx - sCenters[first].cx)
        if (!best || d < best.d) best = { a, d }
      }
      const a = best.a
      const ar = resolved.get(a.id)
      const tRow = ar.row + (seg.row - a.row)
      if (tRow < 0 || tRow >= tRows.length) {
        resolved.set(seg.id, { method: 'none' })
        continue
      }
      // アンカーセグメント内で実際に対応するキー対の横ずれ量で投影
      const aRow = tRows[ar.row]
      const j = Math.min(Math.max(0, -ar.col), a.keys.length - 1)
      const anchorTarget = aRow[Math.min(Math.max(0, ar.col + j), aRow.length - 1)]
      const dx = tCenters[anchorTarget].cx - sCenters[a.keys[j]].cx
      const projected = sCenters[first].cx + dx
      let bestCol = 0
      let bestDist = Infinity
      tRows[tRow].forEach((t, c) => {
        const dist = Math.abs(tCenters[t].cx - projected)
        if (dist < bestDist) {
          bestDist = dist
          bestCol = c
        }
      })
      resolved.set(seg.id, { row: tRow, col: bestCol, method: 'inferred' })
      progress = true
    }
  }

  // 4. 割り当て (ユーザー指定 → 自動 → 推定 の順)
  const priority = { user: 0, auto: 1, inferred: 2 }
  const ordered = segments
    .filter((s) => resolved.get(s.id) && priority[resolved.get(s.id).method] !== undefined)
    .sort((a, b) => priority[resolved.get(a.id).method] - priority[resolved.get(b.id).method])
  for (const seg of ordered) {
    const r = resolved.get(seg.id)
    const row = tRows[r.row]
    if (!row) continue
    seg.keys.forEach((src, j) => {
      if (pinned.has(src)) return
      const col = r.col + j
      if (col < 0 || col >= row.length) return
      const t = row[col]
      if (taken.has(t)) return
      map[src] = t
      taken.add(t)
    })
  }

  const segmentInfo = segments.map((seg) => {
    const r = resolved.get(seg.id) || { method: 'none' }
    let startTarget = null
    if (r.row !== undefined && tRows[r.row]) {
      const col = r.col
      startTarget = col >= 0 && col < tRows[r.row].length ? tRows[r.row][col] : null
    }
    return { ...seg, method: r.method, startTarget }
  })

  return { map, segments: segmentInfo }
}

/**
 * 対応付けの逆引き: ターゲット index → ソース index
 */
export function invertMapping(map, targetCount) {
  const inv = new Array(targetCount).fill(null)
  map.forEach((t, s) => {
    if (t !== null && t !== undefined && t >= 0 && t < targetCount) inv[t] = s
  })
  return inv
}
