// vil2kanata GUI - バンドル済みスクリプト
// このファイルは build.js で自動生成されます。直接編集しないでください。
// ソースファイル: src/core/*.mjs, gui/js/*.js
;(function() {
"use strict";
const V2K = {};

// === src/core/keycodes.mjs ===
(function() {
// ============================================================
// QMK / Vial キーコード定義テーブル
//
// Vial (vial-gui keycodes.py, protocol v6) が .vil に書き出すキーコード名と、
// QMK 本家のエイリアス名の両方を Kanata のキー名へ対応付ける。
// ============================================================

// QMK 基本キーコード → Kanata キー名
// 一部は OS 依存の「疑似キー名」(lang1, lang2, mstp 等) で、出力時に OS ごとに解決する
// (see: resolveOutputKey in emit.mjs)
const QMK_BASIC = {
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
const QMK_UNSUPPORTED_BASIC = new Set([
  'KC_EXEC', 'KC_EXECUTE', 'KC_HELP', 'KC_SLCT', 'KC_SELECT', 'KC_STOP', 'KC_AGIN', 'KC_AGAIN',
  'KC_UNDO', 'KC_CUT', 'KC_COPY', 'KC_PSTE', 'KC_PASTE', 'KC_FIND', 'KC_MYCM', 'KC_MY_COMPUTER',
  'KC_WSCH', 'KC_WWW_SEARCH', 'KC_WSTP', 'KC_WWW_STOP', 'KC_WREF', 'KC_WWW_REFRESH',
  'KC_WFAV', 'KC_WWW_FAVORITES',
])

// QMK のシフト済みキーコード (KC_EXLM = LSFT(KC_1) 等)
const QMK_SHIFTED = {
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
const QMK_MOD_FUNCS = {
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
const QMK_MOD_BITS = {
  MOD_LCTL: ['lctl'], MOD_LSFT: ['lsft'], MOD_LALT: ['lalt'], MOD_LGUI: ['lmet'],
  MOD_RCTL: ['rctl'], MOD_RSFT: ['rsft'], MOD_RALT: ['ralt'], MOD_RGUI: ['rmet'],
  MOD_MEH: ['lctl', 'lsft', 'lalt'], MOD_HYPR: ['lctl', 'lsft', 'lalt', 'lmet'],
}

// 修飾キー → Kanata の出力チョードプレフィックス
const MOD_TO_PREFIX = {
  lctl: 'C-', lsft: 'S-', lalt: 'A-', lmet: 'M-',
  rctl: 'RC-', rsft: 'RS-', ralt: 'RA-', rmet: 'RM-',
}

const PREFIX_TO_MOD = Object.fromEntries(
  Object.entries(MOD_TO_PREFIX).map(([mod, pfx]) => [pfx, mod]),
)

const MODIFIER_KEYS = new Set(['lctl', 'lsft', 'lalt', 'lmet', 'rctl', 'rsft', 'ralt', 'rmet'])

// 5bit 修飾キーエンコーディング (QMK: bit0=Ctrl bit1=Shift bit2=Alt bit3=GUI bit4=右手側)
function decodeMod5(bits) {
  const right = (bits & 0x10) !== 0
  const mods = []
  if (bits & 0x01) mods.push(right ? 'rctl' : 'lctl')
  if (bits & 0x02) mods.push(right ? 'rsft' : 'lsft')
  if (bits & 0x04) mods.push(right ? 'ralt' : 'lalt')
  if (bits & 0x08) mods.push(right ? 'rmet' : 'lmet')
  return mods
}

// 8bit 修飾キーマスク (key_override の trigger_mods 等: bit0-3 左, bit4-7 右)
const MOD8_BITS = [
  [0x01, 'lctl'], [0x02, 'lsft'], [0x04, 'lalt'], [0x08, 'lmet'],
  [0x10, 'rctl'], [0x20, 'rsft'], [0x40, 'ralt'], [0x80, 'rmet'],
]

function decodeMod8(bits) {
  return MOD8_BITS.filter(([bit]) => bits & bit).map(([, mod]) => mod)
}

// 数値キーコード (v6) の基本キー範囲 → QMK 名
// (.vil はキーコード文字列で保存されるが、未知の値は "0x...." 形式になる)
const HID_TO_QMK = {
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
const QMK_SPECIAL = {
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
const MOUSE_BUTTON_KEYS = new Set(['mlft', 'mrgt', 'mmid', 'mbck', 'mfwd'])

// ラベル: special id → 表示名
const SPECIAL_LABELS = {
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
const SUPPORTED_SPECIALS = [
  'GESC', 'LSPO', 'RSPC', 'LCPO', 'RCPC', 'LAPO', 'RAPC', 'SFTENT', 'CAPS_WORD', 'REPEAT', 'ALT_REPEAT',
  'MS_U', 'MS_D', 'MS_L', 'MS_R', 'WH_U', 'WH_D', 'WH_L', 'WH_R', 'ACL0', 'ACL1', 'ACL2',
  'FN_MO13', 'FN_MO23',
]

// Kanata キー名 → 代表 QMK キーコード (逆引き)
const KANATA_TO_QMK = (() => {
  const map = {}
  for (const [qmk, kanata] of Object.entries(QMK_BASIC)) {
    if (!(kanata in map)) map[kanata] = qmk
  }
  return map
})()

  V2K.decodeMod5 = decodeMod5;
  V2K.decodeMod8 = decodeMod8;
  V2K.QMK_BASIC = QMK_BASIC;
  V2K.QMK_UNSUPPORTED_BASIC = QMK_UNSUPPORTED_BASIC;
  V2K.QMK_SHIFTED = QMK_SHIFTED;
  V2K.QMK_MOD_FUNCS = QMK_MOD_FUNCS;
  V2K.QMK_MOD_BITS = QMK_MOD_BITS;
  V2K.MOD_TO_PREFIX = MOD_TO_PREFIX;
  V2K.PREFIX_TO_MOD = PREFIX_TO_MOD;
  V2K.MODIFIER_KEYS = MODIFIER_KEYS;
  V2K.MOD8_BITS = MOD8_BITS;
  V2K.HID_TO_QMK = HID_TO_QMK;
  V2K.QMK_SPECIAL = QMK_SPECIAL;
  V2K.MOUSE_BUTTON_KEYS = MOUSE_BUTTON_KEYS;
  V2K.SPECIAL_LABELS = SPECIAL_LABELS;
  V2K.SUPPORTED_SPECIALS = SUPPORTED_SPECIALS;
  V2K.KANATA_TO_QMK = KANATA_TO_QMK;
})();

// === src/core/qmk.mjs ===
(function() {
  const QMK_BASIC = V2K.QMK_BASIC;
  const QMK_SHIFTED = V2K.QMK_SHIFTED;
  const QMK_MOD_FUNCS = V2K.QMK_MOD_FUNCS;
  const QMK_MOD_BITS = V2K.QMK_MOD_BITS;
  const QMK_SPECIAL = V2K.QMK_SPECIAL;
  const HID_TO_QMK = V2K.HID_TO_QMK;
  const MOD_TO_PREFIX = V2K.MOD_TO_PREFIX;
  const PREFIX_TO_MOD = V2K.PREFIX_TO_MOD;
  const decodeMod5 = V2K.decodeMod5;

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


const LAYER_OPS = ['MO', 'TG', 'TO', 'DF', 'PDF', 'OSL', 'TT']

// 修飾キーの並び順を正規化 (出力の安定化)
const MOD_ORDER = ['lctl', 'lsft', 'lalt', 'lmet', 'rctl', 'rsft', 'ralt', 'rmet']

function sortMods(mods) {
  return [...new Set(mods)].sort((a, b) => MOD_ORDER.indexOf(a) - MOD_ORDER.indexOf(b))
}

function modsToPrefix(mods) {
  return sortMods(mods).map((m) => MOD_TO_PREFIX[m] || '').join('')
}

// "C-S-a" → { mods: ['lctl','lsft'], baseKey: 'a' }
function splitChord(kanataKey) {
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

function makeBasic(kanataKey) {
  return { type: 'basic', kanataKey }
}

function makeModified(mods, baseKey) {
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
function parseNumericKeycode(code) {
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
function parseQmkKeycode(value) {
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
function keyConfigId(kc) {
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
function tapKeyName(kc) {
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
function normalizeKeyConfig(kc) {
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

  V2K.sortMods = sortMods;
  V2K.modsToPrefix = modsToPrefix;
  V2K.splitChord = splitChord;
  V2K.makeBasic = makeBasic;
  V2K.makeModified = makeModified;
  V2K.parseNumericKeycode = parseNumericKeycode;
  V2K.parseQmkKeycode = parseQmkKeycode;
  V2K.keyConfigId = keyConfigId;
  V2K.tapKeyName = tapKeyName;
  V2K.normalizeKeyConfig = normalizeKeyConfig;
})();

// === src/core/settings.mjs ===
(function() {
// ============================================================
// Vial "QMK Settings" (.vil の settings: { qsid: value }) のデコード
//
// qsid の定義は vial-gui の qmk_settings.json に準拠。
// 値が存在しない項目は QMK のデフォルト値を使う。
// ============================================================

const QMK_SETTINGS_DEFAULTS = {
  tappingTerm: 200,
  quickTapTerm: null,          // null = tappingTerm と同じ
  permissiveHold: false,
  holdOnOtherKeyPress: false,
  retroTapping: false,
  chordalHold: false,
  flowTapTerm: 0,
  tapCodeDelay: 0,
  tapHoldCapsDelay: 80,
  tappingToggle: 5,
  comboTerm: 50,
  oneShotTapToggle: 5,
  oneShotTimeout: 5000,
  autoShift: {
    enabled: false,
    modifiers: false,
    noSpecial: false,
    noNumeric: false,
    noAlpha: false,
    repeat: false,
    noAutoRepeat: false,
    timeout: 175,
  },
  graveEsc: { altOverride: false, ctrlOverride: false, guiOverride: false, shiftOverride: false },
  magic: {
    swapControlCapslock: false,
    capslockToControl: false,
    swapLaltLgui: false,
    swapRaltRgui: false,
    noGui: false,
    swapGraveEsc: false,
    swapBackslashBackspace: false,
    hostNkro: false,
    swapLctlLgui: false,
    swapRctlRgui: false,
  },
  mouse: {
    delay: 10,
    interval: 16,
    moveDelta: 8,
    maxSpeed: 10,
    timeToMax: 30,
    wheelDelay: 10,
    wheelInterval: 80,
    wheelMaxSpeed: 8,
    wheelTimeToMax: 40,
  },
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * .vil の settings オブジェクト → 構造化された QMK 設定
 * 戻り値: { values, present: Set<number> }
 */
function decodeQmkSettings(raw) {
  const s = clone(QMK_SETTINGS_DEFAULTS)
  const present = new Set()
  if (!raw || typeof raw !== 'object') return { values: s, present }

  const get = (qsid) => {
    const v = raw[String(qsid)] ?? raw[qsid]
    if (v === undefined || v === null) return undefined
    present.add(qsid)
    return Number(v)
  }
  const bit = (v, b) => ((v >> b) & 1) === 1
  let v

  if ((v = get(1)) !== undefined) {
    s.graveEsc = { altOverride: bit(v, 0), ctrlOverride: bit(v, 1), guiOverride: bit(v, 2), shiftOverride: bit(v, 3) }
  }
  if ((v = get(2)) !== undefined) s.comboTerm = v
  if ((v = get(3)) !== undefined) {
    s.autoShift = {
      ...s.autoShift,
      enabled: bit(v, 0),
      modifiers: bit(v, 1),
      noSpecial: bit(v, 2),
      noNumeric: bit(v, 3),
      noAlpha: bit(v, 4),
      repeat: bit(v, 5),
      noAutoRepeat: bit(v, 6),
    }
  }
  if ((v = get(4)) !== undefined) s.autoShift.timeout = v
  if ((v = get(5)) !== undefined) s.oneShotTapToggle = v
  if ((v = get(6)) !== undefined) s.oneShotTimeout = v
  if ((v = get(7)) !== undefined) s.tappingTerm = v

  // 旧形式 (qsid 8 のビットフィールド)
  if ((v = get(8)) !== undefined) {
    s.permissiveHold = bit(v, 0)
    if (bit(v, 2)) s.quickTapTerm = 0 // Tapping Force Hold
    s.retroTapping = bit(v, 3)
  }

  const mouseKeys = ['delay', 'interval', 'moveDelta', 'maxSpeed', 'timeToMax',
    'wheelDelay', 'wheelInterval', 'wheelMaxSpeed', 'wheelTimeToMax']
  mouseKeys.forEach((key, i) => {
    const mv = get(9 + i)
    if (mv !== undefined) s.mouse[key] = mv
  })

  if ((v = get(18)) !== undefined) s.tapCodeDelay = v
  if ((v = get(19)) !== undefined) s.tapHoldCapsDelay = v
  if ((v = get(20)) !== undefined) s.tappingToggle = v
  if ((v = get(21)) !== undefined) {
    s.magic = {
      swapControlCapslock: bit(v, 0),
      capslockToControl: bit(v, 1),
      swapLaltLgui: bit(v, 2),
      swapRaltRgui: bit(v, 3),
      noGui: bit(v, 4),
      swapGraveEsc: bit(v, 5),
      swapBackslashBackspace: bit(v, 6),
      hostNkro: bit(v, 7),
      swapLctlLgui: bit(v, 8),
      swapRctlRgui: bit(v, 9),
    }
  }
  if ((v = get(22)) !== undefined) s.permissiveHold = v !== 0
  if ((v = get(23)) !== undefined) s.holdOnOtherKeyPress = v !== 0
  if ((v = get(24)) !== undefined) s.retroTapping = v !== 0
  if ((v = get(25)) !== undefined) s.quickTapTerm = v
  if ((v = get(26)) !== undefined) s.chordalHold = v !== 0
  if ((v = get(27)) !== undefined) s.flowTapTerm = v

  return { values: s, present }
}

/**
 * 未知の値を補完して設定オブジェクトを完成させる (プロジェクト読込時)
 */
function completeQmkSettings(partial) {
  const base = clone(QMK_SETTINGS_DEFAULTS)
  if (!partial) return base
  const out = { ...base, ...partial }
  for (const key of ['autoShift', 'graveEsc', 'magic', 'mouse']) {
    out[key] = { ...base[key], ...(partial[key] || {}) }
  }
  return out
}

/**
 * QMK の tap-hold 判定モード → Kanata の tap-hold 系アクション名
 */
function tapHoldActionFor(qmk) {
  if (qmk.holdOnOtherKeyPress) return 'tap-hold-press'
  if (qmk.permissiveHold) return 'tap-hold-release'
  return 'tap-hold'
}

  V2K.decodeQmkSettings = decodeQmkSettings;
  V2K.completeQmkSettings = completeQmkSettings;
  V2K.tapHoldActionFor = tapHoldActionFor;
  V2K.QMK_SETTINGS_DEFAULTS = QMK_SETTINGS_DEFAULTS;
})();

// === src/core/kle.mjs ===
(function() {
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
function deserializeKle(rows) {
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
function keyCenter(key) {
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
function decodeLayoutOptions(labels, value) {
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
function parseVialJson(json, layoutOptions = -1) {
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

function normalizeOrigin(keys) {
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

function keyCorners(k) {
  const pts = [[k.x, k.y], [k.x + k.w, k.y], [k.x, k.y + k.h], [k.x + k.w, k.y + k.h]]
  if (!k.r) return pts
  const rad = (k.r * Math.PI) / 180
  return pts.map(([x, y]) => {
    const dx = x - k.rx
    const dy = y - k.ry
    return [k.rx + dx * Math.cos(rad) - dy * Math.sin(rad), k.ry + dx * Math.sin(rad) + dy * Math.cos(rad)]
  })
}

  V2K.deserializeKle = deserializeKle;
  V2K.keyCenter = keyCenter;
  V2K.decodeLayoutOptions = decodeLayoutOptions;
  V2K.parseVialJson = parseVialJson;
  V2K.normalizeOrigin = normalizeOrigin;
  V2K.keyCorners = keyCorners;
})();

// === src/core/firmware.mjs ===
(function() {
  const QMK_BASIC = V2K.QMK_BASIC;

// ============================================================
// QMK ファームウェアソース (keymap.c / config.h) のテキスト解析
//
// ファイル I/O は呼び出し側 (CLI: fs / GUI: FileReader) が担当し、
// ここでは文字列だけを扱う。
// ============================================================


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
function parseConfigH(text) {
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
function parseKeymapC(text, tappingTermFallback = 200) {
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
function buildFirmwareContext({ keymapC, configH, customKeycodes } = {}) {
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

  V2K.parseConfigH = parseConfigH;
  V2K.parseKeymapC = parseKeymapC;
  V2K.buildFirmwareContext = buildFirmwareContext;
})();

// === src/core/vial.mjs ===
(function() {
  const parseQmkKeycode = V2K.parseQmkKeycode;
  const decodeQmkSettings = V2K.decodeQmkSettings;
  const decodeMod8 = V2K.decodeMod8;
  const parseVialJson = V2K.parseVialJson;
  const buildFirmwareContext = V2K.buildFirmwareContext;

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






function parseVilText(text) {
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

function convertVilMacro(actions, id, warnings = []) {
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

function convertVilTapDance(entry, id) {
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

function convertVilCombo(entry, id) {
  if (!Array.isArray(entry)) return null
  const keys = entry.slice(0, 4).map(kcOrNull).filter(Boolean)
  const result = kcOrNull(entry[4])
  if (keys.length < 2 || !result) return null
  return { id, keys, result }
}

function convertVilKeyOverride(ko, id) {
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

function convertVilAltRepeat(entry, id) {
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
function importVil(vil, opts = {}) {
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

  V2K.parseVilText = parseVilText;
  V2K.convertVilMacro = convertVilMacro;
  V2K.convertVilTapDance = convertVilTapDance;
  V2K.convertVilCombo = convertVilCombo;
  V2K.convertVilKeyOverride = convertVilKeyOverride;
  V2K.convertVilAltRepeat = convertVilAltRepeat;
  V2K.importVil = importVil;
})();

// === src/core/mapping.mjs ===
(function() {
  const keyCenter = V2K.keyCenter;
  const tapKeyName = V2K.tapKeyName;

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



const ROW_TOLERANCE = 0.45
const SEGMENT_GAP = 0.6

function centersOf(keys) {
  return keys.map((k) => keyCenter({ r: 0, rx: 0, ry: 0, ...k }))
}

/**
 * キーを行ごとにまとめる。戻り値: [[index, ...], ...] (上から順、行内は左から順)
 */
function groupRows(keys) {
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
function buildSegments(sourceKeys) {
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
function computeMapping({ sourceKeys, sourceBase = [], targetKeys, starts = {}, pins = {} }) {
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
function invertMapping(map, targetCount) {
  const inv = new Array(targetCount).fill(null)
  map.forEach((t, s) => {
    if (t !== null && t !== undefined && t >= 0 && t < targetCount) inv[t] = s
  })
  return inv
}

  V2K.groupRows = groupRows;
  V2K.buildSegments = buildSegments;
  V2K.computeMapping = computeMapping;
  V2K.invertMapping = invertMapping;
})();

// === src/core/layouts.mjs ===
(function() {
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

const LAYOUT_PRESETS = {
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
        'henk|変換|1.25', 'kana|かな|1.25', 'menu|Menu', 'left|←',
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
        'henk|変換|1.25', 'kana|かな|1.25', 'ralt|Alt|1.25', 'menu|Menu|1.25', 'rctl|Ctrl|1.25']),
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

function getLayoutPresets() {
  return Object.entries(LAYOUT_PRESETS).map(([id, p]) => ({ id, name: p.name }))
}

/**
 * プリセット → フラットな物理キー配列
 */
function getPresetKeys(layoutId) {
  const preset = LAYOUT_PRESETS[layoutId]
  if (!preset) throw new Error(`未知のレイアウト: ${layoutId}`)
  return preset.rows.flat().map((k) => ({ ...k }))
}

  V2K.getLayoutPresets = getLayoutPresets;
  V2K.getPresetKeys = getPresetKeys;
  V2K.LAYOUT_PRESETS = LAYOUT_PRESETS;
})();

// === src/core/text.mjs ===
(function() {
// ============================================================
// マクロの text アクション: 文字 → Kanata キーストローク
//
// us  : QMK send_string と同じ (US 配列のキーコード) = Vial 本来の動作
// jis : OS 側が JIS 配列のとき、その文字が入力されるようなキーを選ぶ
// キー名は US 配列上の物理位置名 (Kanata の命名規則) で表す
// ============================================================

const LETTERS = {}
for (const c of 'abcdefghijklmnopqrstuvwxyz') {
  LETTERS[c] = c
  LETTERS[c.toUpperCase()] = `S-${c}`
}
const DIGITS = {}
for (const d of '0123456789') DIGITS[d] = d

const COMMON = { ...LETTERS, ...DIGITS, ' ': 'spc', '\n': 'ret', '\t': 'tab', ',': ',', '.': '.', '/': '/', '<': 'S-,', '>': 'S-.', '?': 'S-/', ';': ';', '-': '-' }

const TEXT_TO_KEYS = {
  us: {
    ...COMMON,
    '!': 'S-1', '@': 'S-2', '#': 'S-3', '$': 'S-4', '%': 'S-5', '^': 'S-6', '&': 'S-7',
    '*': 'S-8', '(': 'S-9', ')': 'S-0', '_': 'S--', '=': '=', '+': 'S-=',
    '[': '[', '{': 'S-[', ']': ']', '}': 'S-]', '\\': '\\', '|': 'S-\\',
    ':': 'S-;', "'": "'", '"': "S-'", '`': 'grv', '~': 'S-grv',
  },
  jis: {
    ...COMMON,
    '!': 'S-1', '"': 'S-2', '#': 'S-3', '$': 'S-4', '%': 'S-5', '&': 'S-6', "'": 'S-7',
    '(': 'S-8', ')': 'S-9', '=': 'S--', '^': '=', '~': 'S-=', '|': 'S-¥', '¥': '¥',
    '@': '[', '`': 'S-[', '[': ']', '{': 'S-]', '+': 'S-;', ':': "'", '*': "S-'",
    ']': '\\', '}': 'S-\\', '\\': 'ro', '_': 'S-ro',
  },
}

/**
 * 文字列 → キー表現の配列 (変換できない文字は { unicode: c })
 */
function textToKeys(text, layout = 'jis') {
  const table = TEXT_TO_KEYS[layout] || TEXT_TO_KEYS.jis
  const out = []
  for (const ch of text) {
    out.push(table[ch] !== undefined ? table[ch] : { unicode: ch })
  }
  return out
}

  V2K.textToKeys = textToKeys;
  V2K.TEXT_TO_KEYS = TEXT_TO_KEYS;
})();

// === src/core/windows.mjs ===
(function() {
// ============================================================
// Windows 固有の回避策
//
// JIS 配列の Windows では、英数 (Caps Lock) キーは日本語キーボードドライバーが
// VK_DBE_ALPHANUMERIC (240) として「押した」イベントだけを送り、「離した」イベントを送らない。
// Kanata からは押しっぱなしに見えるため、tap-hold はホールド扱いになり修飾キーが押されたままになる。
// レジストリの Scancode Map でキー自体を F13 等に置き換えると、通常どおり押す/離すが届く。
// ============================================================

// セット1 スキャンコード
const SCANCODES = { caps: 0x3A, f13: 0x64, f14: 0x65, f15: 0x66, f16: 0x67 }

function hexBytes(n, len) {
  const out = []
  for (let i = 0; i < len; i++) out.push(((n >> (8 * i)) & 0xFF).toString(16).padStart(2, '0'))
  return out
}

/**
 * Scancode Map (.reg) を生成
 * @param {Array<[number, number]>} remaps [[元のスキャンコード, 置き換え後], ...]
 */
function scancodeMapReg(remaps) {
  const bytes = [
    ...hexBytes(0, 4), // version
    ...hexBytes(0, 4), // flags
    ...hexBytes(remaps.length + 1, 4),
  ]
  for (const [from, to] of remaps) bytes.push(...hexBytes(to, 2), ...hexBytes(from, 2))
  bytes.push(...hexBytes(0, 4))
  return [
    'Windows Registry Editor Version 5.00',
    '',
    '; vil2kanata: JIS 英数キーを F13 に置き換え (サインアウト/再起動後に有効)',
    '; 元に戻すには vil2kanata-restore-keyboard.reg を実行してください',
    '[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]',
    `"Scancode Map"=hex:${bytes.join(',')}`,
    '',
  ].join('\r\n')
}

function scancodeMapRestoreReg() {
  return [
    'Windows Registry Editor Version 5.00',
    '',
    '; vil2kanata: Scancode Map を削除してキー配置を元に戻す (サインアウト/再起動後に有効)',
    '[HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Keyboard Layout]',
    '"Scancode Map"=-',
    '',
  ].join('\r\n')
}

const EISU_TO_F13_REG = scancodeMapReg([[SCANCODES.caps, SCANCODES.f13]])

/**
 * regedit が確実に読める UTF-16LE (BOM 付き) に変換
 */
function toUtf16le(text) {
  const bytes = new Uint8Array(2 + text.length * 2)
  bytes[0] = 0xFF
  bytes[1] = 0xFE
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i)
    bytes[2 + i * 2] = c & 0xFF
    bytes[3 + i * 2] = c >> 8
  }
  return bytes
}

/**
 * Windows で「離した」イベントが届かない JIS 英数キーか
 * (旧バージョンで保存したプロジェクトはフラグが無いのでラベルでも判定)
 */
function isWinNoReleaseKey(tk) {
  if (!tk || tk.kanataKey !== 'caps') return false
  return !!tk.winNoRelease || tk.label === '英数'
}

  V2K.scancodeMapReg = scancodeMapReg;
  V2K.scancodeMapRestoreReg = scancodeMapRestoreReg;
  V2K.toUtf16le = toUtf16le;
  V2K.isWinNoReleaseKey = isWinNoReleaseKey;
  V2K.SCANCODES = SCANCODES;
  V2K.EISU_TO_F13_REG = EISU_TO_F13_REG;
})();

// === src/core/emit.mjs ===
(function() {
  const MODIFIER_KEYS = V2K.MODIFIER_KEYS;
  const keyConfigId = V2K.keyConfigId;
  const modsToPrefix = V2K.modsToPrefix;
  const sortMods = V2K.sortMods;
  const splitChord = V2K.splitChord;
  const completeQmkSettings = V2K.completeQmkSettings;
  const tapHoldActionFor = V2K.tapHoldActionFor;
  const textToKeys = V2K.textToKeys;
  const isWinNoReleaseKey = V2K.isWinNoReleaseKey;

// ============================================================
// プロジェクト → Kanata 設定 (.kbd) 出力器
//
// CLI / GUI の両方がこの 1 つの出力器を使う。
// 入力 (project):
// {
//   targetKeys: [{ kanataKey, label, ... }],   ノートPCの物理キー
//   defsrc:     [targetIndex, ...],            defsrc に含めるキー (並び順)
//   layers:     [{ name, keys: [keyConfig] }], keys は targetIndex 対応
//   macros, tapDances, combos, keyOverrides, altRepeatKeys, userKeys,
//   qmk:        QMK 設定 (settings.mjs),
//   kanata:     { os, textLayout, processUnmappedKeys, concurrentTapHold, rapidEventDelay },
//   hands:      { targetIndex: 'L' | 'R' }     Chordal Hold 用 (任意)
//   sourceName
// }
// 戻り値: { text, warnings }
// ============================================================






const KANATA_DEFAULTS = {
  os: 'windows',
  textLayout: 'jis',
  processUnmappedKeys: true,
  concurrentTapHold: true,
  rapidEventDelay: 5,
}

// OS ごとに扱いの異なるキー (Kanata に共通のキー名がない / 挙動が違う)
// win: Windows 仮想キーコード, linux: evdev キーコード, mac: Kanata の macOS 用キー名
const OS_SPECIFIC_KEYS = {
  lang1: { win: 242, linux: 122, mac: 'kana', note: 'IME ON (VK_DBE_HIRAGANA)' },
  lang2: { win: 26, linux: 123, mac: 'eisu', note: 'IME OFF (VK_IME_OFF)' },
  eisu: { win: 26, linux: 123, mac: 'eisu', note: 'IME OFF (VK_IME_OFF)' },
  ro: { winName: 'ro', linux: 89, mac: 'ro', note: 'JIS ろ' },
  mstp: { win: 178, linux: 166, mac: null, note: 'Media Stop' },
}

// defsrc の重複解消用の代替キー
const DEFSRC_SUBSTITUTES = [
  'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24',
  'nop0', 'nop1', 'nop2', 'nop3', 'nop4', 'nop5', 'nop6', 'nop7', 'nop8', 'nop9',
]

// Magic 設定によるキー入れ替え
function buildMagicMap(magic) {
  const map = {}
  const swap = (a, b) => {
    map[a] = b
    map[b] = a
  }
  if (!magic) return map
  if (magic.swapControlCapslock) swap('caps', 'lctl')
  else if (magic.capslockToControl) map.caps = 'lctl'
  if (magic.swapLaltLgui) swap('lalt', 'lmet')
  if (magic.swapRaltRgui) swap('ralt', 'rmet')
  if (magic.swapLctlLgui) swap('lctl', 'lmet')
  if (magic.swapRctlRgui) swap('rctl', 'rmet')
  if (magic.swapGraveEsc) swap('grv', 'esc')
  if (magic.swapBackslashBackspace) swap('\\', 'bspc')
  if (magic.noGui) {
    map.lmet = 'XX'
    map.rmet = 'XX'
  }
  return map
}

const ALT_REPEAT_DEFAULT_PAIRS = [
  ['left', 'rght'], ['up', 'down'], ['home', 'end'], ['pgup', 'pgdn'],
  ['mwu', 'mwd'], ['mwl', 'mwr'], ['bck', 'fwd'], ['volu', 'vold'], ['bru', 'brdn'],
  ['next', 'prev'],
]

function sanitizeLayerName(name, i, used) {
  let n = String(name || '').replace(/[^a-zA-Z0-9_-]/g, '')
  if (!n || /^\d/.test(n)) n = i === 0 ? 'base' : `layer${i}`
  let unique = n
  let k = 2
  while (used.has(unique)) unique = `${n}${k++}`
  used.add(unique)
  return unique
}

function pad(tokens) {
  if (tokens.length === 0) return []
  const width = Math.max(4, ...tokens.map((t) => [...t].length))
  return tokens.map((t) => t + ' '.repeat(Math.max(0, width - [...t].length)))
}

// 行ごとに折り返し (defsrc / deflayer の見た目を物理行に近づける)
function layoutLines(tokens, rowBreaks) {
  const padded = pad(tokens)
  const lines = []
  let current = []
  padded.forEach((t, i) => {
    if (i > 0 && rowBreaks.has(i)) {
      lines.push(current.join(' '))
      current = []
    }
    current.push(t)
  })
  if (current.length) lines.push(current.join(' '))
  return lines.map((l) => `  ${l.trimEnd()}`)
}

function emitKanata(projectIn) {
  const project = {
    macros: [], tapDances: [], combos: [], keyOverrides: [], altRepeatKeys: [], userKeys: {},
    ...projectIn,
  }
  const qmk = completeQmkSettings(project.qmk)
  const kcfg = { ...KANATA_DEFAULTS, ...(project.kanata || {}) }
  const os = kcfg.os || 'windows'
  const warnings = []
  const warnOnce = new Set()
  const warn = (msg) => {
    if (!warnOnce.has(msg)) {
      warnOnce.add(msg)
      warnings.push(msg)
    }
  }

  const targetKeys = project.targetKeys || []
  const defsrcIdx = project.defsrc && project.defsrc.length
    ? project.defsrc
    : targetKeys.map((_, i) => i).filter((i) => !targetKeys[i].fixed)
  const layers = project.layers || []
  const usedNames = new Set()
  const layerNames = layers.map((l, i) => sanitizeLayerName(l.name, i, usedNames))
  const baseName = layerNames[0] || 'base'
  const magicMap = buildMagicMap(qmk.magic)

  const localKeys = new Map() // name → { win, linux }
  const aliases = new Map() // name → { value, comment }
  const aliasByValue = new Map()

  // ------------------------------------------------------------
  // キー名解決
  // ------------------------------------------------------------

  // 名前として使える形 (defsrc / チョード / キーリスト内)
  function nameKey(name) {
    const spec = OS_SPECIFIC_KEYS[name]
    if (!spec) return name
    if (os === 'macos') {
      if (spec.mac) return spec.mac
      warn(`${name} (${spec.note}) は macOS では出力できないため XX にしました`)
      return 'XX'
    }
    if (os === 'windows' && spec.winName) {
      // Windows では標準名。Linux 版 kanata でも検証できるよう linux 側の定義も出力する
      localKeys.set(name, { ...spec, win: undefined })
      return spec.winName
    }
    const code = os === 'linux' ? spec.linux : spec.win
    if (code === undefined || code === null) {
      warn(`${name} (${spec.note}) は ${os} では出力できないため XX にしました`)
      return 'XX'
    }
    localKeys.set(name, spec)
    return name
  }

  // アクションとして使える形 (Windows の IME キーは arbitrary-code で直接送る)
  function actionKey(name) {
    const spec = OS_SPECIFIC_KEYS[name]
    if (spec && os === 'windows' && spec.win !== undefined && !spec.winName) {
      return `(arbitrary-code ${spec.win})`
    }
    return nameKey(name)
  }

  // タップダンス内のキーは QMK が直接 register するため Magic の対象外
  let magicSuppressed = false
  function magic(name) {
    return magicSuppressed ? name : (magicMap[name] ?? name)
  }

  // 出力キー (チョード可) → アクション文字列
  // Magic (キー入れ替え) は QMK と同様にキーマップ上のキーコードだけに適用し、
  // 修飾ビットやマクロ内のキーには適用しない
  function chordAction(mods, key, { inMacro = false } = {}) {
    let base = inMacro ? key : magic(key)
    if (base === 'XX') return 'XX'
    if (inMacro && /^[0-9]$/.test(base)) base = `Digit${base}`
    const sorted = sortMods(mods)
    if (sorted.length === 0) return inMacro ? macroSafe(actionKey(base)) : actionKey(base)
    return modsToPrefix(sorted) + nameKey(base)
  }

  function macroSafe(token) {
    return /^[0-9]$/.test(token) ? `Digit${token}` : token
  }

  function registerAlias(prefix, value, comment = null) {
    const dedupeKey = `${prefix}\u0000${value}`
    if (aliasByValue.has(dedupeKey)) return `@${aliasByValue.get(dedupeKey)}`
    let name = prefix
    let n = 2
    while (aliases.has(name)) name = `${prefix}-${n++}`
    aliases.set(name, { value, comment })
    aliasByValue.set(dedupeKey, name)
    return `@${name}`
  }

  // ------------------------------------------------------------
  // tap-hold 構築
  // ------------------------------------------------------------

  const defsrcNameOf = new Map() // targetIndex → defsrc 名 (後で設定)

  function sameHandKeys(pos) {
    if (!project.hands || pos === undefined || pos === null) return null
    const hand = project.hands[pos]
    if (!hand) return null
    const names = []
    for (const [idx, name] of defsrcNameOf) {
      if (idx !== pos && project.hands[idx] === hand) names.push(name)
    }
    return names.length ? names : null
  }

  function tapHold(tap, hold, kc, pos, { hints = '' } = {}) {
    let variant = kc?.tapHoldVariant || null
    let extra = kc?.tapHoldExtraKeys ? kc.tapHoldExtraKeys.trim().split(/\s+/).filter(Boolean).map(nameKey) : null
    if (!variant) {
      variant = tapHoldActionFor(qmk)
      if (qmk.chordalHold) {
        const same = sameHandKeys(pos)
        if (same) {
          variant = 'tap-hold-release-keys'
          extra = same
        } else {
          warn('Chordal Hold: 左右の手の判定ができないキーは通常の tap-hold で出力しました')
        }
      }
    }
    if (qmk.retroTapping) warn('Retro Tapping は Kanata に同等機能がないため再現していません')
    if (qmk.flowTapTerm > 0) warn(`Flow Tap (${qmk.flowTapTerm}ms) は Kanata v1.10 に同等機能がないため再現していません`)
    const needsList = variant === 'tap-hold-release-keys' || variant === 'tap-hold-except-keys' || variant === 'tap-hold-tap-keys'
    const needsTimeout = variant.endsWith('-timeout')
    let tail = ''
    if (needsList) tail = ` (${(extra || []).join(' ')})`
    else if (needsTimeout) tail = ` ${hold}`
    return `(${variant} $tap-time $hold-time ${tap} ${hold}${tail})${hints}`
  }

  function holdMods(mods) {
    const m = sortMods(mods)
    if (m.length === 0) return 'XX'
    if (m.length === 1) return m[0]
    return `(multi ${m.join(' ')})`
  }

  function oneShotTimeout() {
    return qmk.oneShotTimeout > 0 ? Math.min(qmk.oneShotTimeout, 65535) : 65535
  }

  // ------------------------------------------------------------
  // アクション生成
  // ------------------------------------------------------------

  // ctx: { layer, pos }  (layer: 出力中のレイヤー index)
  function emitAction(kc, ctx = {}) {
    if (!kc) return '_'
    switch (kc.type) {
      case 'transparent':
        return '_'
      case 'disabled':
        return 'XX'
      case 'basic':
        return basicAction(kc.kanataKey, ctx)
      case 'modified': {
        const chord = kc.mods && kc.baseKey ? kc : { ...kc, ...splitChord(kc.kanataKey) }
        return chordAction(chord.mods || [], chord.baseKey)
      }
      case 'mod-tap': {
        const mods = kc.holdMods || (kc.holdMod ? [kc.holdMod] : [])
        const tap = actionKey(magic(kc.tapKey))
        return registerAlias(`${kc.tapKey}-${mods.join('')}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
          tapHold(tap, holdMods(mods), kc, ctx.pos))
      }
      case 'layer-tap': {
        const layerName = layerRef(kc.layer)
        if (!layerName) return actionKey(magic(kc.tapKey))
        const tap = actionKey(magic(kc.tapKey))
        return registerAlias(`lt${kc.layer}-${kc.tapKey}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
          tapHold(tap, `(layer-while-held ${layerName})`, kc, ctx.pos))
      }
      case 'layer-op':
        return layerOp(kc, ctx)
      case 'layer-mod': {
        const layerName = layerRef(kc.layer)
        if (!layerName) return holdMods(kc.mods)
        const mods = sortMods(kc.mods)
        return registerAlias(`lm${kc.layer}`, `(multi (layer-while-held ${layerName}) ${mods.join(' ')})`)
      }
      case 'one-shot-mod': {
        const mods = sortMods(kc.mods)
        if (mods.length === 0) return 'XX'
        const last = mods[mods.length - 1]
        const chord = modsToPrefix(mods.slice(0, -1)) + last
        return registerAlias(`os-${mods.join('')}`, `(one-shot-press ${oneShotTimeout()} ${chord})`)
      }
      case 'macro':
        if (!macroNames.has(kc.index)) {
          warn(`M${kc.index} は定義されていないため XX にしました`)
          return 'XX'
        }
        return `@${macroNames.get(kc.index)}`
      case 'tap-dance':
        if (!tdNames.has(kc.index)) {
          warn(`TD(${kc.index}) は定義されていないため XX にしました`)
          return 'XX'
        }
        return `@${tdNames.get(kc.index)}`
      case 'user':
        return userAction(kc.index)
      case 'special':
        return specialAction(kc.id, ctx)
      case 'raw':
        return kc.kanata || 'XX'
      case 'unknown':
        warn(`未対応キーコード ${kc.qmk} は XX にしました`)
        return 'XX'
      default:
        return 'XX'
    }
  }

  function basicAction(name, ctx) {
    const key = magic(name)
    if (key === 'XX') return 'XX'
    if (ctx.allowAutoShift !== false && qmk.autoShift.enabled && autoShiftEligible(key)) {
      const shifted = modsToPrefix(['lsft']) + nameKey(key)
      return registerAlias(`as-${key}`.replace(/[^a-zA-Z0-9_-]/g, (c) => `_${c.charCodeAt(0)}`),
        `(tap-hold $tap-time ${qmk.autoShift.timeout} ${actionKey(key)} ${shifted})`,
        ';; Auto Shift')
    }
    return actionKey(key)
  }

  function autoShiftEligible(key) {
    const as = qmk.autoShift
    if (/^[a-z]$/.test(key)) return !as.noAlpha
    if (/^[0-9]$/.test(key)) return !as.noNumeric
    if (['-', '=', '[', ']', '\\', ';', "'", 'grv', ',', '.', '/'].includes(key)) return !as.noSpecial
    return false
  }

  function layerRef(index) {
    if (index === undefined || index === null || index < 0 || index >= layerNames.length) {
      warn(`存在しないレイヤー ${index} を参照しているキーがあります`)
      return null
    }
    return layerNames[index]
  }

  function toggleAction(target, ctx, kind) {
    const name = layerRef(target)
    if (!name) return 'XX'
    // 既にそのレイヤー上にいる → ベースへ戻す
    if (ctx.layer === target && target !== 0) {
      return registerAlias(`${kind}${target}-off`, `(layer-switch ${baseName})`)
    }
    return registerAlias(`${kind}${target}`, `(layer-switch ${name})`)
  }

  function layerOp(kc, ctx) {
    const name = layerRef(kc.layer)
    if (!name) return 'XX'
    switch (kc.op) {
      case 'MO':
        return registerAlias(`mo${kc.layer}`, `(layer-while-held ${name})`)
      case 'TG':
        return toggleAction(kc.layer, ctx, 'tg')
      case 'TO':
        return registerAlias(`to${kc.layer}`, `(layer-switch ${name})`)
      case 'DF':
      case 'PDF':
        warn(`${kc.op}(n) はデフォルトレイヤー変更として layer-switch で近似しました`)
        return registerAlias(`df${kc.layer}`, `(layer-switch ${name})`)
      case 'OSL':
        return registerAlias(`osl${kc.layer}`, `(one-shot-press ${oneShotTimeout()} (layer-while-held ${name}))`)
      case 'TT': {
        const off = ctx.layer === kc.layer && kc.layer !== 0
        const sw = off ? `(layer-switch ${baseName})` : `(layer-switch ${name})`
        const n = Math.max(1, qmk.tappingToggle || 1)
        const tapAct = n <= 1 ? sw : `(tap-dance $hold-time (${[...Array(n - 1).fill('XX'), sw].join(' ')}))`
        return registerAlias(`tt${kc.layer}${off ? '-off' : ''}`,
          `(tap-hold $tap-time $hold-time ${tapAct} (layer-while-held ${name}))`)
      }
      default:
        return 'XX'
    }
  }

  function userAction(index) {
    const info = project.userKeys?.[index]
    const nn = String(index).padStart(2, '0')
    if (info?.kanata) {
      const value = info.kanata.replace(/[^\s()]+/g, (tok) => (OS_SPECIFIC_KEYS[tok] ? nameKey(tok) : tok))
      return registerAlias(`usr${nn}`, value, `;; USER${nn} ${info.name || ''}: ${info.comment || ''}`.trimEnd())
    }
    warn(`USER${nn}${info?.name ? ` (${info.name})` : ''} はファームウェア固有のため XX にしました (keymap.c を読み込むと自動推定します)`)
    return 'XX'
  }

  function specialAction(id, ctx) {
    const m = qmk.mouse
    switch (id) {
      case 'GESC': {
        const g = qmk.graveEsc
        const conds = []
        if (g.altOverride) conds.push(['(or lalt ralt)', 'esc'])
        if (g.ctrlOverride) conds.push(['(or lctl rctl)', 'esc'])
        const grvTriggers = []
        if (!g.shiftOverride) grvTriggers.push('lsft', 'rsft')
        if (!g.guiOverride) grvTriggers.push('lmet', 'rmet')
        if (grvTriggers.length) conds.push([`(or ${grvTriggers.join(' ')})`, 'grv'])
        const body = conds.map(([c, a]) => `(${c}) ${a} break`).join(' ')
        return registerAlias('gesc', `(switch ${body} () esc break)`, ';; Grave Escape')
      }
      case 'LSPO': return registerAlias('lspo', `(tap-hold-press $tap-time $hold-time S-9 lsft)`)
      case 'RSPC': return registerAlias('rspc', `(tap-hold-press $tap-time $hold-time S-0 rsft)`)
      case 'LCPO': return registerAlias('lcpo', `(tap-hold-press $tap-time $hold-time S-9 lctl)`)
      case 'RCPC': return registerAlias('rcpc', `(tap-hold-press $tap-time $hold-time S-0 rctl)`)
      case 'LAPO': return registerAlias('lapo', `(tap-hold-press $tap-time $hold-time S-9 lalt)`)
      case 'RAPC': return registerAlias('rapc', `(tap-hold-press $tap-time $hold-time S-0 ralt)`)
      case 'SFTENT': return registerAlias('sftent', `(tap-hold-press $tap-time $hold-time ret rsft)`)
      case 'CAPS_WORD': return registerAlias('capsword', '(caps-word-toggle 5000)')
      case 'REPEAT': return 'rpt-any'
      case 'ALT_REPEAT': return registerAlias('altrep', altRepeatSwitch(), ';; Alt Repeat Key')
      case 'MS_U': case 'MS_D': case 'MS_L': case 'MS_R': {
        const dir = { MS_U: 'up', MS_D: 'down', MS_L: 'left', MS_R: 'right' }[id]
        const accel = Math.max(1, m.timeToMax * m.interval)
        return registerAlias(`ms-${dir}`,
          `(movemouse-accel-${dir} ${Math.max(1, m.interval)} ${accel} ${Math.max(1, m.moveDelta)} ${Math.max(1, m.moveDelta * m.maxSpeed)})`)
      }
      case 'WH_U': case 'WH_D': case 'WH_L': case 'WH_R': {
        const dir = { WH_U: 'up', WH_D: 'down', WH_L: 'left', WH_R: 'right' }[id]
        return registerAlias(`wh-${dir}`, `(mwheel-${dir} ${Math.max(1, m.wheelInterval)} 120)`)
      }
      case 'ACL0': return registerAlias('acl0', '(movemouse-speed 25)')
      case 'ACL1': return registerAlias('acl1', '(movemouse-speed 50)')
      case 'ACL2': return registerAlias('acl2', '(movemouse-speed 200)')
      case 'FN_MO13':
        warn('FN_MO13/FN_MO23 のトライレイヤー動作は再現できないため MO(1)/MO(2) として出力しました')
        return layerOp({ op: 'MO', layer: 1 }, ctx)
      case 'FN_MO23':
        warn('FN_MO13/FN_MO23 のトライレイヤー動作は再現できないため MO(1)/MO(2) として出力しました')
        return layerOp({ op: 'MO', layer: 2 }, ctx)
      default:
        warn(`${id} はキーボード本体の機能のため XX にしました`)
        return 'XX'
    }
  }

  function simpleKeyOf(kc) {
    if (!kc) return null
    if (kc.type === 'basic') return magic(kc.kanataKey)
    if (kc.type === 'modified') return magic(kc.baseKey || splitChord(kc.kanataKey).baseKey)
    return null
  }

  function altRepeatSwitch() {
    const pairs = []
    const seen = new Set()
    const add = (from, to) => {
      if (!from || !to || seen.has(from)) return
      seen.add(from)
      pairs.push([from, to])
    }
    for (const ar of project.altRepeatKeys || []) {
      if (ar.enabled === false) continue
      const from = simpleKeyOf(ar.keycode)
      const to = ar.altKeycode ? emitAction(ar.altKeycode, { allowAutoShift: false }) : null
      add(from, to)
      if (ar.bidirectional) add(simpleKeyOf(ar.altKeycode), emitAction(ar.keycode, { allowAutoShift: false }))
    }
    for (const [a, b] of ALT_REPEAT_DEFAULT_PAIRS) {
      add(a, b)
      add(b, a)
    }
    if ((project.altRepeatKeys || []).some((ar) => ar.allowedMods?.length)) {
      warn('Alt Repeat Key の修飾キー条件 (allowed_mods) は再現していません')
    }
    const body = pairs.map(([from, to]) => `((key-history ${nameKey(from)} 1)) ${to} break`).join(' ')
    return `(switch ${body} () rpt-any break)`
  }

  // ------------------------------------------------------------
  // defsrc
  // ------------------------------------------------------------
  const defsrcNames = []
  const usedDefsrc = new Set()
  for (const idx of defsrcIdx) {
    const raw = targetKeys[idx]?.kanataKey
    const name = raw ? nameKey(raw) : null
    if (name && name !== 'XX' && !usedDefsrc.has(name)) {
      usedDefsrc.add(name)
      defsrcNames.push(name)
    } else {
      defsrcNames.push(null)
    }
  }
  const substituteNotes = []
  defsrcNames.forEach((name, i) => {
    if (name) return
    const sub = DEFSRC_SUBSTITUTES.find((s) => !usedDefsrc.has(s))
    if (!sub) throw new Error('defsrc の代替キーが不足しました')
    usedDefsrc.add(sub)
    defsrcNames[i] = sub
    const orig = targetKeys[defsrcIdx[i]]?.kanataKey || '(なし)'
    substituteNotes.push(`${orig} → ${sub}`)
  })
  defsrcIdx.forEach((idx, i) => defsrcNameOf.set(idx, defsrcNames[i]))
  if (substituteNotes.length) {
    warn(`defsrc の重複・無効キーを代替キーに置き換えました: ${substituteNotes.join(', ')}`)
  }

  // ------------------------------------------------------------
  // マクロ / タップダンス (名前を先に確定: 相互参照のため)
  // ------------------------------------------------------------
  const macroNames = new Map()
  for (const m of project.macros) if (m && m.id !== undefined) macroNames.set(m.id, `m${m.id}`)
  const tdNames = new Map()
  for (const td of project.tapDances) if (td && td.id !== undefined) tdNames.set(td.id, `td${td.id}`)

  function emitMacro(macro) {
    const parts = []
    const held = []
    const warnCtx = `M${macro.id}`
    const withHeld = (key) => {
      if (typeof key === 'object' && key.unicode) {
        return held.length ? null : `(unicode ${key.unicode})`
      }
      const { mods, baseKey } = splitChord(key)
      if (!baseKey) return null
      return chordAction([...held, ...mods], baseKey, { inMacro: true })
    }
    for (const act of macro.actions || []) {
      if (act.type === 'tap' || act.type === 'down' || act.type === 'up') {
        const keys = act.keys || (act.key ? [act.key] : [])
        for (const key of keys) {
          if (!key) continue
          if (act.type === 'tap') {
            const out = withHeld(key)
            if (out) parts.push(out)
          } else if (MODIFIER_KEYS.has(key)) {
            if (act.type === 'down') {
              if (!held.includes(key)) held.push(key)
            } else {
              const i = held.indexOf(key)
              if (i >= 0) held.splice(i, 1)
            }
          } else if (act.type === 'down') {
            // 修飾キー以外の押しっぱなしは Kanata のマクロで表現できないためタップとして扱う
            warn(`${warnCtx}: 修飾キー以外の down/up (${key}) はタップとして出力しました`)
            const out = withHeld(key)
            if (out) parts.push(out)
          }
        }
      } else if (act.type === 'text') {
        for (const k of textToKeys(act.text || '', kcfg.textLayout)) {
          const out = withHeld(k)
          if (out) parts.push(out)
          else warn(`${warnCtx}: 修飾キー押下中の Unicode 文字は出力できません`)
        }
      } else if (act.type === 'delay') {
        const d = Math.round(Number(act.duration) || 0)
        if (d > 0) parts.push(String(Math.min(d, 65535)))
      }
    }
    if (held.length) warn(`${warnCtx}: マクロ終了時に押されたままの修飾キー (${held.join(' ')}) は解放されます`)
    if (parts.length === 0) return null
    return `(macro ${parts.join(' ')})`
  }

  function tdAction(kc) {
    if (!kc) return null
    magicSuppressed = true
    try {
      return emitAction(kc, { allowAutoShift: false })
    } finally {
      magicSuppressed = false
    }
  }

  function emitTapDance(td) {
    // Vial 形式 (4 スロット) と旧 GUI 形式 (actions 配列) の両対応
    if (Array.isArray(td.actions)) {
      const acts = td.actions.map((a) => tdAction(a) || 'XX')
      if (acts.length === 0) return null
      return `(tap-dance ${td.timeout || td.tappingTerm || 200} (${acts.join(' ')}))`
    }
    const term = td.tappingTerm || 200
    const tap = tdAction(td.onTap)
    const hold = tdAction(td.onHold)
    const dbl = tdAction(td.onDoubleTap)
    const tapHoldAct = tdAction(td.onTapHold)
    const th = (t, h) => `(${tapHoldActionFor(qmk)} $tap-time ${term} ${t} ${h})`
    const first = hold ? th(tap || 'XX', hold) : (tap || 'XX')
    if (!dbl && !tapHoldAct) {
      return first
    }
    let secondTap = dbl
    if (!secondTap) {
      const k = td.onTap && (td.onTap.type === 'basic' || td.onTap.type === 'modified') ? tap : null
      secondTap = k ? `(macro ${macroSafe(k)} ${macroSafe(k)})` : (tap || 'XX')
    }
    const second = tapHoldAct ? th(secondTap, tapHoldAct) : secondTap
    return `(tap-dance ${term} (${first} ${second}))`
  }

  // ------------------------------------------------------------
  // レイヤー
  // ------------------------------------------------------------
  const layerTokens = layers.map((layer, li) => defsrcIdx.map((pos) => {
    let kc = layer.keys?.[pos]
    // TG/TT のトグル解除: 対象レイヤー上で透過になっている位置がベースの TG/TT に落ちる場合
    if (li > 0 && (!kc || kc.type === 'transparent')) {
      const baseKc = layers[0]?.keys?.[pos]
      if (baseKc && baseKc.type === 'layer-op' && (baseKc.op === 'TG' || baseKc.op === 'TT') && baseKc.layer === li) {
        kc = baseKc
      }
    }
    return emitAction(kc, { layer: li, pos })
  }))

  // Windows の JIS 英数キーは「離した」イベントが届かない (windows.mjs 参照)
  if (os === 'windows') {
    for (const pos of defsrcIdx) {
      const tk = targetKeys[pos]
      if (!isWinNoReleaseKey(tk)) continue
      const used = layers.some((l) => {
        const kc = l.keys?.[pos]
        return kc && kc.type !== 'transparent' && kc.type !== 'disabled'
      })
      if (used) {
        warn(`${tk.label || '英数'} キー: Windows の JIS 配列ではこのキーを離したイベントが届かないため、Kanata では押しっぱなし扱いになります (tap-hold が常にホールドになり修飾キーが押されたままになる)。レジストリで英数キーを F13 に置き換え、ノートPC配列でこのキーを f13 にしてください (GUI のキー設定、または README 参照)`)
      }
    }
  }

  const macroEntries = []
  for (const m of project.macros) {
    if (!m || m.id === undefined) continue
    const value = emitMacro(m)
    if (value) macroEntries.push({ name: macroNames.get(m.id), value, comment: m.name || m.label || null })
    else macroEntries.push({ name: macroNames.get(m.id), value: 'XX', comment: '(空のマクロ)' })
  }
  const tdEntries = []
  for (const td of project.tapDances) {
    if (!td || td.id === undefined) continue
    const value = emitTapDance(td) || 'XX'
    tdEntries.push({ name: tdNames.get(td.id), value })
  }

  // ------------------------------------------------------------
  // コンボ → defchordsv2
  // ------------------------------------------------------------
  const chordLines = []
  const effectiveId = (li, pos) => {
    for (let l = li; l >= 0; l--) {
      const kc = layers[l]?.keys?.[pos]
      if (kc && kc.type !== 'transparent') return keyConfigId(kc)
    }
    return 'none'
  }
  for (const combo of project.combos) {
    if (!combo || !Array.isArray(combo.keys) || combo.keys.length < 2 || !combo.result) continue
    const ids = combo.keys.map(keyConfigId)
    const used = new Set()
    const positions = []
    let ok = true
    for (const id of ids) {
      let found = null
      for (let li = 0; li < layers.length && found === null; li++) {
        for (const pos of defsrcIdx) {
          if (!used.has(pos) && effectiveId(li, pos) === id) {
            found = pos
            break
          }
        }
      }
      if (found === null) {
        ok = false
        break
      }
      used.add(found)
      positions.push(found)
    }
    const label = combo.keys.map((k) => keyConfigId(k).replace(/^k:/, '')).join(' + ')
    if (!ok) {
      warn(`コンボ ${label}: 構成キーが defsrc 上に見つからないため出力しませんでした`)
      continue
    }
    // 構成キーが同じキーを出さないレイヤーではコンボを無効化 (QMK はキーコード単位で判定するため)
    const disabled = layerNames.filter((_, li) => !positions.every((pos, j) => effectiveId(li, pos) === ids[j]))
    const action = emitAction(combo.result, { allowAutoShift: false })
    const timeout = combo.timeout || qmk.comboTerm || 50
    chordLines.push(`  ;; ${label}`)
    chordLines.push(`  (${positions.map((p) => defsrcNameOf.get(p)).join(' ')}) ${action} ${timeout} all-released (${disabled.join(' ')})`)
  }

  // ------------------------------------------------------------
  // キーオーバーライド → defoverrides
  // ------------------------------------------------------------
  const overrideLines = []
  const LR = [['lctl', 'rctl'], ['lsft', 'rsft'], ['lalt', 'ralt'], ['lmet', 'rmet']]
  for (const ko of project.keyOverrides) {
    if (!ko || ko.enabled === false) continue
    const trig = ko.trigger
    const trigKey = trig && (trig.type === 'basic' ? trig.kanataKey : trig.type === 'modified' ? (trig.baseKey || splitChord(trig.kanataKey).baseKey) : null)
    const trigExtraMods = trig && trig.type === 'modified' ? (trig.mods || splitChord(trig.kanataKey).mods) : []
    if (!trigKey) {
      warn(`キーオーバーライド${ko.id !== undefined ? ` #${ko.id}` : ''}: トリガーが修飾キーのみ/特殊キーのため Kanata では再現できません`)
      continue
    }
    const rep = ko.replacement
    let repTokens = null
    if (rep && (rep.type === 'basic' || rep.type === 'modified')) {
      const { mods, baseKey } = rep.type === 'modified' ? { mods: rep.mods || splitChord(rep.kanataKey).mods, baseKey: rep.baseKey || splitChord(rep.kanataKey).baseKey } : { mods: [], baseKey: rep.kanataKey }
      repTokens = [...sortMods([...(ko.replacementMods || []), ...mods]), baseKey].map(nameKey)
    } else if (!rep && ko.replacementKey) {
      repTokens = [...(ko.replacementMods || []), ko.replacementKey].map(nameKey)
    }
    if (!repTokens) {
      warn(`キーオーバーライド${ko.id !== undefined ? ` #${ko.id}` : ''}: 置換先が基本キーでないため Kanata では再現できません`)
      continue
    }
    const mods = sortMods([...(ko.triggerMods || []), ...trigExtraMods])
    // 左右両方指定された修飾キー → どちらか一方でよい (個別エントリに展開)
    let combos = [[]]
    if (ko.oneMod && mods.length > 1) {
      combos = mods.map((m) => [m])
    } else {
      const fixed = []
      const pairs = []
      for (const m of mods) {
        const pair = LR.find((p) => p.includes(m))
        if (pair && mods.includes(pair[0]) && mods.includes(pair[1])) {
          if (m === pair[0]) pairs.push(pair)
        } else {
          fixed.push(m)
        }
      }
      combos = [fixed]
      for (const pair of pairs) combos = combos.flatMap((c) => pair.map((p) => [...c, p]))
    }
    if (ko.layers !== undefined && (ko.layers & ((1 << layers.length) - 1)) !== ((1 << layers.length) - 1)) {
      warn('キーオーバーライドのレイヤー限定は Kanata v1.10 の defoverrides では再現できないため全レイヤー共通にしました')
    }
    if (ko.negativeMods && ko.negativeMods.length) {
      warn('キーオーバーライドの Negative mods は Kanata v1.10 の defoverrides では再現できません')
    }
    overrideLines.push(`  ;; ${[...mods, trigKey].join('+')} → ${repTokens.join('+')}`)
    for (const c of combos) {
      overrideLines.push(`  (${[...c.map(nameKey), nameKey(trigKey)].join(' ')}) (${repTokens.join(' ')})`)
    }
  }

  // ------------------------------------------------------------
  // 出力組み立て
  // ------------------------------------------------------------
  const lines = []
  lines.push(';; Generated by vil2kanata')
  if (project.sourceName) lines.push(`;; Source: ${project.sourceName}`)
  lines.push(`;; Target OS: ${os} / Layers: ${layers.length} / Macros: ${macroEntries.length} / TapDance: ${tdEntries.length} / Combos: ${chordLines.length / 2} / Overrides: ${overrideLines.filter((l) => !l.trim().startsWith(';;')).length}`)
  lines.push(`;; QMK: TAPPING_TERM=${qmk.tappingTerm} QUICK_TAP_TERM=${qmk.quickTapTerm ?? qmk.tappingTerm} COMBO_TERM=${qmk.comboTerm} mode=${tapHoldActionFor(qmk)}${qmk.chordalHold ? ' +chordal-hold' : ''}`)
  if (warnings.length) {
    lines.push(';;')
    lines.push(';; 注意 (Kanata で完全再現できなかった項目):')
    for (const w of warnings) lines.push(`;;  - ${w}`)
  }
  lines.push('')

  lines.push('(defcfg')
  if (kcfg.processUnmappedKeys !== false) lines.push('  process-unmapped-keys yes')
  if (kcfg.concurrentTapHold !== false || chordLines.length > 0) lines.push('  concurrent-tap-hold yes')
  if (kcfg.rapidEventDelay > 0) lines.push(`  rapid-event-delay ${kcfg.rapidEventDelay}`)
  // QMK では切り替えたレイヤーの透過キーはレイヤー 0 に落ちる
  lines.push('  delegate-to-first-layer yes')
  lines.push(')')
  lines.push('')

  if (localKeys.size > 0) {
    const entries = [...localKeys.entries()]
    const block = (variant, pick) => {
      const items = entries.filter(([, s]) => pick(s) !== undefined && pick(s) !== null)
      if (items.length === 0) return
      lines.push(`(deflocalkeys-${variant}`)
      for (const [name, s] of items) lines.push(`  ${name} ${pick(s)}  ;; ${s.note}`)
      lines.push(')')
    }
    block('win', (s) => s.win)
    block('winiov2', (s) => s.win)
    block('linux', (s) => s.linux)
    lines.push('')
  }

  const tapTime = qmk.quickTapTerm ?? qmk.tappingTerm
  lines.push('(defvar')
  lines.push(`  tap-time ${tapTime}   ;; QUICK_TAP_TERM`)
  lines.push(`  hold-time ${qmk.tappingTerm}  ;; TAPPING_TERM`)
  lines.push(')')
  lines.push('')

  // 物理行の区切り
  const rowBreaks = new Set()
  let prevY = null
  defsrcIdx.forEach((idx, i) => {
    const y = targetKeys[idx]?.y
    if (prevY !== null && y !== undefined && Math.abs(y - prevY) > 0.3) rowBreaks.add(i)
    if (y !== undefined) prevY = y
  })

  lines.push('(defsrc')
  lines.push(...layoutLines(defsrcNames, rowBreaks))
  lines.push(')')
  lines.push('')

  const allAliases = [...aliases.entries()]
  if (allAliases.length || macroEntries.length || tdEntries.length) {
    lines.push('(defalias')
    for (const [name, a] of allAliases) {
      if (a.comment) lines.push(`  ${a.comment}`)
      lines.push(`  ${name} ${a.value}`)
    }
    if (macroEntries.length) {
      lines.push('  ;; Macros')
      for (const m of macroEntries) {
        if (m.comment) lines.push(`  ;; ${m.comment}`)
        lines.push(`  ${m.name} ${m.value}`)
      }
    }
    if (tdEntries.length) {
      lines.push('  ;; Tap Dance')
      for (const td of tdEntries) lines.push(`  ${td.name} ${td.value}`)
    }
    lines.push(')')
    lines.push('')
  }

  layers.forEach((layer, li) => {
    lines.push(`(deflayer ${layerNames[li]}`)
    lines.push(...layoutLines(layerTokens[li], rowBreaks))
    lines.push(')')
    lines.push('')
  })

  if (chordLines.length) {
    lines.push('(defchordsv2')
    lines.push(...chordLines)
    lines.push(')')
    lines.push('')
  }

  if (overrideLines.length) {
    lines.push('(defoverrides')
    lines.push(...overrideLines)
    lines.push(')')
    lines.push('')
  }

  return { text: lines.join('\n'), warnings }
}

  V2K.emitKanata = emitKanata;
  V2K.KANATA_DEFAULTS = KANATA_DEFAULTS;
})();

// === src/core/project.mjs ===
(function() {
  const computeMapping = V2K.computeMapping;
  const invertMapping = V2K.invertMapping;
  const keyCenter = V2K.keyCenter;
  const normalizeKeyConfig = V2K.normalizeKeyConfig;
  const parseQmkKeycode = V2K.parseQmkKeycode;
  const tapKeyName = V2K.tapKeyName;
  const completeQmkSettings = V2K.completeQmkSettings;
  const KANATA_DEFAULTS = V2K.KANATA_DEFAULTS;
  const emitKanata = V2K.emitKanata;
  const getPresetKeys = V2K.getPresetKeys;

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







const PROJECT_VERSION = 2

function createProject({ layoutId = 'jis-laptop', targetKeys = null } = {}) {
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
function attachSource(project, source) {
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

function layerCount(project) {
  return Math.max(project.layerNames?.length || 0, project.source?.layers?.length || 0, 1)
}

/**
 * 対応付けを計算してノートPC側のレイヤーを組み立てる
 * 戻り値: { map, inverse, segments, layers: [{name, keys}], defsrc: [targetIdx], hands }
 */
function resolveProject(project) {
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
function projectToKbd(project) {
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
function projectFromSourceOnly(source) {
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

function serializeProject(project) {
  return JSON.stringify(project, null, 2)
}

/**
 * プロジェクト JSON (v1 / v2) → v2 プロジェクト
 */
function loadProjectData(data) {
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

  V2K.createProject = createProject;
  V2K.attachSource = attachSource;
  V2K.layerCount = layerCount;
  V2K.resolveProject = resolveProject;
  V2K.projectToKbd = projectToKbd;
  V2K.projectFromSourceOnly = projectFromSourceOnly;
  V2K.serializeProject = serializeProject;
  V2K.loadProjectData = loadProjectData;
  V2K.PROJECT_VERSION = PROJECT_VERSION;
})();

// === gui/js/store.js ===
(function() {
  const createProject = V2K.createProject;
  const resolveProject = V2K.resolveProject;

// ============================================================
// 状態管理ストア
//
// state.project が変換の唯一の情報源 (src/core/project.mjs の v2 形式)。
// それ以外は画面表示用の一時状態。
// ============================================================


let state = {
  project: createProject({ layoutId: 'jis-laptop' }),
  view: 'mapping',        // 'mapping' (対応付け) | 'keymap' (キーマップ編集)
  activeLayer: 0,
  selectedTarget: null,   // キーマップ編集で選択中のノートPCキー
  selectedSource: null,   // 対応付けで選択中の自作キーボードのキー
  pickSegment: null,      // 始点をクリック指定中のセグメント ID
  featureTab: 'key',
  keyLabelMode: 'jis',
  layoutEditMode: false,  // ノートPC配列の編集モード
}

const listeners = new Set()
let resolvedCache = { project: null, value: null }

function getState() {
  return state
}

function setState(updater) {
  const patch = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...patch }
  for (const listener of listeners) listener(state)
}

function updateProject(fn) {
  setState((s) => ({ project: fn(s.project) }))
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// 対応付け・レイヤー解決結果 (project が変わった時だけ再計算)
function getResolved() {
  if (resolvedCache.project !== state.project) {
    resolvedCache = { project: state.project, value: resolveProject(state.project) }
  }
  return resolvedCache.value
}

  V2K.getState = getState;
  V2K.setState = setState;
  V2K.updateProject = updateProject;
  V2K.subscribe = subscribe;
  V2K.getResolved = getResolved;
})();

// === gui/js/labels.js ===
(function() {
  const splitChord = V2K.splitChord;
  const SPECIAL_LABELS = V2K.SPECIAL_LABELS;

// ============================================================
// キー表示ラベル
// ============================================================



const KEY_LABELS = {
  ret: 'Enter', esc: 'Esc', bspc: 'Bksp', tab: 'Tab', spc: 'Space', caps: 'Caps', del: 'Del',
  ins: 'Ins', prnt: 'PrtSc', slck: 'ScrLk', pause: 'Pause', pgup: 'PgUp', pgdn: 'PgDn',
  home: 'Home', end: 'End', left: '←', rght: '→', up: '↑', down: '↓',
  lctl: 'LCtrl', lsft: 'LShift', lalt: 'LAlt', lmet: 'LWin', rctl: 'RCtrl', rsft: 'RShift',
  ralt: 'RAlt', rmet: 'RWin', grv: '`', menu: 'Menu', nlck: 'NumLk', nubs: 'ISO\\',
  ro: 'ろ', kana: 'かな', mhnk: '無変換', henk: '変換', '¥': '¥',
  lang1: 'IME ON', lang2: 'IME OFF',
  mlft: 'M-L', mrgt: 'M-R', mmid: 'M-Mid', mbck: 'M-Back', mfwd: 'M-Fwd',
  mute: 'Mute', volu: 'Vol+', vold: 'Vol-', next: 'Next', prev: 'Prev', pp: 'Play', mstp: 'Stop',
  powr: 'Power', zzz: 'Sleep', wkup: 'Wake', calc: 'Calc', mail: 'Mail', plyr: 'Player',
  hmpg: 'WHome', bck: 'WBack', fwd: 'WFwd', bru: 'Bri+', brdn: 'Bri-', eject: 'Eject',
  'kp/': 'KP/', 'kp*': 'KP*', 'kp-': 'KP-', 'kp+': 'KP+', kprt: 'KPEnt', 'kp.': 'KP.',
  'kp=': 'KP=', 'kp,': 'KP,', _: '▽', XX: '',
}

// JIS 配列の刻印 (US 位置名 → JIS 刻印)
const KEY_LABELS_JIS = {
  '[': '@', ']': '[', '\\': ']', "'": ':', '=': '^', grv: '半/全', caps: '英数', ro: '\\ ろ',
}

const SHIFTED_US = {
  1: '!', 2: '@', 3: '#', 4: '$', 5: '%', 6: '^', 7: '&', 8: '*', 9: '(', 0: ')',
  '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"', grv: '~', ',': '<', '.': '>', '/': '?',
}
const SHIFTED_JIS = {
  1: '!', 2: '"', 3: '#', 4: '$', 5: '%', 6: '&', 7: "'", 8: '(', 9: ')',
  '-': '=', '=': '~', '[': '`', ']': '{', '\\': '}', ';': '+', "'": '*', ',': '<', '.': '>', '/': '?',
  ro: '_', '¥': '|',
}

function getKeyLabel(kanataKey, mode = 'us') {
  if (!kanataKey) return ''
  if (mode === 'jis' && KEY_LABELS_JIS[kanataKey]) return KEY_LABELS_JIS[kanataKey]
  if (KEY_LABELS[kanataKey] !== undefined) return KEY_LABELS[kanataKey]
  if (kanataKey.length === 1) return kanataKey.toUpperCase()
  if (/^f\d+$/.test(kanataKey)) return kanataKey.toUpperCase()
  return kanataKey
}

function getChordLabel(kanataKey, mode = 'us') {
  const { mods, baseKey } = splitChord(kanataKey)
  if (mods.length === 1 && mods[0] === 'lsft') {
    const map = mode === 'jis' ? SHIFTED_JIS : SHIFTED_US
    if (map[baseKey]) return map[baseKey]
  }
  const prefix = mods.map((m) => ({ lctl: 'C', lsft: 'S', lalt: 'A', lmet: 'W', rctl: 'RC', rsft: 'RS', ralt: 'RA', rmet: 'RW' }[m])).join('')
  return `${prefix}(${getKeyLabel(baseKey, mode)})`
}

const MOD_SHORT = { lctl: 'Ctl', lsft: 'Sft', lalt: 'Alt', lmet: 'Win', rctl: 'RCtl', rsft: 'RSft', ralt: 'RAlt', rmet: 'RWin' }

function modsLabel(mods) {
  return (mods || []).map((m) => MOD_SHORT[m] || m).join('+')
}

/**
 * keyConfig → { main, sub, kind } (キーボード表示用)
 * kind は CSS の色分けに使用
 */
function keyConfigLabel(kc, mode = 'us', layerNames = []) {
  if (!kc) return { main: '', kind: 'disabled' }
  const ln = (i) => layerNames[i] || `L${i}`
  switch (kc.type) {
    case 'basic': return { main: getKeyLabel(kc.kanataKey, mode), kind: 'basic' }
    case 'modified': return { main: getChordLabel(kc.kanataKey, mode), kind: 'basic' }
    case 'mod-tap': return { main: getKeyLabel(kc.tapKey, mode), sub: modsLabel(kc.holdMods || [kc.holdMod]), kind: 'dual' }
    case 'layer-tap': return { main: getKeyLabel(kc.tapKey, mode), sub: ln(kc.layer), kind: 'dual' }
    case 'layer-op': return { main: `${kc.op}(${kc.layer})`, sub: ln(kc.layer), kind: 'layer' }
    case 'layer-mod': return { main: `LM(${kc.layer})`, sub: modsLabel(kc.mods), kind: 'layer' }
    case 'one-shot-mod': return { main: 'OSM', sub: modsLabel(kc.mods), kind: 'layer' }
    case 'macro': return { main: `M${kc.index}`, kind: 'macro' }
    case 'tap-dance': return { main: `TD${kc.index}`, kind: 'td' }
    case 'user': return { main: `USER${String(kc.index).padStart(2, '0')}`, kind: 'macro' }
    case 'special': return { main: SPECIAL_LABELS[kc.id] || kc.id, kind: 'layer' }
    case 'transparent': return { main: '▽', kind: 'transparent' }
    case 'disabled': return { main: '', kind: 'disabled' }
    case 'raw': return { main: kc.kanata.length > 10 ? `${kc.kanata.slice(0, 9)}…` : kc.kanata, kind: 'macro' }
    case 'unknown': return { main: kc.qmk, kind: 'disabled' }
    default: return { main: '?', kind: 'disabled' }
  }
}

  V2K.getKeyLabel = getKeyLabel;
  V2K.getChordLabel = getChordLabel;
  V2K.modsLabel = modsLabel;
  V2K.keyConfigLabel = keyConfigLabel;
  V2K.KEY_LABELS = KEY_LABELS;
  V2K.KEY_LABELS_JIS = KEY_LABELS_JIS;
})();

// === gui/js/pickers.js ===
(function() {
  const makeBasic = V2K.makeBasic;
  const makeModified = V2K.makeModified;
  const splitChord = V2K.splitChord;
  const sortMods = V2K.sortMods;
  const SPECIAL_LABELS = V2K.SPECIAL_LABELS;
  const SUPPORTED_SPECIALS = V2K.SUPPORTED_SPECIALS;
  const getKeyLabel = V2K.getKeyLabel;

// ============================================================
// 共通 UI 部品 (キー選択・修飾キー選択・キー設定エディタ)
// ============================================================




function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue
    if (k === 'class') node.className = v
    else if (k === 'text') node.textContent = v
    else if (k === 'html') node.innerHTML = v
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v)
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v)
    else if (v === true) node.setAttribute(k, '')
    else node.setAttribute(k, v)
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
  }
  return node
}

// キー選択肢 (カテゴリ別)
const KEY_CATALOG = [
  ['英字', 'abcdefghijklmnopqrstuvwxyz'.split('')],
  ['数字', '1234567890'.split('')],
  ['記号', ['-', '=', '[', ']', '\\', ';', "'", 'grv', ',', '.', '/', 'ro', '¥', 'nubs']],
  ['編集', ['spc', 'ret', 'tab', 'bspc', 'del', 'esc', 'ins', 'caps']],
  ['移動', ['left', 'down', 'up', 'rght', 'home', 'end', 'pgup', 'pgdn']],
  ['修飾', ['lctl', 'lsft', 'lalt', 'lmet', 'rctl', 'rsft', 'ralt', 'rmet', 'menu']],
  ['日本語', ['mhnk', 'henk', 'kana', 'lang1', 'lang2']],
  ['F', Array.from({ length: 24 }, (_, i) => `f${i + 1}`)],
  ['メディア', ['mute', 'vold', 'volu', 'prev', 'next', 'pp', 'mstp', 'bru', 'brdn', 'eject', 'calc', 'mail', 'plyr', 'hmpg', 'bck', 'fwd', 'powr', 'zzz', 'wkup']],
  ['マウス', ['mlft', 'mrgt', 'mmid', 'mbck', 'mfwd']],
  ['その他', ['prnt', 'slck', 'pause', 'nlck', 'kp0', 'kp1', 'kp2', 'kp3', 'kp4', 'kp5', 'kp6', 'kp7', 'kp8', 'kp9', 'kp/', 'kp*', 'kp-', 'kp+', 'kprt', 'kp.', 'kp=', 'kp,']],
]

const ALL_MODS = [
  ['lctl', 'LCtrl'], ['lsft', 'LShift'], ['lalt', 'LAlt'], ['lmet', 'LWin'],
  ['rctl', 'RCtrl'], ['rsft', 'RShift'], ['ralt', 'RAlt'], ['rmet', 'RWin'],
]

/**
 * 基本キーの <select>
 */
function keySelect(value, mode, onChange, { allowEmpty = false, className = 'editor-select' } = {}) {
  const select = el('select', { class: className })
  if (allowEmpty) select.appendChild(el('option', { value: '', text: '-- なし --' }))
  let found = !value
  for (const [group, keys] of KEY_CATALOG) {
    const og = el('optgroup', { label: group })
    for (const k of keys) {
      const opt = el('option', { value: k, text: `${getKeyLabel(k, mode)} (${k})` })
      if (k === value) {
        opt.selected = true
        found = true
      }
      og.appendChild(opt)
    }
    select.appendChild(og)
  }
  if (!found) {
    const opt = el('option', { value, text: `${value} (カスタム)` })
    opt.selected = true
    select.appendChild(opt)
  }
  select.addEventListener('change', () => onChange(select.value))
  return select
}

/**
 * 検索付きキーグリッド
 */
function keyGrid(value, mode, onPick) {
  const wrap = el('div')
  const search = el('input', { type: 'text', class: 'editor-search', placeholder: 'キーを検索 (例: a, spc, 変換)' })
  const grid = el('div', { class: 'key-picker-grid' })
  const render = () => {
    grid.innerHTML = ''
    const q = search.value.trim().toLowerCase()
    for (const [group, keys] of KEY_CATALOG) {
      for (const k of keys) {
        const label = getKeyLabel(k, mode)
        if (q && !k.toLowerCase().includes(q) && !label.toLowerCase().includes(q) && !group.includes(q)) continue
        const btn = el('button', {
          class: `key-picker-btn${k === value ? ' key-picker-active' : ''}`,
          title: k,
          text: label || k,
          onclick: () => onPick(k),
        })
        grid.appendChild(btn)
      }
    }
  }
  search.addEventListener('input', render)
  render()
  wrap.appendChild(search)
  wrap.appendChild(grid)
  return wrap
}

/**
 * 修飾キーのチェックボックス群
 */
function modCheckboxes(mods, onChange, { small = false } = {}) {
  const current = new Set(mods || [])
  const row = el('div', { class: small ? 'modifier-checkbox-row-sm' : 'modifier-checkbox-row' })
  for (const [mod, label] of ALL_MODS) {
    const cb = el('input', { type: 'checkbox' })
    cb.checked = current.has(mod)
    cb.addEventListener('change', () => {
      if (cb.checked) current.add(mod)
      else current.delete(mod)
      onChange(sortMods([...current]))
    })
    row.appendChild(el('label', { class: small ? 'modifier-checkbox-label-sm' : 'modifier-checkbox-label' }, [cb, label]))
  }
  return row
}

function numberInput(value, onChange, { min = 0, max = 99 } = {}) {
  const input = el('input', { type: 'number', class: 'feature-number-input', min, max, value })
  input.addEventListener('change', () => {
    const v = parseInt(input.value, 10)
    if (!Number.isNaN(v)) onChange(v)
  })
  return input
}

function layerSelect(value, layerNames, onChange) {
  const select = el('select', { class: 'editor-select' })
  layerNames.forEach((name, i) => {
    const opt = el('option', { value: i, text: `${i}: ${name}` })
    if (i === value) opt.selected = true
    select.appendChild(opt)
  })
  select.addEventListener('change', () => onChange(parseInt(select.value, 10)))
  return select
}

const KEY_TYPES = [
  ['basic', '基本キー'],
  ['modified', '修飾付きキー (Ctrl+C 等)'],
  ['mod-tap', 'Mod-Tap (タップ=キー / ホールド=修飾)'],
  ['layer-tap', 'Layer-Tap (タップ=キー / ホールド=レイヤー)'],
  ['layer-op', 'レイヤー操作 (MO/TG/TO/DF/OSL/TT)'],
  ['layer-mod', 'Layer-Mod (LM)'],
  ['one-shot-mod', 'One Shot Mod (OSM)'],
  ['macro', 'マクロ'],
  ['tap-dance', 'タップダンス'],
  ['special', '特殊キー (Grave Esc / Repeat / マウス等)'],
  ['user', 'USER キーコード'],
  ['raw', 'Kanata 式を直接入力'],
  ['transparent', '透過 (▽)'],
  ['disabled', '無効 (XX)'],
]

function defaultKeyConfig(type) {
  switch (type) {
    case 'basic': return makeBasic('a')
    case 'modified': return makeModified(['lctl'], 'c')
    case 'mod-tap': return { type: 'mod-tap', tapKey: 'a', holdMods: ['lsft'], holdMod: 'lsft' }
    case 'layer-tap': return { type: 'layer-tap', tapKey: 'spc', layer: 1 }
    case 'layer-op': return { type: 'layer-op', op: 'MO', layer: 1 }
    case 'layer-mod': return { type: 'layer-mod', layer: 1, mods: ['lsft'] }
    case 'one-shot-mod': return { type: 'one-shot-mod', mods: ['lsft'] }
    case 'macro': return { type: 'macro', index: 0 }
    case 'tap-dance': return { type: 'tap-dance', index: 0 }
    case 'special': return { type: 'special', id: 'GESC' }
    case 'user': return { type: 'user', index: 0 }
    case 'raw': return { type: 'raw', kanata: 'XX' }
    case 'transparent': return { type: 'transparent' }
    default: return { type: 'disabled' }
  }
}

const TAP_HOLD_VARIANTS = [
  ['', 'Vial 設定に従う (Permissive Hold 等)'],
  ['tap-hold', 'tap-hold (時間のみで判定)'],
  ['tap-hold-press', 'tap-hold-press (Hold On Other Key Press)'],
  ['tap-hold-release', 'tap-hold-release (Permissive Hold)'],
  ['tap-hold-press-timeout', 'tap-hold-press-timeout'],
  ['tap-hold-release-timeout', 'tap-hold-release-timeout'],
  ['tap-hold-release-keys', 'tap-hold-release-keys (指定キーで早期タップ)'],
  ['tap-hold-except-keys', 'tap-hold-except-keys (指定キーで常にタップ)'],
  ['tap-hold-tap-keys', 'tap-hold-tap-keys (指定キーで早期タップ・時間でホールド)'],
]

/**
 * 任意の keyConfig を編集するフォーム
 * @param {object} kc
 * @param {object} ctx  { mode, layerNames, macros, tapDances, userKeys, onChange, types? }
 */
function keyConfigEditor(kc, ctx) {
  const { mode, layerNames = [], onChange } = ctx
  const wrap = el('div', { class: ctx.compact ? 'kc-editor kc-editor-compact' : 'kc-editor' })
  const types = ctx.types || KEY_TYPES.map(([t]) => t)

  const typeSel = el('select', { class: 'editor-select' })
  if (ctx.allowNone) {
    const opt = el('option', { value: '', text: '(なし)' })
    if (!kc) opt.selected = true
    typeSel.appendChild(opt)
  }
  const cur = kc || (ctx.allowNone ? { type: '' } : { type: 'disabled' })
  for (const [t, label] of KEY_TYPES) {
    if (!types.includes(t)) continue
    const opt = el('option', { value: t, text: label })
    if (t === cur.type) opt.selected = true
    typeSel.appendChild(opt)
  }
  typeSel.addEventListener('change', () => onChange(typeSel.value ? defaultKeyConfig(typeSel.value) : null))
  wrap.appendChild(section('種類', typeSel))

  const set = (patch) => onChange({ ...cur, ...patch })

  switch (cur.type) {
    case 'basic':
      wrap.appendChild(section('キー', ctx.compact
        ? keySelect(cur.kanataKey, mode, (k) => onChange(makeBasic(k)))
        : keyGrid(cur.kanataKey, mode, (k) => onChange(makeBasic(k)))))
      break
    case 'modified': {
      const chord = cur.mods ? cur : { ...cur, ...splitChord(cur.kanataKey) }
      wrap.appendChild(section('修飾キー', modCheckboxes(chord.mods, (mods) => onChange(makeModified(mods, chord.baseKey)))))
      wrap.appendChild(section('キー', keySelect(chord.baseKey, mode, (k) => onChange(makeModified(chord.mods, k)))))
      break
    }
    case 'mod-tap': {
      wrap.appendChild(section('タップ', keySelect(cur.tapKey, mode, (k) => set({ tapKey: k }))))
      wrap.appendChild(section('ホールド (修飾)', modCheckboxes(cur.holdMods || [cur.holdMod], (mods) => {
        if (mods.length) set({ holdMods: mods, holdMod: mods[0] })
      })))
      wrap.appendChild(tapHoldOptions(cur, set))
      break
    }
    case 'layer-tap':
      wrap.appendChild(section('タップ', keySelect(cur.tapKey, mode, (k) => set({ tapKey: k }))))
      wrap.appendChild(section('ホールド (レイヤー)', layerSelect(cur.layer, layerNames, (l) => set({ layer: l }))))
      wrap.appendChild(tapHoldOptions(cur, set))
      break
    case 'layer-op': {
      const opSel = el('select', { class: 'editor-select' })
      for (const [op, label] of [['MO', 'MO: 押している間'], ['TG', 'TG: トグル'], ['TO', 'TO: 切り替え'], ['DF', 'DF: デフォルト変更'], ['OSL', 'OSL: ワンショット'], ['TT', 'TT: タップでトグル/ホールドで MO']]) {
        const opt = el('option', { value: op, text: label })
        if (op === cur.op) opt.selected = true
        opSel.appendChild(opt)
      }
      opSel.addEventListener('change', () => set({ op: opSel.value }))
      wrap.appendChild(section('操作', opSel))
      wrap.appendChild(section('レイヤー', layerSelect(cur.layer, layerNames, (l) => set({ layer: l }))))
      break
    }
    case 'layer-mod':
      wrap.appendChild(section('レイヤー', layerSelect(cur.layer, layerNames, (l) => set({ layer: l }))))
      wrap.appendChild(section('修飾キー', modCheckboxes(cur.mods, (mods) => set({ mods }))))
      break
    case 'one-shot-mod':
      wrap.appendChild(section('修飾キー', modCheckboxes(cur.mods, (mods) => {
        if (mods.length) set({ mods })
      })))
      break
    case 'macro':
      wrap.appendChild(section('マクロ', indexSelect(cur.index, (ctx.macros || []).map((m) => [m.id, `M${m.id}${m.name ? ` ${m.name}` : ''}`]), (i) => set({ index: i }))))
      break
    case 'tap-dance':
      wrap.appendChild(section('タップダンス', indexSelect(cur.index, (ctx.tapDances || []).map((t) => [t.id, `TD${t.id}`]), (i) => set({ index: i }))))
      break
    case 'user': {
      const users = Object.entries(ctx.userKeys || {}).map(([i, u]) => [Number(i), `USER${String(i).padStart(2, '0')} ${u.name || ''}`])
      if (!users.some(([i]) => i === cur.index)) users.push([cur.index, `USER${String(cur.index).padStart(2, '0')}`])
      wrap.appendChild(section('USER キーコード', indexSelect(cur.index, users, (i) => set({ index: i }))))
      break
    }
    case 'special': {
      const sel = el('select', { class: 'editor-select' })
      for (const id of SUPPORTED_SPECIALS) {
        const opt = el('option', { value: id, text: `${SPECIAL_LABELS[id] || id} (${id})` })
        if (id === cur.id) opt.selected = true
        sel.appendChild(opt)
      }
      if (!SUPPORTED_SPECIALS.includes(cur.id)) {
        const opt = el('option', { value: cur.id, text: `${cur.id} (Kanata 非対応)` })
        opt.selected = true
        sel.appendChild(opt)
      }
      sel.addEventListener('change', () => set({ id: sel.value }))
      wrap.appendChild(section('特殊キー', sel))
      break
    }
    case 'raw': {
      const input = el('input', { type: 'text', class: 'editor-search', value: cur.kanata || '' })
      input.addEventListener('change', () => set({ kanata: input.value.trim() || 'XX' }))
      wrap.appendChild(section('Kanata 式', input))
      break
    }
    case 'unknown':
      wrap.appendChild(el('p', { class: 'editor-hint', text: `未対応キーコード: ${cur.qmk} (XX として出力されます)` }))
      break
    default:
      break
  }
  return wrap
}

function tapHoldOptions(cur, set) {
  const box = el('div')
  const sel = el('select', { class: 'editor-select' })
  for (const [v, label] of TAP_HOLD_VARIANTS) {
    const opt = el('option', { value: v, text: label })
    if ((cur.tapHoldVariant || '') === v) opt.selected = true
    sel.appendChild(opt)
  }
  sel.addEventListener('change', () => set({ tapHoldVariant: sel.value || undefined }))
  box.appendChild(section('判定方式', sel))
  if (['tap-hold-release-keys', 'tap-hold-except-keys', 'tap-hold-tap-keys'].includes(cur.tapHoldVariant)) {
    const input = el('input', { type: 'text', class: 'editor-search', value: cur.tapHoldExtraKeys || '', placeholder: 'defsrc のキー名をスペース区切り (例: a s d)' })
    input.addEventListener('change', () => set({ tapHoldExtraKeys: input.value }))
    box.appendChild(section('対象キー', input))
  }
  return box
}

function indexSelect(value, items, onChange) {
  const sel = el('select', { class: 'editor-select' })
  if (items.length === 0) sel.appendChild(el('option', { value: '', text: '(未作成)' }))
  for (const [id, label] of items) {
    const opt = el('option', { value: id, text: label })
    if (id === value) opt.selected = true
    sel.appendChild(opt)
  }
  sel.addEventListener('change', () => onChange(parseInt(sel.value, 10)))
  return sel
}

function section(label, content) {
  return el('div', { class: 'editor-section' }, [el('label', { text: label }), content])
}

  V2K.el = el;
  V2K.keySelect = keySelect;
  V2K.keyGrid = keyGrid;
  V2K.modCheckboxes = modCheckboxes;
  V2K.defaultKeyConfig = defaultKeyConfig;
  V2K.keyConfigEditor = keyConfigEditor;
  V2K.section = section;
  V2K.KEY_CATALOG = KEY_CATALOG;
  V2K.ALL_MODS = ALL_MODS;
  V2K.KEY_TYPES = KEY_TYPES;
})();

// === gui/js/keyboard.js ===
(function() {
  const keyCorners = V2K.keyCorners;

// ============================================================
// キーボード描画 (ノートPC / 自作キーボード共通)
// ============================================================


const KEY_UNIT = 50
const KEY_GAP = 4
const PADDING = 6

/**
 * @param {HTMLElement} container
 * @param {Array} keys  [{x, y, w, h, r?, rx?, ry?}]
 * @param {object} opts
 *   render(i) → { main, sub, kind, classes: [], badge, corner, title }
 *   onClick(i, event), onContext(i, event), draggable(i), onDrop(fromData, i)
 *   dragData(i) → string
 */
function renderKeyboard(container, keys, opts) {
  container.innerHTML = ''
  if (!keys || keys.length === 0) return

  let maxX = 0
  let maxY = 0
  for (const k of keys) {
    for (const [x, y] of keyCorners({ r: 0, rx: 0, ry: 0, ...k })) {
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  const board = document.createElement('div')
  board.className = 'keyboard'
  board.style.width = `${maxX * KEY_UNIT + PADDING * 2}px`
  board.style.height = `${maxY * KEY_UNIT + PADDING * 2}px`

  keys.forEach((k, i) => {
    const info = opts.render(i) || {}
    const el = document.createElement('div')
    el.className = ['key', `key-kind-${info.kind || 'basic'}`, ...(info.classes || [])].join(' ')
    el.dataset.index = i
    el.style.left = `${k.x * KEY_UNIT + PADDING + KEY_GAP / 2}px`
    el.style.top = `${k.y * KEY_UNIT + PADDING + KEY_GAP / 2}px`
    el.style.width = `${k.w * KEY_UNIT - KEY_GAP}px`
    el.style.height = `${k.h * KEY_UNIT - KEY_GAP}px`
    if (k.r) {
      el.style.transformOrigin = `${(k.rx - k.x) * KEY_UNIT - KEY_GAP / 2}px ${(k.ry - k.y) * KEY_UNIT - KEY_GAP / 2}px`
      el.style.transform = `rotate(${k.r}deg)`
    }
    if (info.title) el.title = info.title
    if (info.style) Object.assign(el.style, info.style)

    if (info.sub) {
      el.appendChild(span('key-label-top', info.main))
      el.appendChild(span('key-label-bottom', info.sub))
    } else {
      el.appendChild(span('key-label', info.main))
    }
    if (info.corner) el.appendChild(span('key-phys-label', info.corner))
    if (info.badge !== undefined && info.badge !== null) el.appendChild(span('key-defsrc-num', String(info.badge)))

    if (opts.onClick) el.addEventListener('click', (e) => opts.onClick(i, e))
    el.addEventListener('contextmenu', (e) => {
      if (!opts.onContext) return
      e.preventDefault()
      opts.onContext(i, e)
    })
    if (opts.draggable && opts.draggable(i)) {
      el.draggable = true
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', opts.dragData ? opts.dragData(i) : String(i))
        e.dataTransfer.effectAllowed = 'copyMove'
        el.classList.add('key-dragging')
      })
      el.addEventListener('dragend', () => el.classList.remove('key-dragging'))
    }
    if (opts.onDrop) {
      el.addEventListener('dragover', (e) => {
        e.preventDefault()
        el.classList.add('key-drag-over')
      })
      el.addEventListener('dragleave', () => el.classList.remove('key-drag-over'))
      el.addEventListener('drop', (e) => {
        e.preventDefault()
        el.classList.remove('key-drag-over')
        opts.onDrop(e.dataTransfer.getData('text/plain'), i)
      })
    }
    if (opts.onHover) {
      el.addEventListener('mouseenter', () => opts.onHover(i))
      el.addEventListener('mouseleave', () => opts.onHover(null))
    }
    board.appendChild(el)
  })
  container.appendChild(board)
}

function span(cls, text) {
  const s = document.createElement('span')
  s.className = cls
  s.textContent = text ?? ''
  return s
}

// セグメントの色分け (色だけに頼らないよう番号バッジも併用する)
function segmentColor(index) {
  const hues = [205, 30, 140, 280, 55, 330, 180, 100, 250, 0]
  return `hsl(${hues[index % hues.length]}, 55%, 32%)`
}

  V2K.renderKeyboard = renderKeyboard;
  V2K.segmentColor = segmentColor;
})();

// === gui/js/layers.js ===
(function() {
  const el = V2K.el;

// ============================================================
// レイヤータブ
// ============================================================


function renderLayers(state, resolved, actions) {
  const container = document.getElementById('layer-tabs')
  if (!container) return
  container.innerHTML = ''
  const sourceLayers = state.project.source?.layers.length || 0

  resolved.layers.forEach((layer, i) => {
    const name = el('span', { class: 'layer-tab-name', text: `${i}: ${layer.name}` })
    name.addEventListener('dblclick', () => {
      const v = prompt('レイヤー名 (英数字・_・-):', layer.name)
      if (!v) return
      const sanitized = v.trim().replace(/[^a-zA-Z0-9_-]/g, '')
      if (sanitized && sanitized.length <= 30) actions.renameLayer(i, sanitized)
    })
    const tab = el('div', {
      class: `layer-tab${i === state.activeLayer ? ' layer-tab-active' : ''}`,
      title: 'ダブルクリックで名前を変更',
      onclick: () => actions.setActiveLayer(i),
    }, [name])
    const edits = Object.keys(state.project.edits?.[i] || {}).length
    if (edits) tab.appendChild(el('span', { class: 'feature-tab-badge', title: '手動変更したキーの数', text: String(edits) }))
    if (i > 0 && i >= sourceLayers && i === resolved.layers.length - 1) {
      tab.appendChild(el('button', {
        class: 'layer-tab-remove',
        title: 'レイヤーを削除',
        text: '×',
        onclick: (e) => {
          e.stopPropagation()
          if (confirm(`レイヤー "${layer.name}" を削除しますか？`)) actions.removeLastLayer()
        },
      }))
    }
    container.appendChild(tab)
  })
  container.appendChild(el('div', { class: 'layer-tab layer-tab-add', title: 'レイヤーを追加', text: '+', onclick: actions.addLayer }))
}

  V2K.renderLayers = renderLayers;
})();

// === gui/js/mapping-panel.js ===
(function() {
  const getLayoutPresets = V2K.getLayoutPresets;
  const groupRows = V2K.groupRows;
  const el = V2K.el;
  const keyConfigLabel = V2K.keyConfigLabel;
  const segmentColor = V2K.segmentColor;

// ============================================================
// 対応付けウィザード (始点のヒアリング → 自動割り当て → 微調整)
// ============================================================






const METHOD_LABELS = {
  user: ['指定', 'badge-user'],
  auto: ['自動 (キー名一致)', 'badge-auto'],
  inferred: ['推定 (近くの行から)', 'badge-inferred'],
  skip: ['割り当てない', 'badge-skip'],
  none: ['未割当', 'badge-none'],
}

function renderMappingPanel(state, resolved, actions) {
  const panel = document.getElementById('mapping-panel')
  if (!panel) return
  panel.innerHTML = ''
  const { project, keyLabelMode: mode } = state
  const source = project.source
  const tk = project.target.keys

  // STEP 1: ノートPC配列
  const layoutSel = el('select', { class: 'editor-select' })
  for (const p of getLayoutPresets()) {
    const opt = el('option', { value: p.id, text: p.name })
    if (p.id === project.target.layoutId) opt.selected = true
    layoutSel.appendChild(opt)
  }
  if (!getLayoutPresets().some((p) => p.id === project.target.layoutId)) {
    const opt = el('option', { value: project.target.layoutId, text: `カスタム (${project.target.layoutId})` })
    opt.selected = true
    layoutSel.appendChild(opt)
  }
  layoutSel.addEventListener('change', () => actions.changeTargetLayout(layoutSel.value))
  panel.appendChild(step('1', 'ノートPCの配列を選ぶ', [
    layoutSel,
    el('p', { class: 'editor-hint', text: '手元の配列と違うキーは左パネルの「ノートPC配列を編集」で追加・削除・名前変更できます。' }),
  ]))

  // STEP 2: 読み込み
  panel.appendChild(step('2', '自作キーボードの設定を読み込む', [
    el('div', { class: 'feature-row' }, [
      el('button', { class: 'btn-primary', text: '.vil を読み込む', onclick: actions.importVil }),
      el('button', { text: 'vial.json / keymap.c / config.h を追加', onclick: actions.importExtras }),
    ]),
    el('p', { class: 'editor-hint', text: source
      ? `読み込み済み: ${source.name || '(名前なし)'} — ${source.keys.length} キー / ${source.layers.length} レイヤー${source.hasGeometry ? ' (vial.json の実配置)' : ' (マトリクス配置: vial.json を追加すると実際の形で表示されます)'}`
      : 'Vial で保存した .vil ファイルを選択してください。vial.json を一緒に読み込むと分割キーボードの左右・親指キーも正しい形で扱えます。' }),
  ]))

  if (!source) return

  // STEP 3: 始点のヒアリング
  const segRows = new Map()
  resolved.segments.forEach((seg) => {
    if (!segRows.has(seg.row)) segRows.set(seg.row, [])
    segRows.get(seg.row).push(seg)
  })
  const table = el('div', { class: 'segment-list' })
  const targetRows = groupRows(tk)
  resolved.segments.forEach((seg, si) => {
    const siblings = segRows.get(seg.row)
    const pos = siblings.indexOf(seg)
    const side = siblings.length === 1 ? '' : pos === 0 ? ' 左' : pos === siblings.length - 1 ? ' 右' : ` 中${pos}`
    const labels = seg.keys.map((s) => keyConfigLabel(source.layers[0][s], mode).main || '·')
    const preview = labels.length > 6 ? `${labels.slice(0, 3).join(' ')} … ${labels.slice(-2).join(' ')}` : labels.join(' ')
    const firstLabel = labels[0] || '·'

    const hasUser = Object.prototype.hasOwnProperty.call(project.mapping.starts || {}, seg.id)
    const sel = el('select', { class: 'editor-select segment-select' })
    const autoText = seg.method !== 'user' && seg.startTarget !== null && seg.method !== 'skip'
      ? `自動 (${tk[seg.startTarget].label || tk[seg.startTarget].kanataKey})`
      : '自動'
    sel.appendChild(el('option', { value: 'auto', text: autoText }))
    sel.appendChild(el('option', { value: 'none', text: '割り当てない' }))
    targetRows.forEach((row, ri) => {
      const og = el('optgroup', { label: `ノートPC ${ri + 1} 段目` })
      for (const t of row) {
        if (tk[t].fixed) continue
        const opt = el('option', { value: t, text: `${tk[t].label || tk[t].kanataKey} (${tk[t].kanataKey})` })
        og.appendChild(opt)
      }
      sel.appendChild(og)
    })
    if (hasUser) {
      const v = project.mapping.starts[seg.id]
      sel.value = v === null ? 'none' : String(v)
    } else {
      sel.value = 'auto'
    }
    sel.addEventListener('change', () => {
      if (sel.value === 'auto') actions.setStart(seg.id, undefined)
      else if (sel.value === 'none') actions.setStart(seg.id, null)
      else actions.setStart(seg.id, parseInt(sel.value, 10))
    })

    const picking = state.pickSegment === seg.id
    const pickBtn = el('button', {
      class: `defsrc-btn defsrc-btn-sm${picking ? ' defsrc-btn-active' : ''}`,
      title: 'ノートPCのキーをクリックして始点を指定',
      text: picking ? 'クリック待ち…' : 'キーで指定',
      onclick: () => actions.startPick(picking ? null : seg.id),
    })
    const [mText, mClass] = METHOD_LABELS[seg.method] || METHOD_LABELS.none
    const mapped = seg.keys.filter((s) => resolved.map[s] !== null).length

    table.appendChild(el('div', { class: `segment-item${picking ? ' segment-item-active' : ''}` }, [
      el('span', { class: 'segment-chip', style: { background: segmentColor(si) }, text: String(si + 1) }),
      el('div', { class: 'segment-desc' }, [
        el('div', { class: 'segment-title', text: `${seg.row + 1} 行目${side} (${seg.keys.length} キー)` }),
        el('div', { class: 'segment-keys', text: preview }),
      ]),
      el('div', { class: 'segment-question' }, [
        el('span', { class: 'feature-unit', text: `「${firstLabel}」はノートPCの` }),
        sel,
        pickBtn,
      ]),
      el('span', { class: `segment-badge ${mClass}`, text: `${mText} ${mapped}/${seg.keys.length}` }),
    ]))
  })
  panel.appendChild(step('3', '各行の始点を確認する (ヒアリング)', [
    el('p', { class: 'editor-hint', text: '自作キーボードの各行 (分割キーボードは左右別) の先頭キーが、ノートPCのどのキーに当たるかを答えてください。キー名が一致する行は自動で推定済みです。残りのキーは始点から右へ順番に割り当てられます。' }),
    table,
  ]))

  // STEP 4: 微調整
  const total = source.keys.length
  const mappedCount = resolved.map.filter((t) => t !== null).length
  const unmapped = resolved.map.map((t, s) => (t === null ? s : null)).filter((s) => s !== null)
  const pinCount = Object.keys(project.mapping.pins || {}).length
  panel.appendChild(step('4', '個別に微調整する', [
    el('p', { class: 'editor-hint', html: '自作キーボードのキーをクリック → ノートPCのキーをクリックで割り当て (ドラッグ&ドロップも可)。<br>自作キーボードのキーを右クリックで割り当て解除。調整は全レイヤーに反映されます。' }),
    el('div', { class: 'feature-row' }, [
      el('span', { class: 'feature-unit', text: `割り当て済み ${mappedCount} / ${total}` }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: `個別調整をリセット (${pinCount})`, onclick: actions.resetPins, disabled: pinCount === 0 }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '始点もすべて自動に戻す', onclick: actions.resetMapping }),
      el('button', { class: 'btn-primary', text: 'キーマップ編集へ →', onclick: () => actions.setView('keymap') }),
    ]),
    unmapped.length
      ? el('p', { class: 'editor-hint', text: `未割当: ${unmapped.map((s) => keyConfigLabel(source.layers[0][s], mode).main || `#${s + 1}`).join(', ')}` })
      : null,
  ]))
}

function step(num, title, children) {
  return el('div', { class: 'wizard-step' }, [
    el('div', { class: 'wizard-step-title' }, [el('span', { class: 'wizard-step-num', text: num }), title]),
    el('div', { class: 'wizard-step-body' }, children),
  ])
}

  V2K.renderMappingPanel = renderMappingPanel;
})();

// === gui/js/export.js ===
(function() {
  const importVil = V2K.importVil;
  const attachSource = V2K.attachSource;
  const loadProjectData = V2K.loadProjectData;
  const projectToKbd = V2K.projectToKbd;
  const serializeProject = V2K.serializeProject;

// ============================================================
// ファイル入出力 (.vil / vial.json / keymap.c / config.h / プロジェクト / .kbd)
// ============================================================



// 最後に読み込んだ入力ファイル (vial.json を後から追加したときの再読込用)
const rawInputs = { vil: null, vilName: '', vialJson: null, keymapC: null, configH: null }

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function exportKbdFile(project) {
  const { text } = projectToKbd(project)
  const base = (project.source?.name || 'keymap').replace(/\.[^.]+$/, '')
  downloadFile(`${base}.kbd`, text, 'text/plain')
}

function saveProjectFile(project) {
  downloadFile('vil2kanata-project.json', serializeProject(project), 'application/json')
}

async function readProjectFile(file) {
  return loadProjectData(JSON.parse(await file.text()))
}

/**
 * ファイル種別を判定して rawInputs に格納
 */
async function classify(files) {
  for (const file of files) {
    const text = await file.text()
    const name = file.name.toLowerCase()
    if (name.endsWith('.c')) rawInputs.keymapC = text
    else if (name.endsWith('.h')) rawInputs.configH = text
    else {
      let json
      try {
        json = JSON.parse(text)
      } catch {
        throw new Error(`${file.name}: JSON として読み込めません`)
      }
      if (Array.isArray(json.layout)) {
        rawInputs.vil = json
        rawInputs.vilName = file.name
      } else if (json.layouts && json.layouts.keymap) {
        rawInputs.vialJson = json
      } else {
        throw new Error(`${file.name}: .vil / vial.json のどちらでもありません`)
      }
    }
  }
}

function buildSource() {
  return importVil(rawInputs.vil, {
    vialJson: rawInputs.vialJson,
    keymapC: rawInputs.keymapC,
    configH: rawInputs.configH,
    name: rawInputs.vilName,
  })
}

/**
 * .vil (と任意の補助ファイル) を読み込んでプロジェクトに取り込む
 */
async function importVilFiles(project, files) {
  rawInputs.vialJson = null
  rawInputs.keymapC = null
  rawInputs.configH = null
  await classify(files)
  if (!rawInputs.vil) throw new Error('.vil ファイルが含まれていません')
  return attachSource(project, buildSource())
}

/**
 * vial.json / keymap.c / config.h を後から追加 (手動変更とレイヤー名は保持)
 */
async function importExtraFiles(project, files) {
  await classify(files)
  if (!rawInputs.vil) throw new Error('先に .vil ファイルを読み込んでください')
  const next = attachSource(project, buildSource())
  next.edits = next.edits.map((_, i) => project.edits?.[i] || {})
  next.layerNames = next.layerNames.map((n, i) => project.layerNames?.[i] || n)
  return next
}

// ============================================================
// 自動保存 (この端末のブラウザのみ)
// ============================================================

const STORAGE_KEY = 'vil2kanata-project-v2'

function autoSave(project) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeProject(project))
  } catch {
    // 容量超過・プライベートモード等は無視
  }
}

function autoLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? loadProjectData(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function clearAutoSave() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

  V2K.downloadFile = downloadFile;
  V2K.exportKbdFile = exportKbdFile;
  V2K.saveProjectFile = saveProjectFile;
  V2K.readProjectFile = readProjectFile;
  V2K.importVilFiles = importVilFiles;
  V2K.importExtraFiles = importExtraFiles;
  V2K.autoSave = autoSave;
  V2K.autoLoad = autoLoad;
  V2K.clearAutoSave = clearAutoSave;
})();

// === gui/js/editor.js ===
(function() {
  const el = V2K.el;
  const keyConfigEditor = V2K.keyConfigEditor;
  const keyGrid = V2K.keyGrid;
  const section = V2K.section;
  const getKeyLabel = V2K.getKeyLabel;
  const keyConfigLabel = V2K.keyConfigLabel;
  const EISU_TO_F13_REG = V2K.EISU_TO_F13_REG;
  const isWinNoReleaseKey = V2K.isWinNoReleaseKey;
  const scancodeMapRestoreReg = V2K.scancodeMapRestoreReg;
  const toUtf16le = V2K.toUtf16le;
  const downloadFile = V2K.downloadFile;

// ============================================================
// キー設定エディタ (選択中のノートPCキー × アクティブレイヤー)
// ============================================================





function renderEditor(state, resolved, actions) {
  const panel = document.getElementById('editor-panel')
  if (!panel) return
  panel.innerHTML = ''
  const { project, selectedTarget: t, activeLayer, keyLabelMode: mode } = state
  const tk = project.target.keys

  if (t === null || t === undefined || !tk[t]) {
    panel.appendChild(el('p', { class: 'feature-empty', text: state.layoutEditMode
      ? 'ノートPCのキーをクリックすると、キー名 (defsrc 名) や幅を編集できます。'
      : 'ノートPCのキーをクリックすると、そのキーの動作を編集できます。' }))
    return
  }

  if (state.layoutEditMode) {
    renderPhysicalEditor(panel, state, actions)
    return
  }

  const kc = resolved.layers[activeLayer]?.keys[t]
  const edited = !!project.edits?.[activeLayer]?.[t]
  const src = resolved.inverse[t]
  const inDefsrc = resolved.defsrc.includes(t)
  const layerNames = resolved.layers.map((l) => l.name)

  const origin = src !== null && src !== undefined
    ? `自作キーボード #${src + 1} (row ${project.source.keys[src].row}, col ${project.source.keys[src].col}) の設定`
    : '対応付けなし'
  panel.appendChild(el('div', { class: 'editor-header' }, [
    el('h3', {}, ['キー設定: ', el('span', { class: 'editor-key-name', text: `${tk[t].label || tk[t].kanataKey} (${tk[t].kanataKey})` })]),
    el('span', { class: 'editor-layer-info', text: `レイヤー ${activeLayer}: ${layerNames[activeLayer]}` }),
  ]))
  panel.appendChild(el('div', { class: 'feature-row' }, [
    el('span', { class: 'feature-unit', text: edited ? `手動変更中 (元: ${origin})` : origin }),
    edited ? el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '手動変更を取り消す', onclick: () => actions.clearEdit(activeLayer, t) }) : null,
    el('button', {
      class: 'defsrc-btn defsrc-btn-sm',
      text: inDefsrc ? 'リマップ対象から外す' : 'リマップ対象に含める',
      title: 'defsrc に含めるかどうか (外したキーは Kanata を通さずそのまま入力されます)',
      onclick: () => actions.toggleDefsrc(t),
    }),
  ]))
  if (isWinNoReleaseKey(tk[t]) && project.kanata.os === 'windows') {
    panel.appendChild(noReleaseNotice(t, actions))
  }
  if (!inDefsrc) {
    panel.appendChild(el('p', { class: 'editor-hint', text: 'このキーはリマップ対象外 (defsrc に含まれない) ため、どのレイヤーでもノートPC本来のキーとして動作します。' }))
  }

  panel.appendChild(keyConfigEditor(kc, {
    mode,
    layerNames,
    macros: project.macros,
    tapDances: project.tapDances,
    userKeys: project.userKeys,
    onChange: (next) => actions.setEdit(activeLayer, t, next),
  }))

  if (kc?.type === 'user') {
    const info = project.userKeys?.[kc.index]
    panel.appendChild(el('p', { class: 'editor-hint', text: info?.kanata
      ? `keymap.c から推定: ${info.kanata}`
      : 'USER キーコードの動作はファームウェア依存です。keymap.c を読み込むと自動推定します。推定できない場合は「Kanata 式を直接入力」で指定してください。' }))
  }
  const label = keyConfigLabel(kc, mode, layerNames)
  panel.appendChild(el('p', { class: 'editor-hint', text: `表示: ${label.main}${label.sub ? ` / ${label.sub}` : ''}` }))
}

// JIS 英数キー (Windows では離したイベントが届かない) の回避策
function noReleaseNotice(t, actions) {
  return el('div', { class: 'notice-box' }, [
    el('strong', { text: '注意: Windows では英数キーを「離した」ことを Kanata が検出できません' }),
    el('p', { text: '日本語キーボードドライバーが英数キーの「押した」イベントしか送らないため、Kanata からは押しっぱなしに見えます。Mod-Tap 等を割り当てるとホールド扱いになり、修飾キーが押されたままになります。' }),
    el('p', { text: '回避策: ① 下のレジストリ設定で英数キーを F13 に置き換えて再起動 → ② 「このキーを f13 として扱う」を押して .kbd を出力し直す' }),
    el('div', { class: 'feature-row' }, [
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '① 英数→F13 のレジストリ設定 (.reg)', onclick: () => downloadFile('vil2kanata-eisu-to-f13.reg', toUtf16le(EISU_TO_F13_REG), 'text/plain') }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '元に戻す .reg', onclick: () => downloadFile('vil2kanata-restore-keyboard.reg', toUtf16le(scancodeMapRestoreReg()), 'text/plain') }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '② このキーを f13 として扱う', onclick: () => actions.updateTargetKey(t, { kanataKey: 'f13', label: '英数(F13)', winNoRelease: false }) }),
    ]),
  ])
}

function renderPhysicalEditor(panel, state, actions) {
  const { project, selectedTarget: t, keyLabelMode: mode } = state
  const key = project.target.keys[t]
  panel.appendChild(el('div', { class: 'editor-header' }, [
    el('h3', {}, ['ノートPCのキー: ', el('span', { class: 'editor-key-name', text: key.label || key.kanataKey || '(なし)' })]),
    el('span', { class: 'editor-layer-info', text: `defsrc 名: ${key.kanataKey || '(対象外)'}` }),
  ]))
  panel.appendChild(el('p', { class: 'editor-hint', text: 'このキーを押したときに Kanata が受け取るキー名 (defsrc 名) を設定します。刻印ではなく、OS から見たキーを選んでください。' }))
  panel.appendChild(section('キー名', keyGrid(key.kanataKey, mode, (k) => actions.updateTargetKey(t, { kanataKey: k, label: getKeyLabel(k, mode), fixed: false }))))

  const nameInput = el('input', { type: 'text', class: 'editor-search', value: key.kanataKey || '', placeholder: 'kanata キー名 (例: mhnk)' })
  const labelInput = el('input', { type: 'text', class: 'editor-search', value: key.label || '', placeholder: '表示ラベル' })
  const widthInput = el('input', { type: 'number', class: 'feature-number-input', value: key.w, min: 0.5, max: 10, step: 0.25 })
  const fixed = el('input', { type: 'checkbox' })
  fixed.checked = !!key.fixed
  panel.appendChild(el('div', { class: 'feature-row feature-row-wrap' }, [
    nameInput, labelInput, el('span', { class: 'feature-unit', text: '幅' }), widthInput,
    el('label', { class: 'modifier-checkbox-label' }, [fixed, 'OS から見えないキー (Fn 等)']),
    el('button', {
      class: 'defsrc-btn defsrc-btn-sm',
      text: '適用',
      onclick: () => actions.updateTargetKey(t, {
        kanataKey: nameInput.value.trim(),
        label: labelInput.value.trim() || nameInput.value.trim(),
        w: parseFloat(widthInput.value) || key.w,
        fixed: fixed.checked || !nameInput.value.trim(),
      }),
    }),
    el('button', { class: 'feature-del-btn', text: 'このキーを削除', onclick: () => actions.deleteTargetKey(t) }),
  ]))
}

  V2K.renderEditor = renderEditor;
})();

// === gui/js/macros.js ===
(function() {
  const makeModified = V2K.makeModified;
  const splitChord = V2K.splitChord;
  const el = V2K.el;
  const keySelect = V2K.keySelect;
  const modCheckboxes = V2K.modCheckboxes;

// ============================================================
// マクロパネル (Vial と同じ tap / down / up / text / delay アクション)
// ============================================================



const ACTION_TYPES = [
  ['tap', 'タップ'],
  ['down', '押す (down)'],
  ['up', '離す (up)'],
  ['text', 'テキスト'],
  ['delay', '待機 (ms)'],
]

function renderMacrosPanel(state, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project, keyLabelMode: mode } = state
  const macros = project.macros || []
  const setMacros = (list) => actions.setList('macros', list)
  const update = (id, fn) => setMacros(macros.map((m) => (m.id === id ? fn(m) : m)))

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'マクロ' }),
    el('span', { class: 'feature-panel-desc', text: 'Vial のマクロ (M0〜) と同じ形式。テキストは「Vial設定」タブの文字入力方式で変換されます' }),
    el('button', {
      class: 'feature-add-btn',
      text: '+ マクロ追加',
      onclick: () => {
        const id = macros.length ? Math.max(...macros.map((m) => m.id)) + 1 : 0
        setMacros([...macros, { id, actions: [] }])
      },
    }),
  ]))
  if (macros.length === 0) {
    panel.appendChild(el('p', { class: 'feature-empty', text: 'マクロはありません。' }))
    return
  }

  for (const macro of macros) {
    const item = el('div', { class: 'feature-item' })
    const nameInput = el('input', { type: 'text', class: 'macro-name-input', value: macro.name || '', placeholder: 'メモ (任意)' })
    nameInput.addEventListener('change', () => update(macro.id, (m) => ({ ...m, name: nameInput.value || undefined })))
    item.appendChild(el('div', { class: 'feature-row' }, [
      el('span', { class: 'feature-item-id', text: `M${macro.id}` }),
      nameInput,
      el('button', { class: 'feature-del-btn', text: '× 削除', onclick: () => setMacros(macros.filter((m) => m.id !== macro.id)) }),
    ]))

    const list = el('div', { class: 'macro-action-list' })
    const acts = macro.actions || []
    const setActs = (next) => update(macro.id, (m) => ({ ...m, actions: next }))
    acts.forEach((act, ai) => {
      const setAct = (patch) => setActs(acts.map((a, j) => (j === ai ? { ...a, ...patch } : a)))
      const typeSel = el('select', { class: 'feature-key-select-sm' })
      for (const [v, label] of ACTION_TYPES) {
        const opt = el('option', { value: v, text: label })
        if (v === act.type) opt.selected = true
        typeSel.appendChild(opt)
      }
      typeSel.addEventListener('change', () => {
        const type = typeSel.value
        const next = type === 'text' ? { type, text: '' } : type === 'delay' ? { type, duration: 50 } : { type, keys: act.keys || ['a'] }
        setActs(acts.map((a, j) => (j === ai ? next : a)))
      })
      const row = el('div', { class: 'macro-action-item' }, [typeSel])
      if (act.type === 'text') {
        const input = el('input', { type: 'text', class: 'feature-text-input', value: act.text || '' })
        input.addEventListener('change', () => setAct({ text: input.value }))
        row.appendChild(input)
      } else if (act.type === 'delay') {
        const input = el('input', { type: 'number', class: 'feature-number-input', value: act.duration || 0, min: 1, max: 65535 })
        input.addEventListener('change', () => setAct({ duration: parseInt(input.value, 10) || 0 }))
        row.appendChild(input)
        row.appendChild(el('span', { class: 'feature-unit', text: 'ms' }))
      } else {
        const keys = act.keys || []
        keys.forEach((key, ki) => {
          const { mods, baseKey } = splitChord(key)
          const setKey = (k) => setAct({ keys: keys.map((x, j) => (j === ki ? k : x)) })
          if (act.type === 'tap') {
            row.appendChild(modCheckboxes(mods, (m) => setKey(makeModified(m, baseKey).kanataKey), { small: true }))
          }
          row.appendChild(keySelect(baseKey, mode, (k) => setKey(act.type === 'tap' ? makeModified(mods, k).kanataKey : k), { className: 'feature-key-select-sm' }))
          if (keys.length > 1) {
            row.appendChild(el('button', { class: 'feature-del-btn-sm', text: '−', title: 'キーを削除', onclick: () => setAct({ keys: keys.filter((_, j) => j !== ki) }) }))
          }
        })
        row.appendChild(el('button', { class: 'feature-add-action-btn', text: '+キー', onclick: () => setAct({ keys: [...keys, 'a'] }) }))
      }
      row.appendChild(el('button', { class: 'feature-del-btn-sm', text: '↑', title: '上へ', disabled: ai === 0, onclick: () => setActs(move(acts, ai, -1)) }))
      row.appendChild(el('button', { class: 'feature-del-btn-sm', text: '↓', title: '下へ', disabled: ai === acts.length - 1, onclick: () => setActs(move(acts, ai, 1)) }))
      row.appendChild(el('button', { class: 'feature-del-btn-sm', text: '×', title: 'アクション削除', onclick: () => setActs(acts.filter((_, j) => j !== ai)) }))
      list.appendChild(row)
    })
    item.appendChild(list)
    const addRow = el('div', { class: 'feature-row' })
    for (const [type, label] of ACTION_TYPES) {
      addRow.appendChild(el('button', {
        class: 'feature-add-action-btn',
        text: `+ ${label}`,
        onclick: () => setActs([...acts, type === 'text' ? { type, text: '' } : type === 'delay' ? { type, duration: 50 } : { type, keys: [type === 'tap' ? 'a' : 'lsft'] }]),
      }))
    }
    item.appendChild(addRow)
    panel.appendChild(item)
  }
}

function move(list, i, d) {
  const out = [...list]
  const j = i + d
  if (j < 0 || j >= out.length) return out
  ;[out[i], out[j]] = [out[j], out[i]]
  return out
}

  V2K.renderMacrosPanel = renderMacrosPanel;
})();

// === gui/js/tap-dance.js ===
(function() {
  const el = V2K.el;
  const keyConfigEditor = V2K.keyConfigEditor;

// ============================================================
// タップダンスパネル (Vial 形式: タップ / ホールド / ダブルタップ / タップ後ホールド + Tapping term)
// ============================================================


const SLOTS = [
  ['onTap', 'タップ'],
  ['onHold', 'ホールド'],
  ['onDoubleTap', 'ダブルタップ'],
  ['onTapHold', 'タップ後ホールド'],
]

function renderTapDancePanel(state, resolved, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project, keyLabelMode: mode } = state
  const tds = project.tapDances || []
  const setTds = (list) => actions.setList('tapDances', list)
  const update = (id, patch) => setTds(tds.map((t) => (t.id === id ? { ...t, ...patch } : t)))
  const layerNames = resolved.layers.map((l) => l.name)

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'タップダンス' }),
    el('span', { class: 'feature-panel-desc', text: 'Vial の TD(n) と同じ 4 つの動作と個別の Tapping term' }),
    el('button', {
      class: 'feature-add-btn',
      text: '+ タップダンス追加',
      onclick: () => {
        const id = tds.length ? Math.max(...tds.filter((t) => t.id < 1000).map((t) => t.id), -1) + 1 : 0
        setTds([...tds, { id, onTap: { type: 'basic', kanataKey: 'a' }, onHold: null, onDoubleTap: null, onTapHold: null, tappingTerm: project.qmk.tappingTerm || 200 }])
      },
    }),
  ]))
  if (tds.length === 0) {
    panel.appendChild(el('p', { class: 'feature-empty', text: 'タップダンスはありません。' }))
    return
  }

  for (const td of tds) {
    const item = el('div', { class: 'feature-item' })
    const term = el('input', { type: 'number', class: 'feature-number-input', value: td.tappingTerm || td.timeout || 200, min: 50, max: 2000 })
    term.addEventListener('change', () => {
      const v = parseInt(term.value, 10)
      if (v > 0) update(td.id, Array.isArray(td.actions) ? { timeout: v } : { tappingTerm: v })
    })
    item.appendChild(el('div', { class: 'feature-row' }, [
      el('span', { class: 'feature-item-id', text: `TD${td.id}` }),
      el('span', { class: 'feature-unit', text: 'Tapping term' }),
      term,
      el('span', { class: 'feature-unit', text: 'ms' }),
      el('button', { class: 'feature-del-btn', text: '× 削除', onclick: () => setTds(tds.filter((t) => t.id !== td.id)) }),
    ]))
    const ctx = { mode, layerNames, macros: project.macros, tapDances: tds, userKeys: project.userKeys, compact: true }
    if (Array.isArray(td.actions)) {
      // 旧 GUI 形式 (タップ回数ごとの動作リスト)
      item.appendChild(el('p', { class: 'editor-hint', text: '旧形式のタップダンス (n 回タップ → n 番目の動作)' }))
      td.actions.forEach((a, i) => {
        item.appendChild(el('div', { class: 'td-slot' }, [
          el('span', { class: 'feature-unit', text: `${i + 1} 回` }),
          keyConfigEditor(a, { ...ctx, onChange: (kc) => update(td.id, { actions: td.actions.map((x, j) => (j === i ? (kc || { type: 'disabled' }) : x)) }) }),
        ]))
      })
    } else {
      for (const [slot, label] of SLOTS) {
        item.appendChild(el('div', { class: 'td-slot' }, [
          el('span', { class: 'feature-unit td-slot-label', text: label }),
          keyConfigEditor(td[slot], { ...ctx, allowNone: true, onChange: (kc) => update(td.id, { [slot]: kc }) }),
        ]))
      }
    }
    panel.appendChild(item)
  }
}

  V2K.renderTapDancePanel = renderTapDancePanel;
})();

// === gui/js/combos.js ===
(function() {
  const keyConfigId = V2K.keyConfigId;
  const el = V2K.el;
  const keyConfigEditor = V2K.keyConfigEditor;
  const keyConfigLabel = V2K.keyConfigLabel;

// ============================================================
// コンボパネル
// Vial と同じく「キーコード」で構成キーを指定する。
// 出力時にそのキーコードが割り当てられた位置 (defsrc) を探して defchordsv2 にする。
// ============================================================




function renderCombosPanel(state, resolved, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project, keyLabelMode: mode } = state
  const combos = project.combos || []
  const setCombos = (list) => actions.setList('combos', list)
  const update = (id, patch) => setCombos(combos.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  const layerNames = resolved.layers.map((l) => l.name)

  // 構成キーの候補: いずれかのレイヤーで defsrc 上に存在するキー
  const candidates = new Map()
  resolved.layers.forEach((layer) => {
    for (const t of resolved.defsrc) {
      const kc = layer.keys[t]
      if (!kc || kc.type === 'transparent' || kc.type === 'disabled') continue
      const id = keyConfigId(kc)
      if (!candidates.has(id)) candidates.set(id, kc)
    }
  })

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'コンボ' }),
    el('span', { class: 'feature-panel-desc', text: `同時押しで別の動作。判定時間の既定値は COMBO_TERM (${project.qmk.comboTerm}ms)` }),
    el('button', {
      class: 'feature-add-btn',
      text: '+ コンボ追加',
      onclick: () => {
        const id = combos.length ? Math.max(...combos.map((c) => c.id)) + 1 : 0
        const first = [...candidates.values()].slice(0, 2)
        setCombos([...combos, { id, keys: first, result: { type: 'basic', kanataKey: 'esc' } }])
      },
    }),
  ]))
  if (combos.length === 0) {
    panel.appendChild(el('p', { class: 'feature-empty', text: 'コンボはありません。' }))
    return
  }

  for (const combo of combos) {
    const item = el('div', { class: 'feature-item' })
    const timeout = el('input', { type: 'number', class: 'feature-number-input', value: combo.timeout || '', placeholder: String(project.qmk.comboTerm), min: 10, max: 2000 })
    timeout.addEventListener('change', () => {
      const v = parseInt(timeout.value, 10)
      update(combo.id, { timeout: v > 0 ? v : undefined })
    })
    item.appendChild(el('div', { class: 'feature-row' }, [
      el('span', { class: 'feature-item-id', text: `C${combo.id}` }),
      el('span', { class: 'feature-unit', text: '判定時間' }),
      timeout,
      el('span', { class: 'feature-unit', text: 'ms (空欄 = COMBO_TERM)' }),
      el('button', { class: 'feature-del-btn', text: '× 削除', onclick: () => setCombos(combos.filter((c) => c.id !== combo.id)) }),
    ]))

    const keyRow = el('div', { class: 'feature-row feature-row-wrap combo-key-row' }, [el('span', { class: 'feature-unit', text: '同時押し:' })])
    combo.keys.forEach((kc, ki) => {
      const sel = el('select', { class: 'feature-key-select' })
      const curId = keyConfigId(kc)
      let found = false
      for (const [id, cand] of candidates) {
        const opt = el('option', { value: id, text: labelOf(cand, mode, layerNames) })
        if (id === curId) {
          opt.selected = true
          found = true
        }
        sel.appendChild(opt)
      }
      if (!found) {
        const opt = el('option', { value: curId, text: `${labelOf(kc, mode, layerNames)} (配置なし)` })
        opt.selected = true
        sel.appendChild(opt)
      }
      sel.addEventListener('change', () => {
        const next = candidates.get(sel.value) || kc
        update(combo.id, { keys: combo.keys.map((k, j) => (j === ki ? next : k)) })
      })
      keyRow.appendChild(sel)
      if (combo.keys.length > 2) {
        keyRow.appendChild(el('button', { class: 'feature-del-btn-sm', text: '−', onclick: () => update(combo.id, { keys: combo.keys.filter((_, j) => j !== ki) }) }))
      }
      if (ki < combo.keys.length - 1) keyRow.appendChild(el('span', { class: 'feature-operator', text: '+' }))
    })
    if (combo.keys.length < 4) {
      keyRow.appendChild(el('button', {
        class: 'feature-add-action-btn',
        text: '+キー',
        onclick: () => update(combo.id, { keys: [...combo.keys, [...candidates.values()][0] || { type: 'basic', kanataKey: 'a' }] }),
      }))
    }
    item.appendChild(keyRow)
    item.appendChild(el('div', { class: 'td-slot' }, [
      el('span', { class: 'feature-unit td-slot-label', text: '→ 出力' }),
      keyConfigEditor(combo.result, {
        mode, layerNames, macros: project.macros, tapDances: project.tapDances, userKeys: project.userKeys, compact: true,
        onChange: (kc) => update(combo.id, { result: kc || { type: 'disabled' } }),
      }),
    ]))
    panel.appendChild(item)
  }
}

function labelOf(kc, mode, layerNames) {
  const l = keyConfigLabel(kc, mode, layerNames)
  return l.sub ? `${l.main} / ${l.sub}` : l.main || '(空)'
}

  V2K.renderCombosPanel = renderCombosPanel;
})();

// === gui/js/overrides.js ===
(function() {
  const el = V2K.el;
  const keyConfigEditor = V2K.keyConfigEditor;
  const keySelect = V2K.keySelect;
  const modCheckboxes = V2K.modCheckboxes;

// ============================================================
// キーオーバーライド / Alt Repeat Key パネル
// ============================================================


function renderOverridesPanel(state, resolved, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project, keyLabelMode: mode } = state
  const list = project.keyOverrides || []
  const setList = (next) => actions.setList('keyOverrides', next)
  const update = (id, patch) => setList(list.map((k) => (k.id === id ? { ...k, ...patch } : k)))
  const layerNames = resolved.layers.map((l) => l.name)
  const ctx = { mode, layerNames, macros: project.macros, tapDances: project.tapDances, userKeys: project.userKeys, compact: true }

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'キーオーバーライド' }),
    el('span', { class: 'feature-panel-desc', text: '修飾キー + キー を別のキーに置き換え (Kanata の defoverrides)' }),
    el('button', {
      class: 'feature-add-btn',
      text: '+ 追加',
      onclick: () => {
        const id = list.length ? Math.max(...list.map((k) => k.id)) + 1 : 0
        setList([...list, { id, enabled: true, trigger: { type: 'basic', kanataKey: 'bspc' }, triggerMods: ['lsft'], replacement: { type: 'basic', kanataKey: 'del' }, layers: 0xFFFF, negativeMods: [], suppressedMods: [], oneMod: false }])
      },
    }),
  ]))
  if (list.length === 0) panel.appendChild(el('p', { class: 'feature-empty', text: 'キーオーバーライドはありません。' }))

  for (const ko of list) {
    const item = el('div', { class: `feature-item${ko.enabled === false ? ' feature-item-disabled' : ''}` })
    const enabled = el('input', { type: 'checkbox' })
    enabled.checked = ko.enabled !== false
    enabled.addEventListener('change', () => update(ko.id, { enabled: enabled.checked }))
    const oneMod = el('input', { type: 'checkbox' })
    oneMod.checked = !!ko.oneMod
    oneMod.addEventListener('change', () => update(ko.id, { oneMod: oneMod.checked }))
    item.appendChild(el('div', { class: 'feature-row' }, [
      el('span', { class: 'feature-item-id', text: `KO${ko.id}` }),
      el('label', { class: 'modifier-checkbox-label' }, [enabled, '有効']),
      el('label', { class: 'modifier-checkbox-label', title: 'いずれか 1 つの修飾キーで発動' }, [oneMod, 'どれか 1 つの修飾で発動']),
      el('button', { class: 'feature-del-btn', text: '× 削除', onclick: () => setList(list.filter((k) => k.id !== ko.id)) }),
    ]))
    const trigKey = ko.trigger?.kanataKey || ko.trigger?.baseKey || ''
    item.appendChild(el('div', { class: 'feature-row feature-row-wrap' }, [
      el('span', { class: 'feature-unit', text: 'トリガー:' }),
      modCheckboxes(ko.triggerMods, (mods) => update(ko.id, { triggerMods: mods }), { small: true }),
      el('span', { class: 'feature-operator', text: '+' }),
      keySelect(trigKey, mode, (k) => update(ko.id, { trigger: { type: 'basic', kanataKey: k } }), { className: 'feature-key-select' }),
    ]))
    item.appendChild(el('div', { class: 'td-slot' }, [
      el('span', { class: 'feature-unit td-slot-label', text: '→ 置換' }),
      keyConfigEditor(ko.replacement, { ...ctx, types: ['basic', 'modified', 'disabled'], onChange: (kc) => update(ko.id, { replacement: kc }) }),
    ]))
    const notes = []
    const allLayers = (1 << layerNames.length) - 1
    if (ko.layers !== undefined && (ko.layers & allLayers) !== allLayers) {
      notes.push(`レイヤー限定 (${layerNames.filter((_, i) => ko.layers & (1 << i)).join(', ')}) は Kanata v1.10 では再現できず全レイヤー共通になります`)
    }
    if (ko.negativeMods?.length) notes.push(`Negative mods (${ko.negativeMods.join(', ')}) は再現できません`)
    if (notes.length) item.appendChild(el('p', { class: 'editor-hint', text: `注意: ${notes.join(' / ')}` }))
    panel.appendChild(item)
  }

  // Alt Repeat Key
  const ars = project.altRepeatKeys || []
  const setArs = (next) => actions.setList('altRepeatKeys', next)
  const updateAr = (id, patch) => setArs(ars.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'Alt Repeat Key' }),
    el('span', { class: 'feature-panel-desc', text: '直前のキーに応じて QK_ALT_REPEAT_KEY の出力を変える (矢印・Home/End 等の反対方向は既定で登録済み)' }),
    el('button', {
      class: 'feature-add-btn',
      text: '+ 追加',
      onclick: () => {
        const id = ars.length ? Math.max(...ars.map((a) => a.id)) + 1 : 0
        setArs([...ars, { id, keycode: { type: 'basic', kanataKey: 'a' }, altKeycode: { type: 'basic', kanataKey: 'b' }, allowedMods: [], bidirectional: false, enabled: true }])
      },
    }),
  ]))
  for (const ar of ars) {
    const enabled = el('input', { type: 'checkbox' })
    enabled.checked = ar.enabled !== false
    enabled.addEventListener('change', () => updateAr(ar.id, { enabled: enabled.checked }))
    const bidi = el('input', { type: 'checkbox' })
    bidi.checked = !!ar.bidirectional
    bidi.addEventListener('change', () => updateAr(ar.id, { bidirectional: bidi.checked }))
    panel.appendChild(el('div', { class: 'feature-item' }, [
      el('div', { class: 'feature-row feature-row-wrap' }, [
        el('label', { class: 'modifier-checkbox-label' }, [enabled, '有効']),
        el('span', { class: 'feature-unit', text: '直前のキー' }),
        keySelect(ar.keycode?.kanataKey || ar.keycode?.baseKey || '', mode, (k) => updateAr(ar.id, { keycode: { type: 'basic', kanataKey: k } }), { className: 'feature-key-select' }),
        el('span', { class: 'feature-operator', text: '→' }),
        keySelect(ar.altKeycode?.kanataKey || ar.altKeycode?.baseKey || '', mode, (k) => updateAr(ar.id, { altKeycode: { type: 'basic', kanataKey: k } }), { className: 'feature-key-select' }),
        el('label', { class: 'modifier-checkbox-label' }, [bidi, '双方向']),
        el('button', { class: 'feature-del-btn', text: '×', onclick: () => setArs(ars.filter((a) => a.id !== ar.id)) }),
      ]),
    ]))
  }
}

  V2K.renderOverridesPanel = renderOverridesPanel;
})();

// === gui/js/settings-panel.js ===
(function() {
  const el = V2K.el;

// ============================================================
// Vial (QMK Settings) / Kanata 出力設定パネル
// ============================================================


const GROUPS = [
  ['Tap-Hold', [
    ['num', 'tappingTerm', 'Tapping Term (ms)', 'hold-time', 7],
    ['num', 'quickTapTerm', 'Quick Tap Term (ms, 空欄 = Tapping Term)', 'tap-time', 25],
    ['bool', 'permissiveHold', 'Permissive Hold', 'tap-hold-release', 22],
    ['bool', 'holdOnOtherKeyPress', 'Hold On Other Key Press', 'tap-hold-press', 23],
    ['bool', 'chordalHold', 'Chordal Hold', '同じ手のキーでタップ確定 (tap-hold-release-keys)', 26],
    ['bool', 'retroTapping', 'Retro Tapping', '再現不可', 24],
    ['num', 'flowTapTerm', 'Flow Tap (ms)', '再現不可', 27],
    ['num', 'tappingToggle', 'Tapping Toggle (TT の回数)', 'TT', 20],
  ]],
  ['Combo / One Shot', [
    ['num', 'comboTerm', 'Combo 判定時間 (ms)', 'defchordsv2', 2],
    ['num', 'oneShotTimeout', 'One Shot タイムアウト (ms, 0 = なし)', 'one-shot', 6],
  ]],
  ['Auto Shift', [
    ['bool', 'autoShift.enabled', '有効', 'tap-hold で Shift', 3],
    ['num', 'autoShift.timeout', 'タイムアウト (ms)', '', 4],
    ['bool', 'autoShift.noAlpha', '英字に適用しない', '', 3],
    ['bool', 'autoShift.noNumeric', '数字に適用しない', '', 3],
    ['bool', 'autoShift.noSpecial', '記号に適用しない', '', 3],
  ]],
  ['Grave Escape', [
    ['bool', 'graveEsc.altOverride', 'Alt 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.ctrlOverride', 'Ctrl 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.guiOverride', 'GUI 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.shiftOverride', 'Shift 押下時は常に Esc', '', 1],
  ]],
  ['Magic', [
    ['bool', 'magic.swapControlCapslock', 'Caps Lock と左 Ctrl を入れ替え', '', 21],
    ['bool', 'magic.capslockToControl', 'Caps Lock を Ctrl に', '', 21],
    ['bool', 'magic.swapLaltLgui', '左 Alt と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapRaltRgui', '右 Alt と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapLctlLgui', '左 Ctrl と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapRctlRgui', '右 Ctrl と GUI を入れ替え', '', 21],
    ['bool', 'magic.noGui', 'GUI キーを無効化', '', 21],
    ['bool', 'magic.swapGraveEsc', '` と Esc を入れ替え', '', 21],
    ['bool', 'magic.swapBackslashBackspace', '\\ と Backspace を入れ替え', '', 21],
  ]],
  ['Mouse keys', [
    ['num', 'mouse.interval', 'カーソル移動の間隔 (ms)', 'movemouse-accel', 10],
    ['num', 'mouse.moveDelta', '移動量 (px)', '', 11],
    ['num', 'mouse.maxSpeed', '最大速度 (倍率)', '', 12],
    ['num', 'mouse.timeToMax', '最大速度までの回数', '', 13],
    ['num', 'mouse.wheelInterval', 'ホイールの間隔 (ms)', 'mwheel', 15],
  ]],
]

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

function setPath(obj, path, value) {
  const keys = path.split('.')
  const out = { ...obj }
  let cur = out
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return out
}

function renderSettingsPanel(state, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project } = state
  const qmk = project.qmk
  const present = new Set(project.source?.qmkSettingsPresent || [])

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'Vial 設定 (QMK Settings)' }),
    el('span', { class: 'feature-panel-desc', text: '.vil の設定値を読み込み済み。● は .vil に含まれていた項目です' }),
  ]))

  const grid = el('div', { class: 'settings-grid' })
  for (const [title, fields] of GROUPS) {
    const box = el('div', { class: 'settings-group' }, [el('h4', { text: title })])
    for (const [type, path, label, note, qsid] of fields) {
      const value = getPath(qmk, path)
      let input
      if (type === 'bool') {
        input = el('input', { type: 'checkbox' })
        input.checked = !!value
        input.addEventListener('change', () => actions.setQmk(setPath(qmk, path, input.checked)))
      } else {
        input = el('input', { type: 'number', class: 'feature-number-input', value: value ?? '', min: 0, max: 65535 })
        input.addEventListener('change', () => {
          const v = input.value === '' ? null : parseInt(input.value, 10)
          if (v === null && path !== 'quickTapTerm') return
          actions.setQmk(setPath(qmk, path, v))
        })
      }
      box.appendChild(el('label', { class: 'settings-field', title: `qsid ${qsid}` }, [
        el('span', { class: 'settings-dot', text: present.has(qsid) ? '●' : '' }),
        input,
        el('span', { text: label }),
        note ? el('span', { class: 'settings-note', text: note }) : null,
      ]))
    }
    grid.appendChild(box)
  }
  panel.appendChild(grid)

  // Kanata 出力設定
  const k = project.kanata
  const setK = (patch) => actions.setKanata({ ...k, ...patch })
  const osSel = el('select', { class: 'editor-select' })
  for (const [v, label] of [['windows', 'Windows'], ['linux', 'Linux'], ['macos', 'macOS']]) {
    const opt = el('option', { value: v, text: label })
    if (k.os === v) opt.selected = true
    osSel.appendChild(opt)
  }
  osSel.addEventListener('change', () => setK({ os: osSel.value }))
  const textSel = el('select', { class: 'editor-select' })
  for (const [v, label] of [['jis', 'JIS: 文字どおりに入力 (OS が JIS 配列)'], ['us', 'US: Vial 本来の動作 (US キーコード)']]) {
    const opt = el('option', { value: v, text: label })
    if (k.textLayout === v) opt.selected = true
    textSel.appendChild(opt)
  }
  textSel.addEventListener('change', () => setK({ textLayout: textSel.value }))
  const unmapped = el('input', { type: 'checkbox' })
  unmapped.checked = k.processUnmappedKeys !== false
  unmapped.addEventListener('change', () => setK({ processUnmappedKeys: unmapped.checked }))
  const concurrent = el('input', { type: 'checkbox' })
  concurrent.checked = k.concurrentTapHold !== false
  concurrent.addEventListener('change', () => setK({ concurrentTapHold: concurrent.checked }))
  const rapid = el('input', { type: 'number', class: 'feature-number-input', value: k.rapidEventDelay ?? 5, min: 0, max: 100 })
  rapid.addEventListener('change', () => setK({ rapidEventDelay: parseInt(rapid.value, 10) || 0 }))

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [el('h3', { text: 'Kanata 出力設定' })]))
  panel.appendChild(el('div', { class: 'settings-group' }, [
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), osSel, el('span', { text: '出力先 OS (IME キー等の出力方法が変わります)' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), textSel, el('span', { text: 'マクロのテキスト入力' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), unmapped, el('span', { text: 'process-unmapped-keys' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), concurrent, el('span', { text: 'concurrent-tap-hold (コンボ使用時は常に有効)' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), rapid, el('span', { text: 'rapid-event-delay (ms)' })]),
  ]))
}

  V2K.renderSettingsPanel = renderSettingsPanel;
})();

// === gui/js/preview.js ===
(function() {
  const projectToKbd = V2K.projectToKbd;
  const el = V2K.el;

// ============================================================
// 出力プレビュー (.kbd と変換時の注意)
// ============================================================



function renderPreviewPanel(state, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  let result
  try {
    result = projectToKbd(state.project)
  } catch (err) {
    panel.appendChild(el('p', { class: 'feature-empty', text: `変換エラー: ${err.message}` }))
    return
  }
  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: '出力プレビュー' }),
    el('span', { class: 'feature-panel-desc', text: result.warnings.length ? `注意 ${result.warnings.length} 件` : '完全に変換できました' }),
    el('button', { class: 'feature-add-btn', text: '.kbd をダウンロード', onclick: actions.exportKbd }),
    el('button', { class: 'feature-add-btn', text: 'コピー', onclick: () => navigator.clipboard?.writeText(result.text) }),
  ]))
  if (result.warnings.length) {
    panel.appendChild(el('ul', { class: 'warning-list' }, result.warnings.map((w) => el('li', { text: w }))))
  }
  panel.appendChild(el('pre', { class: 'kbd-preview', text: result.text }))
}

  V2K.renderPreviewPanel = renderPreviewPanel;
})();

// === gui/js/app.js ===
(function() {
  const getState = V2K.getState;
  const setState = V2K.setState;
  const updateProject = V2K.updateProject;
  const subscribe = V2K.subscribe;
  const getResolved = V2K.getResolved;
  const createProject = V2K.createProject;
  const layerCount = V2K.layerCount;
  const LAYOUT_PRESETS = V2K.LAYOUT_PRESETS;
  const getPresetKeys = V2K.getPresetKeys;
  const renderKeyboard = V2K.renderKeyboard;
  const segmentColor = V2K.segmentColor;
  const keyConfigLabel = V2K.keyConfigLabel;
  const getKeyLabel = V2K.getKeyLabel;
  const renderLayers = V2K.renderLayers;
  const renderMappingPanel = V2K.renderMappingPanel;
  const renderEditor = V2K.renderEditor;
  const renderMacrosPanel = V2K.renderMacrosPanel;
  const renderTapDancePanel = V2K.renderTapDancePanel;
  const renderCombosPanel = V2K.renderCombosPanel;
  const renderOverridesPanel = V2K.renderOverridesPanel;
  const renderSettingsPanel = V2K.renderSettingsPanel;
  const renderPreviewPanel = V2K.renderPreviewPanel;
  const exportKbdFile = V2K.exportKbdFile;
  const saveProjectFile = V2K.saveProjectFile;
  const readProjectFile = V2K.readProjectFile;
  const importVilFiles = V2K.importVilFiles;
  const importExtraFiles = V2K.importExtraFiles;
  const autoSave = V2K.autoSave;
  const autoLoad = V2K.autoLoad;
  const clearAutoSave = V2K.clearAutoSave;

// ============================================================
// アプリケーション本体 (アクション・描画の統括)
// ============================================================
















// ============================================================
// アクション
// ============================================================

function hasWork(project) {
  return !!project.source || (project.edits || []).some((e) => e && Object.keys(e).length > 0)
}

const actions = {
  setView(view) {
    setState({ view, pickSegment: null, selectedSource: null })
  },

  changeTargetLayout(layoutId) {
    const s = getState()
    if (hasWork(s.project) && !confirm('ノートPC配列を変更すると、始点・個別の割り当て・手動変更したキーがリセットされます。よろしいですか？')) {
      setState({})
      return
    }
    const preset = LAYOUT_PRESETS[layoutId]
    updateProject((p) => ({
      ...p,
      target: { layoutId, keys: getPresetKeys(layoutId) },
      mapping: { starts: {}, pins: {} },
      edits: (p.edits || []).map(() => ({})),
      defsrcInclude: [],
      defsrcExclude: [],
    }))
    setState({ selectedTarget: null, keyLabelMode: preset?.keyLabelMode || getState().keyLabelMode })
  },

  importVil() {
    document.getElementById('file-input-vil').click()
  },

  importExtras() {
    document.getElementById('file-input-extras').click()
  },

  // ---- 対応付け ----
  setStart(segId, value) {
    updateProject((p) => {
      const starts = { ...(p.mapping.starts || {}) }
      if (value === undefined) delete starts[segId]
      else starts[segId] = value
      return { ...p, mapping: { ...p.mapping, starts } }
    })
  },

  startPick(segId) {
    setState({ pickSegment: segId, selectedSource: null })
  },

  // ソース s をターゲット t へ割り当て (t に別のキーがあれば入れ替え)
  pin(s, t) {
    const resolved = getResolved()
    updateProject((p) => {
      const pins = { ...(p.mapping.pins || {}) }
      if (t !== null) {
        const other = resolved.inverse[t]
        if (other !== null && other !== undefined && other !== s) pins[other] = resolved.map[s] ?? null
      }
      pins[s] = t
      return { ...p, mapping: { ...p.mapping, pins } }
    })
    setState({ selectedSource: null })
  },

  resetPins() {
    updateProject((p) => ({ ...p, mapping: { ...p.mapping, pins: {} } }))
  },

  resetMapping() {
    if (!confirm('始点の指定と個別の割り当てをすべて自動に戻しますか？')) return
    updateProject((p) => ({ ...p, mapping: { starts: {}, pins: {} } }))
  },

  // ---- レイヤー ----
  setActiveLayer(i) {
    setState({ activeLayer: i })
  },

  addLayer() {
    updateProject((p) => {
      const n = layerCount(p)
      const names = Array.from({ length: n }, (_, i) => p.layerNames?.[i] || (i === 0 ? 'base' : `layer${i}`))
      const edits = Array.from({ length: n }, (_, i) => p.edits?.[i] || {})
      return { ...p, layerNames: [...names, `layer${n}`], edits: [...edits, {}] }
    })
    setState({ activeLayer: layerCount(getState().project) - 1 })
  },

  removeLastLayer() {
    updateProject((p) => ({ ...p, layerNames: p.layerNames.slice(0, -1), edits: (p.edits || []).slice(0, p.layerNames.length - 1) }))
    setState((s) => ({ activeLayer: Math.min(s.activeLayer, layerCount(s.project) - 1) }))
  },

  renameLayer(i, name) {
    updateProject((p) => {
      const names = Array.from({ length: layerCount(p) }, (_, j) => p.layerNames?.[j] || (j === 0 ? 'base' : `layer${j}`))
      names[i] = name
      return { ...p, layerNames: names }
    })
  },

  // ---- キー編集 ----
  selectTarget(t) {
    setState((s) => ({ selectedTarget: s.selectedTarget === t ? null : t, featureTab: 'key' }))
  },

  setEdit(layer, t, kc) {
    updateProject((p) => {
      const edits = Array.from({ length: layerCount(p) }, (_, i) => ({ ...(p.edits?.[i] || {}) }))
      edits[layer][t] = kc || { type: 'disabled' }
      return { ...p, edits }
    })
  },

  clearEdit(layer, t) {
    updateProject((p) => {
      const edits = (p.edits || []).map((e) => ({ ...e }))
      if (edits[layer]) delete edits[layer][t]
      return { ...p, edits }
    })
  },

  swapKeys(layer, a, b) {
    const resolved = getResolved()
    const ka = resolved.layers[layer].keys[a]
    const kb = resolved.layers[layer].keys[b]
    updateProject((p) => {
      const edits = Array.from({ length: layerCount(p) }, (_, i) => ({ ...(p.edits?.[i] || {}) }))
      edits[layer][a] = kb
      edits[layer][b] = ka
      return { ...p, edits }
    })
  },

  toggleDefsrc(t) {
    const inDefsrc = getResolved().defsrc.includes(t)
    updateProject((p) => {
      const include = new Set(p.defsrcInclude || [])
      const exclude = new Set(p.defsrcExclude || [])
      if (inDefsrc) {
        include.delete(t)
        exclude.add(t)
      } else {
        exclude.delete(t)
        include.add(t)
      }
      return { ...p, defsrcInclude: [...include], defsrcExclude: [...exclude] }
    })
  },

  // ---- ノートPC配列の編集 ----
  updateTargetKey(t, patch) {
    updateProject((p) => ({
      ...p,
      target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: p.target.keys.map((k, i) => (i === t ? { ...k, ...patch } : k)) },
    }))
  },

  deleteTargetKey(t) {
    const shift = (i) => (i === t ? null : i > t ? i - 1 : i)
    updateProject((p) => {
      const edits = (p.edits || []).map((e) => {
        const out = {}
        for (const [k, v] of Object.entries(e || {})) {
          const n = shift(Number(k))
          if (n !== null) out[n] = v
        }
        return out
      })
      const starts = {}
      for (const [k, v] of Object.entries(p.mapping.starts || {})) {
        if (v === null) starts[k] = null
        else if (shift(v) !== null) starts[k] = shift(v)
      }
      const pins = {}
      for (const [k, v] of Object.entries(p.mapping.pins || {})) pins[k] = v === null ? null : shift(v)
      return {
        ...p,
        target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: p.target.keys.filter((_, i) => i !== t) },
        edits,
        mapping: { starts, pins },
        defsrcInclude: (p.defsrcInclude || []).map(shift).filter((v) => v !== null),
        defsrcExclude: (p.defsrcExclude || []).map(shift).filter((v) => v !== null),
      }
    })
    setState({ selectedTarget: null })
  },

  addTargetKey(kanataKey, label, width, rowY) {
    updateProject((p) => {
      const row = p.target.keys.filter((k) => Math.abs(k.y - rowY) < 0.01).sort((a, b) => a.x - b.x)
      const last = row[row.length - 1]
      const key = { x: last ? last.x + last.w : 0, y: rowY, w: width, h: last?.h || 1, kanataKey, label: label || getKeyLabel(kanataKey, getState().keyLabelMode) }
      return { ...p, target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: [...p.target.keys, key] } }
    })
  },

  // ---- 機能設定 ----
  setList(name, list) {
    updateProject((p) => ({ ...p, [name]: list }))
  },

  setQmk(qmk) {
    updateProject((p) => ({ ...p, qmk }))
  },

  setKanata(kanata) {
    updateProject((p) => ({ ...p, kanata }))
  },

  setFeatureTab(tab) {
    setState({ featureTab: tab })
  },

  // ---- ファイル ----
  exportKbd() {
    try {
      exportKbdFile(getState().project)
    } catch (err) {
      alert(`変換に失敗しました: ${err.message}`)
    }
  },

  saveProject() {
    saveProjectFile(getState().project)
  },

  newProject() {
    if (!confirm('現在の内容を破棄して新規作成しますか？')) return
    clearAutoSave()
    setState({ project: createProject({ layoutId: 'jis-laptop' }), view: 'mapping', activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, keyLabelMode: 'jis' })
  },
}

// ============================================================
// 描画
// ============================================================

let hoverSource = null
let hoverTarget = null

function segmentIndexMap(resolved) {
  const m = new Map()
  resolved.segments.forEach((seg, i) => seg.keys.forEach((s) => m.set(s, i)))
  return m
}

function renderTargetKeyboard(state, resolved) {
  const container = document.getElementById('keyboard-container')
  const { project, view, keyLabelMode: mode, activeLayer } = state
  const tk = project.target.keys
  const source = project.source
  const segIdx = segmentIndexMap(resolved)
  const layerNames = resolved.layers.map((l) => l.name)
  const defsrc = new Set(resolved.defsrc)

  renderKeyboard(container, tk, {
    render: (t) => {
      const k = tk[t]
      const classes = []
      if (k.fixed) classes.push('key-fixed')
      if (state.layoutEditMode) {
        if (state.selectedTarget === t) classes.push('key-selected')
        return { main: k.label || k.kanataKey || '', corner: k.kanataKey, classes, title: k.kanataKey }
      }
      const s = resolved.inverse[t]
      if (view === 'mapping') {
        if (s === null) {
          classes.push('key-passthrough')
          return { main: k.label || getKeyLabel(k.kanataKey, mode), classes, title: '対応付けなし (Kanata を通さずそのまま入力)' }
        }
        if (hoverSource === s) classes.push('key-hover-link')
        const label = keyConfigLabel(source.layers[0][s], mode, layerNames)
        return {
          ...label,
          classes,
          badge: s + 1,
          corner: k.label || k.kanataKey,
          style: { background: segmentColor(segIdx.get(s) ?? 0) },
          title: `ノートPC: ${k.label || k.kanataKey} ← 自作キーボード #${s + 1}`,
        }
      }
      // キーマップ表示
      const kc = resolved.layers[activeLayer].keys[t]
      const label = keyConfigLabel(kc, mode, layerNames)
      if (!defsrc.has(t)) classes.push('key-passthrough')
      if (state.selectedTarget === t) classes.push('key-selected')
      if (project.edits?.[activeLayer]?.[t]) classes.push('key-edited')
      if (hoverSource !== null && resolved.inverse[t] === hoverSource) classes.push('key-hover-link')
      return { ...label, classes, corner: k.kanataKey, title: `${k.label || k.kanataKey}${s !== null ? ` ← 自作 #${s + 1}` : ''}` }
    },
    onClick: (t, e) => {
      const s = getState()
      if (s.layoutEditMode) return actions.selectTarget(t)
      if (s.view === 'mapping') {
        if (tk[t].fixed) return
        if (s.pickSegment) {
          actions.setStart(s.pickSegment, t)
          setState({ pickSegment: null })
        } else if (s.selectedSource !== null) {
          actions.pin(s.selectedSource, t)
        } else if (resolved.inverse[t] !== null) {
          setState({ selectedSource: resolved.inverse[t] })
        }
        return
      }
      if (e.shiftKey) return actions.toggleDefsrc(t)
      actions.selectTarget(t)
    },
    onContext: (t) => {
      const s = getState()
      if (s.layoutEditMode) return actions.deleteTargetKey(t)
      if (s.view === 'mapping') {
        const src = resolved.inverse[t]
        if (src !== null) actions.pin(src, null)
        return
      }
      actions.toggleDefsrc(t)
    },
    draggable: () => !state.layoutEditMode && view === 'keymap',
    dragData: (t) => `tgt:${t}`,
    onDrop: (data, t) => {
      if (data.startsWith('src:')) actions.pin(parseInt(data.slice(4), 10), t)
      else if (data.startsWith('tgt:')) {
        const from = parseInt(data.slice(4), 10)
        if (from !== t) actions.swapKeys(getState().activeLayer, from, t)
      }
    },
    onHover: (t) => {
      hoverTarget = t
      highlightSource()
    },
  })
}

function renderSourceKeyboard(state, resolved) {
  const pane = document.getElementById('vil-keyboard-pane')
  const container = document.getElementById('vil-keyboard-container')
  const { project, view, keyLabelMode: mode, activeLayer } = state
  const source = project.source
  if (!source) {
    pane.style.display = 'none'
    container.innerHTML = ''
    return
  }
  pane.style.display = ''
  const tk = project.target.keys
  const segIdx = segmentIndexMap(resolved)
  const layerNames = resolved.layers.map((l) => l.name)
  const layer = view === 'mapping' ? 0 : Math.min(activeLayer, source.layers.length - 1)
  document.getElementById('vil-keyboard-label').textContent =
    `自作キーボード: ${source.name || ''} (レイヤー ${layer}${view === 'mapping' ? '・対応付けはベースレイヤーで表示' : ''})`

  renderKeyboard(container, source.keys, {
    render: (s) => {
      const label = keyConfigLabel(source.layers[layer][s], mode, layerNames)
      const t = resolved.map[s]
      const classes = ['vil-key']
      if (t === null) classes.push('key-unmapped')
      if (state.selectedSource === s) classes.push('key-selected')
      if (view === 'keymap' && state.selectedTarget !== null && t === state.selectedTarget) classes.push('key-hover-link')
      return {
        ...label,
        classes,
        badge: s + 1,
        corner: t !== null ? (tk[t].label || tk[t].kanataKey) : '未割当',
        style: view === 'mapping' ? { background: segmentColor(segIdx.get(s) ?? 0) } : undefined,
        title: `#${s + 1} (row ${source.keys[s].row}, col ${source.keys[s].col}) → ${t !== null ? tk[t].kanataKey : '未割当'}`,
      }
    },
    onClick: (s) => {
      const st = getState()
      if (st.view === 'mapping') {
        setState({ selectedSource: st.selectedSource === s ? null : s, pickSegment: null })
      } else if (resolved.map[s] !== null) {
        actions.selectTarget(resolved.map[s])
      }
    },
    onContext: (s) => actions.pin(s, null),
    draggable: () => true,
    dragData: (s) => `src:${s}`,
    onHover: (s) => {
      hoverSource = s
      highlightTarget()
    },
  })
}

// ホバー時の対応キー強調 (再描画なしで class を切り替える)
function highlightTarget() {
  const resolved = getResolved()
  document.querySelectorAll('#keyboard-container .key').forEach((node) => {
    const t = Number(node.dataset.index)
    node.classList.toggle('key-hover-link', hoverSource !== null && resolved.inverse[t] === hoverSource)
  })
}

function highlightSource() {
  const resolved = getResolved()
  document.querySelectorAll('#vil-keyboard-container .key').forEach((node) => {
    const s = Number(node.dataset.index)
    node.classList.toggle('key-hover-link', hoverTarget !== null && resolved.map[s] === hoverTarget)
  })
}

const FEATURE_TABS = [
  ['key', 'キー設定'],
  ['macros', 'マクロ'],
  ['tap-dance', 'タップダンス'],
  ['combos', 'コンボ'],
  ['overrides', 'オーバーライド'],
  ['settings', 'Vial設定'],
  ['preview', '出力プレビュー'],
]

function renderFeatureTabs(state) {
  const container = document.getElementById('feature-tabs')
  container.innerHTML = ''
  const p = state.project
  const counts = { macros: p.macros?.length, 'tap-dance': p.tapDances?.length, combos: p.combos?.length, overrides: (p.keyOverrides?.length || 0) + (p.altRepeatKeys?.length || 0) }
  for (const [id, label] of FEATURE_TABS) {
    const btn = document.createElement('button')
    btn.className = `feature-tab${state.featureTab === id ? ' feature-tab-active' : ''}`
    btn.textContent = label
    if (counts[id]) {
      const b = document.createElement('span')
      b.className = 'feature-tab-badge'
      b.textContent = counts[id]
      btn.appendChild(b)
    }
    btn.addEventListener('click', () => actions.setFeatureTab(id))
    container.appendChild(btn)
  }
}

function renderFeaturePanel(state, resolved) {
  const editor = document.getElementById('editor-panel')
  const feature = document.getElementById('feature-panel')
  if (state.featureTab === 'key') {
    feature.style.display = 'none'
    editor.style.display = 'block'
    renderEditor(state, resolved, actions)
    return
  }
  editor.style.display = 'none'
  feature.style.display = 'block'
  switch (state.featureTab) {
    case 'macros': return renderMacrosPanel(state, actions)
    case 'tap-dance': return renderTapDancePanel(state, resolved, actions)
    case 'combos': return renderCombosPanel(state, resolved, actions)
    case 'overrides': return renderOverridesPanel(state, resolved, actions)
    case 'settings': return renderSettingsPanel(state, actions)
    case 'preview': return renderPreviewPanel(state, actions)
    default: return undefined
  }
}

let saveTimer = null

function render(state) {
  const resolved = getResolved()
  const isMapping = state.view === 'mapping' && !state.layoutEditMode

  document.querySelectorAll('.view-tab').forEach((b) => b.classList.toggle('view-tab-active', b.dataset.view === state.view))
  document.getElementById('btn-label-us').classList.toggle('defsrc-btn-active', state.keyLabelMode === 'us')
  document.getElementById('btn-label-jis').classList.toggle('defsrc-btn-active', state.keyLabelMode === 'jis')
  document.getElementById('btn-layout-edit').classList.toggle('defsrc-btn-active', state.layoutEditMode)
  document.getElementById('layout-edit-panel').style.display = state.layoutEditMode ? 'flex' : 'none'
  document.getElementById('target-keyboard-label').textContent = state.layoutEditMode
    ? 'ノートPC配列の編集 (クリック: 編集 / 右クリック: 削除)'
    : `ノートPC: ${LAYOUT_PRESETS[state.project.target.layoutId]?.name || state.project.target.layoutId}${isMapping ? '' : ` — レイヤー ${state.activeLayer}: ${resolved.layers[state.activeLayer]?.name || ''}`}`
  document.getElementById('status-summary').textContent = summary(state, resolved)
  const hint = document.getElementById('defsrc-hint')
  hint.innerHTML = isMapping
    ? '自作キーをクリック → ノートPCのキーをクリックで割り当て<br>ドラッグ&ドロップも可 / 右クリックで解除'
    : state.layoutEditMode
      ? 'クリック: キー名を編集<br>右クリック: キーを削除'
      : 'クリック: キー設定<br>Shift+クリック / 右クリック: リマップ対象の切替<br>ドラッグ&ドロップ: キー入れ替え'

  const rowSelect = document.getElementById('new-key-row')
  if (state.layoutEditMode && rowSelect) {
    const prev = rowSelect.value
    rowSelect.innerHTML = ''
    const rows = [...new Set(state.project.target.keys.map((k) => k.y))].sort((a, b) => a - b)
    rows.forEach((y, i) => rowSelect.appendChild(Object.assign(document.createElement('option'), { value: y, textContent: `${i + 1} 段目` })))
    if (prev) rowSelect.value = prev
  }

  renderTargetKeyboard(state, resolved)
  renderSourceKeyboard(state, resolved)

  document.getElementById('mapping-panel').style.display = isMapping ? '' : 'none'
  document.getElementById('keymap-area').style.display = isMapping ? 'none' : ''
  if (isMapping) {
    renderMappingPanel(state, resolved, actions)
  } else {
    renderLayers(state, resolved, actions)
    renderFeatureTabs(state)
    renderFeaturePanel(state, resolved)
  }

  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => autoSave(getState().project), 400)
}

function summary(state, resolved) {
  const p = state.project
  if (!p.source) return '.vil 未読み込み'
  const mapped = resolved.map.filter((t) => t !== null).length
  return `${p.source.name || '自作キーボード'}: ${mapped}/${p.source.keys.length} キー割り当て済み / ${resolved.layers.length} レイヤー`
}

// ============================================================
// 初期化
// ============================================================

async function handleFiles(input, fn) {
  const files = [...input.files]
  input.value = ''
  if (files.length === 0) return
  try {
    const next = await fn(getState().project, files)
    const warnings = next.source?.warnings || []
    setState({ project: next, activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, view: 'mapping' })
    if (warnings.length) console.warn('読み込み時の注意:\n' + warnings.join('\n'))
  } catch (err) {
    alert(err.message)
  }
}

function initApp() {
  document.querySelectorAll('.view-tab').forEach((b) => b.addEventListener('click', () => actions.setView(b.dataset.view)))
  document.getElementById('btn-export-kbd').addEventListener('click', actions.exportKbd)
  document.getElementById('btn-save-project').addEventListener('click', actions.saveProject)
  document.getElementById('btn-new-project').addEventListener('click', actions.newProject)
  document.getElementById('btn-load-project').addEventListener('click', () => document.getElementById('file-input-project').click())
  document.getElementById('btn-import-vil').addEventListener('click', actions.importVil)
  document.getElementById('file-input-vil').addEventListener('change', (e) => handleFiles(e.target, importVilFiles))
  document.getElementById('file-input-extras').addEventListener('change', (e) => handleFiles(e.target, importExtraFiles))
  document.getElementById('file-input-project').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const project = await readProjectFile(file)
      setState({ project, activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, keyLabelMode: LAYOUT_PRESETS[project.target.layoutId]?.keyLabelMode || getState().keyLabelMode })
    } catch (err) {
      alert(`プロジェクトの読み込みに失敗しました: ${err.message}`)
    }
  })
  document.getElementById('btn-label-us').addEventListener('click', () => setState({ keyLabelMode: 'us' }))
  document.getElementById('btn-label-jis').addEventListener('click', () => setState({ keyLabelMode: 'jis' }))
  document.getElementById('btn-layout-edit').addEventListener('click', () => setState((s) => ({ layoutEditMode: !s.layoutEditMode, selectedTarget: null, view: s.layoutEditMode ? s.view : 'keymap', featureTab: 'key' })))
  document.getElementById('btn-add-layout-key').addEventListener('click', () => {
    const kanataKey = document.getElementById('new-key-kanata').value.trim()
    const label = document.getElementById('new-key-label').value.trim()
    const width = parseFloat(document.getElementById('new-key-width').value) || 1
    const rowY = parseFloat(document.getElementById('new-key-row').value)
    if (!kanataKey || Number.isNaN(rowY)) return
    actions.addTargetKey(kanataKey, label, width, rowY)
    document.getElementById('new-key-kanata').value = ''
    document.getElementById('new-key-label').value = ''
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setState({ selectedSource: null, pickSegment: null, selectedTarget: null })
  })

  window.addEventListener('pagehide', () => autoSave(getState().project))
  subscribe(render)
  const restored = autoLoad()
  if (restored) {
    setState({ project: restored, keyLabelMode: LAYOUT_PRESETS[restored.target.layoutId]?.keyLabelMode || 'jis' })
  } else {
    render(getState())
  }
}

document.addEventListener('DOMContentLoaded', initApp)

  V2K.actions = actions;
})();

})();
