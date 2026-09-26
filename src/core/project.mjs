// ============================================================
// プロジェクト (GUI の保存形式 v2 / CLI の内部表現)
//
// {
//   version: 2,
//   target:  { layoutId, keys: [...] }             ノートPCの物理配列
//   source:  ソースモデル (vial.mjs) | null        自作キーボード
//   mapping: { starts: {segId: targetIdx|null}, pins: {srcIdx: targetIdx|null} }
//   layerNames: [...],
//   edits:   [{ targetIdx: keyConfig }, ...]       レイヤーごとの手動変更 (対応付けより優先)
//   defsrcInclude: [targetIdx], defsrcExclude: [targetIdx]
//   macros, tapDances, combos, keyOverrides, altRepeatKeys, userKeys,
//   qmk: QMK 設定, kanata: Kanata 出力設定
// }
//
// 対応付けを変更しても手動変更 (edits) は保持され、全レイヤーに同じ対応付けが適用される。
// ============================================================

import { computeMapping, invertMapping } from './mapping.mjs'
import { keyCenter } from './kle.mjs'
import { normalizeKeyConfig, parseQmkKeycode, tapKeyName } from './qmk.mjs'
import { completeQmkSettings } from './settings.mjs'
import { KANATA_DEFAULTS, emitKanata } from './emit.mjs'
import { getPresetKeys } from './layouts.mjs'

export const PROJECT_VERSION = 2

export function createProject({ layoutId = 'jis-laptop', targetKeys = null } = {}) {
  return {
    version: PROJECT_VERSION,
    target: { layoutId, keys: targetKeys || getPresetKeys(layoutId) },
    source: null,
    mapping: { starts: {}, pins: {} },
    layerNames: ['base'],
    edits: [{}],
    defsrcInclude: [],
    defsrcExclude: [],
    macros: [],
    tapDances: [],
    combos: [],
    keyOverrides: [],
    altRepeatKeys: [],
    userKeys: {},
    qmk: completeQmkSettings(null),
    kanata: { ...KANATA_DEFAULTS },
  }
}

/**
 * ソースモデルをプロジェクトに取り込む (機能設定もソースで置き換える)
 */
export function attachSource(project, source) {
  const layerCount = source.layers.length
  return {
    ...project,
    source,
    mapping: { starts: {}, pins: {} },
    layerNames: Array.from({ length: layerCount }, (_, i) => project.layerNames?.[i] || (i === 0 ? 'base' : `layer${i}`)),
    edits: Array.from({ length: layerCount }, () => ({})),
    defsrcInclude: [],
    defsrcExclude: [],
    macros: source.macros,
    tapDances: source.tapDances,
    combos: source.combos,
    keyOverrides: source.keyOverrides,
    altRepeatKeys: source.altRepeatKeys,
    userKeys: source.userKeys,
    qmk: completeQmkSettings(source.qmkSettings),
  }
}

export function layerCount(project) {
  return Math.max(project.layerNames?.length || 0, project.source?.layers?.length || 0, 1)
}

/**
 * 対応付けを計算してノートPC側のレイヤーを組み立てる
 * 戻り値: { map, inverse, segments, layers: [{name, keys}], defsrc: [targetIdx], hands }
 */
export function resolveProject(project) {
  const targetKeys = project.target.keys
  const source = project.source
  let map = []
  let segments = []
  if (source) {
    const res = computeMapping({
      sourceKeys: source.keys,
      sourceBase: source.layers[0],
      targetKeys,
      starts: project.mapping?.starts || {},
      pins: project.mapping?.pins || {},
    })
    // 固定キー (Fn 等) への割り当ては除外
    map = res.map.map((t) => (t !== null && targetKeys[t]?.fixed ? null : t))
    segments = res.segments
  }
  const inverse = invertMapping(map, targetKeys.length)
  const n = layerCount(project)

  const layers = []
  for (let li = 0; li < n; li++) {
    const edits = project.edits?.[li] || {}
    const keys = targetKeys.map((tk, t) => {
      if (edits[t]) return edits[t]
      const s = inverse[t]
      if (s !== null && source?.layers?.[li]) return source.layers[li][s]
      if (li === 0) return tk.kanataKey && !tk.fixed ? { type: 'basic', kanataKey: tk.kanataKey } : { type: 'disabled' }
      return { type: 'transparent' }
    })
    layers.push({ name: project.layerNames?.[li] || (li === 0 ? 'base' : `layer${li}`), keys })
  }

  // defsrc: 対応付け済み or 手動変更のあるキー
  const include = new Set(project.defsrcInclude || [])
  const exclude = new Set(project.defsrcExclude || [])
  const defsrc = []
  targetKeys.forEach((tk, t) => {
    if (tk.fixed || exclude.has(t)) return
    // 名前のないキーは明示的に含めた場合のみ (出力器が代替キー名を割り当てる)
    if (!tk.kanataKey && !include.has(t)) return
    const edited = (project.edits || []).some((e) => e && e[t])
    if (!source || inverse[t] !== null || edited || include.has(t)) defsrc.push(t)
  })

  // 左右の手 (Chordal Hold 用): ソースの物理配置から判定
  let hands = null
  if (source && source.keys.length) {
    const cx = source.keys.map((k) => keyCenter({ r: 0, rx: 0, ry: 0, ...k }).cx)
    const mid = (Math.min(...cx) + Math.max(...cx)) / 2
    hands = {}
    map.forEach((t, s) => {
      if (t !== null) hands[t] = cx[s] < mid ? 'L' : 'R'
    })
  }

  return { map, inverse, segments, layers, defsrc, hands }
}

/**
 * プロジェクト → .kbd
 */
export function projectToKbd(project) {
  const resolved = resolveProject(project)
  return emitKanata({
    targetKeys: project.target.keys,
    defsrc: resolved.defsrc,
    layers: resolved.layers,
    macros: project.macros,
    tapDances: project.tapDances,
    combos: project.combos,
    keyOverrides: project.keyOverrides,
    altRepeatKeys: project.altRepeatKeys,
    userKeys: project.userKeys,
    qmk: project.qmk,
    kanata: project.kanata,
    hands: resolved.hands,
    sourceName: project.source?.name || project.sourceName || '',
  })
}

/**
 * ソースの配列そのものをターゲットにする (ノートPC配列を指定しない CLI 互換モード)
 * defsrc 名はベースレイヤーのタップキーから推定する
 */
export function projectFromSourceOnly(source) {
  const used = new Set()
  const keys = source.keys.map((k, i) => {
    let name = tapKeyName(source.layers[0][i])
    if (!name || name === 'XX' || used.has(name)) name = null
    if (name) used.add(name)
    return { x: k.x, y: k.y, w: k.w, h: k.h, kanataKey: name || '', label: name || '' }
  })
  // 名前のないキーは出力器が代替キーで埋める (fixed にはしない)
  const project = attachSource(createProject({ layoutId: 'source', targetKeys: keys }), source)
  const pins = {}
  source.keys.forEach((_, i) => {
    pins[i] = i
  })
  project.mapping = { starts: {}, pins }
  project.defsrcInclude = keys.map((_, i) => i)
  return project
}

// ============================================================
// 保存 / 読込
// ============================================================

export function serializeProject(project) {
  return JSON.stringify(project, null, 2)
}

/**
 * プロジェクト JSON (v1 / v2) → v2 プロジェクト
 */
export function loadProjectData(data) {
  if (!data || typeof data !== 'object') throw new Error('プロジェクトファイルの形式が不正です')
  if (data.version === PROJECT_VERSION) {
    const base = createProject({ layoutId: data.target?.layoutId || 'jis-laptop', targetKeys: data.target?.keys })
    return {
      ...base,
      ...data,
      qmk: completeQmkSettings(data.qmk),
      kanata: { ...KANATA_DEFAULTS, ...(data.kanata || {}) },
    }
  }
  if (data.version === 1 || Array.isArray(data.layers)) return migrateV1(data)
  throw new Error('未対応のプロジェクトファイルです')
}

function migrateV1(data) {
  const targetKeys = (data.physicalLayout || []).map((k) => ({ ...k }))
  const project = createProject({ layoutId: data.layout || 'custom', targetKeys })
  const layers = data.layers || []
  project.layerNames = layers.map((l, i) => l.name || (i === 0 ? 'base' : `layer${i}`))
  // v1 はノートPC側のキー設定をそのまま保持していたので、全キーを手動変更として移行する
  project.edits = layers.map((l) => {
    const e = {}
    ;(l.keys || []).forEach((kc, t) => {
      if (kc) e[t] = normalizeKeyConfig(kc)
    })
    return e
  })
  const selected = new Set(data.defsrcKeys || targetKeys.map((_, i) => i))
  project.defsrcExclude = targetKeys.map((_, i) => i).filter((i) => !selected.has(i))

  project.macros = (data.macros || []).filter(Boolean).map((m) => ({
    id: m.id,
    name: m.label || undefined,
    actions: (m.actions || []).map((a) => {
      if (a.type === 'tap') return { type: 'tap', keys: a.key ? [a.key] : [] }
      if (a.type === 'delay') return { type: 'delay', duration: a.duration || 0 }
      return { type: 'text', text: a.text || '' }
    }),
  }))
  // v1 の Vial 形式タップダンス (配列) と GUI 形式 (actions) を統合
  const tds = []
  ;(data.tapDances || []).forEach((td, i) => {
    if (Array.isArray(td)) {
      tds.push({ id: i, onTap: kcFromName(td[0]), onHold: kcFromName(td[1]), onDoubleTap: kcFromName(td[2]), onTapHold: kcFromName(td[3]), tappingTerm: td[4] || 200, legacyQmk: td })
    }
  })
  ;(data.tapDancesGui || []).forEach((td) => {
    if (!td) return
    const acts = (td.actions || []).map(normalizeKeyConfig)
    tds.push({ id: 1000 + td.id, actions: acts, timeout: td.timeout || 200, legacyGuiId: td.id })
  })
  project.tapDances = tds
  // v1 の GUI タップダンス参照 (tdg) を新 ID に付け替え
  const guiIds = new Set((data.tapDancesGui || []).filter(Boolean).map((t) => t.id))
  project.edits = project.edits.map((e) => {
    const out = {}
    for (const [t, kc] of Object.entries(e)) {
      out[t] = kc.type === 'tap-dance' && guiIds.has(kc.index) ? { ...kc, index: 1000 + kc.index } : kc
    }
    return out
  })
  project.combos = (data.combos || []).filter((c) => c && c.keys && c.result).map((c) => ({
    id: c.id,
    keys: c.keys.filter(Boolean).map((k) => normalizeKeyConfig({ type: 'basic', kanataKey: k })),
    result: normalizeKeyConfig({ type: 'basic', kanataKey: c.result }),
    timeout: c.timeout,
  }))
  project.keyOverrides = (data.keyOverrides || []).filter((k) => k && k.trigger && k.replacementKey).map((k) => ({
    id: k.id,
    enabled: true,
    trigger: { type: 'basic', kanataKey: k.trigger },
    triggerMods: k.triggerMods || [],
    replacement: normalizeKeyConfig({ type: 'basic', kanataKey: k.replacementKey }),
    replacementMods: k.replacementMods || [],
    layers: 0xFFFF,
    negativeMods: [],
    suppressedMods: [],
    oneMod: false,
  }))
  const s = data.settings || {}
  project.qmk = completeQmkSettings({ tappingTerm: s.holdTime || 200, quickTapTerm: s.tapTime ?? null, permissiveHold: true })
  project.kanata = {
    ...KANATA_DEFAULTS,
    processUnmappedKeys: s.processUnmappedKeys !== false,
    concurrentTapHold: s.concurrentTapHold !== false,
    rapidEventDelay: s.rapidEventDelay ?? 5,
  }
  return project
}

function kcFromName(v) {
  const kc = parseQmkKeycode(v)
  return kc && kc.type !== 'disabled' ? kc : null
}
