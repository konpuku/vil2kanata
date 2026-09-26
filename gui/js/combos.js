// ============================================================
// コンボパネル
// Vial と同じく「キーコード」で構成キーを指定する。
// 出力時にそのキーコードが割り当てられた位置 (defsrc) を探して defchordsv2 にする。
// ============================================================

import { keyConfigId } from '../../src/core/qmk.mjs'
import { el, keyConfigEditor } from './pickers.js'
import { keyConfigLabel } from './labels.js'

export function renderCombosPanel(state, resolved, actions) {
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
