// ============================================================
// キー表示ラベル
// ============================================================

import { splitChord } from '../../src/core/qmk.mjs'
import { SPECIAL_LABELS } from '../../src/core/keycodes.mjs'

export const KEY_LABELS = {
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
export const KEY_LABELS_JIS = {
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

export function getKeyLabel(kanataKey, mode = 'us') {
  if (!kanataKey) return ''
  if (mode === 'jis' && KEY_LABELS_JIS[kanataKey]) return KEY_LABELS_JIS[kanataKey]
  if (KEY_LABELS[kanataKey] !== undefined) return KEY_LABELS[kanataKey]
  if (kanataKey.length === 1) return kanataKey.toUpperCase()
  if (/^f\d+$/.test(kanataKey)) return kanataKey.toUpperCase()
  return kanataKey
}

export function getChordLabel(kanataKey, mode = 'us') {
  const { mods, baseKey } = splitChord(kanataKey)
  if (mods.length === 1 && mods[0] === 'lsft') {
    const map = mode === 'jis' ? SHIFTED_JIS : SHIFTED_US
    if (map[baseKey]) return map[baseKey]
  }
  const prefix = mods.map((m) => ({ lctl: 'C', lsft: 'S', lalt: 'A', lmet: 'W', rctl: 'RC', rsft: 'RS', ralt: 'RA', rmet: 'RW' }[m])).join('')
  return `${prefix}(${getKeyLabel(baseKey, mode)})`
}

const MOD_SHORT = { lctl: 'Ctl', lsft: 'Sft', lalt: 'Alt', lmet: 'Win', rctl: 'RCtl', rsft: 'RSft', ralt: 'RAlt', rmet: 'RWin' }

export function modsLabel(mods) {
  return (mods || []).map((m) => MOD_SHORT[m] || m).join('+')
}

/**
 * keyConfig → { main, sub, kind } (キーボード表示用)
 * kind は CSS の色分けに使用
 */
export function keyConfigLabel(kc, mode = 'us', layerNames = []) {
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
