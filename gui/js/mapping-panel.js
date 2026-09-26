// ============================================================
// 対応付けウィザード (始点のヒアリング → 自動割り当て → 微調整)
// ============================================================

import { getLayoutPresets } from '../../src/core/layouts.mjs'
import { groupRows } from '../../src/core/mapping.mjs'
import { el } from './pickers.js'
import { keyConfigLabel } from './labels.js'
import { segmentColor } from './keyboard.js'

const METHOD_LABELS = {
  user: ['指定', 'badge-user'],
  auto: ['自動 (キー名一致)', 'badge-auto'],
  inferred: ['推定 (近くの行から)', 'badge-inferred'],
  skip: ['割り当てない', 'badge-skip'],
  none: ['未割当', 'badge-none'],
}

export function renderMappingPanel(state, resolved, actions) {
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
