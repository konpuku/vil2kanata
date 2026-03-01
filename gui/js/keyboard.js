// ============================================================
// キーボードレンダリング・インタラクション
// ============================================================

import { getKeyLabel, getModifiedKeyLabel } from './converter.js'

const KEY_UNIT = 54
const KEY_GAP = 4
const KEY_PADDING = 8

let onSelectKeyCallback = null
let onToggleDefsrcCallback = null
let onDeleteLayoutKeyCallback = null
let onSwapKeysCallback = null
let onDropVilKeyCallback = null

export function setSelectKeyCallback(cb) {
  onSelectKeyCallback = cb
}

export function setToggleDefsrcCallback(cb) {
  onToggleDefsrcCallback = cb
}

export function setDeleteLayoutKeyCallback(cb) {
  onDeleteLayoutKeyCallback = cb
}

export function setSwapKeysCallback(cb) {
  onSwapKeysCallback = cb
}

export function setDropVilKeyCallback(cb) {
  onDropVilKeyCallback = cb
}

export function renderKeyboard(state) {
  const container = document.getElementById('keyboard-container')
  if (!container) return

  container.innerHTML = ''

  const { physicalLayout, layers, activeLayer, selectedKey, defsrcKeys, vilKeyCount, layoutEditMode, keyLabelMode } = state
  if (!physicalLayout || physicalLayout.length === 0) return

  const currentLayerKeys = layers[activeLayer]?.keys || []

  // defsrcキーの選択順序マップ（インデックス → 0始まりの順序）
  // .vilインポート済みの場合のみ番号を表示
  const showDefsrcNum = vilKeyCount !== null
  const defsrcOrder = new Map()
  if (showDefsrcNum && defsrcKeys) {
    let order = 0
    for (const idx of [...defsrcKeys].sort((a, b) => a - b)) {
      defsrcOrder.set(idx, order++)
    }
  }

  let maxX = 0
  let maxY = 0
  for (const key of physicalLayout) {
    const right = (key.x + key.w) * KEY_UNIT + KEY_GAP
    const bottom = (key.y + key.h) * KEY_UNIT + KEY_GAP
    if (right > maxX) maxX = right
    if (bottom > maxY) maxY = bottom
  }

  const keyboard = document.createElement('div')
  keyboard.className = 'keyboard'
  keyboard.style.width = `${maxX + KEY_PADDING}px`
  keyboard.style.height = `${maxY + KEY_PADDING}px`
  keyboard.style.position = 'relative'

  for (let i = 0; i < physicalLayout.length; i++) {
    const physKey = physicalLayout[i]
    const layerKey = currentLayerKeys[i]
    const isSelected = i === selectedKey
    const isInDefsrc = !defsrcKeys || defsrcKeys.size === 0 || defsrcKeys.has(i)
    const defsrcNum = showDefsrcNum ? defsrcOrder.get(i) : undefined

    const keyEl = createKeyElement(physKey, layerKey, i, isSelected, isInDefsrc, defsrcNum, layoutEditMode, keyLabelMode)
    keyboard.appendChild(keyEl)
  }

  container.appendChild(keyboard)
}

function createKeyElement(physKey, layerKey, index, isSelected, isInDefsrc, defsrcNum, layoutEditMode, keyLabelMode) {
  const el = document.createElement('div')
  el.className = 'key'

  const width = physKey.w * KEY_UNIT - KEY_GAP
  const height = physKey.h * KEY_UNIT - KEY_GAP
  const left = physKey.x * KEY_UNIT + KEY_GAP / 2
  const top = physKey.y * KEY_UNIT + KEY_GAP / 2

  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.left = `${left}px`
  el.style.top = `${top}px`
  el.style.position = 'absolute'

  if (layoutEditMode) {
    // srcモード: 物理キーのkanata設定を表示
    if (isSelected) el.classList.add('key-selected')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = getKeyLabel(physKey.kanataKey, keyLabelMode) || physKey.label || ''
    el.appendChild(labelEl)
  } else if (!isInDefsrc) {
    el.classList.add('key-passthrough')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = physKey.label || physKey.kanataKey || ''
    el.appendChild(labelEl)
  } else if (!layerKey || layerKey.type === 'disabled') {
    if (isSelected) el.classList.add('key-selected')
    else el.classList.add('key-disabled')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    el.appendChild(labelEl)
  } else if (layerKey.type === 'mod-tap' || layerKey.type === 'layer-tap') {
    el.classList.add('key-dual')
    if (isSelected) el.classList.add('key-selected')
    renderDualKey(el, layerKey, keyLabelMode)
  } else {
    if (isSelected) el.classList.add('key-selected')
    else if (layerKey.type === 'transparent') el.classList.add('key-transparent')
    else if (layerKey.type === 'layer-op') el.classList.add('key-layer-op')
    else if (layerKey.type === 'macro') el.classList.add('key-macro')
    else if (layerKey.type === 'tap-dance') el.classList.add('key-tap-dance')

    const label = getDisplayLabel(physKey, layerKey, keyLabelMode)
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = label
    el.appendChild(labelEl)
  }

  // defsrc番号表示（.vilインポート後かつdefsrcに含まれる場合）
  if (isInDefsrc && defsrcNum !== undefined) {
    const numEl = document.createElement('span')
    numEl.className = 'key-defsrc-num'
    numEl.textContent = defsrcNum + 1
    el.appendChild(numEl)
  }

  // レイヤー編集時: 物理キーのkanataKeyをサブラベルで表示
  if (!layoutEditMode && physKey && physKey.kanataKey) {
    const physLabel = document.createElement('span')
    physLabel.className = 'key-phys-label'
    physLabel.textContent = physKey.kanataKey
    el.appendChild(physLabel)
  }

  // レイアウト編集モード: 削除ボタンを表示
  if (layoutEditMode) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'key-delete-btn'
    deleteBtn.textContent = '×'
    deleteBtn.title = 'このキーを削除'
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (onDeleteLayoutKeyCallback) onDeleteLayoutKeyCallback(index)
    })
    el.appendChild(deleteBtn)
  }

  // 左クリック:
  //   defsrc外のキー → defsrcに追加（トグル）
  //   defsrc内のキー → Shift: defsrcトグル / 通常: キー選択
  // 右クリック → defsrcトグル or キー削除
  el.addEventListener('click', (e) => {
    if (layoutEditMode) {
      if (onSelectKeyCallback) onSelectKeyCallback(index)
    } else if (!isInDefsrc) {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    } else if (e.shiftKey) {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    } else {
      if (onSelectKeyCallback) onSelectKeyCallback(index)
    }
  })
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    if (layoutEditMode) {
      if (onDeleteLayoutKeyCallback) onDeleteLayoutKeyCallback(index)
    } else {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    }
  })

  // ドラッグ&ドロップ（defsrc内のキーのみ）
  if (isInDefsrc && !layoutEditMode) {
    el.draggable = true
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', String(index))
      e.dataTransfer.effectAllowed = 'move'
      el.classList.add('key-dragging')
    })
    el.addEventListener('dragover', (e) => {
      e.preventDefault()
      el.classList.add('key-drag-over')
    })
    el.addEventListener('dragleave', () => {
      el.classList.remove('key-drag-over')
    })
    el.addEventListener('drop', (e) => {
      e.preventDefault()
      el.classList.remove('key-drag-over')
      const data = e.dataTransfer.getData('text/plain')
      if (data.startsWith('vil:')) {
        const vilIndex = parseInt(data.slice(4), 10)
        if (!isNaN(vilIndex) && onDropVilKeyCallback) {
          onDropVilKeyCallback(vilIndex, index)
        }
      } else {
        const fromIndex = parseInt(data, 10)
        if (!isNaN(fromIndex) && fromIndex !== index) {
          if (onSwapKeysCallback) onSwapKeysCallback(fromIndex, index)
        }
      }
    })
    el.addEventListener('dragend', () => {
      el.classList.remove('key-dragging')
      el.classList.remove('key-drag-over')
    })
  }

  return el
}

function renderDualKey(el, layerKey, keyLabelMode) {
  const topLabel = document.createElement('span')
  topLabel.className = 'key-label-top'

  const bottomLabel = document.createElement('span')
  bottomLabel.className = 'key-label-bottom'

  if (layerKey.type === 'mod-tap') {
    topLabel.textContent = getKeyLabel(layerKey.tapKey, keyLabelMode) || layerKey.label || ''
    bottomLabel.textContent = layerKey.holdMod?.toUpperCase() || layerKey.holdLabel || ''
  } else if (layerKey.type === 'layer-tap') {
    topLabel.textContent = getKeyLabel(layerKey.tapKey, keyLabelMode) || layerKey.label || ''
    bottomLabel.textContent = layerKey.holdLabel || `L${layerKey.layer}`
  }

  el.appendChild(topLabel)
  el.appendChild(bottomLabel)
}

function getDisplayLabel(physKey, layerKey, keyLabelMode) {
  if (!layerKey) return physKey.label || ''

  switch (layerKey.type) {
    case 'basic':
      return getKeyLabel(layerKey.kanataKey, keyLabelMode) || layerKey.label || ''
    case 'transparent':
      return '▽'
    case 'disabled':
      return ''
    case 'layer-op':
      return layerKey.label || `${layerKey.op}(${layerKey.layer})`
    case 'macro':
      return layerKey.label || `M${layerKey.index}`
    case 'tap-dance':
      return layerKey.label || `TD${layerKey.index}`
    case 'user':
      return layerKey.label || `U${layerKey.index}`
    case 'modified':
      return getModifiedKeyLabel(layerKey.kanataKey, keyLabelMode) || layerKey.label || ''
    default:
      return layerKey.label || ''
  }
}

// ============================================================
// VILソースキーボード描画
// ============================================================

export function renderVilKeyboard(state) {
  const container = document.getElementById('vil-keyboard-container')
  if (!container) { console.warn('vil-keyboard-container not found'); return }

  const pane = document.getElementById('vil-keyboard-pane')
  const { vilPhysicalLayout, vilLayers, activeLayer, keyLabelMode } = state
  console.log('renderVilKeyboard:', vilPhysicalLayout?.length, 'keys,', vilLayers?.length, 'layers')

  if (!vilPhysicalLayout || vilPhysicalLayout.length === 0) {
    container.innerHTML = ''
    if (pane) pane.style.display = 'none'
    return
  }

  if (pane) pane.style.display = 'flex'
  container.innerHTML = ''

  const vilKeys = vilLayers[activeLayer] || []

  let maxX = 0
  let maxY = 0
  for (const key of vilPhysicalLayout) {
    const right = (key.x + key.w) * KEY_UNIT + KEY_GAP
    const bottom = (key.y + key.h) * KEY_UNIT + KEY_GAP
    if (right > maxX) maxX = right
    if (bottom > maxY) maxY = bottom
  }

  const keyboard = document.createElement('div')
  keyboard.className = 'keyboard'
  keyboard.style.width = `${maxX + KEY_PADDING}px`
  keyboard.style.height = `${maxY + KEY_PADDING}px`
  keyboard.style.position = 'relative'

  for (let i = 0; i < vilPhysicalLayout.length; i++) {
    const physKey = vilPhysicalLayout[i]
    const layerKey = vilKeys[i] || null
    const keyEl = createVilKeyElement(physKey, layerKey, i, keyLabelMode)
    keyboard.appendChild(keyEl)
  }

  container.appendChild(keyboard)
}

function createVilKeyElement(physKey, layerKey, index, keyLabelMode) {
  const el = document.createElement('div')
  el.className = 'key vil-key'

  const width = physKey.w * KEY_UNIT - KEY_GAP
  const height = physKey.h * KEY_UNIT - KEY_GAP
  const left = physKey.x * KEY_UNIT + KEY_GAP / 2
  const top = physKey.y * KEY_UNIT + KEY_GAP / 2

  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.left = `${left}px`
  el.style.top = `${top}px`
  el.style.position = 'absolute'

  if (!layerKey || layerKey.type === 'disabled') {
    el.classList.add('key-disabled')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    el.appendChild(labelEl)
  } else if (layerKey.type === 'mod-tap' || layerKey.type === 'layer-tap') {
    el.classList.add('key-dual')
    renderDualKey(el, layerKey, keyLabelMode)
  } else {
    if (layerKey.type === 'transparent') el.classList.add('key-transparent')
    else if (layerKey.type === 'layer-op') el.classList.add('key-layer-op')
    else if (layerKey.type === 'macro') el.classList.add('key-macro')
    else if (layerKey.type === 'tap-dance') el.classList.add('key-tap-dance')

    const label = getDisplayLabel(physKey, layerKey, keyLabelMode)
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = label
    el.appendChild(labelEl)
  }

  // VILインデックス番号
  const numEl = document.createElement('span')
  numEl.className = 'key-defsrc-num vil-key-num'
  numEl.textContent = index + 1
  el.appendChild(numEl)

  // ドラッグ可能（コピー操作）
  el.draggable = true
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', `vil:${index}`)
    e.dataTransfer.effectAllowed = 'copy'
    el.classList.add('key-dragging')
  })
  el.addEventListener('dragend', () => {
    el.classList.remove('key-dragging')
  })

  return el
}
