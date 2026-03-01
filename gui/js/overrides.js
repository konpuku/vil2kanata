// ============================================================
// キーオーバーライド管理パネル
// ============================================================

import { getAllBasicKeys } from './converter.js'

let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

function createKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー選択 --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of getBasicKeys()) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }
  return select
}

const MOD_DEFS = [
  { value: 'lsft', label: 'LShift' },
  { value: 'rsft', label: 'RShift' },
  { value: 'lctl', label: 'LCtrl' },
  { value: 'rctl', label: 'RCtrl' },
  { value: 'lalt', label: 'LAlt' },
  { value: 'ralt', label: 'RAlt' },
  { value: 'lmet', label: 'LWin' },
  { value: 'rmet', label: 'RWin' },
]

function createModCheckboxes(currentMods, onChange) {
  const row = document.createElement('div')
  row.className = 'modifier-checkbox-row modifier-checkbox-row-sm'

  let mods = [...(currentMods || [])]

  for (const mod of MOD_DEFS) {
    const cbLabel = document.createElement('label')
    cbLabel.className = 'modifier-checkbox-label modifier-checkbox-label-sm'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = mods.includes(mod.value)
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!mods.includes(mod.value)) mods.push(mod.value)
      } else {
        mods = mods.filter((m) => m !== mod.value)
      }
      onChange([...mods])
    })
    cbLabel.appendChild(cb)
    cbLabel.appendChild(document.createTextNode(mod.label))
    row.appendChild(cbLabel)
  }
  return row
}

export function renderOverridesPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'キーオーバーライド管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = '修飾キー+キーの組み合わせを別のキーに置き換え'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ オーバーライド追加'
  addBtn.addEventListener('click', () => callbacks.onAddOverride())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const overrides = state.keyOverrides || []
  if (overrides.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'キーオーバーライドがありません。修飾キー+キーの組み合わせを別のキーに置き換えます。'
    panel.appendChild(empty)
    return
  }

  for (const ko of overrides) {
    if (!ko || ko.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    const row = document.createElement('div')
    row.className = 'feature-row feature-row-wrap'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `O${ko.id}`
    row.appendChild(idLabel)

    const triggerLabel = document.createElement('span')
    triggerLabel.className = 'feature-unit'
    triggerLabel.textContent = '入力:'
    row.appendChild(triggerLabel)

    // トリガー修飾キーチェックボックス
    const triggerModBoxes = createModCheckboxes(ko.triggerMods || [], (newMods) => {
      callbacks.onUpdateOverride(ko.id, { triggerMods: newMods })
    })
    row.appendChild(triggerModBoxes)

    // トリガーキー
    const triggerSelect = createKeySelect(ko.trigger || '')
    triggerSelect.title = 'トリガーキー'
    triggerSelect.addEventListener('change', () => {
      callbacks.onUpdateOverride(ko.id, { trigger: triggerSelect.value })
    })
    row.appendChild(triggerSelect)

    const arrow = document.createElement('span')
    arrow.className = 'feature-operator'
    arrow.textContent = '→'
    row.appendChild(arrow)

    const replLabel = document.createElement('span')
    replLabel.className = 'feature-unit'
    replLabel.textContent = '出力:'
    row.appendChild(replLabel)

    // 置き換え修飾キーチェックボックス
    const replModBoxes = createModCheckboxes(ko.replacementMods || [], (newMods) => {
      callbacks.onUpdateOverride(ko.id, { replacementMods: newMods })
    })
    row.appendChild(replModBoxes)

    // 置き換えキー
    const replSelect = createKeySelect(ko.replacementKey || '')
    replSelect.title = '置き換えキー'
    replSelect.addEventListener('change', () => {
      callbacks.onUpdateOverride(ko.id, { replacementKey: replSelect.value })
    })
    row.appendChild(replSelect)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = '×'
    delBtn.title = '削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveOverride(ko.id))
    row.appendChild(delBtn)

    item.appendChild(row)
    panel.appendChild(item)
  }
}
