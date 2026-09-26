// ============================================================
// レイヤータブ
// ============================================================

import { el } from './pickers.js'

export function renderLayers(state, resolved, actions) {
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
