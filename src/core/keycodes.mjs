// ============================================================
// QMK / Vial キーコード定義テーブル
//
// Vial (vial-gui keycodes.py, protocol v6) が .vil に書き出すキーコード名と、
// QMK 本家のエイリアス名の両方を Kanata のキー名へ対応付ける。
// ============================================================

// QMK 基本キーコード → Kanata キー名
// 一部は OS 依存の「疑似キー名」(lang1, lang2, mstp 等) で、出力時に OS ごとに解決する
// (see: resolveOutputKey in emit.mjs)
export const QMK_BASIC = {
  KC_A: 'a', KC_B: 'b', KC_C: 'c', KC_D: 'd', KC_E: 'e', KC_F: 'f', KC_G: 'g',
  KC_H: 'h', KC_I: 'i', KC_J: 'j', KC_K: 'k', KC_L: 'l', KC_M: 'm', KC_N: 'n',
  KC_O: 'o', KC_P: 'p', KC_Q: 'q', KC_R: 'r', KC_S: 's', KC_T: 't', KC_U: 'u',
  KC_V: 'v', KC_W: 'w', KC_X: 'x', KC_Y: 'y', KC_Z: 'z',

  KC_1: '1', KC_2: '2', KC_3: '3', KC_4: '4', KC_5: '5',
  KC_6: '6', KC_7: '7', KC_8: '8', KC_9: '9', KC_0: '0',

  KC_ENTER: 'ret', KC_ENT: 'ret',
  KC_ESCAPE: 'esc', KC_ESC: 'esc',
  KC_BSPACE: 'bspc', KC_BSPC: 'bspc', KC_BACKSPACE: 'bspc',
  KC_TAB: 'tab',
  KC_SPACE: 'spc', KC_SPC: 'spc',
  KC_MINUS: '-', KC_MINS: '-',
  KC_EQUAL: '=', KC_EQL: '=',
  KC_LBRACKET: '[', KC_LBRC: '[', KC_LEFT_BRACKET: '[',
  KC_RBRACKET: ']', KC_RBRC: ']', KC_RIGHT_BRACKET: ']',
  KC_BSLASH: '\\', KC_BSLS: '\\', KC_BACKSLASH: '\\',
  // Windows / Linux ともに NUHS は Backslash と同じスキャンコードになる
  KC_NONUS_HASH: '\\', KC_NUHS: '\\',
  KC_SCOLON: ';', KC_SCLN: ';', KC_SEMICOLON: ';',
  KC_QUOTE: "'", KC_QUOT: "'",
  KC_GRAVE: 'grv', KC_GRV: 'grv', KC_ZKHK: 'grv',
  KC_COMMA: ',', KC_COMM: ',',
  KC_DOT: '.',
  KC_SLASH: '/', KC_SLSH: '/',
  KC_CAPSLOCK: 'caps', KC_CAPS: 'caps', KC_CLCK: 'caps', KC_CAPS_LOCK: 'caps',
  KC_LCAP: 'caps', KC_LNUM: 'nlck', KC_LSCR: 'slck',
  KC_NONUS_BSLASH: 'nubs', KC_NUBS: 'nubs', KC_NONUS_BACKSLASH: 'nubs',

  KC_F1: 'f1', KC_F2: 'f2', KC_F3: 'f3', KC_F4: 'f4', KC_F5: 'f5', KC_F6: 'f6',
  KC_F7: 'f7', KC_F8: 'f8', KC_F9: 'f9', KC_F10: 'f10', KC_F11: 'f11', KC_F12: 'f12',
  KC_F13: 'f13', KC_F14: 'f14', KC_F15: 'f15', KC_F16: 'f16', KC_F17: 'f17', KC_F18: 'f18',
  KC_F19: 'f19', KC_F20: 'f20', KC_F21: 'f21', KC_F22: 'f22', KC_F23: 'f23', KC_F24: 'f24',

  KC_PSCREEN: 'prnt', KC_PSCR: 'prnt', KC_PRINT_SCREEN: 'prnt',
  KC_SCROLLLOCK: 'slck', KC_SLCK: 'slck', KC_SCRL: 'slck', KC_SCROLL_LOCK: 'slck',
  KC_PAUSE: 'pause', KC_PAUS: 'pause', KC_BRK: 'pause',
  KC_INSERT: 'ins', KC_INS: 'ins',
  KC_HOME: 'home', KC_END: 'end',
  KC_PGUP: 'pgup', KC_PAGE_UP: 'pgup',
  KC_PGDOWN: 'pgdn', KC_PGDN: 'pgdn', KC_PAGE_DOWN: 'pgdn',
  KC_DELETE: 'del', KC_DEL: 'del',
  KC_RIGHT: 'rght', KC_RGHT: 'rght', KC_LEFT: 'left', KC_DOWN: 'down', KC_UP: 'up',
  KC_APPLICATION: 'menu', KC_APP: 'menu',

  KC_LCTRL: 'lctl', KC_LCTL: 'lctl', KC_LEFT_CTRL: 'lctl',
  KC_LSHIFT: 'lsft', KC_LSFT: 'lsft', KC_LEFT_SHIFT: 'lsft',
  KC_LALT: 'lalt', KC_LOPT: 'lalt', KC_LEFT_ALT: 'lalt',
  KC_LGUI: 'lmet', KC_LCMD: 'lmet', KC_LWIN: 'lmet', KC_LEFT_GUI: 'lmet',
  KC_RCTRL: 'rctl', KC_RCTL: 'rctl', KC_RIGHT_CTRL: 'rctl',
  KC_RSHIFT: 'rsft', KC_RSFT: 'rsft', KC_RIGHT_SHIFT: 'rsft',
  KC_RALT: 'ralt', KC_ALGR: 'ralt', KC_ROPT: 'ralt', KC_RIGHT_ALT: 'ralt',
  KC_RGUI: 'rmet', KC_RCMD: 'rmet', KC_RWIN: 'rmet', KC_RIGHT_GUI: 'rmet',

  KC_NUMLOCK: 'nlck', KC_NLCK: 'nlck', KC_NUM: 'nlck', KC_NUM_LOCK: 'nlck',
  KC_KP_SLASH: 'kp/', KC_PSLS: 'kp/',
  KC_KP_ASTERISK: 'kp*', KC_PAST: 'kp*',
  KC_KP_MINUS: 'kp-', KC_PMNS: 'kp-',
  KC_KP_PLUS: 'kp+', KC_PPLS: 'kp+',
  KC_KP_ENTER: 'kprt', KC_PENT: 'kprt',
  KC_KP_1: 'kp1', KC_P1: 'kp1', KC_KP_2: 'kp2', KC_P2: 'kp2', KC_KP_3: 'kp3', KC_P3: 'kp3',
  KC_KP_4: 'kp4', KC_P4: 'kp4', KC_KP_5: 'kp5', KC_P5: 'kp5', KC_KP_6: 'kp6', KC_P6: 'kp6',
  KC_KP_7: 'kp7', KC_P7: 'kp7', KC_KP_8: 'kp8', KC_P8: 'kp8', KC_KP_9: 'kp9', KC_P9: 'kp9',
  KC_KP_0: 'kp0', KC_P0: 'kp0',
  KC_KP_DOT: 'kp.', KC_PDOT: 'kp.',
  KC_KP_EQUAL: 'kp=', KC_PEQL: 'kp=',
  KC_KP_COMMA: 'kp,', KC_PCMM: 'kp,',

  // 日本語 / 国際キー
  KC_RO: 'ro', KC_INT1: 'ro', KC_INTERNATIONAL_1: 'ro',
  KC_KANA: 'kana', KC_INT2: 'kana', KC_INTERNATIONAL_2: 'kana',
  KC_JYEN: '¥', KC_INT3: '¥', KC_INTERNATIONAL_3: '¥',
  KC_HENK: 'henk', KC_INT4: 'henk', KC_INTERNATIONAL_4: 'henk',
  KC_MHEN: 'mhnk', KC_INT5: 'mhnk', KC_INTERNATIONAL_5: 'mhnk',
  KC_LANG1: 'lang1', KC_LNG1: 'lang1', KC_HAEN: 'lang1', KC_LANGUAGE_1: 'lang1',
  KC_LANG2: 'lang2', KC_LNG2: 'lang2', KC_HANJ: 'lang2', KC_LANGUAGE_2: 'lang2',

  // システム / メディア
  KC_PWR: 'powr', KC_SYSTEM_POWER: 'powr',
  KC_SLEP: 'zzz', KC_SYSTEM_SLEEP: 'zzz',
  KC_WAKE: 'wkup', KC_SYSTEM_WAKE: 'wkup',
  KC_CALC: 'calc', KC_CALCULATOR: 'calc',
  KC_MAIL: 'mail',
  KC_MSEL: 'plyr', KC_MEDIA_SELECT: 'plyr',
  KC_WHOM: 'hmpg', KC_WWW_HOME: 'hmpg',
  KC_WBAK: 'bck', KC_WWW_BACK: 'bck',
  KC_WFWD: 'fwd', KC_WWW_FORWARD: 'fwd',
  KC_BRIU: 'bru', KC_BRIGHTNESS_UP: 'bru', KC_BRMU: 'bru',
  KC_BRID: 'brdn', KC_BRIGHTNESS_DOWN: 'brdn', KC_BRMD: 'brdn',
  KC_MPRV: 'prev', KC_MEDIA_PREV_TRACK: 'prev', KC_MRWD: 'prev', KC_MEDIA_REWIND: 'prev',
  KC_MNXT: 'next', KC_MEDIA_NEXT_TRACK: 'next', KC_MFFD: 'next', KC_MEDIA_FAST_FORWARD: 'next',
  KC_MUTE: 'mute', KC_AUDIO_MUTE: 'mute',
  KC_VOLD: 'vold', KC_AUDIO_VOL_DOWN: 'vold', KC__VOLDOWN: 'vold',
  KC_VOLU: 'volu', KC_AUDIO_VOL_UP: 'volu', KC__VOLUP: 'volu',
  KC_MPLY: 'pp', KC_MEDIA_PLAY_PAUSE: 'pp',
  KC_MSTP: 'mstp', KC_MEDIA_STOP: 'mstp',
  KC_EJCT: 'eject', KC_MEDIA_EJECT: 'eject',

  // マウスボタン
  KC_BTN1: 'mlft', KC_MS_BTN1: 'mlft',
  KC_BTN2: 'mrgt', KC_MS_BTN2: 'mrgt',
  KC_BTN3: 'mmid', KC_MS_BTN3: 'mmid',
  KC_BTN4: 'mbck', KC_MS_BTN4: 'mbck',
  KC_BTN5: 'mfwd', KC_MS_BTN5: 'mfwd',
}

// Kanata に相当キーのない QMK キーコード (出力は XX + 警告)
export const QMK_UNSUPPORTED_BASIC = new Set([
  'KC_EXEC', 'KC_EXECUTE', 'KC_HELP', 'KC_SLCT', 'KC_SELECT', 'KC_STOP', 'KC_AGIN', 'KC_AGAIN',
  'KC_UNDO', 'KC_CUT', 'KC_COPY', 'KC_PSTE', 'KC_PASTE', 'KC_FIND', 'KC_MYCM', 'KC_MY_COMPUTER',
  'KC_WSCH', 'KC_WWW_SEARCH', 'KC_WSTP', 'KC_WWW_STOP', 'KC_WREF', 'KC_WWW_REFRESH',
  'KC_WFAV', 'KC_WWW_FAVORITES',
])

// QMK のシフト済みキーコード (KC_EXLM = LSFT(KC_1) 等)
export const QMK_SHIFTED = {
  KC_TILD: 'KC_GRAVE', KC_TILDE: 'KC_GRAVE',
  KC_EXLM: 'KC_1', KC_EXCLAIM: 'KC_1',
  KC_AT: 'KC_2',
  KC_HASH: 'KC_3',
  KC_DLR: 'KC_4', KC_DOLLAR: 'KC_4',
  KC_PERC: 'KC_5', KC_PERCENT: 'KC_5',
  KC_CIRC: 'KC_6', KC_CIRCUMFLEX: 'KC_6',
  KC_AMPR: 'KC_7', KC_AMPERSAND: 'KC_7',
  KC_ASTR: 'KC_8', KC_ASTERISK: 'KC_8',
  KC_LPRN: 'KC_9', KC_LEFT_PAREN: 'KC_9',
  KC_RPRN: 'KC_0', KC_RIGHT_PAREN: 'KC_0',
  KC_UNDS: 'KC_MINUS', KC_UNDERSCORE: 'KC_MINUS',
  KC_PLUS: 'KC_EQUAL',
  KC_LCBR: 'KC_LBRACKET', KC_LEFT_CURLY_BRACE: 'KC_LBRACKET',
  KC_RCBR: 'KC_RBRACKET', KC_RIGHT_CURLY_BRACE: 'KC_RBRACKET',
  KC_PIPE: 'KC_BSLASH',
  KC_COLN: 'KC_SCOLON', KC_COLON: 'KC_SCOLON',
  KC_DQUO: 'KC_QUOTE', KC_DQT: 'KC_QUOTE', KC_DOUBLE_QUOTE: 'KC_QUOTE',
  KC_LT: 'KC_COMMA', KC_LABK: 'KC_COMMA', KC_LEFT_ANGLE_BRACKET: 'KC_COMMA',
  KC_GT: 'KC_DOT', KC_RABK: 'KC_DOT', KC_RIGHT_ANGLE_BRACKET: 'KC_DOT',
  KC_QUES: 'KC_SLASH', KC_QUESTION: 'KC_SLASH',
}

// 修飾キー関数 → 修飾キー一覧 (Kanata 名)
export const QMK_MOD_FUNCS = {
  LCTL: ['lctl'], LSFT: ['lsft'], LALT: ['lalt'], LGUI: ['lmet'],
  LCMD: ['lmet'], LWIN: ['lmet'], LOPT: ['lalt'],
  RCTL: ['rctl'], RSFT: ['rsft'], RALT: ['ralt'], RGUI: ['rmet'],
  RCMD: ['rmet'], RWIN: ['rmet'], ROPT: ['ralt'], ALGR: ['ralt'],
  C_S: ['lctl', 'lsft'], LCS: ['lctl', 'lsft'],
  LCA: ['lctl', 'lalt'],
  LCG: ['lctl', 'lmet'],
  LSA: ['lsft', 'lalt'],
  LAG: ['lalt', 'lmet'],
  SGUI: ['lsft', 'lmet'], LSG: ['lsft', 'lmet'], SCMD: ['lsft', 'lmet'], SWIN: ['lsft', 'lmet'],
  LCAG: ['lctl', 'lalt', 'lmet'],
  RCG: ['rctl', 'rmet'],
  RCS: ['rctl', 'rsft'],
  RCA: ['rctl', 'ralt'],
  RSA: ['rsft', 'ralt'], SAGR: ['rsft', 'ralt'],
  RAG: ['ralt', 'rmet'],
  RSG: ['rsft', 'rmet'],
  RCAG: ['rctl', 'ralt', 'rmet'],
  MEH: ['lctl', 'lsft', 'lalt'],
  HYPR: ['lctl', 'lsft', 'lalt', 'lmet'],
  ALL: ['lctl', 'lsft', 'lalt', 'lmet'],
}

// OSM(MOD_xxx) の MOD 名 → 修飾キー
export const QMK_MOD_BITS = {
  MOD_LCTL: ['lctl'], MOD_LSFT: ['lsft'], MOD_LALT: ['lalt'], MOD_LGUI: ['lmet'],
  MOD_RCTL: ['rctl'], MOD_RSFT: ['rsft'], MOD_RALT: ['ralt'], MOD_RGUI: ['rmet'],
  MOD_MEH: ['lctl', 'lsft', 'lalt'], MOD_HYPR: ['lctl', 'lsft', 'lalt', 'lmet'],
}

// 修飾キー → Kanata の出力チョードプレフィックス
export const MOD_TO_PREFIX = {
  lctl: 'C-', lsft: 'S-', lalt: 'A-', lmet: 'M-',
  rctl: 'RC-', rsft: 'RS-', ralt: 'RA-', rmet: 'RM-',
}

export const PREFIX_TO_MOD = Object.fromEntries(
  Object.entries(MOD_TO_PREFIX).map(([mod, pfx]) => [pfx, mod]),
)

export const MODIFIER_KEYS = new Set(['lctl', 'lsft', 'lalt', 'lmet', 'rctl', 'rsft', 'ralt', 'rmet'])

// 5bit 修飾キーエンコーディング (QMK: bit0=Ctrl bit1=Shift bit2=Alt bit3=GUI bit4=右手側)
export function decodeMod5(bits) {
  const right = (bits & 0x10) !== 0
  const mods = []
  if (bits & 0x01) mods.push(right ? 'rctl' : 'lctl')
  if (bits & 0x02) mods.push(right ? 'rsft' : 'lsft')
  if (bits & 0x04) mods.push(right ? 'ralt' : 'lalt')
  if (bits & 0x08) mods.push(right ? 'rmet' : 'lmet')
  return mods
}

// 8bit 修飾キーマスク (key_override の trigger_mods 等: bit0-3 左, bit4-7 右)
export const MOD8_BITS = [
  [0x01, 'lctl'], [0x02, 'lsft'], [0x04, 'lalt'], [0x08, 'lmet'],
  [0x10, 'rctl'], [0x20, 'rsft'], [0x40, 'ralt'], [0x80, 'rmet'],
]

export function decodeMod8(bits) {
  return MOD8_BITS.filter(([bit]) => bits & bit).map(([, mod]) => mod)
}

// 数値キーコード (v6) の基本キー範囲 → QMK 名
// (.vil はキーコード文字列で保存されるが、未知の値は "0x...." 形式になる)
export const HID_TO_QMK = {
  0x04: 'KC_A', 0x05: 'KC_B', 0x06: 'KC_C', 0x07: 'KC_D', 0x08: 'KC_E', 0x09: 'KC_F',
  0x0A: 'KC_G', 0x0B: 'KC_H', 0x0C: 'KC_I', 0x0D: 'KC_J', 0x0E: 'KC_K', 0x0F: 'KC_L',
  0x10: 'KC_M', 0x11: 'KC_N', 0x12: 'KC_O', 0x13: 'KC_P', 0x14: 'KC_Q', 0x15: 'KC_R',
  0x16: 'KC_S', 0x17: 'KC_T', 0x18: 'KC_U', 0x19: 'KC_V', 0x1A: 'KC_W', 0x1B: 'KC_X',
  0x1C: 'KC_Y', 0x1D: 'KC_Z',
  0x1E: 'KC_1', 0x1F: 'KC_2', 0x20: 'KC_3', 0x21: 'KC_4', 0x22: 'KC_5',
  0x23: 'KC_6', 0x24: 'KC_7', 0x25: 'KC_8', 0x26: 'KC_9', 0x27: 'KC_0',
  0x28: 'KC_ENTER', 0x29: 'KC_ESCAPE', 0x2A: 'KC_BSPACE', 0x2B: 'KC_TAB', 0x2C: 'KC_SPACE',
  0x2D: 'KC_MINUS', 0x2E: 'KC_EQUAL', 0x2F: 'KC_LBRACKET', 0x30: 'KC_RBRACKET',
  0x31: 'KC_BSLASH', 0x32: 'KC_NONUS_HASH', 0x33: 'KC_SCOLON', 0x34: 'KC_QUOTE',
  0x35: 'KC_GRAVE', 0x36: 'KC_COMMA', 0x37: 'KC_DOT', 0x38: 'KC_SLASH', 0x39: 'KC_CAPSLOCK',
  0x3A: 'KC_F1', 0x3B: 'KC_F2', 0x3C: 'KC_F3', 0x3D: 'KC_F4', 0x3E: 'KC_F5', 0x3F: 'KC_F6',
  0x40: 'KC_F7', 0x41: 'KC_F8', 0x42: 'KC_F9', 0x43: 'KC_F10', 0x44: 'KC_F11', 0x45: 'KC_F12',
  0x46: 'KC_PSCREEN', 0x47: 'KC_SCROLLLOCK', 0x48: 'KC_PAUSE', 0x49: 'KC_INSERT',
  0x4A: 'KC_HOME', 0x4B: 'KC_PGUP', 0x4C: 'KC_DELETE', 0x4D: 'KC_END', 0x4E: 'KC_PGDOWN',
  0x4F: 'KC_RIGHT', 0x50: 'KC_LEFT', 0x51: 'KC_DOWN', 0x52: 'KC_UP',
  0x53: 'KC_NUMLOCK', 0x54: 'KC_KP_SLASH', 0x55: 'KC_KP_ASTERISK', 0x56: 'KC_KP_MINUS',
  0x57: 'KC_KP_PLUS', 0x58: 'KC_KP_ENTER', 0x59: 'KC_KP_1', 0x5A: 'KC_KP_2', 0x5B: 'KC_KP_3',
  0x5C: 'KC_KP_4', 0x5D: 'KC_KP_5', 0x5E: 'KC_KP_6', 0x5F: 'KC_KP_7', 0x60: 'KC_KP_8',
  0x61: 'KC_KP_9', 0x62: 'KC_KP_0', 0x63: 'KC_KP_DOT', 0x64: 'KC_NONUS_BSLASH',
  0x65: 'KC_APPLICATION', 0x67: 'KC_KP_EQUAL',
  0x68: 'KC_F13', 0x69: 'KC_F14', 0x6A: 'KC_F15', 0x6B: 'KC_F16', 0x6C: 'KC_F17', 0x6D: 'KC_F18',
  0x6E: 'KC_F19', 0x6F: 'KC_F20', 0x70: 'KC_F21', 0x71: 'KC_F22', 0x72: 'KC_F23', 0x73: 'KC_F24',
  0x85: 'KC_KP_COMMA', 0x87: 'KC_RO', 0x88: 'KC_KANA', 0x89: 'KC_JYEN', 0x8A: 'KC_HENK',
  0x8B: 'KC_MHEN', 0x90: 'KC_LANG1', 0x91: 'KC_LANG2',
  0xE0: 'KC_LCTRL', 0xE1: 'KC_LSHIFT', 0xE2: 'KC_LALT', 0xE3: 'KC_LGUI',
  0xE4: 'KC_RCTRL', 0xE5: 'KC_RSHIFT', 0xE6: 'KC_RALT', 0xE7: 'KC_RGUI',
}

// 特殊キーコード (QMK 機能キー) → special id
export const QMK_SPECIAL = {
  KC_GESC: 'GESC', QK_GESC: 'GESC', QK_GRAVE_ESCAPE: 'GESC',
  KC_LSPO: 'LSPO', SC_LSPO: 'LSPO',
  KC_RSPC: 'RSPC', SC_RSPC: 'RSPC',
  KC_LCPO: 'LCPO', SC_LCPO: 'LCPO',
  KC_RCPC: 'RCPC', SC_RCPC: 'RCPC',
  KC_LAPO: 'LAPO', SC_LAPO: 'LAPO',
  KC_RAPC: 'RAPC', SC_RAPC: 'RAPC',
  KC_SFTENT: 'SFTENT', SC_SENT: 'SFTENT',
  QK_CAPS_WORD_TOGGLE: 'CAPS_WORD', CW_TOGG: 'CAPS_WORD',
  QK_REPEAT_KEY: 'REPEAT', QK_REP: 'REPEAT',
  QK_ALT_REPEAT_KEY: 'ALT_REPEAT', QK_AREP: 'ALT_REPEAT',
  KC_MS_U: 'MS_U', KC_MS_UP: 'MS_U', MS_UP: 'MS_U',
  KC_MS_D: 'MS_D', KC_MS_DOWN: 'MS_D', MS_DOWN: 'MS_D',
  KC_MS_L: 'MS_L', KC_MS_LEFT: 'MS_L', MS_LEFT: 'MS_L',
  KC_MS_R: 'MS_R', KC_MS_RIGHT: 'MS_R', MS_RGHT: 'MS_R',
  KC_WH_U: 'WH_U', KC_MS_WH_UP: 'WH_U', MS_WHLU: 'WH_U',
  KC_WH_D: 'WH_D', KC_MS_WH_DOWN: 'WH_D', MS_WHLD: 'WH_D',
  KC_WH_L: 'WH_L', KC_MS_WH_LEFT: 'WH_L', MS_WHLL: 'WH_L',
  KC_WH_R: 'WH_R', KC_MS_WH_RIGHT: 'WH_R', MS_WHLR: 'WH_R',
  KC_ACL0: 'ACL0', KC_MS_ACCEL0: 'ACL0', MS_ACL0: 'ACL0',
  KC_ACL1: 'ACL1', KC_MS_ACCEL1: 'ACL1', MS_ACL1: 'ACL1',
  KC_ACL2: 'ACL2', KC_MS_ACCEL2: 'ACL2', MS_ACL2: 'ACL2',
  FN_MO13: 'FN_MO13', FN_MO23: 'FN_MO23',
  QK_LAYER_LOCK: 'LAYER_LOCK', QK_LLCK: 'LAYER_LOCK',
  QK_BOOT: 'BOOT', RESET: 'BOOT', QK_REBOOT: 'REBOOT', QK_CLEAR_EEPROM: 'CLEAR_EEPROM', EE_CLR: 'CLEAR_EEPROM',
  KC_ASDN: 'AS_DOWN', KC_ASUP: 'AS_UP', KC_ASRP: 'AS_REPORT',
  KC_ASON: 'AS_ON', KC_ASOFF: 'AS_OFF', KC_ASTG: 'AS_TOGGLE',
  CMB_ON: 'COMBO_ON', CMB_OFF: 'COMBO_OFF', CMB_TOG: 'COMBO_TOGGLE',
}

// マウスボタンの Kanata キー名 (defsrc に置けない等の判定用)
export const MOUSE_BUTTON_KEYS = new Set(['mlft', 'mrgt', 'mmid', 'mbck', 'mfwd'])

// ラベル: special id → 表示名
export const SPECIAL_LABELS = {
  GESC: 'Esc/`', LSPO: 'LS(', RSPC: 'RS)', LCPO: 'LC(', RCPC: 'RC)', LAPO: 'LA(', RAPC: 'RA)',
  SFTENT: 'RS/Ent', CAPS_WORD: 'CapsWd', REPEAT: 'Repeat', ALT_REPEAT: 'AltRep',
  MS_U: 'M↑', MS_D: 'M↓', MS_L: 'M←', MS_R: 'M→',
  WH_U: 'W↑', WH_D: 'W↓', WH_L: 'W←', WH_R: 'W→',
  ACL0: 'Acl0', ACL1: 'Acl1', ACL2: 'Acl2',
  FN_MO13: 'Fn1(3)', FN_MO23: 'Fn2(3)', LAYER_LOCK: 'LLock',
  BOOT: 'Boot', REBOOT: 'Reboot', CLEAR_EEPROM: 'EEClr',
  AS_DOWN: 'AS-', AS_UP: 'AS+', AS_REPORT: 'ASRpt', AS_ON: 'ASOn', AS_OFF: 'ASOff', AS_TOGGLE: 'ASTg',
  COMBO_ON: 'CmbOn', COMBO_OFF: 'CmbOff', COMBO_TOGGLE: 'CmbTg',
}

// GUI のキー選択で使える special id (Kanata で再現できるもの)
export const SUPPORTED_SPECIALS = [
  'GESC', 'LSPO', 'RSPC', 'LCPO', 'RCPC', 'LAPO', 'RAPC', 'SFTENT', 'CAPS_WORD', 'REPEAT', 'ALT_REPEAT',
  'MS_U', 'MS_D', 'MS_L', 'MS_R', 'WH_U', 'WH_D', 'WH_L', 'WH_R', 'ACL0', 'ACL1', 'ACL2',
  'FN_MO13', 'FN_MO23',
]

// Kanata キー名 → 代表 QMK キーコード (逆引き)
export const KANATA_TO_QMK = (() => {
  const map = {}
  for (const [qmk, kanata] of Object.entries(QMK_BASIC)) {
    if (!(kanata in map)) map[kanata] = qmk
  }
  return map
})()
