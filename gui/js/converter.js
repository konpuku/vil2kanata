// ============================================================
// vil2kanata ブラウザ対応版変換ロジック
// vil2kanata.js から fs/path 依存を除去した ES Module 版
// ============================================================

// QMK → Kanata キーコードマッピング
export const BASIC_KEYCODE_MAP = {
  KC_A: 'a', KC_B: 'b', KC_C: 'c', KC_D: 'd', KC_E: 'e',
  KC_F: 'f', KC_G: 'g', KC_H: 'h', KC_I: 'i', KC_J: 'j',
  KC_K: 'k', KC_L: 'l', KC_M: 'm', KC_N: 'n', KC_O: 'o',
  KC_P: 'p', KC_Q: 'q', KC_R: 'r', KC_S: 's', KC_T: 't',
  KC_U: 'u', KC_V: 'v', KC_W: 'w', KC_X: 'x', KC_Y: 'y',
  KC_Z: 'z',

  KC_1: '1', KC_2: '2', KC_3: '3', KC_4: '4', KC_5: '5',
  KC_6: '6', KC_7: '7', KC_8: '8', KC_9: '9', KC_0: '0',

  KC_F1: 'f1', KC_F2: 'f2', KC_F3: 'f3', KC_F4: 'f4',
  KC_F5: 'f5', KC_F6: 'f6', KC_F7: 'f7', KC_F8: 'f8',
  KC_F9: 'f9', KC_F10: 'f10', KC_F11: 'f11', KC_F12: 'f12',
  KC_F13: 'f13', KC_F14: 'f14', KC_F15: 'f15', KC_F16: 'f16',
  KC_F17: 'f17', KC_F18: 'f18', KC_F19: 'f19', KC_F20: 'f20',
  KC_F21: 'f21', KC_F22: 'f22', KC_F23: 'f23', KC_F24: 'f24',

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

  KC_MINUS: '-', KC_MINS: '-',
  KC_EQUAL: '=', KC_EQL: '=',
  KC_LBRACKET: '[', KC_LBRC: '[',
  KC_RBRACKET: ']', KC_RBRC: ']',
  KC_BACKSLASH: '\\', KC_BSLASH: '\\', KC_BSLS: '\\',
  KC_SCOLON: ';', KC_SCLN: ';',
  KC_QUOTE: '\'', KC_QUOT: '\'',
  KC_GRAVE: 'grv', KC_GRV: 'grv',
  KC_COMMA: ',', KC_COMM: ',',
  KC_DOT: '.', KC_PDOT: '.',
  KC_SLASH: '/', KC_SLSH: '/',

  KC_PGUP: 'pgup',
  KC_PGDOWN: 'pgdn', KC_PGDN: 'pgdn',
  KC_HOME: 'home',
  KC_END: 'end',
  KC_LEFT: 'left',
  KC_RIGHT: 'rght',
  KC_UP: 'up',
  KC_DOWN: 'down',

  KC_LCTRL: 'lctl', KC_LCTL: 'lctl',
  KC_LSHIFT: 'lsft', KC_LSFT: 'lsft',
  KC_LALT: 'lalt',
  KC_LGUI: 'lmet',
  KC_RCTRL: 'rctl', KC_RCTL: 'rctl',
  KC_RSHIFT: 'rsft', KC_RSFT: 'rsft',
  KC_RALT: 'ralt',
  KC_RGUI: 'rmet',

  KC_RO: 'ro',
  KC_JYEN: '¥',
  KC_NONUS_HASH: '\\',
  KC_LANG1: 'kana', KC_LNG1: 'kana',
  KC_INT5: 'mhnk',
  KC_INT4: 'henk',
  KC_APPLICATION: 'menu', KC_APP: 'menu',

  KC_BTN1: 'mlft',
  KC_BTN2: 'mrgt',
  KC_BTN3: 'mmid',

  KC_KP_PLUS: 'kp+',
  KC_KP_MINUS: 'kp-',
  KC_KP_ASTERISK: 'kp*',
  KC_KP_SLASH: 'kp/',
  KC_KP_DOT: 'kp.',
  KC_KP_ENTER: 'kprt',
  KC_KP_0: 'kp0', KC_KP_1: 'kp1', KC_KP_2: 'kp2', KC_KP_3: 'kp3',
  KC_KP_4: 'kp4', KC_KP_5: 'kp5', KC_KP_6: 'kp6', KC_KP_7: 'kp7',
  KC_KP_8: 'kp8', KC_KP_9: 'kp9',

  KC_TRNS: '_', KC_TRANSPARENT: '_',
  KC_NO: 'XX',

  KC_MUTE: 'mute',
  KC_VOLU: 'volu',
  KC_VOLD: 'vold',
  KC_MNXT: 'next',
  KC_MPRV: 'prev',
  KC_MPLY: 'pp',
  KC_MSTP: 'stop',

  KC_LRLD: 'lrld',
}

export const ARBITRARY_CODE_KEYS = {
  KC_LANG1: { name: 'lang1', code: 242, comment: ';; IME ON (VK_DBE_HIRAGANA)' },
  KC_LNG1: { name: 'lang1', code: 242, comment: ';; IME ON (VK_DBE_HIRAGANA)' },
  KC_LANG2: { name: 'lang2', code: 26, comment: ';; IME OFF (VK_IME_OFF)' },
  KC_LNG2: { name: 'lang2', code: 26, comment: ';; IME OFF (VK_IME_OFF)' },
}

// kanataキー名 → arbitrary-code 変換が必要なキー（Windowsでkanataが正しくマッピングしないもの）
const KANATA_NAME_TO_ARBITRARY = {
  'lang1': 242,  // VK_DBE_HIRAGANA (IME ON)
  'lang2': 26,   // VK_IME_OFF (IME OFF)
  'eisu': 26,    // lang2の別名
}

// kanataキー名を.kbd出力用に変換（arbitrary-codeが必要なキーを自動変換）
export function resolveKanataKey(kanataKey) {
  if (!kanataKey) return kanataKey
  const code = KANATA_NAME_TO_ARBITRARY[kanataKey]
  if (code !== undefined) return `(arbitrary-code ${code})`
  return kanataKey
}

export const MOD_PREFIX_MAP = {
  LSFT: 'S-', RSFT: 'RS-',
  LCTL: 'C-', RCTL: 'RC-',
  LALT: 'A-', RALT: 'RA-',
  LGUI: 'M-', RGUI: 'RM-',
}

const MOD_TAP_HOLD_MAP = {
  LSFT: 'lsft', RSFT: 'rsft',
  LCTL: 'lctl', RCTL: 'rctl',
  LALT: 'lalt', RALT: 'ralt',
  LGUI: 'lmet', RGUI: 'rmet',
}

const COMPOUND_MOD_MAP = {
  C_S: 'C-S-',
  LCA: 'C-A-',
  MEH: 'C-A-S-',
  HYPR: 'C-A-S-M-',
}

export const TEXT_TO_KEYS_JIS = {
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
  '!': 'S-1', '@': '[', '#': 'S-3', '$': 'S-4', '%': 'S-5',
  '^': '=', '&': 'S-6', '*': 'S-\'', '(': 'S-8', ')': 'S-9',
  '_': 'S-ro', '+': 'S-;', '=': 'S--',
  '{': 'S-[', '}': 'S-]', '|': 'S-¥',
  ':': ':', '\'': 'S-7', '"': 'S-2',
  '<': 'S-,', '>': 'S-.', '?': 'S-/',
  '~': 'S-=',
  '`': 'S-[',
}

const MOUSE_MOVE_MAP = {
  KC_MS_L: { name: 'ms-l', value: '(movemouse-left 1 1)' },
  KC_MS_R: { name: 'ms-r', value: '(movemouse-right 1 1)' },
  KC_MS_U: { name: 'ms-u', value: '(movemouse-up 1 1)' },
  KC_MS_D: { name: 'ms-d', value: '(movemouse-down 1 1)' },
}

const DEFSRC_SUBSTITUTE_POOL = [
  'f13', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20',
  'f21', 'f22', 'f23', 'f24',
  'ins', 'pause', 'slck', 'prnt',
  'kp0', 'kp1', 'kp2', 'kp3', 'kp4', 'kp5',
  'kp6', 'kp7', 'kp8', 'kp9',
]

const MACRO_MOD_MAPPING = {
  LSHIFT: 'LSFT', RSHIFT: 'RSFT', LSFT: 'LSFT', RSFT: 'RSFT',
  LCTRL: 'LCTL', RCTRL: 'RCTL', LCTL: 'LCTL', RCTL: 'RCTL',
  LALT: 'LALT', RALT: 'RALT',
  LGUI: 'LGUI', RGUI: 'RGUI',
}

// ============================================================
// パーサー関数
// ============================================================

export function parseModified(str) {
  for (const [prefix, kanataPrefix] of Object.entries(COMPOUND_MOD_MAP)) {
    const open = prefix + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: kanataPrefix, key: parseKeycode(inner) }
    }
  }

  for (const mod of Object.keys(MOD_PREFIX_MAP)) {
    const open = mod + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: MOD_PREFIX_MAP[mod], key: parseKeycode(inner) }
    }
  }

  return null
}

export function parseModTap(str) {
  const match = str.match(/^(LSFT|RSFT|LCTL|RCTL|LALT|RALT|LGUI|RGUI)_T\((.+)\)$/)
  if (!match) return null
  const mod = MOD_TAP_HOLD_MAP[match[1]]
  const key = convertBasicKeycode(match[2])
  return { type: 'mod-tap', mod, key }
}

export function parseLayerTap(str) {
  const match = str.match(/^LT(\d+)\((.+)\)$/)
  if (!match) return null
  const layer = parseInt(match[1], 10)
  const key = convertBasicKeycode(match[2])
  return { type: 'layer-tap', layer, key }
}

export function parseLayerOp(str) {
  const match = str.match(/^(MO|TO|TG|DF)\((\d+)\)$/)
  if (!match) return null
  return { type: 'layer-op', op: match[1], layer: parseInt(match[2], 10) }
}

function parseMacroRef(str) {
  const match = str.match(/^M(\d+)$/)
  if (!match) return null
  return { type: 'macro-ref', index: parseInt(match[1], 10) }
}

function parseTapDanceRef(str) {
  const match = str.match(/^TD\((\d+)\)$/)
  if (!match) return null
  return { type: 'tap-dance-ref', index: parseInt(match[1], 10) }
}

function parseUserKeycode(str) {
  const match = str.match(/^USER(\d+)$/)
  if (!match) return null
  return { type: 'user', index: parseInt(match[1], 10) }
}

// ============================================================
// キーコード変換
// ============================================================

export function convertBasicKeycode(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    return `(arbitrary-code ${ARBITRARY_CODE_KEYS[qmkStr].code})`
  }
  return 'XX'
}

function convertModified(parsed) {
  const keyStr = typeof parsed.key === 'string' ? parsed.key : formatKeycode(parsed.key)
  return `${parsed.prefix}${keyStr}`
}

function formatKeycode(parsed) {
  if (typeof parsed === 'string') return parsed
  if (parsed && parsed.type === 'modified') {
    return convertModified(parsed)
  }
  return 'XX'
}

function parseKeycode(qmkStr) {
  if (!qmkStr || qmkStr === '') return 'XX'
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modified = parseModified(qmkStr)
  if (modified) return modified
  return qmkStr
}

export function extractDefsrcKey(key) {
  if (!key || typeof key !== 'string') return 'XX'
  if (BASIC_KEYCODE_MAP[key] !== undefined) return BASIC_KEYCODE_MAP[key]
  if (ARBITRARY_CODE_KEYS[key]) return 'XX'
  const modTap = parseModTap(key)
  if (modTap) return modTap.key
  const layerTap = parseLayerTap(key)
  if (layerTap) {
    if (layerTap.key.startsWith('XX') || layerTap.key.startsWith('@') || layerTap.key.startsWith('(')) return 'XX'
    return layerTap.key
  }
  const userKey = parseUserKeycode(key)
  if (userKey) return `f${13 + userKey.index}`
  return 'XX'
}

export function convertKeycode(qmkStr, aliasContext) {
  if (!qmkStr || qmkStr === '' || typeof qmkStr !== 'string') return { kanata: 'XX' }

  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return { kanata: BASIC_KEYCODE_MAP[qmkStr] }
  }

  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    const arb = ARBITRARY_CODE_KEYS[qmkStr]
    aliasContext.registerArbitraryCode(arb.name, arb.code, arb.comment)
    return { kanata: `@${arb.name}` }
  }

  if (MOUSE_MOVE_MAP[qmkStr]) {
    const mouse = MOUSE_MOVE_MAP[qmkStr]
    aliasContext.registerMouseMove(mouse.name, mouse.value)
    return { kanata: `@${mouse.name}` }
  }

  const modTap = parseModTap(qmkStr)
  if (modTap) {
    const name = aliasContext.registerModTap(modTap)
    return { kanata: `@${name}` }
  }

  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) {
    const name = aliasContext.registerLayerTap(layerTap)
    return { kanata: `@${name}` }
  }

  const layerOp = parseLayerOp(qmkStr)
  if (layerOp) {
    const name = aliasContext.registerLayerOp(layerOp)
    return { kanata: `@${name}` }
  }

  const macroRef = parseMacroRef(qmkStr)
  if (macroRef) {
    return { kanata: `@m${macroRef.index}` }
  }

  const tdRef = parseTapDanceRef(qmkStr)
  if (tdRef) {
    return { kanata: `@td${tdRef.index}` }
  }

  const userKey = parseUserKeycode(qmkStr)
  if (userKey) {
    const name = aliasContext.registerUser(userKey)
    return { kanata: `@${name}` }
  }

  const modified = parseModified(qmkStr)
  if (modified) {
    const kanataStr = formatKeycode(modified)
    const name = aliasContext.registerModified(qmkStr, kanataStr)
    return { kanata: `@${name}` }
  }

  return { kanata: 'XX' }
}

// ============================================================
// マクロ変換
// ============================================================

function convertMacroKeycode(qmkStr) {
  if (qmkStr === 'KC_TRNS' || qmkStr === 'KC_TRANSPARENT') {
    return null
  }
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    return formatKeycode(modified)
  }
  return 'XX'
}

function convertTextToKeys(text) {
  const keys = []
  for (const ch of text) {
    if (TEXT_TO_KEYS_JIS[ch]) {
      keys.push(TEXT_TO_KEYS_JIS[ch])
    } else {
      keys.push('XX')
    }
  }
  return keys
}

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
      if (action.length > 2) {
        result.push({ type: 'tap', keys: action.slice(1) })
        i++
        continue
      }

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

    result.push({ type: 'unknown', raw: action })
    i++
  }

  return result
}

function convertMacro(macroActions) {
  if (!macroActions || macroActions.length === 0) return null

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

// ============================================================
// タップダンス変換
// ============================================================

function convertBasicOrModified(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
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
  return 'XX'
}

export function convertTapDance(tdData, index) {
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

  function buildSecondAction() {
    const dt = hasOnDoubleTap ? doubleTapKey : tapKey
    if (hasOnTapHold) {
      return `(tap-hold-release $tap-time $hold-time ${dt} ${tapHoldKey})`
    }
    return dt
  }

  const actions = []

  if (hasOnHold) {
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

// ============================================================
// コンボ変換
// ============================================================

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

function convertComboWithPositions(comboData, macroNames, qmkToPositions, uniqueDefsrcKeys) {
  const [key1, key2, key3, key4, result] = comboData
  const keys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')

  if (keys.length < 2) return null

  const usedPositions = new Set()
  const inputKeys = keys.map((qmkStr) => {
    const positions = qmkToPositions.get(qmkStr) || []
    for (const pos of positions) {
      if (!usedPositions.has(pos)) {
        usedPositions.add(pos)
        return uniqueDefsrcKeys[pos]
      }
    }
    return comboInputKey(qmkStr)
  })

  const hasDuplicateKeys = new Set(inputKeys).size !== inputKeys.length
  const duplicateWarning = hasDuplicateKeys
    ? ' ;; WARNING: 重複キーあり'
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
// キーオーバーライド変換
// ============================================================

const TRIGGER_MOD_BITS = {
  1: 'LCtrl', 2: 'LShift', 4: 'LAlt', 8: 'LGui',
  16: 'RCtrl', 32: 'RShift', 64: 'RAlt', 128: 'RGui',
}

export const TRIGGER_MOD_TO_KANATA = {
  1: 'lctl', 2: 'lsft', 4: 'lalt', 8: 'lmet',
  16: 'rctl', 32: 'rsft', 64: 'ralt', 128: 'rmet',
}

const MOD_LR_PAIRS = [
  [1, 16], [2, 32], [4, 64], [8, 128],
]

function describeTriggerMods(modBits) {
  const mods = []
  for (const [bit, name] of Object.entries(TRIGGER_MOD_BITS)) {
    if (modBits & parseInt(bit, 10)) {
      mods.push(name)
    }
  }
  return mods.length > 0 ? mods.join('+') : 'none'
}

function expandTriggerMods(modBits) {
  if (modBits === 0) return [[]]

  const allMods = []
  for (const [bit, name] of Object.entries(TRIGGER_MOD_TO_KANATA)) {
    if (modBits & parseInt(bit, 10)) {
      allMods.push({ bit: parseInt(bit, 10), name })
    }
  }

  const pairsToExpand = []
  const fixedMods = []

  for (const mod of allMods) {
    let isPaired = false
    for (const [leftBit, rightBit] of MOD_LR_PAIRS) {
      if ((mod.bit === leftBit || mod.bit === rightBit) &&
          (modBits & leftBit) && (modBits & rightBit)) {
        if (mod.bit === leftBit) {
          pairsToExpand.push([
            TRIGGER_MOD_TO_KANATA[leftBit],
            TRIGGER_MOD_TO_KANATA[rightBit],
          ])
        }
        isPaired = true
        break
      }
    }
    if (!isPaired) {
      fixedMods.push(mod.name)
    }
  }

  if (pairsToExpand.length === 0) {
    return [allMods.map((m) => m.name)]
  }

  let combos = [fixedMods]
  for (const pair of pairsToExpand) {
    const newCombos = []
    for (const combo of combos) {
      for (const mod of pair) {
        newCombos.push([...combo, mod])
      }
    }
    combos = newCombos
  }
  return combos
}

function parseKanataPrefixToMods(prefix) {
  const modMap = {
    'S-': 'lsft', 'RS-': 'rsft',
    'C-': 'lctl', 'RC-': 'rctl',
    'A-': 'lalt', 'RA-': 'ralt',
    'M-': 'lmet', 'RM-': 'rmet',
  }
  const mods = []
  let remaining = prefix
  while (remaining.length > 0) {
    let matched = false
    for (const [pfx, mod] of Object.entries(modMap).sort((a, b) => b[0].length - a[0].length)) {
      if (remaining.startsWith(pfx)) {
        mods.push(mod)
        remaining = remaining.slice(pfx.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }
  return mods
}

function convertReplacementToKanata(qmkStr) {
  if (!qmkStr || qmkStr === 'KC_NO') return null
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return [BASIC_KEYCODE_MAP[qmkStr]]
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    const mods = parseKanataPrefixToMods(modified.prefix)
    const key = typeof modified.key === 'string' ? modified.key : 'XX'
    return [...mods, key]
  }
  return null
}

function convertKeyOverride(ko) {
  const triggerQmk = ko.trigger || 'KC_NO'
  const replacementQmk = ko.replacement || 'KC_NO'
  const modBits = ko.trigger_mods || 0

  if (triggerQmk === 'KC_NO' && replacementQmk === 'KC_NO') return null

  const triggerKey = extractDefsrcKey(triggerQmk)
  if (!triggerKey || triggerKey === 'XX') return null

  const replacementKeys = convertReplacementToKanata(replacementQmk)
  if (!replacementKeys) return null

  const modCombos = expandTriggerMods(modBits)
  const triggerModsDesc = describeTriggerMods(modBits)
  const comment = `${triggerQmk} + ${triggerModsDesc} → ${replacementQmk}`

  const entries = modCombos.map((mods) => ({
    trigger: [...mods, triggerKey].join(' '),
    replacement: replacementKeys.join(' '),
    comment,
  }))

  return { entries }
}

// ============================================================
// defsrc重複キー解消
// ============================================================

function makeDefsrcKeysUnique(allKeys) {
  const usedKeys = new Set(allKeys)
  const seen = new Map()
  const uniqueKeys = []
  const duplicateInfo = []
  let subIdx = 0

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i]
    if (key === 'XX' || key === '_') {
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
    } else if (!seen.has(key)) {
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

// ============================================================
// エイリアスコンテキスト
// ============================================================

export function createAliasContext() {
  const aliases = new Map()

  return {
    registerModTap(parsed) {
      const variant = parsed.variant || 'tap-hold-release'
      const extraKeys = parsed.extraKeys || ''
      const suffix = variant !== 'tap-hold-release' ? `-${variant}` : ''
      const extraSuffix = extraKeys ? `-${extraKeys.replace(/\s+/g, '')}` : ''
      const name = `${parsed.key}-${parsed.mod}${suffix}${extraSuffix}`
      if (!aliases.has(name)) {
        const extraPart = extraKeys ? ` ${extraKeys}` : ''
        aliases.set(name, {
          type: 'mod-tap',
          value: `(${variant} $tap-time $hold-time ${parsed.key} ${parsed.mod}${extraPart})`,
          comment: null,
        })
      }
      return name
    },

    registerLayerTap(parsed) {
      const variant = parsed.variant || 'tap-hold-release'
      const extraKeys = parsed.extraKeys || ''
      const suffix = variant !== 'tap-hold-release' ? `-${variant}` : ''
      const extraSuffix = extraKeys ? `-${extraKeys.replace(/\s+/g, '')}` : ''
      const name = `l${parsed.layer}-${parsed.key}${suffix}${extraSuffix}`
      if (!aliases.has(name)) {
        const extraPart = extraKeys ? ` ${extraKeys}` : ''
        aliases.set(name, {
          type: 'layer-tap',
          value: `(${variant} $tap-time $hold-time ${parsed.key} (layer-while-held layer${parsed.layer})${extraPart})`,
          comment: null,
        })
      }
      return name
    },

    registerLayerOp(parsed) {
      const opMap = {
        MO: 'layer-while-held',
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
      const nn = String(parsed.index).padStart(2, '0')
      const name = `usr${nn}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'user',
          value: `XX ;; USER${nn}: ユーザー定義キーコード（要手動設定）`,
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
// キー名パディング
// ============================================================

function padKeys(keys) {
  if (keys.length === 0) return []
  const maxLen = Math.max(...keys.map((k) => k.length))
  const padTo = Math.max(maxLen, 4)
  return keys.map((k) => k.padEnd(padTo))
}

// ============================================================
// メイン変換: .vilデータ → .kbd文字列
// ============================================================

export function generateKanataConfig(vilData, inputFileName) {
  const aliasContext = createAliasContext()
  const layout = vilData.layout || []
  const macros = vilData.macro || []
  const tapDances = vilData.tap_dance || []
  const combos = vilData.combo || []
  const keyOverrides = vilData.key_override || []

  const layerCount = layout.length
  const rowCount = layout[0] ? layout[0].length : 0
  const colCount = layout[0] && layout[0][0] ? layout[0][0].length : 0

  // 1. マクロ変換
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

  // 2. タップダンス変換
  const tdAliases = []
  for (let i = 0; i < tapDances.length; i++) {
    const td = convertTapDance(tapDances[i], i)
    if (td) {
      tdAliases.push(td)
    }
  }

  // 3. レイヤーキー変換
  const convertedLayers = layout.map((layer) =>
    layer.map((row) =>
      row.map((key) => convertKeycode(key, aliasContext))
    )
  )

  // 3.5. defsrcキー計算
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

  // QMKキーコード → ベースレイヤー位置マップ
  const qmkToPositions = new Map()
  for (let i = 0; i < baseLayerFlat.length; i++) {
    if (!qmkToPositions.has(baseLayerFlat[i])) {
      qmkToPositions.set(baseLayerFlat[i], [])
    }
    qmkToPositions.get(baseLayerFlat[i]).push(i)
  }

  // 3.6. arbitrary-codeキーのエイリアス登録
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

  // 4. コンボ変換
  const macroNameSet = new Set(macroAliases.keys())
  const convertedCombos = combos
    .map((c) => convertComboWithPositions(c, macroNameSet, qmkToPositions, uniqueDefsrcKeys))
    .filter(Boolean)

  // 5. キーオーバーライド変換
  const koResults = keyOverrides
    .map(convertKeyOverride)
    .filter(Boolean)
  const koEntries = koResults.flatMap((r) => r.entries)

  // 出力組み立て
  const lines = []

  lines.push(`;; Generated by vil2kanata GUI`)
  lines.push(`;; Source: ${inputFileName}`)
  lines.push(`;; Layers: ${layerCount}, Macros: ${macroAliases.size}, TapDance: ${tdAliases.length}, Combos: ${convertedCombos.length}`)
  lines.push('')

  lines.push('(defcfg')
  lines.push('  process-unmapped-keys yes')
  lines.push('  concurrent-tap-hold yes')
  lines.push(')')
  lines.push('')

  const tapTime = 200
  lines.push('(defvar')
  lines.push(`  tap-time ${tapTime}`)
  lines.push(`  hold-time ${tapTime}`)
  lines.push(')')
  lines.push('')

  lines.push(';; ============================================================')
  lines.push(`;; defsrc: 物理レイアウト (${colCount}x${rowCount})`)
  lines.push(';; ============================================================')
  lines.push('(defsrc')
  let defsrcOffset = 0
  for (const row of defsrcRows) {
    const uniqueRow = uniqueDefsrcKeys.slice(defsrcOffset, defsrcOffset + row.length)
    lines.push(`  ${padKeys(uniqueRow).join(' ')}`)
    defsrcOffset += row.length
  }
  lines.push(')')

  if (duplicateInfo.length > 0) {
    lines.push(`;; NOTE: defsrc内の重複キーを自動的に代替キーに置換しました:`)
    for (const dup of duplicateInfo) {
      lines.push(`;;   ${dup.original} → ${dup.substitute} (位置: ${dup.position})`)
    }
  }
  lines.push('')

  lines.push('(defalias')

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

  if (macroAliases.size > 0) {
    lines.push('  ;; Macros')
    for (const [, macro] of macroAliases) {
      lines.push(`  ${macro.comment}`)
      lines.push(`  ${macro.name} ${macro.value}`)
    }
    lines.push('')
  }

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

  if (convertedCombos.length > 0) {
    lines.push('(defchordsv2')
    for (const combo of convertedCombos) {
      lines.push(`  ${combo.comment}`)
      lines.push(`  (${combo.keys.join(' ')})  ${combo.result}  200  all-released  ()`)
    }
    lines.push(')')
    lines.push('')
  }

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

  if (koEntries.length > 0) {
    lines.push(';; ============================================================')
    lines.push(';; Key Overrides')
    lines.push(';; ============================================================')
    lines.push('(defoverrides')
    const seenComments = new Set()
    for (const entry of koEntries) {
      if (!seenComments.has(entry.comment)) {
        lines.push(`  ;; ${entry.comment}`)
        seenComments.add(entry.comment)
      }
      lines.push(`  (${entry.trigger}) (${entry.replacement})`)
    }
    lines.push(')')
    lines.push('')
  }

  return lines.join('\n')
}

// ============================================================
// GUI状態 → .kbd生成 (Phase 4用)
// ============================================================

export function generateKbdFromState(state) {
  const aliasContext = createAliasContext()
  const lines = []

  lines.push(';; Generated by vil2kanata GUI')
  lines.push('')

  // defcfg
  lines.push('(defcfg')
  if (state.settings.processUnmappedKeys !== false) {
    lines.push('  process-unmapped-keys yes')
  }
  if (state.settings.concurrentTapHold !== false) {
    lines.push('  concurrent-tap-hold yes')
  }
  if (state.settings.rapidEventDelay > 0) {
    lines.push(`  rapid-event-delay ${state.settings.rapidEventDelay}`)
  }
  lines.push(')')
  lines.push('')

  // defvar
  lines.push('(defvar')
  lines.push(`  tap-time ${state.settings.tapTime}`)
  lines.push(`  hold-time ${state.settings.holdTime}`)
  lines.push(')')
  lines.push('')

  // defsrcKeysに含まれるインデックスを決定
  const defsrcKeys = state.defsrcKeys
  const includedIndices = (defsrcKeys && defsrcKeys.size > 0)
    ? [...defsrcKeys].sort((a, b) => a - b)
    : state.physicalLayout.map((_, i) => i)

  // defsrc（選択キーのみ）
  const filteredPhysicalKeys = includedIndices.map((i) => state.physicalLayout[i].kanataKey)
  const { uniqueKeys, duplicateInfo } = makeDefsrcKeysUnique(filteredPhysicalKeys)

  lines.push('(defsrc')
  lines.push(`  ${padKeys(uniqueKeys).join(' ')}`)
  lines.push(')')
  if (duplicateInfo.length > 0) {
    for (const dup of duplicateInfo) {
      lines.push(`;;   ${dup.original} → ${dup.substitute} (位置: ${dup.position})`)
    }
  }
  lines.push('')

  // レイヤーのキーコードを変換（defsrcKeysでフィルタリング）
  const convertedLayers = state.layers.map((layer) =>
    includedIndices.map((i) => {
      const keyConfig = layer.keys[i]
      if (!keyConfig || !keyConfig.type) return { kanata: 'XX' }

      switch (keyConfig.type) {
        case 'basic':
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
        case 'modified':
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
        case 'mod-tap': {
          const name = aliasContext.registerModTap({
            key: keyConfig.tapKey,
            mod: keyConfig.holdMod,
            variant: keyConfig.tapHoldVariant,
            extraKeys: keyConfig.tapHoldExtraKeys,
          })
          return { kanata: `@${name}` }
        }
        case 'layer-tap': {
          const name = aliasContext.registerLayerTap({
            layer: keyConfig.layer,
            key: keyConfig.tapKey,
            variant: keyConfig.tapHoldVariant,
            extraKeys: keyConfig.tapHoldExtraKeys,
          })
          return { kanata: `@${name}` }
        }
        case 'layer-op': {
          const name = aliasContext.registerLayerOp({
            op: keyConfig.op,
            layer: keyConfig.layer,
          })
          return { kanata: `@${name}` }
        }
        case 'macro':
          return { kanata: `@m${keyConfig.index}` }
        case 'tap-dance': {
          // GUI形式のtap-danceに該当するIDがあればtdgプレフィックス
          const guiTds = state.tapDancesGui || []
          const isGuiTd = guiTds.some((t) => t && t.id === keyConfig.index)
          return { kanata: isGuiTd ? `@tdg${keyConfig.index}` : `@td${keyConfig.index}` }
        }
        case 'transparent':
          return { kanata: '_' }
        case 'disabled':
          return { kanata: 'XX' }
        default:
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
      }
    })
  )

  // Macros (GUI形式: {id, actions:[{type,key/text}]})
  const guiMacros = (state.macros || []).filter(
    (m) => m && m.id !== undefined && m.actions && m.actions.length > 0,
  )
  const macroEntries = []
  for (const macro of guiMacros) {
    const parts = []
    for (const action of macro.actions) {
      if (action.type === 'tap' && action.key) {
        parts.push(resolveKanataKey(action.key))
      } else if (action.type === 'text') {
        for (const ch of (action.text || '')) {
          if (TEXT_TO_KEYS_JIS[ch]) parts.push(TEXT_TO_KEYS_JIS[ch])
        }
      } else if (action.type === 'delay' && action.duration) {
        parts.push(`(pause ${action.duration})`)
      }
    }
    if (parts.length > 0) {
      const labelComment = macro.label ? ` ;; ${macro.label}` : ''
      macroEntries.push({ index: macro.id, value: `(macro ${parts.join(' ')})${labelComment}` })
    }
  }

  // Tap Dance (VIL形式パススルー)
  const tdAliases = []
  if (state.tapDances && state.tapDances.length > 0) {
    for (let i = 0; i < state.tapDances.length; i++) {
      const td = convertTapDance(state.tapDances[i], i)
      if (td) tdAliases.push(td)
    }
  }

  // Tap Dance (GUI形式: VILパススルーと区別するためtdgプレフィックス)
  const guiTapDances = (state.tapDancesGui || []).filter(
    (t) => t && t.id !== undefined && t.actions && t.actions.length > 0,
  )
  for (const td of guiTapDances) {
    const actions = td.actions
      .map((a) => resolveKanataKey(a.kanataKey) || 'XX')
      .filter((k) => k)
    if (actions.length > 0) {
      const timeout = td.timeout || 200
      tdAliases.push({
        name: `tdg${td.id}`,
        value: `(tap-dance ${timeout} (${actions.join(' ')}))`,
        comment: null,
      })
    }
  }

  // defalias
  const allAliases = aliasContext.getAliases()
  if (allAliases.size > 0 || macroEntries.length > 0 || tdAliases.length > 0) {
    lines.push('(defalias')
    if (allAliases.size > 0) {
      lines.push('  ;; Mod-Tap / Layer-Tap / Modified keys')
      for (const [name, alias] of allAliases) {
        if (alias.comment) {
          lines.push(`  ${alias.comment}`)
        }
        lines.push(`  ${name} ${alias.value}`)
      }
    }
    if (macroEntries.length > 0) {
      lines.push('  ;; Macros')
      for (const m of macroEntries) {
        lines.push(`  m${m.index} ${m.value}`)
      }
    }
    if (tdAliases.length > 0) {
      lines.push('  ;; Tap Dance')
      for (const td of tdAliases) {
        if (td.comment) lines.push(`  ${td.comment}`)
        lines.push(`  ${td.name} ${td.value}`)
      }
    }
    lines.push(')')
    lines.push('')
  }

  // deflayer
  for (let i = 0; i < state.layers.length; i++) {
    const layerName = state.layers[i].name
    const keys = convertedLayers[i].map((r) => r.kanata)
    lines.push(`(deflayer ${layerName}`)
    lines.push(`  ${padKeys(keys).join(' ')}`)
    lines.push(')')
    lines.push('')
  }

  // Combos → defchordsv2 (GUI形式: {id, keys, result, timeout})
  // コンボのトリガーキーはbaseレイヤーのkanataKeyで保存されているため、
  // 物理キー(defsrc)のkanataKeyに逆引き変換する
  const baseToPhysMap = new Map()
  if (state.physicalLayout && state.layers && state.layers.length > 0) {
    const baseKeys = state.layers[0].keys || []
    for (let i = 0; i < state.physicalLayout.length; i++) {
      if (state.defsrcKeys && state.defsrcKeys.size > 0 && !state.defsrcKeys.has(i)) continue
      const layerKey = baseKeys[i]
      if (layerKey && layerKey.kanataKey && layerKey.kanataKey !== '_' && layerKey.kanataKey !== 'XX') {
        if (!baseToPhysMap.has(layerKey.kanataKey)) {
          baseToPhysMap.set(layerKey.kanataKey, state.physicalLayout[i].kanataKey)
        }
      }
    }
  }

  const guiCombos = (state.combos || []).filter(
    (c) => c && c.id !== undefined && c.keys && c.keys.length >= 2 && c.result,
  )
  if (guiCombos.length > 0) {
    lines.push('(defchordsv2')
    for (const combo of guiCombos) {
      const timeout = combo.timeout || 200
      const physKeys = combo.keys.map((k) => resolveKanataKey(baseToPhysMap.get(k) || k))
      const resolvedResult = resolveKanataKey(combo.result)
      lines.push(`  ;; ${combo.keys.join(' + ')} → ${combo.result}`)
      lines.push(`  (${physKeys.join(' ')})  ${resolvedResult}  ${timeout}  all-released  ()`)
    }
    lines.push(')')
    lines.push('')
  }

  // Key Overrides → defoverrides (GUI形式: {id, trigger, triggerMods, replacementKey, replacementMods})
  const guiOverrides = (state.keyOverrides || []).filter(
    (ko) => ko && ko.id !== undefined && ko.trigger && ko.replacementKey,
  )
  if (guiOverrides.length > 0) {
    lines.push('(defoverrides')
    for (const ko of guiOverrides) {
      const triggerParts = [...(ko.triggerMods || []), ko.trigger].map((k) => resolveKanataKey(k))
      const replacementParts = [...(ko.replacementMods || []), ko.replacementKey].map((k) => resolveKanataKey(k))
      lines.push(`  ;; ${triggerParts.join('+')} → ${replacementParts.join('+')}`)
      lines.push(`  (${triggerParts.join(' ')}) (${replacementParts.join(' ')})`)
    }
    lines.push(')')
    lines.push('')
  }

  return lines.join('\n')
}

// ============================================================
// VIL → GUI形式変換関数
// ============================================================

export function vilMacroToGui(macroActions, id) {
  if (!macroActions || macroActions.length === 0) return null
  const optimized = optimizeMacroActions(macroActions)
  const actions = []
  for (const action of optimized) {
    if (action.type === 'tap') {
      for (const key of action.keys) {
        const kanataKey = convertMacroKeycode(key)
        if (kanataKey) actions.push({ type: 'tap', key: kanataKey })
      }
    } else if (action.type === 'modified-tap') {
      for (const key of action.keys) {
        const kanataKey = convertMacroKeycode(key)
        if (kanataKey) actions.push({ type: 'tap', key: `${action.prefix}${kanataKey}` })
      }
    } else if (action.type === 'text') {
      actions.push({ type: 'text', text: action.text })
    }
  }
  return { id, actions }
}

export function vilComboToGui(comboData, id) {
  const [key1, key2, key3, key4, result] = comboData
  const inputQmkKeys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')
  if (inputQmkKeys.length < 2) return null

  const keys = inputQmkKeys.map((k) => {
    if (BASIC_KEYCODE_MAP[k] !== undefined) return BASIC_KEYCODE_MAP[k]
    const modTap = parseModTap(k)
    if (modTap) return modTap.key
    const layerTap = parseLayerTap(k)
    if (layerTap) return layerTap.key
    return convertBasicOrModified(k)
  }).filter((k) => k && k !== 'XX')

  if (keys.length < 2) return null

  let resultKey
  if (BASIC_KEYCODE_MAP[result] !== undefined) {
    resultKey = BASIC_KEYCODE_MAP[result]
  } else {
    resultKey = convertBasicOrModified(result)
  }
  if (!resultKey || resultKey === 'XX') return null

  return { id, keys, result: resultKey, timeout: 200 }
}

export function vilOverrideToGui(ko, id) {
  const triggerQmk = ko.trigger || 'KC_NO'
  const replacementQmk = ko.replacement || 'KC_NO'
  const modBits = ko.trigger_mods || 0

  if (triggerQmk === 'KC_NO' && replacementQmk === 'KC_NO') return null

  const trigger = extractDefsrcKey(triggerQmk)
  if (!trigger || trigger === 'XX') return null

  const triggerMods = []
  for (const [bit, mod] of Object.entries(TRIGGER_MOD_TO_KANATA)) {
    if (modBits & parseInt(bit, 10)) triggerMods.push(mod)
  }

  let replacementKey = null
  const replacementMods = []

  if (replacementQmk !== 'KC_NO' && replacementQmk !== '') {
    if (BASIC_KEYCODE_MAP[replacementQmk] !== undefined) {
      replacementKey = BASIC_KEYCODE_MAP[replacementQmk]
    } else {
      const modified = parseModified(replacementQmk)
      if (modified) {
        const mods = parseKanataPrefixToMods(modified.prefix)
        replacementMods.push(...mods)
        replacementKey = typeof modified.key === 'string' ? modified.key : 'XX'
      }
    }
  }

  if (!replacementKey) return null

  return { id, trigger, triggerMods, replacementKey, replacementMods }
}

// ============================================================
// .vilパース: バイナリ/JSONどちらにも対応
// ============================================================

export function parseVilData(content) {
  try {
    return JSON.parse(content)
  } catch {
    throw new Error('.vilファイルのパースに失敗しました。JSON形式を確認してください。')
  }
}

// QMKキーコード → GUI用の構造化キー定義に変換
export function qmkKeyToGuiKey(qmkStr) {
  if (!qmkStr || qmkStr === '' || typeof qmkStr !== 'string') {
    return { type: 'disabled', label: '', kanataKey: 'XX' }
  }

  if (qmkStr === 'KC_TRNS' || qmkStr === 'KC_TRANSPARENT') {
    return { type: 'transparent', label: '▽', kanataKey: '_' }
  }

  if (qmkStr === 'KC_NO') {
    return { type: 'disabled', label: '', kanataKey: 'XX' }
  }

  // 基本キーコード
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    const kanata = BASIC_KEYCODE_MAP[qmkStr]
    const label = qmkStr.replace('KC_', '')
    return { type: 'basic', label, kanataKey: kanata, qmk: qmkStr }
  }

  // Mod-Tap
  const modTap = parseModTap(qmkStr)
  if (modTap) {
    const tapLabel = modTap.key.toUpperCase()
    const holdLabel = modTap.mod.toUpperCase()
    return {
      type: 'mod-tap',
      label: tapLabel,
      holdLabel,
      tapKey: modTap.key,
      holdMod: modTap.mod,
      qmk: qmkStr,
    }
  }

  // Layer-Tap
  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) {
    const tapLabel = layerTap.key.toUpperCase()
    const holdLabel = `L${layerTap.layer}`
    return {
      type: 'layer-tap',
      label: tapLabel,
      holdLabel,
      tapKey: layerTap.key,
      layer: layerTap.layer,
      qmk: qmkStr,
    }
  }

  // レイヤー操作
  const layerOp = parseLayerOp(qmkStr)
  if (layerOp) {
    return {
      type: 'layer-op',
      label: `${layerOp.op}(${layerOp.layer})`,
      op: layerOp.op,
      layer: layerOp.layer,
      qmk: qmkStr,
    }
  }

  // マクロ
  const macroRef = parseMacroRef(qmkStr)
  if (macroRef) {
    return {
      type: 'macro',
      label: `M${macroRef.index}`,
      index: macroRef.index,
      qmk: qmkStr,
    }
  }

  // タップダンス
  const tdRef = parseTapDanceRef(qmkStr)
  if (tdRef) {
    return {
      type: 'tap-dance',
      label: `TD${tdRef.index}`,
      index: tdRef.index,
      qmk: qmkStr,
    }
  }

  // USER
  const userKey = parseUserKeycode(qmkStr)
  if (userKey) {
    return {
      type: 'user',
      label: `U${userKey.index}`,
      index: userKey.index,
      qmk: qmkStr,
    }
  }

  // 修飾付き
  const modified = parseModified(qmkStr)
  if (modified) {
    const kanataStr = formatKeycode(modified)
    return {
      type: 'modified',
      label: kanataStr,
      kanataKey: kanataStr,
      qmk: qmkStr,
    }
  }

  return { type: 'unknown', label: qmkStr, kanataKey: 'XX', qmk: qmkStr }
}

// Kanataキー名 → 表示用ラベル (US配列)
export const KANATA_KEY_LABELS = {
  'ret': 'Enter', 'esc': 'Esc', 'bspc': 'Bksp', 'tab': 'Tab',
  'spc': 'Space', 'caps': 'Caps', 'del': 'Del', 'ins': 'Ins',
  'prnt': 'PrtSc', 'slck': 'ScrLk', 'pause': 'Pause',
  'pgup': 'PgUp', 'pgdn': 'PgDn', 'home': 'Home', 'end': 'End',
  'left': '←', 'rght': '→', 'up': '↑', 'down': '↓',
  'lctl': 'LCtrl', 'lsft': 'LShift', 'lalt': 'LAlt', 'lmet': 'LWin',
  'rctl': 'RCtrl', 'rsft': 'RShift', 'ralt': 'RAlt', 'rmet': 'RWin',
  'grv': '`', 'ro': 'Ro', 'kana': 'かな', 'mhnk': '無変換', 'henk': '変換', 'menu': 'Menu',
  'lang1': 'IME ON', 'lang2': 'IME OFF',
  'mlft': 'MLeft', 'mrgt': 'MRight', 'mmid': 'MMid',
  'mute': 'Mute', 'volu': 'Vol+', 'vold': 'Vol-',
  'next': 'Next', 'prev': 'Prev', 'pp': 'Play', 'stop': 'Stop',
  'lrld': 'Reload',
  '_': '▽', 'XX': '',
  // 追加キー
  'nlck': 'NumLk', 'nlk': 'NumLk',
  '102d': '102nd', 'lsgt': '102nd', 'nubs': '102nd',
  'ssrq': 'SysRq', 'sys': 'SysRq',
  'fn': 'Fn',
  'eisu': '英数',
  'bck': 'Back', 'fwd': 'Fwd',
  'eject': 'Eject',
  'bru': 'Bri+', 'brup': 'Bri+',
  'brdn': 'Bri-', 'brdwn': 'Bri-', 'brdown': 'Bri-',
  'blup': 'KBLi+', 'bldn': 'KBLi-',
  'hmpg': 'Home🌐', 'homepage': 'Home🌐',
  'mdia': 'Media', 'media': 'Media',
  'mail': 'Mail', 'email': 'Email',
  'calc': 'Calc',
  'plyr': 'Player', 'player': 'Player',
  'powr': 'Power', 'power': 'Power',
  'zzz': 'Sleep', 'sleep': 'Sleep',
  'wkup': 'Wake',
  'comp': 'Compose', 'cmps': 'Compose', 'cmp': 'Compose',
  'mbck': 'MBack', 'mfwd': 'MFwd',
  'mwu': 'MWU', 'mwd': 'MWD', 'mwl': 'MWL', 'mwr': 'MWR',
  'kp=': 'KP=', 'clr': 'Clear',
  'kp,': 'KP,',
  'lpar': 'KP(', 'kp(': 'KP(',
  'rpar': 'KP)', 'kp)': 'KP)',
  'sls': 'Spotlight', 'dtn': 'Dictation', 'dnd': 'DND',
  'mctl': 'MCtrl', 'lpad': 'LPad',
  'hiragana': 'ひらがな', 'katakana': 'カタカナ',
  'mvmt': 'MouseMv',
}

// JIS配列で表示が異なるキーのラベルマップ
export const KANATA_KEY_LABELS_JIS = {
  '[': '@',
  ']': '[',
  '\\': ']',
  '\'': ':',
  '=': '^',
  'grv': '半/全',
  '¥': '¥',
  'ro': '\\',
}

export function getKeyLabel(kanataKey, mode) {
  if (!kanataKey) return ''
  if (mode === 'jis' && KANATA_KEY_LABELS_JIS[kanataKey]) {
    return KANATA_KEY_LABELS_JIS[kanataKey]
  }
  if (KANATA_KEY_LABELS[kanataKey]) return KANATA_KEY_LABELS[kanataKey]
  if (kanataKey.length === 1) return kanataKey.toUpperCase()
  if (kanataKey.startsWith('f') && /^f\d+$/.test(kanataKey)) return kanataKey.toUpperCase()
  return kanataKey
}

// Shift+キー → 出力文字マップ
const SHIFTED_OUTPUT_US = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
  ';': ':', "'": '"', 'grv': '~', ',': '<', '.': '>', '/': '?',
}

const SHIFTED_OUTPUT_JIS = {
  '1': '!', '2': '"', '3': '#', '4': '$', '5': '%',
  '6': '&', '7': "'", '8': '(', '9': ')', '0': '',
  '-': '=', '=': '~', '[': '`', ']': '{', '\\': '}',
  ';': '+', "'": '*', 'grv': '~', ',': '<', '.': '>', '/': '?',
}

// modified キー (例: "S-9") → 出力内容ラベル
export function getModifiedKeyLabel(kanataKey, mode) {
  if (!kanataKey) return ''

  // "S-<key>" 形式のShiftのみの場合、出力文字を返す
  const shiftMatch = kanataKey.match(/^S-(.+)$/)
  if (shiftMatch) {
    const baseKey = shiftMatch[1]
    const shiftMap = mode === 'jis' ? SHIFTED_OUTPUT_JIS : SHIFTED_OUTPUT_US

    // Shift+記号/数字 → 出力文字
    if (shiftMap[baseKey] !== undefined) {
      return shiftMap[baseKey] || kanataKey
    }
    // Shift+英字 → 大文字
    if (baseKey.length === 1 && /^[a-z]$/.test(baseKey)) {
      return baseKey.toUpperCase()
    }
    // Shift+特殊キー → ラベル付き表示
    const baseLabel = getKeyLabel(baseKey, mode)
    return `S-${baseLabel}`
  }

  // 複数修飾キー: プレフィックス部分を短縮表示、ベースキーはラベル変換
  const modMatch = kanataKey.match(/^((?:[A-Z]+-)+)(.+)$/)
  if (modMatch) {
    const prefix = modMatch[1]
    const baseKey = modMatch[2]
    const baseLabel = getKeyLabel(baseKey, mode)
    return `${prefix}${baseLabel}`
  }

  return kanataKey
}

// BASIC_KEYCODE_MAP に含まれないkanata追加キー
// str_to_oscode (kanata parser/src/keys/mod.rs) から抽出
const EXTRA_KANATA_KEYS = [
  // NumLock
  'nlck',
  // Non-US 102nd key
  '102d', 'lsgt', 'nubs',
  // SysRq
  'ssrq',
  // Fn
  'fn',
  // IME ON/OFF (Windows: arbitrary-code経由)
  'lang1', 'lang2',
  // ブラウザ
  'bck', 'fwd',
  // 輝度
  'bru', 'brdn',
  // キーボードバックライト
  'blup', 'bldn',
  // イジェクト
  'eject',
  // アプリ起動
  'hmpg', 'mdia', 'mail', 'email', 'calc',
  // 電源
  'powr', 'zzz', 'wkup',
  // Compose
  'comp',
  // マウス追加
  'mbck', 'mfwd',
  'mwu', 'mwd', 'mwl', 'mwr',
  // テンキー追加
  'kp=', 'kp,', 'lpar', 'rpar',
  // macOS固有
  'sls', 'dtn', 'dnd', 'mctl', 'lpad',
  // 日本語入力
  'hiragana', 'katakana',
  // マウス移動ダミー
  'mvmt',
]

// Kanataキー名の逆引き（表示ラベル → kanataキー名のリスト）
export function getAllBasicKeys(mode) {
  const seen = new Set()
  const keys = []
  for (const [qmk, kanata] of Object.entries(BASIC_KEYCODE_MAP)) {
    if (!seen.has(kanata) && kanata !== '_' && kanata !== 'XX') {
      seen.add(kanata)
      keys.push({
        kanata,
        label: getKeyLabel(kanata, mode),
        qmk,
      })
    }
  }
  // 追加kanataキー（QMKマッピングなし）
  for (const kanata of EXTRA_KANATA_KEYS) {
    if (!seen.has(kanata)) {
      seen.add(kanata)
      keys.push({
        kanata,
        label: getKeyLabel(kanata, mode),
        qmk: '',
      })
    }
  }
  return keys
}
