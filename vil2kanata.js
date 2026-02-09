#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

// ============================================================
// QMK → Kanata キーコードマッピング
// ============================================================

const BASIC_KEYCODE_MAP = {
  // アルファベット
  KC_A: 'a', KC_B: 'b', KC_C: 'c', KC_D: 'd', KC_E: 'e',
  KC_F: 'f', KC_G: 'g', KC_H: 'h', KC_I: 'i', KC_J: 'j',
  KC_K: 'k', KC_L: 'l', KC_M: 'm', KC_N: 'n', KC_O: 'o',
  KC_P: 'p', KC_Q: 'q', KC_R: 'r', KC_S: 's', KC_T: 't',
  KC_U: 'u', KC_V: 'v', KC_W: 'w', KC_X: 'x', KC_Y: 'y',
  KC_Z: 'z',

  // 数字
  KC_1: '1', KC_2: '2', KC_3: '3', KC_4: '4', KC_5: '5',
  KC_6: '6', KC_7: '7', KC_8: '8', KC_9: '9', KC_0: '0',

  // ファンクションキー
  KC_F1: 'f1', KC_F2: 'f2', KC_F3: 'f3', KC_F4: 'f4',
  KC_F5: 'f5', KC_F6: 'f6', KC_F7: 'f7', KC_F8: 'f8',
  KC_F9: 'f9', KC_F10: 'f10', KC_F11: 'f11', KC_F12: 'f12',
  KC_F13: 'f13', KC_F14: 'f14', KC_F15: 'f15', KC_F16: 'f16',
  KC_F17: 'f17', KC_F18: 'f18', KC_F19: 'f19', KC_F20: 'f20',
  KC_F21: 'f21', KC_F22: 'f22', KC_F23: 'f23', KC_F24: 'f24',

  // 特殊キー
  KC_ENTER: 'ret', KC_ENT: 'ret',
  KC_ESCAPE: 'esc', KC_ESC: 'esc',
  KC_BSPACE: 'bspc', KC_BSPC: 'bspc',
  KC_TAB: 'tab',
  KC_SPACE: 'spc', KC_SPC: 'spc',
  KC_CAPSLOCK: 'caps', KC_CAPS: 'caps',
  KC_DELETE: 'del', KC_DEL: 'del',
  KC_INSERT: 'ins', KC_INS: 'ins',
  KC_PSCREEN: 'prnt', KC_PSCR: 'prnt',
  KC_SCROLLLOCK: 'slck', KC_SLCK: 'slck',
  KC_PAUSE: 'pause', KC_PAUS: 'pause',

  // 記号
  KC_MINUS: '-', KC_MINS: '-',
  KC_EQUAL: '=', KC_EQL: '=',
  KC_LBRACKET: '[', KC_LBRC: '[',
  KC_RBRACKET: ']', KC_RBRC: ']',
  KC_BACKSLASH: '\\', KC_BSLS: '\\',
  KC_SCOLON: ';', KC_SCLN: ';',
  KC_QUOTE: '\'', KC_QUOT: '\'',
  KC_GRAVE: 'grv', KC_GRV: 'grv',
  KC_COMMA: ',', KC_COMM: ',',
  KC_DOT: '.', KC_PDOT: '.',
  KC_SLASH: '/', KC_SLSH: '/',

  // ナビゲーション
  KC_PGUP: 'pgup',
  KC_PGDOWN: 'pgdn', KC_PGDN: 'pgdn',
  KC_HOME: 'home',
  KC_END: 'end',
  KC_LEFT: 'left',
  KC_RIGHT: 'rght',
  KC_UP: 'up',
  KC_DOWN: 'down',

  // 修飾キー
  KC_LCTRL: 'lctl', KC_LCTL: 'lctl',
  KC_LSHIFT: 'lsft', KC_LSFT: 'lsft',
  KC_LALT: 'lalt',
  KC_LGUI: 'lmet',
  KC_RCTRL: 'rctl', KC_RCTL: 'rctl',
  KC_RSHIFT: 'rsft', KC_RSFT: 'rsft',
  KC_RALT: 'ralt',
  KC_RGUI: 'rmet',

  // 日本語キー
  KC_RO: 'ro',
  KC_JYEN: '¥',
  KC_NONUS_HASH: '\\',
  KC_LANG1: 'kana',
  KC_APPLICATION: 'menu', KC_APP: 'menu',

  // マウスキー（ボタンのみ直接マッピング、移動はエイリアス化）
  KC_BTN1: 'mlft',
  KC_BTN2: 'mrgt',
  KC_BTN3: 'mmid',

  // テンキー
  KC_KP_PLUS: 'kp+',
  KC_KP_MINUS: 'kp-',
  KC_KP_ASTERISK: 'kp*',
  KC_KP_SLASH: 'kp/',
  KC_KP_DOT: 'kp.',
  KC_KP_ENTER: 'kprt',
  KC_KP_0: 'kp0', KC_KP_1: 'kp1', KC_KP_2: 'kp2', KC_KP_3: 'kp3',
  KC_KP_4: 'kp4', KC_KP_5: 'kp5', KC_KP_6: 'kp6', KC_KP_7: 'kp7',
  KC_KP_8: 'kp8', KC_KP_9: 'kp9',

  // 透過・無効
  KC_TRNS: '_', KC_TRANSPARENT: '_',
  KC_NO: 'XX',

  // メディアキー
  KC_MUTE: 'mute',
  KC_VOLU: 'volu',
  KC_VOLD: 'vold',
  KC_MNXT: 'next',
  KC_MPRV: 'prev',
  KC_MPLY: 'pp',
  KC_MSTP: 'stop',
}

// Kanataに標準キー名がないキー（arbitrary-codeで定義）
// Windows Virtual Key Code を使用
const ARBITRARY_CODE_KEYS = {
  KC_LANG2: { name: 'eisu', code: 240, comment: ';; 英数 (VK_DBE_ALPHANUMERIC)' },
}

// 修飾キーのプレフィックスマッピング
const MOD_PREFIX_MAP = {
  LSFT: 'S-', RSFT: 'RS-',
  LCTL: 'C-', RCTL: 'RC-',
  LALT: 'A-', RALT: 'RA-',
  LGUI: 'M-', RGUI: 'RM-',
}

// Mod-Tap用の修飾キーマッピング
const MOD_TAP_HOLD_MAP = {
  LSFT: 'lsft', RSFT: 'rsft',
  LCTL: 'lctl', RCTL: 'rctl',
  LALT: 'lalt', RALT: 'ralt',
  LGUI: 'lmet', RGUI: 'rmet',
}

// 複合修飾キーのマッピング
const COMPOUND_MOD_MAP = {
  C_S: 'C-S-',
  MEH: 'C-A-S-',
  HYPR: 'C-A-S-M-',
}

// ============================================================
// テキスト→キーシーケンス変換（JISレイアウト前提）
// ============================================================

const TEXT_TO_KEYS_JIS = {
  'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e',
  'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j',
  'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
  'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't',
  'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y',
  'z': 'z',
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '-': '-', ' ': 'spc',
  '.': '.', ',': ',', '/': '/', ';': ';',
  '[': '[', ']': ']', '\\': '\\',
  // JISシフト記号
  '!': 'S-1', '@': '[', '#': 'S-3', '$': 'S-4', '%': 'S-5',
  '^': '=', '&': 'S-6', '*': 'S-\'', '(': 'S-8', ')': 'S-9',
  '_': 'S-ro', '+': 'S-;', '=': 'S--',
  '{': 'S-[', '}': 'S-]', '|': 'S-¥',
  ':': ':', '\'': 'S-7', '"': 'S-2',
  '<': 'S-,', '>': 'S-.', '?': 'S-/',
  '~': 'S-=',
  '`': 'S-[',
}

// ============================================================
// パーサー関数
// ============================================================

/**
 * 修飾付きキーコードをパース: LSFT(KC_8) → {mods: ['LSFT'], key: 'KC_8'}
 * ネストにも対応: RSFT(KC_LEFT) など
 */
function parseModified(str) {
  // 複合修飾キー: C_S(x)
  for (const [prefix, kanataPrefix] of Object.entries(COMPOUND_MOD_MAP)) {
    const open = prefix + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: kanataPrefix, key: parseKeycode(inner) }
    }
  }

  // 単一修飾キー: LSFT(x), RSFT(x), etc.
  for (const mod of Object.keys(MOD_PREFIX_MAP)) {
    const open = mod + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: MOD_PREFIX_MAP[mod], key: parseKeycode(inner) }
    }
  }

  return null
}

/**
 * Mod-Tapをパース: LGUI_T(KC_A) → {mod: 'lmet', key: 'a'}
 */
function parseModTap(str) {
  const match = str.match(/^(LSFT|RSFT|LCTL|RCTL|LALT|RALT|LGUI|RGUI)_T\((.+)\)$/)
  if (!match) return null
  const mod = MOD_TAP_HOLD_MAP[match[1]]
  const key = convertBasicKeycode(match[2])
  return { type: 'mod-tap', mod, key }
}

/**
 * Layer-Tapをパース: LT1(KC_BSPACE) → {layer: 1, key: 'bspc'}
 */
function parseLayerTap(str) {
  const match = str.match(/^LT(\d+)\((.+)\)$/)
  if (!match) return null
  const layer = parseInt(match[1], 10)
  const key = convertBasicKeycode(match[2])
  return { type: 'layer-tap', layer, key }
}

/**
 * レイヤー操作をパース: MO(n), TO(n), TG(n), DF(n)
 */
function parseLayerOp(str) {
  const match = str.match(/^(MO|TO|TG|DF)\((\d+)\)$/)
  if (!match) return null
  return { type: 'layer-op', op: match[1], layer: parseInt(match[2], 10) }
}

/**
 * マクロ参照をパース: M0, M1, ..., M15
 */
function parseMacroRef(str) {
  const match = str.match(/^M(\d+)$/)
  if (!match) return null
  return { type: 'macro-ref', index: parseInt(match[1], 10) }
}

/**
 * タップダンス参照をパース: TD(n)
 */
function parseTapDanceRef(str) {
  const match = str.match(/^TD\((\d+)\)$/)
  if (!match) return null
  return { type: 'tap-dance-ref', index: parseInt(match[1], 10) }
}

/**
 * USER定義キーコードをパース: USER01, USER02, ...
 */
function parseUserKeycode(str) {
  const match = str.match(/^USER(\d+)$/)
  if (!match) return null
  return { type: 'user', index: parseInt(match[1], 10) }
}

// ============================================================
// キーコード変換
// ============================================================

/**
 * 基本キーコード(KC_X)をKanataキー名に変換
 */
function convertBasicKeycode(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  // 未知のキーコードはそのまま小文字化してコメント付き
  return `XX ;; unknown: ${qmkStr}`
}

/**
 * 修飾付きキーコードをKanata文字列に変換
 */
function convertModified(parsed) {
  const keyStr = typeof parsed.key === 'string' ? parsed.key : formatKeycode(parsed.key)
  return `${parsed.prefix}${keyStr}`
}

/**
 * パース済みキーコードをKanata文字列にフォーマット
 */
function formatKeycode(parsed) {
  if (typeof parsed === 'string') return parsed

  if (parsed && parsed.type === 'modified') {
    return convertModified(parsed)
  }

  return `XX ;; unhandled: ${JSON.stringify(parsed)}`
}

/**
 * QMKキーコード文字列をパースして構造化された結果を返す
 */
function parseKeycode(qmkStr) {
  if (!qmkStr || qmkStr === '') return 'XX'

  // 基本キーコード
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }

  // 修飾付きキーコード
  const modified = parseModified(qmkStr)
  if (modified) return modified

  // 未知のキーコード
  return qmkStr
}

/**
 * トップレベルのキーコード変換。エイリアスが必要な複合キーコードも処理する。
 * 戻り値: { kanata: string, alias?: { name: string, value: string } }
 */
// マウス移動キーのマッピング（エイリアス化が必要）
const MOUSE_MOVE_MAP = {
  KC_MS_L: { name: 'ms-l', value: '(movemouse-left 1 1)' },
  KC_MS_R: { name: 'ms-r', value: '(movemouse-right 1 1)' },
  KC_MS_U: { name: 'ms-u', value: '(movemouse-up 1 1)' },
  KC_MS_D: { name: 'ms-d', value: '(movemouse-down 1 1)' },
}

// defsrc重複キー解消用の代替キープール
const DEFSRC_SUBSTITUTE_POOL = [
  'f13', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20',
  'f21', 'f22', 'f23', 'f24',
  'ins', 'pause', 'slck', 'prnt',
  'kp0', 'kp1', 'kp2', 'kp3', 'kp4', 'kp5',
  'kp6', 'kp7', 'kp8', 'kp9',
]

/**
 * defsrcキー配列から重複を除去し、代替キーで置換する
 * 戻り値: { uniqueKeys: string[], duplicateInfo: Array<{original, substitute, position}> }
 */
function makeDefsrcKeysUnique(allKeys) {
  const usedKeys = new Set(allKeys)
  const seen = new Map()
  const uniqueKeys = []
  const duplicateInfo = []
  let subIdx = 0

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i]
    if (key === 'XX' || !seen.has(key)) {
      seen.set(key, i)
      uniqueKeys.push(key)
    } else {
      while (subIdx < DEFSRC_SUBSTITUTE_POOL.length && usedKeys.has(DEFSRC_SUBSTITUTE_POOL[subIdx])) {
        subIdx++
      }
      if (subIdx < DEFSRC_SUBSTITUTE_POOL.length) {
        const sub = DEFSRC_SUBSTITUTE_POOL[subIdx]
        uniqueKeys.push(sub)
        usedKeys.add(sub)
        duplicateInfo.push({ original: key, substitute: sub, position: i })
        subIdx++
      } else {
        uniqueKeys.push(key)
      }
    }
  }

  return { uniqueKeys, duplicateInfo }
}

/**
 * defsrcの物理キー名を抽出する（QMKキーコード→defsrcキー名）
 */
function extractDefsrcKey(key) {
  if (BASIC_KEYCODE_MAP[key] !== undefined) return BASIC_KEYCODE_MAP[key]
  const modTap = parseModTap(key)
  if (modTap) return modTap.key
  const layerTap = parseLayerTap(key)
  if (layerTap) return layerTap.key
  const userKey = parseUserKeycode(key)
  if (userKey) return `f${13 + userKey.index}`
  return 'XX'
}

function convertKeycode(qmkStr, aliasContext) {
  if (!qmkStr || qmkStr === '') return { kanata: 'XX' }

  // 基本キーコード
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return { kanata: BASIC_KEYCODE_MAP[qmkStr] }
  }

  // arbitrary-codeが必要なキー（エイリアス化）
  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    const arb = ARBITRARY_CODE_KEYS[qmkStr]
    aliasContext.registerArbitraryCode(arb.name, arb.code, arb.comment)
    return { kanata: `@${arb.name}` }
  }

  // マウス移動キー（エイリアス化）
  if (MOUSE_MOVE_MAP[qmkStr]) {
    const mouse = MOUSE_MOVE_MAP[qmkStr]
    aliasContext.registerMouseMove(mouse.name, mouse.value)
    return { kanata: `@${mouse.name}` }
  }

  // Mod-Tap
  const modTap = parseModTap(qmkStr)
  if (modTap) {
    const name = aliasContext.registerModTap(modTap)
    return { kanata: `@${name}` }
  }

  // Layer-Tap
  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) {
    const name = aliasContext.registerLayerTap(layerTap)
    return { kanata: `@${name}` }
  }

  // レイヤー操作
  const layerOp = parseLayerOp(qmkStr)
  if (layerOp) {
    const name = aliasContext.registerLayerOp(layerOp)
    return { kanata: `@${name}` }
  }

  // マクロ参照
  const macroRef = parseMacroRef(qmkStr)
  if (macroRef) {
    const name = `m${macroRef.index}`
    return { kanata: `@${name}` }
  }

  // タップダンス参照
  const tdRef = parseTapDanceRef(qmkStr)
  if (tdRef) {
    const name = `td${tdRef.index}`
    return { kanata: `@${name}` }
  }

  // USER定義
  const userKey = parseUserKeycode(qmkStr)
  if (userKey) {
    const name = aliasContext.registerUser(userKey)
    return { kanata: `@${name}` }
  }

  // 修飾付きキーコード（レイヤー内で直接使用）
  const modified = parseModified(qmkStr)
  if (modified) {
    const kanataStr = formatKeycode(modified)
    // 修飾付きキーはエイリアス化が必要（スペース含む場合あり）
    const name = aliasContext.registerModified(qmkStr, kanataStr)
    return { kanata: `@${name}` }
  }

  // 未知のキーコード
  return { kanata: `XX ;; unknown: ${qmkStr}` }
}

// ============================================================
// マクロ変換
// ============================================================

/**
 * マクロの単一アクション内のキーコードをKanata形式に変換
 */
function convertMacroKeycode(qmkStr) {
  // KC_TRNSはマクロ内では無意味なのでスキップ
  if (qmkStr === 'KC_TRNS' || qmkStr === 'KC_TRANSPARENT') {
    return null
  }

  // 基本キーコード
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }

  // 修飾付きキーコード
  const modified = parseModified(qmkStr)
  if (modified) {
    return formatKeycode(modified)
  }

  return `XX ;; unknown: ${qmkStr}`
}

/**
 * テキスト文字列をKanataキーシーケンスに変換（JISレイアウト前提）
 */
function convertTextToKeys(text) {
  const keys = []
  for (const ch of text) {
    if (TEXT_TO_KEYS_JIS[ch]) {
      keys.push(TEXT_TO_KEYS_JIS[ch])
    } else {
      keys.push(`XX ;; unknown char: '${ch}'`)
    }
  }
  return keys
}

/**
 * .vilのマクロアクション配列をKanataマクロ文字列に変換
 *
 * マクロアクション最適化:
 * down(MOD) + tap(KEY) + up(MOD) → S-KEY のような修飾キー表現に圧縮
 */
function convertMacro(macroActions) {
  if (!macroActions || macroActions.length === 0) return null

  // down/tap/up パターンを最適化するための前処理
  const optimized = optimizeMacroActions(macroActions)
  const parts = []

  for (const action of optimized) {
    if (action.type === 'tap') {
      const converted = action.keys.map(convertMacroKeycode).filter(Boolean)
      parts.push(...converted)
    } else if (action.type === 'modified-tap') {
      for (const key of action.keys) {
        const converted = convertMacroKeycode(key)
        if (converted) {
          parts.push(`${action.prefix}${converted}`)
        }
      }
    } else if (action.type === 'text') {
      parts.push(...convertTextToKeys(action.text))
    } else if (action.type === 'down') {
      parts.push(`;; hold: ${action.key}`)
    } else if (action.type === 'up') {
      parts.push(`;; release: ${action.key}`)
    }
  }

  if (parts.length === 0) return null
  return `(macro ${parts.join(' ')})`
}

// マクロ内のdown/upアクション用修飾キー名正規化マッピング
const MACRO_MOD_MAPPING = {
  LSHIFT: 'LSFT', RSHIFT: 'RSFT', LSFT: 'LSFT', RSFT: 'RSFT',
  LCTRL: 'LCTL', RCTRL: 'RCTL', LCTL: 'LCTL', RCTL: 'RCTL',
  LALT: 'LALT', RALT: 'RALT',
  LGUI: 'LGUI', RGUI: 'RGUI',
}

/**
 * マクロアクションを最適化: down(MOD)+tap(KEY)+up(MOD)パターンを検出して圧縮
 */
function optimizeMacroActions(actions) {
  const result = []
  let i = 0

  while (i < actions.length) {
    const action = actions[i]
    const actionType = action[0]

    if (actionType === 'text') {
      result.push({ type: 'text', text: action[1] })
      i++
      continue
    }

    if (actionType === 'down') {
      // down(key, key, ...) 複数キーの場合はtapとして扱う
      if (action.length > 2) {
        result.push({ type: 'tap', keys: action.slice(1) })
        i++
        continue
      }

      // down(MOD)を検出。対応するup(MOD)を探す
      const modKey = action[1]
      const modName = modKey.replace('KC_', '')
      const normalizedMod = MACRO_MOD_MAPPING[modName]
      if (normalizedMod && MOD_PREFIX_MAP[normalizedMod]) {
        const tapsBeforeUp = []
        let j = i + 1
        let foundUp = false

        while (j < actions.length) {
          const next = actions[j]
          if (next[0] === 'tap') {
            tapsBeforeUp.push(...next.slice(1))
            j++
          } else if (next[0] === 'up' && next[1] === modKey) {
            foundUp = true
            j++
            break
          } else {
            break
          }
        }

        if (foundUp && tapsBeforeUp.length > 0) {
          result.push({
            type: 'modified-tap',
            prefix: MOD_PREFIX_MAP[normalizedMod],
            keys: tapsBeforeUp,
          })
          i = j
          continue
        }
      }

      // 最適化できない場合はそのまま
      result.push({ type: 'down', key: modKey })
      i++
      continue
    }

    if (actionType === 'tap') {
      result.push({ type: 'tap', keys: action.slice(1) })
      i++
      continue
    }

    if (actionType === 'up') {
      result.push({ type: 'up', key: action[1] })
      i++
      continue
    }

    // 未知のアクション
    result.push({ type: 'unknown', raw: action })
    i++
  }

  return result
}

// ============================================================
// タップダンス変換
// ============================================================

/**
 * タップダンスエントリをKanataの定義に変換
 * [on_tap, on_hold, on_double_tap, on_tap_hold, tapping_term]
 */
function convertTapDance(tdData, index) {
  const [onTap, onHold, onDoubleTap, onTapHold, tappingTerm] = tdData

  const isActive = (k) => k && k !== 'KC_NO'
  const hasOnTap = isActive(onTap)
  const hasOnHold = isActive(onHold)
  const hasOnDoubleTap = isActive(onDoubleTap)
  const hasOnTapHold = isActive(onTapHold)

  if (!hasOnTap && !hasOnHold && !hasOnDoubleTap && !hasOnTapHold) {
    return null
  }

  const tapKey = hasOnTap ? convertBasicOrModified(onTap) : 'XX'
  const holdKey = hasOnHold ? convertBasicOrModified(onHold) : null
  const doubleTapKey = hasOnDoubleTap ? convertBasicOrModified(onDoubleTap) : null
  const tapHoldKey = hasOnTapHold ? convertBasicOrModified(onTapHold) : null
  const term = tappingTerm || 200
  const comment = `;; TD${index}: tap=${onTap} hold=${onHold} 2tap=${onDoubleTap} tap_hold=${onTapHold}`

  // 2タップ目のアクションを構築する共通ヘルパー
  function buildSecondAction() {
    const dt = hasOnDoubleTap ? doubleTapKey : tapKey
    if (hasOnTapHold) {
      return `(tap-hold-release $tap-time $hold-time ${dt} ${tapHoldKey})`
    }
    return dt
  }

  const actions = []

  if (hasOnHold) {
    // 1タップ: tap-hold(tap, hold)
    actions.push(`(tap-hold-release $tap-time $hold-time ${tapKey} ${holdKey})`)
  } else {
    actions.push(tapKey)
  }

  if (hasOnDoubleTap || hasOnTapHold) {
    actions.push(buildSecondAction())
  }

  return {
    name: `td${index}`,
    value: `(tap-dance ${term} (${actions.join(' ')}))`,
    comment,
  }
}

/**
 * 基本キーコードまたは修飾付きキーコードをKanata文字列に変換
 */
function convertBasicOrModified(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  // arbitrary-codeが必要なキー（コンボ結果等ではエイリアス参照）
  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    return `@${ARBITRARY_CODE_KEYS[qmkStr].name}`
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    return formatKeycode(modified)
  }
  const modTap = parseModTap(qmkStr)
  if (modTap) {
    return `(tap-hold-release $tap-time $hold-time ${modTap.key} ${modTap.mod})`
  }
  return `XX ;; unknown: ${qmkStr}`
}

// ============================================================
// コンボ変換
// ============================================================

/**
 * コンボの入力キーをdefsrc対応のキー名に変換
 * Mod-Tapキーの場合はtapキー名を使用
 */
function comboInputKey(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modTap = parseModTap(qmkStr)
  if (modTap) return modTap.key
  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) return layerTap.key
  const userKey = parseUserKeycode(qmkStr)
  if (userKey) return `usr${String(userKey.index).padStart(2, '0')}`
  return convertBasicOrModified(qmkStr)
}

/**
 * コンボエントリをKanata defchordsv2形式に変換
 */
function convertCombo(comboData, macroNames) {
  const [key1, key2, key3, key4, result] = comboData
  const keys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')

  if (keys.length < 2) return null

  const inputKeys = keys.map(comboInputKey)

  // 重複キー検出（defsrcで同じキー名が複数ある場合、コンボは正しく動作しない）
  const hasDuplicateKeys = new Set(inputKeys).size !== inputKeys.length
  const duplicateWarning = hasDuplicateKeys
    ? ' ;; WARNING: 重複キーあり。defsrc調整後にコンボキーも修正してください'
    : ''

  // 結果の変換
  let resultStr
  const macroRef = parseMacroRef(result)
  if (macroRef && macroNames.has(macroRef.index)) {
    resultStr = `@m${macroRef.index}`
  } else if (BASIC_KEYCODE_MAP[result] !== undefined) {
    resultStr = BASIC_KEYCODE_MAP[result]
  } else {
    resultStr = convertBasicOrModified(result)
  }

  const comment = `;; ${keys.join(' + ')} → ${result}${duplicateWarning}`

  return {
    keys: inputKeys,
    result: resultStr,
    comment,
  }
}

/**
 * 位置ベースのコンボ変換。defsrcの重複キー置換に対応
 * qmkToPositions: QMKキーコード → ベースレイヤー内の位置インデックス配列
 * uniqueDefsrcKeys: 重複解消済みのdefsrcキー配列
 */
function convertComboWithPositions(comboData, macroNames, qmkToPositions, uniqueDefsrcKeys) {
  const [key1, key2, key3, key4, result] = comboData
  const keys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')

  if (keys.length < 2) return null

  // 位置ベースでdefsrcキーを解決
  const usedPositions = new Set()
  const inputKeys = keys.map((qmkStr) => {
    const positions = qmkToPositions.get(qmkStr) || []
    for (const pos of positions) {
      if (!usedPositions.has(pos)) {
        usedPositions.add(pos)
        return uniqueDefsrcKeys[pos]
      }
    }
    // フォールバック: 位置が見つからない場合は旧方式
    return comboInputKey(qmkStr)
  })

  const hasDuplicateKeys = new Set(inputKeys).size !== inputKeys.length
  const duplicateWarning = hasDuplicateKeys
    ? ' ;; WARNING: 重複キーあり。defsrc調整後にコンボキーも修正してください'
    : ''

  let resultStr
  const macroRef = parseMacroRef(result)
  if (macroRef && macroNames.has(macroRef.index)) {
    resultStr = `@m${macroRef.index}`
  } else if (BASIC_KEYCODE_MAP[result] !== undefined) {
    resultStr = BASIC_KEYCODE_MAP[result]
  } else {
    resultStr = convertBasicOrModified(result)
  }

  const comment = `;; ${keys.join(' + ')} → ${result}${duplicateWarning}`

  return {
    keys: inputKeys,
    result: resultStr,
    comment,
  }
}

// ============================================================
// キーオーバーライド変換（コメント出力）
// ============================================================

const TRIGGER_MOD_BITS = {
  1: 'LCtrl', 2: 'LShift', 4: 'LAlt', 8: 'LGui',
  16: 'RCtrl', 32: 'RShift', 64: 'RAlt', 128: 'RGui',
}

function describeTriggerMods(modBits) {
  const mods = []
  for (const [bit, name] of Object.entries(TRIGGER_MOD_BITS)) {
    if (modBits & parseInt(bit, 10)) {
      mods.push(name)
    }
  }
  return mods.length > 0 ? mods.join('+') : 'none'
}

function convertKeyOverride(ko) {
  const trigger = ko.trigger || 'KC_NO'
  const replacement = ko.replacement || 'KC_NO'
  const triggerMods = describeTriggerMods(ko.trigger_mods || 0)

  if (trigger === 'KC_NO' && replacement === 'KC_NO') return null

  return `;; trigger=${trigger} + ${triggerMods} → replacement=${replacement}`
}

// ============================================================
// エイリアスコンテキスト
// ============================================================

function createAliasContext() {
  const aliases = new Map()

  return {
    registerModTap(parsed) {
      const name = `${parsed.key}-${parsed.mod}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'mod-tap',
          value: `(tap-hold-release $tap-time $hold-time ${parsed.key} ${parsed.mod})`,
          comment: null,
        })
      }
      return name
    },

    registerLayerTap(parsed) {
      const name = `l${parsed.layer}-${parsed.key}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'layer-tap',
          value: `(tap-hold-release $tap-time $hold-time ${parsed.key} (layer-toggle layer${parsed.layer}))`,
          comment: null,
        })
      }
      return name
    },

    registerLayerOp(parsed) {
      const opMap = {
        MO: 'layer-toggle',
        TO: 'layer-switch',
        TG: 'layer-toggle',
        DF: 'layer-switch',
      }
      const kanataOp = opMap[parsed.op] || 'layer-toggle'
      const name = `${parsed.op.toLowerCase()}${parsed.layer}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'layer-op',
          value: `(${kanataOp} layer${parsed.layer})`,
          comment: null,
        })
      }
      return name
    },

    registerModified(qmkStr, kanataStr) {
      // 修飾付きキーコードのエイリアス名を安全に生成
      const safeName = qmkStr
        .replace(/\(/g, '_')
        .replace(/\)/g, '')
        .replace(/KC_/g, '')
        .toLowerCase()
      const name = `k-${safeName}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'modified',
          value: kanataStr,
          comment: `;; ${qmkStr}`,
        })
      }
      return name
    },

    registerUser(parsed) {
      const name = `usr${String(parsed.index).padStart(2, '0')}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'user',
          value: `XX ;; USER${String(parsed.index).padStart(2, '0')}: ユーザー定義キーコード（要手動設定）`,
          comment: null,
        })
      }
      return name
    },

    registerArbitraryCode(name, code, comment) {
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'arbitrary-code',
          value: `(arbitrary-code ${code})`,
          comment: comment || null,
        })
      }
      return name
    },

    registerMouseMove(name, value) {
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'mouse',
          value,
          comment: null,
        })
      }
      return name
    },

    getAliases() {
      return aliases
    },
  }
}

// ============================================================
// メイン変換処理
// ============================================================

function generateKanataConfig(vilData, inputFileName) {
  const aliasContext = createAliasContext()
  const layout = vilData.layout || []
  const macros = vilData.macro || []
  const tapDances = vilData.tap_dance || []
  const combos = vilData.combo || []
  const keyOverrides = vilData.key_override || []

  const layerCount = layout.length
  const rowCount = layout[0] ? layout[0].length : 0
  const colCount = layout[0] && layout[0][0] ? layout[0][0].length : 0

  // --------------------------------------------------------
  // 1. マクロ変換
  // --------------------------------------------------------
  const macroAliases = new Map()
  for (let i = 0; i < macros.length; i++) {
    const macroData = macros[i]
    if (!macroData || macroData.length === 0) continue
    const kanataStr = convertMacro(macroData)
    if (kanataStr) {
      macroAliases.set(i, {
        name: `m${i}`,
        value: kanataStr,
        comment: `;; M${i}: ${JSON.stringify(macroData)}`,
      })
    }
  }

  // --------------------------------------------------------
  // 2. タップダンス変換
  // --------------------------------------------------------
  const tdAliases = []
  for (let i = 0; i < tapDances.length; i++) {
    const td = convertTapDance(tapDances[i], i)
    if (td) {
      tdAliases.push(td)
    }
  }

  // --------------------------------------------------------
  // 3. レイヤーキー変換（エイリアス収集）
  // --------------------------------------------------------
  const convertedLayers = layout.map((layer) =>
    layer.map((row) =>
      row.map((key) => convertKeycode(key, aliasContext))
    )
  )

  // --------------------------------------------------------
  // 3.5. defsrcキー計算（コンボ変換で必要）
  // --------------------------------------------------------
  const baseLayer = layout[0] || []
  const defsrcRows = []
  const allDefsrcKeys = []
  const baseLayerFlat = []
  for (const row of baseLayer) {
    const defsrcKeys = row.map((key) => {
      baseLayerFlat.push(key)
      return extractDefsrcKey(key)
    })
    defsrcRows.push(defsrcKeys)
    allDefsrcKeys.push(...defsrcKeys)
  }

  const { uniqueKeys: uniqueDefsrcKeys, duplicateInfo } = makeDefsrcKeysUnique(allDefsrcKeys)

  // QMKキーコード → ベースレイヤー位置マップ（コンボ用）
  const qmkToPositions = new Map()
  for (let i = 0; i < baseLayerFlat.length; i++) {
    if (!qmkToPositions.has(baseLayerFlat[i])) {
      qmkToPositions.set(baseLayerFlat[i], [])
    }
    qmkToPositions.get(baseLayerFlat[i]).push(i)
  }

  // --------------------------------------------------------
  // 3.6. arbitrary-codeキーのエイリアス登録（コンボ結果等で使用される場合）
  // --------------------------------------------------------
  const allKeycodes = new Set()
  for (const layer of layout) {
    for (const row of layer) {
      for (const key of row) {
        allKeycodes.add(key)
      }
    }
  }
  for (const combo of combos) {
    for (const key of combo) {
      if (key) allKeycodes.add(key)
    }
  }
  for (const [qmkStr, arb] of Object.entries(ARBITRARY_CODE_KEYS)) {
    if (allKeycodes.has(qmkStr)) {
      aliasContext.registerArbitraryCode(arb.name, arb.code, arb.comment)
    }
  }

  // --------------------------------------------------------
  // 4. コンボ変換（位置ベース）
  // --------------------------------------------------------
  const macroNameSet = new Set(macroAliases.keys())
  const convertedCombos = combos
    .map((c) => convertComboWithPositions(c, macroNameSet, qmkToPositions, uniqueDefsrcKeys))
    .filter(Boolean)

  // --------------------------------------------------------
  // 5. キーオーバーライド変換（コメント）
  // --------------------------------------------------------
  const koComments = keyOverrides
    .map(convertKeyOverride)
    .filter(Boolean)

  // --------------------------------------------------------
  // 出力組み立て
  // --------------------------------------------------------
  const lines = []

  // ヘッダー
  lines.push(`;; Generated by vil2kanata`)
  lines.push(`;; Source: ${inputFileName}`)
  lines.push(`;; Layers: ${layerCount}, Macros: ${macroAliases.size}, TapDance: ${tdAliases.length}, Combos: ${convertedCombos.length}`)
  lines.push('')

  // defcfg
  lines.push('(defcfg')
  lines.push('  process-unmapped-keys yes')
  lines.push('  concurrent-tap-hold yes')
  lines.push(')')
  lines.push('')

  // defvar
  lines.push('(defvar')
  lines.push('  tap-time 200')
  lines.push('  hold-time 200')
  lines.push(')')
  lines.push('')

  // defsrc（事前計算済みのuniqueDefsrcKeysを使用）
  lines.push(';; ============================================================')
  lines.push(`;; defsrc: 物理レイアウト (${colCount}x${rowCount})`)
  lines.push(';; ノートPCのレイアウトに合わせて書き換えてください。')
  lines.push(';; defsrc内のキー数とdeflayer内のキー数は一致する必要があります。')
  lines.push(';; ============================================================')
  lines.push('(defsrc')
  let defsrcOffset = 0
  for (const row of defsrcRows) {
    const uniqueRow = uniqueDefsrcKeys.slice(defsrcOffset, defsrcOffset + row.length)
    lines.push(`  ${padKeys(uniqueRow).join(' ')}`)
    defsrcOffset += row.length
  }
  lines.push(')')

  // defsrc重複キー自動置換情報
  if (duplicateInfo.length > 0) {
    lines.push(`;; NOTE: defsrc内の重複キーを自動的に代替キーに置換しました:`)
    for (const dup of duplicateInfo) {
      lines.push(`;;   ${dup.original} → ${dup.substitute} (位置: ${dup.position})`)
    }
  }
  lines.push('')

  // defalias
  lines.push('(defalias')

  // ホームロウモッドとその他のエイリアス
  const allAliases = aliasContext.getAliases()
  if (allAliases.size > 0) {
    lines.push('  ;; Mod-Tap / Layer-Tap / Modified keys')
    for (const [name, alias] of allAliases) {
      if (alias.comment) {
        lines.push(`  ${alias.comment}`)
      }
      lines.push(`  ${name} ${alias.value}`)
    }
    lines.push('')
  }

  // マクロエイリアス
  if (macroAliases.size > 0) {
    lines.push('  ;; Macros')
    for (const [, macro] of macroAliases) {
      lines.push(`  ${macro.comment}`)
      lines.push(`  ${macro.name} ${macro.value}`)
    }
    lines.push('')
  }

  // タップダンスエイリアス
  if (tdAliases.length > 0) {
    lines.push('  ;; Tap Dance')
    for (const td of tdAliases) {
      lines.push(`  ${td.comment}`)
      lines.push(`  ${td.name} ${td.value}`)
    }
    lines.push('')
  }

  lines.push(')')
  lines.push('')

  // defchordsv2（コンボ）
  if (convertedCombos.length > 0) {
    lines.push('(defchordsv2')
    for (const combo of convertedCombos) {
      lines.push(`  ${combo.comment}`)
      lines.push(`  (${combo.keys.join(' ')})  ${combo.result}  200  all-released  ()`)
    }
    lines.push(')')
    lines.push('')
  }

  // deflayer
  const layerNames = layout.map((_, i) => (i === 0 ? 'base' : `layer${i}`))
  for (let i = 0; i < layout.length; i++) {
    lines.push(`(deflayer ${layerNames[i]}`)
    const convertedLayer = convertedLayers[i]
    for (const row of convertedLayer) {
      const keys = row.map((r) => r.kanata)
      lines.push(`  ${padKeys(keys).join(' ')}`)
    }
    lines.push(')')
    lines.push('')
  }

  // キーオーバーライド（コメント）
  if (koComments.length > 0) {
    lines.push(';; ============================================================')
    lines.push(';; Key Overrides (QMK機能 - Kanataでは直接対応なし)')
    lines.push(';; 以下は参考情報です。必要に応じてfork/switchで実装してください。')
    lines.push(';; ============================================================')
    for (const comment of koComments) {
      lines.push(comment)
    }
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * キー名の表示幅を揃えるためにパディングする
 */
function padKeys(keys) {
  if (keys.length === 0) return []
  const maxLen = Math.max(...keys.map((k) => k.length))
  const padTo = Math.max(maxLen, 4)
  return keys.map((k) => k.padEnd(padTo))
}

// ============================================================
// CLI エントリポイント
// ============================================================

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.error('Usage: node vil2kanata.js <input.vil> [--output output.kbd]')
    console.error('')
    console.error('Vial (.vil) → Kanata (.kbd) converter')
    console.error('')
    console.error('Options:')
    console.error('  --output, -o  出力ファイルパス（省略時はstdout）')
    console.error('  --help, -h    ヘルプを表示')
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1)
  }

  const inputPath = args[0]
  let outputPath = null

  const outputIdx = args.indexOf('--output')
  const outputIdxShort = args.indexOf('-o')
  const oIdx = outputIdx !== -1 ? outputIdx : outputIdxShort
  if (oIdx !== -1 && args[oIdx + 1]) {
    outputPath = args[oIdx + 1]
  }

  // ファイル読み込み
  let raw
  try {
    raw = fs.readFileSync(inputPath, 'utf-8')
  } catch (err) {
    console.error(`エラー: ファイルの読み込みに失敗しました: ${inputPath}`)
    console.error(err.message)
    process.exit(1)
  }

  let vilData
  try {
    vilData = JSON.parse(raw)
  } catch (err) {
    console.error(`エラー: JSONパースに失敗しました: ${inputPath}`)
    console.error(err.message)
    process.exit(1)
  }

  // バリデーション
  if (!vilData.layout || vilData.layout.length === 0) {
    console.error('エラー: layoutデータが空です。有効な.vilファイルか確認してください。')
    process.exit(1)
  }

  // 変換
  const inputFileName = path.basename(inputPath)
  const kanataConfig = generateKanataConfig(vilData, inputFileName)

  // 出力
  if (outputPath) {
    try {
      fs.writeFileSync(outputPath, kanataConfig, 'utf-8')
      console.error(`変換完了: ${outputPath}`)
    } catch (err) {
      console.error(`エラー: ファイルの書き込みに失敗しました: ${outputPath}`)
      console.error(err.message)
      process.exit(1)
    }
  } else {
    process.stdout.write(kanataConfig)
  }
}

main()
