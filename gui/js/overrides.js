// ============================================================
// キーオーバーライド / Alt Repeat Key パネル
// ============================================================

import { el, keyConfigEditor, keySelect, modCheckboxes } from './pickers.js'

export function renderOverridesPanel(state, resolved, actions) {
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
