// ============================================================
// タップダンス管理パネル
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

function renderTdActionItem(action, tdId, actionIndex, callbacks) {
  const item = document.createElement('div')
  item.className = 'macro-action-item'

  const indexLabel = document.createElement('span')
  indexLabel.className = 'feature-item-id'
  indexLabel.textContent = `${actionIndex + 1}回`
  indexLabel.title = `${actionIndex + 1}回タップ時のアクション`
  item.appendChild(indexLabel)

  const keySelect = createKeySelect(action.kanataKey || '')
  keySelect.addEventListener('change', () => {
    const kanata = keySelect.value
    const label = kanata ? kanata.toUpperCase() : ''
    callbacks.onUpdateTapDanceAction(tdId, actionIndex, {
      type: 'basic',
      kanataKey: kanata,
      label,
    })
  })
  item.appendChild(keySelect)

  const delBtn = document.createElement('button')
  delBtn.className = 'feature-del-btn feature-del-btn-sm'
  delBtn.textContent = '×'
  delBtn.title = 'アクション削除'
  delBtn.addEventListener('click', () => callbacks.onRemoveTapDanceAction(tdId, actionIndex))
  item.appendChild(delBtn)

  return item
}

export function renderTapDancePanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'タップダンス管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = 'タップ回数に応じて異なるキーを出力'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ タップダンス追加'
  addBtn.addEventListener('click', () => callbacks.onAddTapDance())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const tapDancesGui = state.tapDancesGui || []
  if (tapDancesGui.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'タップダンスがありません。タップ回数に応じた動作を設定してください。'
    panel.appendChild(empty)
    return
  }

  for (const td of tapDancesGui) {
    if (!td || td.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `TD${td.id}`
    headerRow.appendChild(idLabel)

    // タイムアウト
    const timeoutLabel = document.createElement('label')
    timeoutLabel.className = 'feature-inline-label'
    timeoutLabel.textContent = 'Timeout:'
    headerRow.appendChild(timeoutLabel)

    const timeoutInput = document.createElement('input')
    timeoutInput.type = 'number'
    timeoutInput.className = 'feature-number-input'
    timeoutInput.value = td.timeout || 200
    timeoutInput.min = 50
    timeoutInput.max = 2000
    timeoutInput.step = 10
    timeoutInput.title = 'タップダンスのタイムアウト (ms)'
    timeoutInput.addEventListener('change', () => {
      const val = parseInt(timeoutInput.value, 10)
      if (!isNaN(val) && val > 0) {
        callbacks.onUpdateTapDance(td.id, { timeout: val })
      }
    })
    headerRow.appendChild(timeoutInput)

    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    headerRow.appendChild(msLabel)

    // アクション追加ボタン
    const addActionBtn = document.createElement('button')
    addActionBtn.className = 'feature-add-action-btn'
    addActionBtn.textContent = '+ アクション'
    addActionBtn.title = 'タップアクション追加'
    addActionBtn.addEventListener('click', () => callbacks.onAddTapDanceAction(td.id))
    headerRow.appendChild(addActionBtn)

    // 削除ボタン
    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = 'TD削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveTapDance(td.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    // アクションリスト
    const actionList = document.createElement('div')
    actionList.className = 'macro-action-list'

    const actions = td.actions || []
    if (actions.length === 0) {
      const hint = document.createElement('span')
      hint.className = 'feature-hint'
      hint.textContent = 'アクションを追加してください（1回タップ, 2回タップ, ...）'
      actionList.appendChild(hint)
    } else {
      for (let i = 0; i < actions.length; i++) {
        actionList.appendChild(renderTdActionItem(actions[i], td.id, i, callbacks))
      }
    }

    item.appendChild(actionList)
    panel.appendChild(item)
  }
}
