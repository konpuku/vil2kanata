// ============================================================
// 共通 UI 部品 (キー選択・修飾キー選択・キー設定エディタ)
// ============================================================

import { makeBasic, makeModified, splitChord, sortMods } from '../../src/core/qmk.mjs'
import { SPECIAL_LABELS, SUPPORTED_SPECIALS } from '../../src/core/keycodes.mjs'
import { getKeyLabel } from './labels.js'

export function el(tag, attrs = {}, children = []) {
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
export const KEY_CATALOG = [
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

export const ALL_MODS = [
  ['lctl', 'LCtrl'], ['lsft', 'LShift'], ['lalt', 'LAlt'], ['lmet', 'LWin'],
  ['rctl', 'RCtrl'], ['rsft', 'RShift'], ['ralt', 'RAlt'], ['rmet', 'RWin'],
]

/**
 * 基本キーの <select>
 */
export function keySelect(value, mode, onChange, { allowEmpty = false, className = 'editor-select' } = {}) {
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
export function keyGrid(value, mode, onPick) {
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
export function modCheckboxes(mods, onChange, { small = false } = {}) {
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

export const KEY_TYPES = [
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

export function defaultKeyConfig(type) {
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
export function keyConfigEditor(kc, ctx) {
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

export function section(label, content) {
  return el('div', { class: 'editor-section' }, [el('label', { text: label }), content])
}
