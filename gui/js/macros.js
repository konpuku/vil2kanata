// ============================================================
// マクロパネル (Vial と同じ tap / down / up / text / delay アクション)
// ============================================================

import { makeModified, splitChord } from '../../src/core/qmk.mjs'
import { el, keySelect, modCheckboxes } from './pickers.js'

const ACTION_TYPES = [
  ['tap', 'タップ'],
  ['down', '押す (down)'],
  ['up', '離す (up)'],
  ['text', 'テキスト'],
  ['delay', '待機 (ms)'],
]

export function renderMacrosPanel(state, actions) {
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
