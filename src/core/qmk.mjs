// ============================================================
// QMK キーコード文字列 (.vil 形式) → 正規化キー設定 (keyConfig)
//
// keyConfig は CLI / GUI / 出力器で共通のキー表現:
//   { type: 'basic', kanataKey }
//   { type: 'modified', mods: [...], baseKey, kanataKey }       // 例: S-1
//   { type: 'mod-tap', tapKey, holdMods: [...], holdMod }       // holdMod は先頭(互換用)
//   { type: 'layer-tap', tapKey, layer }
//   { type: 'layer-op', op: 'MO'|'TG'|'TO'|'DF'|'PDF'|'OSL'|'TT', layer }
//   { type: 'layer-mod', layer, mods }                          // LM(layer, mod)
//   { type: 'one-shot-mod', mods }                              // OSM(mod)
//   { type: 'macro', index } / { type: 'tap-dance', index } / { type: 'user', index }
//   { type: 'special', id }                                     // GESC, REPEAT, MS_U 等
//   { type: 'transparent' } / { type: 'disabled' }
//   { type: 'raw', kanata }                                     // Kanata 式を直接指定
//   { type: 'unknown', qmk }
// mod-tap / layer-tap は任意で tapHoldVariant, tapHoldExtraKeys を持てる (GUI 用拡張)
// ============================================================

import {
  QMK_BASIC,
  QMK_SHIFTED,
  QMK_MOD_FUNCS,
  QMK_MOD_BITS,
  QMK_SPECIAL,
  HID_TO_QMK,
  MOD_TO_PREFIX,
  PREFIX_TO_MOD,
  decodeMod5,
} from './keycodes.mjs'

const LAYER_OPS = ['MO', 'TG', 'TO', 'DF', 'PDF', 'OSL', 'TT']

// 修飾キーの並び順を正規化 (出力の安定化)
const MOD_ORDER = ['lctl', 'lsft', 'lalt', 'lmet', 'rctl', 'rsft', 'ralt', 'rmet']

export function sortMods(mods) {
  return [...new Set(mods)].sort((a, b) => MOD_ORDER.indexOf(a) - MOD_ORDER.indexOf(b))
}

export function modsToPrefix(mods) {
  return sortMods(mods).map((m) => MOD_TO_PREFIX[m] || '').join('')
}

// "C-S-a" → { mods: ['lctl','lsft'], baseKey: 'a' }
export function splitChord(kanataKey) {
  const mods = []
  let rest = kanataKey || ''
  const prefixes = Object.keys(PREFIX_TO_MOD).sort((a, b) => b.length - a.length)
  let matched = true
  while (matched && rest.length > 2) {
    matched = false
    for (const pfx of prefixes) {
      if (rest.startsWith(pfx) && rest.length > pfx.length) {
        mods.push(PREFIX_TO_MOD[pfx])
        rest = rest.slice(pfx.length)
        matched = true
        break
      }
    }
  }
  return { mods: sortMods(mods), baseKey: rest }
}

export function makeBasic(kanataKey) {
  return { type: 'basic', kanataKey }
}

export function makeModified(mods, baseKey) {
  const sorted = sortMods(mods)
  if (sorted.length === 0) return makeBasic(baseKey)
  return { type: 'modified', mods: sorted, baseKey, kanataKey: modsToPrefix(sorted) + baseKey }
}

// "LT(1, KC_A)" のような括弧内の引数を分割 (ネスト考慮)
function splitArgs(str) {
  const args = []
  let depth = 0
  let cur = ''
  for (const ch of str) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      args.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  if (cur.trim()) args.push(cur.trim())
  return args
}

// "FUNC(inner)" を分解
function splitCall(str) {
  const open = str.indexOf('(')
  if (open <= 0 || !str.endsWith(')')) return null
  return { fn: str.slice(0, open), inner: str.slice(open + 1, -1) }
}

// MOD_LCTL|MOD_LSFT → mods
function parseModExpr(expr) {
  const mods = []
  for (const part of expr.split('|').map((s) => s.trim())) {
    if (QMK_MOD_BITS[part]) mods.push(...QMK_MOD_BITS[part])
    else if (/^\d+$/.test(part) || /^0x[0-9a-f]+$/i.test(part)) mods.push(...decodeMod5(Number(part)))
    else return null
  }
  return sortMods(mods)
}

/**
 * 基本キー (8bit キーコード) を Kanata キー名に変換。修飾付きなら modified を返す
 * 戻り値: keyConfig | null
 */
function parseInnerKey(str) {
  if (QMK_BASIC[str] !== undefined) return makeBasic(QMK_BASIC[str])
  if (QMK_SHIFTED[str]) return makeModified(['lsft'], QMK_BASIC[QMK_SHIFTED[str]])
  if (str === 'KC_NO' || str === 'kc' || str === 'XXXXXXX') return { type: 'disabled' }
  if (str === 'KC_TRNS' || str === 'KC_TRANSPARENT' || str === '_______') return { type: 'transparent' }
  return null
}

/**
 * 数値キーコード (Vial protocol v6) をデコード
 */
export function parseNumericKeycode(code) {
  if (code < 0) return null
  if (code === 0) return { type: 'disabled' }
  if (code === 1) return { type: 'transparent' }
  if (code <= 0xFF) {
    const qmk = HID_TO_QMK[code]
    return qmk ? parseQmkKeycode(qmk) : { type: 'unknown', qmk: hex(code) }
  }
  if (code <= 0x1FFF) {
    const mods = decodeMod5((code >> 8) & 0x1F)
    const inner = parseNumericKeycode(code & 0xFF)
    if (inner && (inner.type === 'basic' || inner.type === 'modified')) {
      return makeModified([...mods, ...(inner.mods || [])], inner.baseKey || inner.kanataKey)
    }
    return { type: 'unknown', qmk: hex(code) }
  }
  if (code <= 0x3FFF) {
    const holdMods = decodeMod5((code >> 8) & 0x1F)
    const inner = parseNumericKeycode(code & 0xFF)
    return makeModTap(holdMods, inner)
  }
  if (code <= 0x4FFF) {
    const layer = (code >> 8) & 0xF
    const inner = parseNumericKeycode(code & 0xFF)
    return makeLayerTap(layer, inner)
  }
  if (code <= 0x51FF) {
    return { type: 'layer-mod', layer: (code >> 5) & 0xF, mods: decodeMod5(code & 0x1F) }
  }
  const ranges = [
    [0x5200, 'TO'], [0x5220, 'MO'], [0x5240, 'DF'], [0x5260, 'TG'],
    [0x5280, 'OSL'], [0x52C0, 'TT'], [0x52E0, 'PDF'],
  ]
  for (const [base, op] of ranges) {
    if (code >= base && code < base + 0x20) return { type: 'layer-op', op, layer: code - base }
  }
  if (code >= 0x52A0 && code < 0x52C0) return { type: 'one-shot-mod', mods: decodeMod5(code & 0x1F) }
  if (code >= 0x5700 && code <= 0x57FF) return { type: 'tap-dance', index: code - 0x5700 }
  if (code >= 0x7700 && code <= 0x777F) return { type: 'macro', index: code - 0x7700 }
  if (code >= 0x7E00 && code <= 0x7E3F) return { type: 'user', index: code - 0x7E00 }
  return { type: 'unknown', qmk: hex(code) }
}

function hex(code) {
  return '0x' + code.toString(16).padStart(4, '0')
}

function tapKeyOf(inner) {
  if (!inner) return null
  if (inner.type === 'basic') return inner.kanataKey
  if (inner.type === 'disabled') return 'XX'
  return null
}

function makeModTap(holdMods, inner) {
  const tapKey = tapKeyOf(inner)
  if (!tapKey) return { type: 'unknown', qmk: 'MT(?)' }
  const mods = sortMods(holdMods)
  return { type: 'mod-tap', tapKey, holdMods: mods, holdMod: mods[0] }
}

function makeLayerTap(layer, inner) {
  const tapKey = tapKeyOf(inner)
  if (!tapKey) return { type: 'unknown', qmk: `LT${layer}(?)` }
  return { type: 'layer-tap', tapKey, layer }
}

/**
 * .vil のキーコード値 (文字列 or 数値) → keyConfig
 * -1 (マトリクス上にキーが存在しない) は null を返す
 */
export function parseQmkKeycode(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return parseNumericKeycode(value)
  if (typeof value !== 'string') return { type: 'unknown', qmk: String(value) }

  const str = value.trim()
  if (str === '' || str === '-1') return null
  if (/^0x[0-9a-f]+$/i.test(str)) return parseNumericKeycode(parseInt(str, 16))
  if (/^\d+$/.test(str)) return parseNumericKeycode(parseInt(str, 10))

  const inner = parseInnerKey(str)
  if (inner) return inner

  if (QMK_SPECIAL[str]) return { type: 'special', id: QMK_SPECIAL[str] }

  let m
  if ((m = str.match(/^M(\d+)$/)) || (m = str.match(/^MACRO(\d+)$/)) || (m = str.match(/^QK_MACRO_(\d+)$/))) {
    return { type: 'macro', index: parseInt(m[1], 10) }
  }
  if ((m = str.match(/^USER(\d+)$/)) || (m = str.match(/^QK_KB_(\d+)$/))) {
    return { type: 'user', index: parseInt(m[1], 10) }
  }
  if ((m = str.match(/^LT(\d+)\((.+)\)$/))) {
    return makeLayerTap(parseInt(m[1], 10), parseQmkKeycode(m[2]))
  }

  const call = splitCall(str)
  if (!call) return { type: 'unknown', qmk: str }
  const { fn, inner: argStr } = call
  const args = splitArgs(argStr)

  if (fn === 'TD' && /^\d+$/.test(argStr)) return { type: 'tap-dance', index: parseInt(argStr, 10) }
  if (LAYER_OPS.includes(fn) && /^\d+$/.test(argStr)) {
    return { type: 'layer-op', op: fn, layer: parseInt(argStr, 10) }
  }
  if (fn === 'LT' && args.length === 2) {
    return makeLayerTap(parseInt(args[0], 10), parseQmkKeycode(args[1]))
  }
  if (fn === 'LM' && args.length === 2) {
    const mods = parseModExpr(args[1])
    if (mods) return { type: 'layer-mod', layer: parseInt(args[0], 10), mods }
  }
  if (fn === 'OSM') {
    const mods = parseModExpr(argStr)
    if (mods) return { type: 'one-shot-mod', mods }
  }
  if (fn === 'MT' && args.length === 2) {
    const mods = parseModExpr(args[0])
    if (mods) return makeModTap(mods, parseQmkKeycode(args[1]))
  }
  // XXX_T(kc): Mod-Tap
  if (fn.endsWith('_T') && QMK_MOD_FUNCS[fn.slice(0, -2)]) {
    return makeModTap(QMK_MOD_FUNCS[fn.slice(0, -2)], parseQmkKeycode(argStr))
  }
  // LSFT(kc) 等: 修飾付きキー (ネスト可)
  if (QMK_MOD_FUNCS[fn]) {
    const innerKey = parseQmkKeycode(argStr)
    if (innerKey && (innerKey.type === 'basic' || innerKey.type === 'modified')) {
      return makeModified(
        [...QMK_MOD_FUNCS[fn], ...(innerKey.mods || [])],
        innerKey.baseKey || innerKey.kanataKey,
      )
    }
    if (innerKey && innerKey.type === 'disabled') {
      // LSFT(KC_NO) は修飾キーのみ
      const mods = QMK_MOD_FUNCS[fn]
      return mods.length === 1 ? makeBasic(mods[0]) : { type: 'raw', kanata: `(multi ${mods.join(' ')})` }
    }
  }
  return { type: 'unknown', qmk: str }
}

/**
 * keyConfig の同一性比較用キー (コンボのトリガー照合等で使用)
 */
export function keyConfigId(kc) {
  if (!kc) return 'none'
  switch (kc.type) {
    case 'basic': return `k:${kc.kanataKey}`
    case 'modified': return `k:${modsToPrefix(kc.mods || splitChord(kc.kanataKey).mods)}${kc.baseKey || splitChord(kc.kanataKey).baseKey}`
    case 'mod-tap': return `mt:${sortMods(kc.holdMods || [kc.holdMod]).join('+')}:${kc.tapKey}`
    case 'layer-tap': return `lt:${kc.layer}:${kc.tapKey}`
    case 'layer-op': return `lo:${kc.op}:${kc.layer}`
    case 'layer-mod': return `lm:${kc.layer}:${sortMods(kc.mods).join('+')}`
    case 'one-shot-mod': return `osm:${sortMods(kc.mods).join('+')}`
    case 'macro': return `m:${kc.index}`
    case 'tap-dance': return `td:${kc.index}`
    case 'user': return `u:${kc.index}`
    case 'special': return `s:${kc.id}`
    case 'raw': return `r:${kc.kanata}`
    default: return kc.type
  }
}

/**
 * keyConfig の「タップ時に出力される基本キー」を返す (defsrc 名推定・名前マッチング用)
 */
export function tapKeyName(kc) {
  if (!kc) return null
  switch (kc.type) {
    case 'basic': return kc.kanataKey
    case 'mod-tap':
    case 'layer-tap': return kc.tapKey
    default: return null
  }
}

/**
 * 旧 GUI 形式 (v1 プロジェクト) の keyConfig を正規化
 */
export function normalizeKeyConfig(kc) {
  if (!kc || typeof kc !== 'object') return { type: 'disabled' }
  switch (kc.type) {
    case 'basic': {
      if (!kc.kanataKey || kc.kanataKey === 'XX') return { type: 'disabled' }
      if (kc.kanataKey === '_') return { type: 'transparent' }
      const chord = splitChord(kc.kanataKey)
      if (chord.mods.length > 0) return makeModified(chord.mods, chord.baseKey)
      return makeBasic(kc.kanataKey)
    }
    case 'modified': {
      if (kc.mods && kc.baseKey) return makeModified(kc.mods, kc.baseKey)
      const chord = splitChord(kc.kanataKey || '')
      return makeModified(chord.mods, chord.baseKey || 'XX')
    }
    case 'mod-tap': {
      const holdMods = sortMods(kc.holdMods || (kc.holdMod ? [kc.holdMod] : ['lsft']))
      const out = { type: 'mod-tap', tapKey: kc.tapKey || 'XX', holdMods, holdMod: holdMods[0] }
      if (kc.tapHoldVariant) out.tapHoldVariant = kc.tapHoldVariant
      if (kc.tapHoldExtraKeys) out.tapHoldExtraKeys = kc.tapHoldExtraKeys
      return out
    }
    case 'layer-tap': {
      const out = { type: 'layer-tap', tapKey: kc.tapKey || 'XX', layer: kc.layer ?? 1 }
      if (kc.tapHoldVariant) out.tapHoldVariant = kc.tapHoldVariant
      if (kc.tapHoldExtraKeys) out.tapHoldExtraKeys = kc.tapHoldExtraKeys
      return out
    }
    case 'layer-op': return { type: 'layer-op', op: kc.op || 'MO', layer: kc.layer ?? 1 }
    case 'layer-mod': return { type: 'layer-mod', layer: kc.layer ?? 1, mods: sortMods(kc.mods || []) }
    case 'one-shot-mod': return { type: 'one-shot-mod', mods: sortMods(kc.mods || ['lsft']) }
    case 'macro': return { type: 'macro', index: kc.index ?? 0 }
    case 'tap-dance': return { type: 'tap-dance', index: kc.index ?? 0 }
    case 'user': return { type: 'user', index: kc.index ?? 0 }
    case 'special': return { type: 'special', id: kc.id }
    case 'transparent': return { type: 'transparent' }
    case 'disabled': return { type: 'disabled' }
    case 'raw': return { type: 'raw', kanata: kc.kanata || 'XX' }
    case 'unknown': return { type: 'unknown', qmk: kc.qmk || '?' }
    default: return { type: 'disabled' }
  }
}
