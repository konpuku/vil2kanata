// ============================================================
// コンボ管理パネル
// ============================================================

import { getKeyLabel, getModifiedKeyLabel, getAllBasicKeys } from './converter.js'

let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

// baseレイヤーのキー割当からセレクト用リストを生成
function getBaseLayerKeys(state, keyLabelMode) {
  const { physicalLayout, layers, defsrcKeys } = state
  if (!physicalLayout || !layers || layers.length === 0) return []

  const baseKeys = layers[0].keys || []
  const seen = new Set()
  const result = []

  for (let i = 0; i < physicalLayout.length; i++) {
    // defsrcに含まれるキーのみ
    if (defsrcKeys && defsrcKeys.size > 0 && !defsrcKeys.has(i)) continue

    const layerKey = baseKeys[i]
    if (!layerKey || layerKey.type === 'disabled' || layerKey.type === 'transparent') continue

    const kanataKey = layerKey.kanataKey
    if (!kanataKey || kanataKey === '_' || kanataKey === 'XX' || seen.has(kanataKey)) continue
    seen.add(kanataKey)

    let label
    if (layerKey.type === 'modified') {
      label = getModifiedKeyLabel(kanataKey, keyLabelMode)
    } else {
      label = getKeyLabel(kanataKey, keyLabelMode)
    }

    result.push({ kanataKey, label })
  }

  return result
}

function createBaseKeySelect(currentValue, baseLayerKeys) {
  const select = document.createElement('select')
  select.className = 'feature-key-select'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー選択 --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of baseLayerKeys) {
    const opt = document.createElement('option')
    opt.value = key.kanataKey
    opt.textContent = `${key.label} (${key.kanataKey})`
    if (key.kanataKey === currentValue) opt.selected = true
    select.appendChild(opt)
  }

  return select
}

function createResultKeySelect(currentValue) {
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

export function renderCombosPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'コンボ管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = '同時押しで別のキーを発動'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ コンボ追加'
  addBtn.addEventListener('click', () => callbacks.onAddCombo())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const combos = state.combos || []
  if (combos.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'コンボがありません。同時押しでキーを発動させるコンボを追加してください。'
    panel.appendChild(empty)
    return
  }

  // baseレイヤーキーリストをトリガー用に生成
  const baseLayerKeys = getBaseLayerKeys(state, state.keyLabelMode)

  for (const combo of combos) {
    if (!combo || combo.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行: ID + タイムアウト + 削除ボタン
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `C${combo.id}`
    headerRow.appendChild(idLabel)

    const timeoutLabel = document.createElement('span')
    timeoutLabel.className = 'feature-unit'
    timeoutLabel.textContent = '判定時間:'
    headerRow.appendChild(timeoutLabel)

    const timeoutInput = document.createElement('input')
    timeoutInput.type = 'number'
    timeoutInput.className = 'feature-number-input'
    timeoutInput.value = combo.timeout || 200
    timeoutInput.min = 10
    timeoutInput.max = 2000
    timeoutInput.title = 'タイムアウト (ms)'
    timeoutInput.addEventListener('change', () => {
      const val = parseInt(timeoutInput.value, 10)
      if (!isNaN(val) && val >= 10) callbacks.onUpdateCombo(combo.id, { timeout: val })
    })
    headerRow.appendChild(timeoutInput)

    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    headerRow.appendChild(msLabel)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = '× 削除'
    delBtn.title = '削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveCombo(combo.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    // キー行: トリガーキー群 → 出力キー
    const keyRow = document.createElement('div')
    keyRow.className = 'feature-row feature-row-wrap combo-key-row'

    const triggerLabel = document.createElement('span')
    triggerLabel.className = 'feature-unit'
    triggerLabel.textContent = '同時押し:'
    keyRow.appendChild(triggerLabel)

    // トリガーキーのセレクト群（可変）
    const currentKeys = combo.keys || ['', '']
    const keySelects = []

    function renderKeySelects() {
      // 既存のセレクトとボタンを削除
      while (keyRow.children.length > 1) keyRow.removeChild(keyRow.lastChild)
      keySelects.length = 0

      for (let ki = 0; ki < currentKeys.length; ki++) {
        const kSel = createBaseKeySelect(currentKeys[ki] || '', baseLayerKeys)
        kSel.title = `トリガーキー${ki + 1}`
        const kiCopy = ki
        kSel.addEventListener('change', () => {
          const newKeys = [...currentKeys]
          newKeys[kiCopy] = kSel.value
          callbacks.onUpdateCombo(combo.id, { keys: newKeys })
        })
        keyRow.appendChild(kSel)
        keySelects.push(kSel)

        if (ki < currentKeys.length - 1) {
          const plus = document.createElement('span')
          plus.className = 'feature-operator'
          plus.textContent = '+'
          keyRow.appendChild(plus)
        }
      }

      // キー追加ボタン（最大4キー）
      if (currentKeys.length < 4) {
        const addKeyBtn = document.createElement('button')
        addKeyBtn.className = 'feature-add-action-btn'
        addKeyBtn.textContent = '+ キー'
        addKeyBtn.title = 'トリガーキーを追加（最大4個）'
        addKeyBtn.addEventListener('click', () => {
          currentKeys.push('')
          callbacks.onUpdateCombo(combo.id, { keys: [...currentKeys] })
          renderKeySelects()
        })
        keyRow.appendChild(addKeyBtn)
      }

      // キー削除ボタン（最低2キー）
      if (currentKeys.length > 2) {
        const removeKeyBtn = document.createElement('button')
        removeKeyBtn.className = 'feature-del-btn feature-del-btn-sm'
        removeKeyBtn.textContent = '- キー'
        removeKeyBtn.title = '最後のトリガーキーを削除'
        removeKeyBtn.addEventListener('click', () => {
          currentKeys.pop()
          callbacks.onUpdateCombo(combo.id, { keys: [...currentKeys] })
          renderKeySelects()
        })
        keyRow.appendChild(removeKeyBtn)
      }
    }

    renderKeySelects()
    item.appendChild(keyRow)

    // 出力キー行（結果は任意のキーを選べる）
    const resultRow = document.createElement('div')
    resultRow.className = 'feature-row'

    const arrowLabel = document.createElement('span')
    arrowLabel.className = 'feature-unit'
    arrowLabel.textContent = '→ 出力:'
    resultRow.appendChild(arrowLabel)

    const resultSelect = createResultKeySelect(combo.result || '')
    resultSelect.title = '出力キー'
    resultSelect.addEventListener('change', () => {
      callbacks.onUpdateCombo(combo.id, { result: resultSelect.value })
    })
    resultRow.appendChild(resultSelect)

    item.appendChild(resultRow)
    panel.appendChild(item)
  }
}
