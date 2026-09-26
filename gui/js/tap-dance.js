// ============================================================
// タップダンスパネル (Vial 形式: タップ / ホールド / ダブルタップ / タップ後ホールド + Tapping term)
// ============================================================

import { el, keyConfigEditor } from './pickers.js'

const SLOTS = [
  ['onTap', 'タップ'],
  ['onHold', 'ホールド'],
  ['onDoubleTap', 'ダブルタップ'],
  ['onTapHold', 'タップ後ホールド'],
]

export function renderTapDancePanel(state, resolved, actions) {
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
