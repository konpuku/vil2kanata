// ============================================================
// レイヤー管理UI
// ============================================================

let callbacks = {
  setActiveLayer: null,
  addLayer: null,
  removeLayer: null,
  renameLayer: null,
  enterSrcMode: null,
}

export function setLayerCallbacks(cbs) {
  callbacks = { ...callbacks, ...cbs }
}

export function renderLayers(state) {
  const container = document.getElementById('layer-tabs')
  if (!container) return

  container.innerHTML = ''

  const { layers, activeLayer, layoutEditMode } = state

  // srcタブ（物理キー設定）
  const srcTab = document.createElement('div')
  srcTab.className = 'layer-tab layer-tab-src'
  if (layoutEditMode) srcTab.classList.add('layer-tab-active')

  const srcName = document.createElement('span')
  srcName.className = 'layer-tab-name'
  srcName.textContent = 'src'
  srcTab.appendChild(srcName)

  srcTab.addEventListener('click', () => {
    if (callbacks.enterSrcMode) callbacks.enterSrcMode()
  })
  container.appendChild(srcTab)

  // 通常レイヤータブ
  for (let i = 0; i < layers.length; i++) {
    const tab = document.createElement('div')
    tab.className = 'layer-tab'
    if (!layoutEditMode && i === activeLayer) tab.classList.add('layer-tab-active')

    const nameSpan = document.createElement('span')
    nameSpan.className = 'layer-tab-name'
    nameSpan.textContent = layers[i].name
    nameSpan.addEventListener('dblclick', () => {
      const newName = prompt('レイヤー名:', layers[i].name)
      if (newName && newName.trim()) {
        const sanitized = newName.trim().replace(/[^a-zA-Z0-9_-]/g, '')
        if (sanitized.length > 0 && sanitized.length <= 30 && callbacks.renameLayer) {
          callbacks.renameLayer(i, sanitized)
        }
      }
    })

    tab.appendChild(nameSpan)

    if (i > 0) {
      const removeBtn = document.createElement('button')
      removeBtn.className = 'layer-tab-remove'
      removeBtn.textContent = '\u00d7'
      removeBtn.title = 'レイヤーを削除'
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        if (confirm(`レイヤー "${layers[i].name}" を削除しますか？`) && callbacks.removeLayer) {
          callbacks.removeLayer(i)
        }
      })
      tab.appendChild(removeBtn)
    }

    tab.addEventListener('click', () => {
      if (callbacks.setActiveLayer) callbacks.setActiveLayer(i)
    })
    container.appendChild(tab)
  }

  const addBtn = document.createElement('div')
  addBtn.className = 'layer-tab layer-tab-add'
  addBtn.textContent = '+'
  addBtn.title = 'レイヤーを追加'
  addBtn.addEventListener('click', () => {
    const name = `layer${layers.length}`
    if (callbacks.addLayer) callbacks.addLayer(name)
  })
  container.appendChild(addBtn)
}
