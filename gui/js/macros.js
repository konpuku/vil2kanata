// ============================================================
// マクロ管理パネル
// ============================================================

import { getAllBasicKeys } from './converter.js'

let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

function createKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select feature-key-select-sm'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー --'
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

function renderActionItem(action, macroId, actionIndex, callbacks) {
  const item = document.createElement('div')
  item.className = 'macro-action-item'

  // アクション種別セレクト
  const typeSelect = document.createElement('select')
  typeSelect.className = 'feature-key-select feature-key-select-sm'
  for (const [val, label] of [['tap', 'キー'], ['text', 'テキスト'], ['delay', '待機']]) {
    const opt = document.createElement('option')
    opt.value = val
    opt.textContent = label
    if (action.type === val) opt.selected = true
    typeSelect.appendChild(opt)
  }
  typeSelect.addEventListener('change', () => {
    let newAction
    if (typeSelect.value === 'tap') newAction = { type: 'tap', key: '' }
    else if (typeSelect.value === 'text') newAction = { type: 'text', text: '' }
    else newAction = { type: 'delay', duration: 50 }
    callbacks.onUpdateMacroAction(macroId, actionIndex, newAction)
  })
  item.appendChild(typeSelect)

  if (action.type === 'tap') {
    const keySelect = createKeySelect(action.key || '')
    keySelect.addEventListener('change', () => {
      callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, key: keySelect.value })
    })
    item.appendChild(keySelect)
  } else if (action.type === 'text') {
    const textInput = document.createElement('input')
    textInput.type = 'text'
    textInput.className = 'feature-text-input'
    textInput.value = action.text || ''
    textInput.placeholder = '入力テキスト'
    textInput.addEventListener('change', () => {
      callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, text: textInput.value })
    })
    item.appendChild(textInput)
  } else if (action.type === 'delay') {
    const durInput = document.createElement('input')
    durInput.type = 'number'
    durInput.className = 'feature-number-input'
    durInput.value = action.duration || 50
    durInput.min = 1
    durInput.max = 5000
    durInput.title = '待機時間 (ms)'
    durInput.addEventListener('change', () => {
      const val = parseInt(durInput.value, 10)
      if (!isNaN(val) && val > 0) {
        callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, duration: val })
      }
    })
    item.appendChild(durInput)
    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    item.appendChild(msLabel)
  }

  const delBtn = document.createElement('button')
  delBtn.className = 'feature-del-btn feature-del-btn-sm'
  delBtn.textContent = '×'
  delBtn.title = 'アクション削除'
  delBtn.addEventListener('click', () => callbacks.onRemoveMacroAction(macroId, actionIndex))
  item.appendChild(delBtn)

  return item
}

export function renderMacrosPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'マクロ管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = 'キーシーケンスを自動実行'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ マクロ追加'
  addBtn.addEventListener('click', () => callbacks.onAddMacro())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const macros = state.macros || []
  if (macros.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'マクロがありません。キーシーケンスを自動実行するマクロを追加してください。'
    panel.appendChild(empty)
    return
  }

  for (const macro of macros) {
    if (!macro || macro.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行: ID + ラベル + アクション追加ボタン + 削除
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `M${macro.id}`
    headerRow.appendChild(idLabel)

    // 名前フィールド
    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.className = 'feature-text-input macro-name-input'
    nameInput.value = macro.label || ''
    nameInput.placeholder = '名前（任意）'
    nameInput.title = 'マクロの名前（表示用）'
    nameInput.addEventListener('change', () => {
      callbacks.onUpdateMacro(macro.id, { label: nameInput.value })
    })
    headerRow.appendChild(nameInput)

    const addActionTap = document.createElement('button')
    addActionTap.className = 'feature-add-action-btn'
    addActionTap.textContent = '+ キー'
    addActionTap.title = 'キー入力アクション追加'
    addActionTap.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'tap'))
    headerRow.appendChild(addActionTap)

    const addActionText = document.createElement('button')
    addActionText.className = 'feature-add-action-btn'
    addActionText.textContent = '+ テキスト'
    addActionText.title = 'テキスト入力アクション追加'
    addActionText.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'text'))
    headerRow.appendChild(addActionText)

    const addActionDelay = document.createElement('button')
    addActionDelay.className = 'feature-add-action-btn'
    addActionDelay.textContent = '+ 待機'
    addActionDelay.title = '待機アクション追加'
    addActionDelay.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'delay'))
    headerRow.appendChild(addActionDelay)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = 'マクロ削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveMacro(macro.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    const actionList = document.createElement('div')
    actionList.className = 'macro-action-list'

    const actions = macro.actions || []
    if (actions.length === 0) {
      const hint = document.createElement('span')
      hint.className = 'feature-hint'
      hint.textContent = 'アクションを追加してください（キー / テキスト / 待機）'
      actionList.appendChild(hint)
    } else {
      for (let i = 0; i < actions.length; i++) {
        actionList.appendChild(renderActionItem(actions[i], macro.id, i, callbacks))
      }
    }

    item.appendChild(actionList)
    panel.appendChild(item)
  }
}
