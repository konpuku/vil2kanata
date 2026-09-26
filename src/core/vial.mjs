// ============================================================
// .vil (+ vial.json / ファームウェアソース) → ソースモデル
//
// ソースモデル (自作キーボード側の情報を丸ごと保持):
// {
//   name,
//   keys:   [{ row, col, x, y, w, h, r, rx, ry }]      物理キー (vial.json があれば実配置)
//   layers: [[keyConfig, ...], ...]                    keys と同じ並び
//   macros, tapDances, combos, keyOverrides, altRepeatKeys,
//   qmkSettings, userKeys, encoders, warnings
// }
// ============================================================

import { parseQmkKeycode } from './qmk.mjs'
import { decodeQmkSettings } from './settings.mjs'
import { decodeMod8 } from './keycodes.mjs'
import { parseVialJson } from './kle.mjs'
import { buildFirmwareContext } from './firmware.mjs'

export function parseVilText(text) {
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('.vil ファイルのパースに失敗しました。JSON 形式か確認してください。')
  }
}

function isPresent(value) {
  return !(value === -1 || value === '-1' || value === null || value === undefined)
}

/**
 * マクロ内キーコード → Kanata キー表現 (チョード可)
 */
function macroKeyOf(qmk, warnings, ctx) {
  const kc = parseQmkKeycode(qmk)
  if (!kc || kc.type === 'transparent' || kc.type === 'disabled') return null
  if (kc.type === 'basic' || kc.type === 'modified') return kc.kanataKey
  warnings.push(`${ctx}: マクロ内のキーコード ${qmk} は変換できないため無視しました`)
  return null
}

export function convertVilMacro(actions, id, warnings = []) {
  if (!Array.isArray(actions) || actions.length === 0) return null
  const out = []
  for (const act of actions) {
    if (!Array.isArray(act) || act.length === 0) continue
    const [tag, ...args] = act
    if (tag === 'tap' || tag === 'down' || tag === 'up') {
      const keys = args.map((k) => macroKeyOf(k, warnings, `M${id}`)).filter(Boolean)
      if (keys.length > 0) out.push({ type: tag, keys })
    } else if (tag === 'text') {
      out.push({ type: 'text', text: String(args[0] ?? '') })
    } else if (tag === 'delay') {
      out.push({ type: 'delay', duration: Number(args[0]) || 0 })
    } else {
      warnings.push(`M${id}: 未対応のマクロアクション ${tag} を無視しました`)
    }
  }
  if (out.length === 0) return null
  return { id, actions: out }
}

function kcOrNull(qmk) {
  const kc = parseQmkKeycode(qmk)
  if (!kc || kc.type === 'disabled') return null
  return kc
}

export function convertVilTapDance(entry, id) {
  if (!Array.isArray(entry)) return null
  const [onTap, onHold, onDoubleTap, onTapHold, term] = entry
  const td = {
    id,
    onTap: kcOrNull(onTap),
    onHold: kcOrNull(onHold),
    onDoubleTap: kcOrNull(onDoubleTap),
    onTapHold: kcOrNull(onTapHold),
    tappingTerm: Number(term) || 200,
  }
  if (!td.onTap && !td.onHold && !td.onDoubleTap && !td.onTapHold) return null
  return td
}

export function convertVilCombo(entry, id) {
  if (!Array.isArray(entry)) return null
  const keys = entry.slice(0, 4).map(kcOrNull).filter(Boolean)
  const result = kcOrNull(entry[4])
  if (keys.length < 2 || !result) return null
  return { id, keys, result }
}

export function convertVilKeyOverride(ko, id) {
  if (!ko || typeof ko !== 'object') return null
  const trigger = kcOrNull(ko.trigger)
  const replacement = kcOrNull(ko.replacement)
  if (!trigger && !replacement) return null
  const options = Number(ko.options ?? 0x80)
  return {
    id,
    enabled: (options & 0x80) !== 0,
    trigger,
    triggerMods: decodeMod8(Number(ko.trigger_mods) || 0),
    replacement,
    layers: ko.layers === undefined ? 0xFFFF : Number(ko.layers),
    negativeMods: decodeMod8(Number(ko.negative_mod_mask) || 0),
    suppressedMods: decodeMod8(Number(ko.suppressed_mods) || 0),
    oneMod: (options & 0x08) !== 0,
    options,
  }
}

export function convertVilAltRepeat(entry, id) {
  if (!entry || typeof entry !== 'object') return null
  const keycode = kcOrNull(entry.keycode)
  const altKeycode = kcOrNull(entry.alt_keycode)
  if (!keycode || !altKeycode) return null
  const options = Number(entry.options) || 0
  return {
    id,
    keycode,
    altKeycode,
    allowedMods: decodeMod8(Number(entry.allowed_mods) || 0),
    defaultToThisAltKey: (options & 1) !== 0,
    bidirectional: (options & 2) !== 0,
    ignoreModHandedness: (options & 4) !== 0,
    enabled: (options & 8) !== 0,
  }
}

/**
 * .vil データ → ソースモデル
 * @param {object} vil         .vil の JSON
 * @param {object} [opts]
 * @param {object|string} [opts.vialJson]  vial.json (物理配置・カスタムキーコード名)
 * @param {string} [opts.keymapC]          keymap.c の内容
 * @param {string} [opts.configH]          config.h の内容
 * @param {string} [opts.name]
 */
export function importVil(vil, opts = {}) {
  const warnings = []
  if (!vil || !Array.isArray(vil.layout) || vil.layout.length === 0) {
    throw new Error('layout データが空です。有効な .vil ファイルか確認してください。')
  }

  let vialInfo = null
  if (opts.vialJson) {
    try {
      vialInfo = parseVialJson(opts.vialJson, vil.layout_options ?? -1)
    } catch (err) {
      warnings.push(`vial.json の解析に失敗したためグリッド配置を使用します: ${err.message}`)
    }
  }

  const layout = vil.layout
  const base = layout[0]

  // 物理キー一覧
  let keys
  if (vialInfo && vialInfo.keys.length > 0) {
    keys = vialInfo.keys.filter((k) => base[k.row] && isPresent(base[k.row][k.col]))
    const missing = vialInfo.keys.length - keys.length
    if (missing > 0) warnings.push(`vial.json のキー ${missing} 個が .vil のマトリクスに存在しないため除外しました`)
  } else {
    keys = []
    base.forEach((row, r) => {
      row.forEach((value, c) => {
        if (isPresent(value)) keys.push({ row: r, col: c, x: c, y: r, w: 1, h: 1, r: 0, rx: 0, ry: 0 })
      })
    })
  }

  const layers = layout.map((layer, li) => keys.map((k) => {
    const value = layer?.[k.row]?.[k.col]
    const kc = parseQmkKeycode(value)
    if (!kc) return { type: 'transparent' }
    if (kc.type === 'unknown') warnings.push(`L${li} (${k.row},${k.col}): 未対応キーコード ${kc.qmk}`)
    return kc
  }))

  const macros = (vil.macro || []).map((m, i) => convertVilMacro(m, i, warnings)).filter(Boolean)
  const tapDances = (vil.tap_dance || []).map(convertVilTapDance).filter(Boolean)
  const combos = (vil.combo || []).map(convertVilCombo).filter(Boolean)
  const keyOverrides = (vil.key_override || []).map(convertVilKeyOverride).filter(Boolean)
  const altRepeatKeys = (vil.alt_repeat_key || []).map(convertVilAltRepeat).filter(Boolean)
  const { values: qmkSettings, present } = decodeQmkSettings(vil.settings)

  // ファームウェア情報
  const fw = buildFirmwareContext({
    keymapC: opts.keymapC,
    configH: opts.configH,
    customKeycodes: vialInfo?.customKeycodes,
  })
  if (fw.config) {
    // .vil の settings に無い項目は config.h の値で補完
    if (!present.has(7) && fw.config.tappingTerm) qmkSettings.tappingTerm = fw.config.tappingTerm
    if (!present.has(25) && fw.config.quickTapTerm !== null) qmkSettings.quickTapTerm = fw.config.quickTapTerm
    if (!present.has(2) && fw.config.comboTerm) qmkSettings.comboTerm = fw.config.comboTerm
    if (!present.has(22) && !present.has(8) && fw.config.permissiveHold) qmkSettings.permissiveHold = true
    if (!present.has(23) && fw.config.holdOnOtherKeyPress) qmkSettings.holdOnOtherKeyPress = true
    if (!present.has(24) && !present.has(8) && fw.config.retroTapping) qmkSettings.retroTapping = true
  }
  const userKeys = {}
  fw.customKeycodes.forEach((ck, i) => {
    userKeys[i] = { name: ck.name || `USER${String(i).padStart(2, '0')}`, title: ck.title || '', shortName: ck.shortName || '' }
  })
  for (const [index, pattern] of fw.userKeys) {
    userKeys[index] = { ...(userKeys[index] || {}), name: userKeys[index]?.name || pattern.name, kanata: pattern.kanata, comment: pattern.comment }
  }

  const encoderCount = (vil.encoder_layout || []).reduce((n, layer) => Math.max(n, layer?.length || 0), 0)
  if (encoderCount > 0) {
    warnings.push(`ロータリーエンコーダー ${encoderCount} 個の設定はノートPCに対応する入力がないため変換しません`)
  }

  return {
    name: opts.name || vialInfo?.name || '',
    hasGeometry: !!(vialInfo && vialInfo.keys.length > 0),
    keys,
    layers,
    macros,
    tapDances,
    combos,
    keyOverrides,
    altRepeatKeys,
    qmkSettings,
    qmkSettingsPresent: [...present],
    userKeys,
    warnings,
  }
}
