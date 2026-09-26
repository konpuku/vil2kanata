// ============================================================
// 出力プレビュー (.kbd と変換時の注意)
// ============================================================

import { projectToKbd } from '../../src/core/project.mjs'
import { el } from './pickers.js'

export function renderPreviewPanel(state, actions) {
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
