// ============================================================
// QMK ファームウェアソース (keymap.c / config.h) のテキスト解析
//
// ファイル I/O は呼び出し側 (CLI: fs / GUI: FileReader) が担当し、
// ここでは文字列だけを扱う。
// ============================================================

import { QMK_BASIC } from './keycodes.mjs'

function qmkKeyToKanata(qmkKey) {
  const normalized = qmkKey.startsWith('KC_') ? qmkKey : `KC_${qmkKey}`
  return QMK_BASIC[normalized] ?? null
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
}

function extractTapCodes(block) {
  const codes = []
  const regex = /(?:tap_code16|tap_code|register_code16|register_code)\s*\(\s*(\w+)\s*\)/g
  let m
  while ((m = regex.exec(stripComments(block))) !== null) codes.push(m[1])
  return codes
}

// 対応する閉じ括弧までのブロックを取り出す
function extractBraceBlock(text, openIndex) {
  let depth = 0
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) return text.slice(openIndex + 1, i)
    }
  }
  return text.slice(openIndex + 1)
}

function findIfBlock(body, condRegex) {
  const m = condRegex.exec(body)
  if (!m) return null
  const open = body.indexOf('{', m.index + m[0].length - 1)
  if (open < 0) return null
  const block = extractBraceBlock(body, open)
  const after = body.slice(open + block.length + 2)
  const elseMatch = after.match(/^\s*else\s*\{/)
  let elseBlock = null
  if (elseMatch) {
    elseBlock = extractBraceBlock(after, elseMatch[0].length - 1)
  }
  return { block, elseBlock }
}

/**
 * config.h を解析
 */
export function parseConfigH(text) {
  const num = (name) => {
    const m = text.match(new RegExp(`#define\\s+${name}\\s+(\\d+)`))
    return m ? parseInt(m[1], 10) : null
  }
  const flag = (name) => new RegExp(`#define\\s+${name}\\b`).test(text)
  return {
    tappingTerm: num('TAPPING_TERM'),
    quickTapTerm: num('QUICK_TAP_TERM'),
    comboTerm: num('COMBO_TERM'),
    permissiveHold: flag('PERMISSIVE_HOLD'),
    holdOnOtherKeyPress: flag('HOLD_ON_OTHER_KEY_PRESS'),
    retroTapping: flag('RETRO_TAPPING'),
    layerCount: num('DYNAMIC_KEYMAP_LAYER_COUNT'),
    comboEntries: num('VIAL_COMBO_ENTRIES'),
    macroCount: num('DYNAMIC_KEYMAP_MACRO_COUNT') ?? num('MACRO_COUNT'),
  }
}

/**
 * keymap.c を解析し、カスタムキーコード (USERxx) の動作を推定する
 * 戻り値: { userKeys: Map<index, {name, kanata, comment}>, tappingTerm }
 */
export function parseKeymapC(text, tappingTermFallback = 200) {
  const userKeys = new Map()
  const tappingMatch = text.match(/#define\s+TAPPING_TERM\s+(\d+)/)
  const tappingTerm = tappingMatch ? parseInt(tappingMatch[1], 10) : tappingTermFallback

  // enum custom_keycodes
  const enumMap = new Map()
  const enumMatch = text.match(/enum\s+custom_keycodes\s*\{([^}]+)\}/s)
  if (enumMatch) {
    let index = 0
    for (const entry of stripComments(enumMatch[1]).split(',').map((e) => e.trim()).filter(Boolean)) {
      const assign = entry.match(/^(\w+)\s*=\s*(?:QK_KB_|USER)(\d+)/)
      if (assign) {
        index = parseInt(assign[2], 10)
        enumMap.set(assign[1], index++)
        continue
      }
      const anyAssign = entry.match(/^(\w+)\s*=/)
      if (anyAssign) {
        // SAFE_RANGE / QK_KB_0 等 → 0 から数える
        enumMap.set(anyAssign[1], 0)
        index = 1
        continue
      }
      const name = entry.match(/^(\w+)/)
      if (name) enumMap.set(name[1], index++)
    }
  }

  const prMatch = text.match(/bool\s+process_record_user\s*\([^)]*\)\s*\{/)
  if (!prMatch) return { userKeys, tappingTerm }
  const funcBody = extractBraceBlock(text, prMatch.index + prMatch[0].length - 1)

  for (const [keyName, index] of enumMap) {
    const caseRegex = new RegExp(`case\\s+${keyName}\\s*:([\\s\\S]*?)(?=\\bcase\\s+\\w+\\s*:|\\bdefault\\s*:|$)`)
    const caseMatch = funcBody.match(caseRegex)
    if (!caseMatch) continue
    const pattern = analyzeCase(keyName, caseMatch[1], tappingTerm)
    if (pattern) userKeys.set(index, pattern)
  }
  return { userKeys, tappingTerm }
}

function analyzeCase(keyName, body, tappingTerm) {
  const hasTimer = /timer_read|timer_elapsed|_timer\s*=/.test(body)
  const hasTerm = /TAPPING_TERM|tapping_term/.test(body)
  const pressed = findIfBlock(body, /if\s*\(\s*record\s*->\s*event\s*\.\s*pressed\s*\)\s*\{/)

  if (hasTimer && hasTerm && pressed) {
    const released = pressed.elseBlock || ''
    const shortBranch = findIfBlock(released, /if\s*\([^{]*(?:<\s*TAPPING_TERM|TAPPING_TERM\s*>)[^{]*\)\s*\{/)
    const tapCodes = shortBranch ? extractTapCodes(shortBranch.block) : []
    const holdCodes = shortBranch && shortBranch.elseBlock ? extractTapCodes(shortBranch.elseBlock) : []
    const tap = tapCodes.length ? qmkKeyToKanata(tapCodes[0]) : null
    const hold = holdCodes.length ? qmkKeyToKanata(holdCodes[0]) : null
    if (!tap && !hold) return null
    const pressCodes = extractTapCodes(pressed.block)
    const note = pressCodes.length ? ` (押下時の ${pressCodes[0]} 送信は再現不可)` : ''
    return {
      name: keyName,
      kanata: `(tap-hold-release ${tappingTerm} ${tappingTerm} ${tap || 'XX'} ${hold || 'XX'})`,
      comment: `${keyName}: タップ=${tapCodes[0] || '?'} ホールド=${holdCodes[0] || '?'}${note}`,
    }
  }

  if (/_pressed\s*=|_active\s*=/.test(body) && pressed) {
    const released = pressed.elseBlock || ''
    const flagBranch = findIfBlock(released, /if\s*\([^)]*(?:active|_pressed)[^)]*\)\s*\{/)
    let tap = null
    let hold = null
    if (flagBranch) {
      const holdCodes = extractTapCodes(flagBranch.block)
      const tapCodes = flagBranch.elseBlock ? extractTapCodes(flagBranch.elseBlock) : []
      hold = holdCodes.length ? qmkKeyToKanata(holdCodes[0]) : null
      tap = tapCodes.length ? qmkKeyToKanata(tapCodes[0]) : null
    }
    if (!tap && !hold) {
      const all = extractTapCodes(body).map(qmkKeyToKanata).filter(Boolean)
      if (all.length >= 2) {
        tap = all[1]
        hold = all[0]
      } else if (all.length === 1) {
        tap = all[0]
      }
    }
    if (!tap && !hold) return null
    return {
      name: keyName,
      kanata: `(tap-hold-release ${tappingTerm} ${tappingTerm} ${tap || 'XX'} ${hold || 'XX'})`,
      comment: `${keyName}: SandS 方式を tap-hold で近似 (タップ=${tap || 'XX'} ホールド=${hold || 'XX'})`,
    }
  }

  const codes = extractTapCodes(body)
  const keys = codes.map(qmkKeyToKanata).filter(Boolean)
  if (keys.length === 0) return null
  return {
    name: keyName,
    kanata: keys.length === 1 ? keys[0] : `(multi ${keys.join(' ')})`,
    comment: `${keyName}: ${codes.join(', ')}`,
  }
}

/**
 * ファームウェア情報を統合 (vial.json の customKeycodes + keymap.c + config.h)
 */
export function buildFirmwareContext({ keymapC, configH, customKeycodes } = {}) {
  const config = configH ? parseConfigH(configH) : null
  const tappingFallback = config?.tappingTerm ?? 200
  const keymap = keymapC ? parseKeymapC(keymapC, tappingFallback) : { userKeys: new Map(), tappingTerm: tappingFallback }
  return {
    config,
    tappingTerm: keymap.tappingTerm,
    userKeys: keymap.userKeys,
    customKeycodes: customKeycodes || [],
  }
}
