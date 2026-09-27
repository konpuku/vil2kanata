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

import { MODIFIER_KEYS } from './keycodes.mjs'
import { keyConfigId, modsToPrefix, sortMods, splitChord } from './qmk.mjs'
import { completeQmkSettings, tapHoldActionFor } from './settings.mjs'
import { textToKeys } from './text.mjs'
import { winProblemKey } from './windows.mjs'

export const KANATA_DEFAULTS = {
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

export function emitKanata(projectIn) {
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

  // Windows の JIS IME キー (英数・カタカナ/ひらがな) は「離した」イベントが届かない (windows.mjs 参照)
  if (os === 'windows') {
    for (const pos of defsrcIdx) {
      const tk = targetKeys[pos]
      const info = winProblemKey(tk)
      if (!info) continue
      const used = layers.some((l) => {
        const kc = l.keys?.[pos]
        return kc && kc.type !== 'transparent' && kc.type !== 'disabled'
      })
      if (used) {
        warn(`${info.name}キー: Windows の JIS 配列ではこのキーを離したイベントが Kanata に届かず${tk.kanataKey === 'kana' ? '、キー名も一致しない' : ''}ため正しく動作しません。レジストリで ${info.name}キーを ${info.replacement.toUpperCase()} に置き換え、ノートPC配列でこのキーを ${info.replacement} にしてください (GUI のキー設定、または README 参照)`)
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
