// ============================================================
// アプリケーション初期化・アクション
// ============================================================

import { getState, setState, subscribe } from './store.js'
import { loadLayout, getAvailableLayouts, flattenLayout } from './layouts.js'
import {
  renderKeyboard,
  renderVilKeyboard,
  setSelectKeyCallback,
  setToggleDefsrcCallback,
  setDeleteLayoutKeyCallback,
  setSwapKeysCallback,
  setDropVilKeyCallback,
} from './keyboard.js'
import { renderEditor, hideEditor, setUpdateKeyCallback, setUpdatePhysicalKeyCallback } from './editor.js'
import { renderLayers, setLayerCallbacks } from './layers.js'
import { renderDefsrcPanel } from './defsrc.js'
import { exportKbd, importVil, saveProject, loadProject } from './export.js'
import { renderCombosPanel } from './combos.js'
import { renderOverridesPanel } from './overrides.js'
import { renderMacrosPanel } from './macros.js'
import { renderTapDancePanel } from './tap-dance.js'

// ============================================================
// 機能タブ管理
// ============================================================

let activeFeatureTab = 'keymap'

// ============================================================
// アクション
// ============================================================

export async function changeLayout(layoutId) {
  const state = getState()
  const layoutData = await loadLayout(layoutId)
  const physicalLayout = flattenLayout(layoutData)
  const keyCount = physicalLayout.length

  const layers = state.layers.map((layer, layerIdx) => {
    const keys = [...layer.keys]
    while (keys.length < keyCount) {
      const idx = keys.length
      if (layerIdx === 0 && physicalLayout[idx]) {
        const phys = physicalLayout[idx]
        keys.push({
          type: 'basic',
          label: phys.label || phys.kanataKey,
          kanataKey: phys.kanataKey,
        })
      } else {
        keys.push({ type: 'transparent', label: '▽', kanataKey: '_' })
      }
    }
    return { ...layer, keys: keys.slice(0, keyCount) }
  })

  const defsrcKeys = new Set(physicalLayout.map((_, i) => i))

  const keyLabelMode = layoutId.startsWith('jis-') ? 'jis' : getState().keyLabelMode

  setState({
    layout: layoutId,
    physicalLayout,
    defsrcKeys,
    layers,
    selectedKey: null,
    keyLabelMode,
  })
}

export function selectKey(index) {
  const state = getState()
  const newSelected = index === state.selectedKey ? null : index
  // キー選択時は「キー設定」タブを自動表示（setStateより先に変更）
  if (newSelected !== null && activeFeatureTab !== 'keymap') {
    activeFeatureTab = 'keymap'
  }
  setState({ selectedKey: newSelected })
}

export function toggleDefsrcKey(index) {
  const state = getState()
  const defsrcKeys = new Set(state.defsrcKeys)
  if (defsrcKeys.has(index)) {
    defsrcKeys.delete(index)
    if (state.selectedKey === index) setState({ defsrcKeys, selectedKey: null })
    else setState({ defsrcKeys })
  } else {
    defsrcKeys.add(index)
    setState({ defsrcKeys })
  }
}

export function swapKeys(fromIndex, toIndex) {
  const state = getState()
  const { activeLayer } = state
  const layers = state.layers.map((layer, i) => {
    if (i !== activeLayer) return layer
    const keys = layer.keys.map((key, j) => {
      if (j === fromIndex) return layer.keys[toIndex]
      if (j === toIndex) return layer.keys[fromIndex]
      return key
    })
    return { ...layer, keys }
  })
  setState({ layers })
}

export function selectAllDefsrcKeys() {
  const state = getState()
  const defsrcKeys = new Set(state.physicalLayout.map((_, i) => i))
  setState({ defsrcKeys })
}

export function clearAllDefsrcKeys() {
  setState({ defsrcKeys: new Set(), selectedKey: null })
}

export function updateKey(layerIndex, keyIndex, keyConfig) {
  const state = getState()
  const layers = state.layers.map((layer, i) => {
    if (i !== layerIndex) return layer
    const keys = layer.keys.map((key, j) => {
      if (j !== keyIndex) return key
      return { ...keyConfig }
    })
    return { ...layer, keys }
  })
  setState({ layers })
}

export function setActiveLayer(index) {
  setState({ activeLayer: index, layoutEditMode: false, selectedKey: null })
}

export function enterSrcMode() {
  setState({ layoutEditMode: true, selectedKey: null })
}

export function addLayer(name) {
  const state = getState()
  const keyCount = state.physicalLayout.length
  const keys = Array.from({ length: keyCount }, () => ({
    type: 'transparent',
    label: '▽',
    kanataKey: '_',
  }))
  const layers = [...state.layers, { name, keys }]
  setState({ layers })
}

export function removeLayer(index) {
  const state = getState()
  if (index === 0 || state.layers.length <= 1) return
  const layers = state.layers.filter((_, i) => i !== index)
  const activeLayer = state.activeLayer >= layers.length
    ? layers.length - 1
    : state.activeLayer
  setState({ layers, activeLayer, selectedKey: null })
}

// ============================================================
// 物理キー編集（レイアウト編集モード用）
// ============================================================

export function updatePhysicalKey(index, kanataKey, label) {
  const state = getState()
  const { physicalLayout, layers } = state

  if (!physicalLayout || index < 0 || index >= physicalLayout.length) return

  const newPhysicalLayout = physicalLayout.map((key, i) => {
    if (i !== index) return key
    return { ...key, kanataKey, label }
  })

  // レイヤー0の対応キーも更新
  const newLayers = layers.map((layer, layerIdx) => {
    if (layerIdx !== 0) return layer
    const keys = layer.keys.map((key, keyIdx) => {
      if (keyIdx !== index) return key
      return { ...key, kanataKey, label }
    })
    return { ...layer, keys }
  })

  setState({ physicalLayout: newPhysicalLayout, layers: newLayers })
}

// ============================================================
// レイアウト編集
// ============================================================

export function toggleLayoutEditMode() {
  const state = getState()
  setState({ layoutEditMode: !state.layoutEditMode, selectedKey: null })
}

function deleteAndReflowLayout(physicalLayout, deleteIndex) {
  const deletedKey = physicalLayout[deleteIndex]
  const rowY = deletedKey.y

  const remaining = physicalLayout.filter((_, i) => i !== deleteIndex)

  // 削除されたキーと同じ行の残りキーを x 順に取得
  const originalRowKeys = physicalLayout
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)
  const firstX = originalRowKeys[0]?.x ?? 0

  const remainingRowKeys = remaining
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)

  // x 座標を詰め直す
  let xAccum = firstX
  const reflowed = remainingRowKeys.map((key) => {
    const newKey = { ...key, x: xAccum }
    xAccum += key.w
    return newKey
  })

  const reflowMap = new Map()
  for (let i = 0; i < remainingRowKeys.length; i++) {
    reflowMap.set(remainingRowKeys[i], reflowed[i])
  }

  return remaining.map((key) => reflowMap.get(key) ?? key)
}

export function deleteLayoutKey(index) {
  const state = getState()
  const { physicalLayout, layers, defsrcKeys, selectedKey } = state
  if (!physicalLayout || index < 0 || index >= physicalLayout.length) return

  const newPhysicalLayout = deleteAndReflowLayout(physicalLayout, index)

  const newLayers = layers.map((layer) => ({
    ...layer,
    keys: layer.keys.filter((_, i) => i !== index),
  }))

  const newDefsrcKeys = new Set()
  for (const idx of defsrcKeys || []) {
    if (idx < index) newDefsrcKeys.add(idx)
    else if (idx > index) newDefsrcKeys.add(idx - 1)
  }

  const newSelectedKey =
    selectedKey === index
      ? null
      : selectedKey !== null && selectedKey > index
        ? selectedKey - 1
        : selectedKey

  setState({
    physicalLayout: newPhysicalLayout,
    layers: newLayers,
    defsrcKeys: newDefsrcKeys,
    selectedKey: newSelectedKey,
  })
}

export function addLayoutKey(kanataKey, label, width, rowY) {
  const state = getState()
  const { physicalLayout, layers } = state

  const rowKeys = physicalLayout
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)
  const lastKey = rowKeys[rowKeys.length - 1]
  const newX = lastKey ? lastKey.x + lastKey.w : 0

  const newPhysKey = {
    x: newX,
    y: rowY,
    w: width,
    h: 1,
    kanataKey,
    label: label || kanataKey,
  }

  const newPhysicalLayout = [...physicalLayout, newPhysKey]
  const newLayers = layers.map((layer) => ({
    ...layer,
    keys: [...layer.keys, { type: 'transparent', label: '▽', kanataKey: '_' }],
  }))

  setState({ physicalLayout: newPhysicalLayout, layers: newLayers })
}

export function getDistinctRowYValues(physicalLayout) {
  const rows = new Set(physicalLayout.map((k) => k.y))
  return [...rows].sort((a, b) => a - b)
}

export function renameLayer(index, name) {
  const state = getState()
  const layers = state.layers.map((layer, i) => {
    if (i !== index) return layer
    return { ...layer, name }
  })
  setState({ layers })
}

// ============================================================
// キーラベルモード切替
// ============================================================

export function setKeyLabelMode(mode) {
  setState({ keyLabelMode: mode })
}

// ============================================================
// VILキーボードからのドロップ
// ============================================================

export function dropVilKey(vilKeyIndex, physKeyIndex) {
  const state = getState()
  const { activeLayer, vilLayers } = state
  const vilLayerKeys = vilLayers[activeLayer]
  if (!vilLayerKeys || !vilLayerKeys[vilKeyIndex]) return

  const vilKey = { ...vilLayerKeys[vilKeyIndex] }
  updateKey(activeLayer, physKeyIndex, vilKey)
}

// ============================================================
// コンボ CRUD
// ============================================================

export function addCombo() {
  const state = getState()
  const combos = state.combos || []
  const newId = combos.length > 0 ? Math.max(...combos.map((c) => c.id)) + 1 : 0
  setState({ combos: [...combos, { id: newId, keys: ['', ''], result: '', timeout: 200 }] })
}

export function removeCombo(id) {
  const state = getState()
  setState({ combos: (state.combos || []).filter((c) => c.id !== id) })
}

export function updateCombo(id, updates) {
  const state = getState()
  setState({
    combos: (state.combos || []).map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })
}

// ============================================================
// キーオーバーライド CRUD
// ============================================================

export function addOverride() {
  const state = getState()
  const overrides = state.keyOverrides || []
  const newId = overrides.length > 0 ? Math.max(...overrides.map((o) => o.id)) + 1 : 0
  setState({
    keyOverrides: [...overrides, { id: newId, trigger: '', triggerMods: [], replacementKey: '', replacementMods: [] }],
  })
}

export function removeOverride(id) {
  const state = getState()
  setState({ keyOverrides: (state.keyOverrides || []).filter((o) => o.id !== id) })
}

export function updateOverride(id, updates) {
  const state = getState()
  setState({
    keyOverrides: (state.keyOverrides || []).map((o) => (o.id === id ? { ...o, ...updates } : o)),
  })
}

// ============================================================
// マクロ CRUD
// ============================================================

export function addMacro() {
  const state = getState()
  const macros = state.macros || []
  const newId = macros.length > 0 ? Math.max(...macros.map((m) => m.id)) + 1 : 0
  setState({ macros: [...macros, { id: newId, actions: [] }] })
}

export function removeMacro(id) {
  const state = getState()
  setState({ macros: (state.macros || []).filter((m) => m.id !== id) })
}

export function updateMacro(id, updates) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })
}

export function addMacroAction(macroId, actionType) {
  const state = getState()
  let newAction
  if (actionType === 'tap') newAction = { type: 'tap', key: '' }
  else if (actionType === 'delay') newAction = { type: 'delay', duration: 50 }
  else newAction = { type: 'text', text: '' }
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return { ...m, actions: [...(m.actions || []), newAction] }
    }),
  })
}

export function removeMacroAction(macroId, actionIndex) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return { ...m, actions: (m.actions || []).filter((_, i) => i !== actionIndex) }
    }),
  })
}

export function updateMacroAction(macroId, actionIndex, updates) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return {
        ...m,
        actions: (m.actions || []).map((a, i) => (i === actionIndex ? { ...a, ...updates } : a)),
      }
    }),
  })
}

// ============================================================
// タップダンスCRUD (GUI形式)
// ============================================================

export function addTapDance() {
  const state = getState()
  const tds = state.tapDancesGui || []
  const newId = tds.length > 0 ? Math.max(...tds.map((t) => t.id)) + 1 : 0
  setState({ tapDancesGui: [...tds, { id: newId, timeout: 200, actions: [] }] })
}

export function removeTapDance(id) {
  const state = getState()
  setState({ tapDancesGui: (state.tapDancesGui || []).filter((t) => t.id !== id) })
}

export function updateTapDance(id, updates) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })
}

export function addTapDanceAction(tdId) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return { ...t, actions: [...(t.actions || []), { type: 'basic', kanataKey: '', label: '' }] }
    }),
  })
}

export function removeTapDanceAction(tdId, actionIndex) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return { ...t, actions: (t.actions || []).filter((_, i) => i !== actionIndex) }
    }),
  })
}

export function updateTapDanceAction(tdId, actionIndex, updates) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return {
        ...t,
        actions: (t.actions || []).map((a, i) => (i === actionIndex ? { ...a, ...updates } : a)),
      }
    }),
  })
}

// ============================================================
// 機能タブUI
// ============================================================

function updateFeatureTabs(state) {
  const tabs = document.querySelectorAll('.feature-tab')
  for (const tab of tabs) {
    if (tab.dataset.tab === activeFeatureTab) {
      tab.classList.add('feature-tab-active')
    } else {
      tab.classList.remove('feature-tab-active')
    }
  }

  // バッジ更新
  const macros = state.macros || []
  const tapDancesGui = state.tapDancesGui || []
  const combos = state.combos || []
  const overrides = state.keyOverrides || []

  const badgeMacros = document.getElementById('badge-macros')
  const badgeTapDance = document.getElementById('badge-tap-dance')
  const badgeCombos = document.getElementById('badge-combos')
  const badgeOverrides = document.getElementById('badge-overrides')

  if (badgeMacros) badgeMacros.textContent = macros.length > 0 ? macros.length : ''
  if (badgeTapDance) badgeTapDance.textContent = tapDancesGui.length > 0 ? tapDancesGui.length : ''
  if (badgeCombos) badgeCombos.textContent = combos.length > 0 ? combos.length : ''
  if (badgeOverrides) badgeOverrides.textContent = overrides.length > 0 ? overrides.length : ''

  // 選択キーの表示を「キー設定」タブに反映
  const keymapTab = document.querySelector('.feature-tab[data-tab="keymap"]')
  if (keymapTab) {
    if (state.selectedKey !== null && state.physicalLayout?.[state.selectedKey]) {
      const physKey = state.physicalLayout[state.selectedKey]
      keymapTab.textContent = `キー設定: ${physKey.label || physKey.kanataKey}`
    } else {
      keymapTab.textContent = 'キー設定'
    }
  }
}

function renderFeaturePanel(state) {
  const editorPanel = document.getElementById('editor-panel')
  const featurePanel = document.getElementById('feature-panel')

  if (activeFeatureTab === 'keymap') {
    if (featurePanel) featurePanel.style.display = 'none'
    if (editorPanel) {
      if (state.selectedKey !== null) {
        editorPanel.style.display = 'block'
        renderEditor(state)
      } else {
        hideEditor()
      }
    }
  } else {
    if (editorPanel) editorPanel.style.display = 'none'
    if (featurePanel) {
      featurePanel.style.display = 'block'

      const comboCallbacks = {
        onAddCombo: addCombo,
        onRemoveCombo: removeCombo,
        onUpdateCombo: updateCombo,
      }
      const overrideCallbacks = {
        onAddOverride: addOverride,
        onRemoveOverride: removeOverride,
        onUpdateOverride: updateOverride,
      }
      const macroCallbacks = {
        onAddMacro: addMacro,
        onRemoveMacro: removeMacro,
        onUpdateMacro: updateMacro,
        onAddMacroAction: addMacroAction,
        onRemoveMacroAction: removeMacroAction,
        onUpdateMacroAction: updateMacroAction,
      }
      const tapDanceCallbacks = {
        onAddTapDance: addTapDance,
        onRemoveTapDance: removeTapDance,
        onUpdateTapDance: updateTapDance,
        onAddTapDanceAction: addTapDanceAction,
        onRemoveTapDanceAction: removeTapDanceAction,
        onUpdateTapDanceAction: updateTapDanceAction,
      }

      switch (activeFeatureTab) {
        case 'macros':
          renderMacrosPanel(state, macroCallbacks)
          break
        case 'tap-dance':
          renderTapDancePanel(state, tapDanceCallbacks)
          break
        case 'combos':
          renderCombosPanel(state, comboCallbacks)
          break
        case 'overrides':
          renderOverridesPanel(state, overrideCallbacks)
          break
        default:
          break
      }
    }
  }
}

// ============================================================
// 初期化
// ============================================================

async function initApp() {
  const layoutSelect = document.getElementById('layout-select')
  for (const layout of getAvailableLayouts()) {
    const option = document.createElement('option')
    option.value = layout.id
    option.textContent = layout.name
    layoutSelect.appendChild(option)
  }

  layoutSelect.addEventListener('change', (e) => {
    changeLayout(e.target.value)
  })

  document.getElementById('btn-import-vil').addEventListener('click', () => {
    document.getElementById('file-input-vil').click()
  })

  document.getElementById('file-input-vil').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file) {
      await importVil(file)
      e.target.value = ''
    }
  })

  document.getElementById('btn-export-kbd').addEventListener('click', () => {
    exportKbd()
  })

  document.getElementById('btn-save-project').addEventListener('click', () => {
    saveProject()
  })

  document.getElementById('btn-load-project').addEventListener('click', () => {
    document.getElementById('file-input-project').click()
  })

  document.getElementById('file-input-project').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file) {
      await loadProject(file)
      e.target.value = ''
    }
  })

  document.getElementById('btn-defsrc-all').addEventListener('click', () => {
    selectAllDefsrcKeys()
  })

  document.getElementById('btn-defsrc-clear').addEventListener('click', () => {
    clearAllDefsrcKeys()
  })

  document.getElementById('tap-time').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      setState({ settings: { ...state.settings, tapTime: val } })
    }
  })

  document.getElementById('hold-time').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      setState({ settings: { ...state.settings, holdTime: val } })
    }
  })

  document.getElementById('cfg-process-unmapped').addEventListener('change', (e) => {
    const state = getState()
    setState({ settings: { ...state.settings, processUnmappedKeys: e.target.checked } })
  })

  document.getElementById('cfg-concurrent-tap-hold').addEventListener('change', (e) => {
    const state = getState()
    setState({ settings: { ...state.settings, concurrentTapHold: e.target.checked } })
  })

  document.getElementById('cfg-rapid-event-delay').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 0) {
      setState({ settings: { ...state.settings, rapidEventDelay: val } })
    }
  })

  // 機能タブクリックハンドラ
  const featureTabs = document.querySelectorAll('.feature-tab')
  for (const tab of featureTabs) {
    tab.addEventListener('click', () => {
      activeFeatureTab = tab.dataset.tab
      const s = getState()
      updateFeatureTabs(s)
      renderFeaturePanel(s)
    })
  }

  // コールバック登録（循環依存回避）
  setSelectKeyCallback(selectKey)
  setToggleDefsrcCallback(toggleDefsrcKey)
  setDeleteLayoutKeyCallback(deleteLayoutKey)
  setSwapKeysCallback(swapKeys)
  setDropVilKeyCallback(dropVilKey)
  setUpdateKeyCallback(updateKey)
  setUpdatePhysicalKeyCallback(updatePhysicalKey)
  setLayerCallbacks({ setActiveLayer, addLayer, removeLayer, renameLayer, enterSrcMode })

  // キーラベルモード切替ボタン
  document.getElementById('btn-label-us')?.addEventListener('click', () => {
    setKeyLabelMode('us')
  })
  document.getElementById('btn-label-jis')?.addEventListener('click', () => {
    setKeyLabelMode('jis')
  })

  // キー追加フォーム
  document.getElementById('btn-add-layout-key')?.addEventListener('click', () => {
    const kanataKey = document.getElementById('new-key-kanata')?.value.trim()
    const label = document.getElementById('new-key-label')?.value.trim()
    const widthStr = document.getElementById('new-key-width')?.value
    const rowStr = document.getElementById('new-key-row')?.value

    if (!kanataKey) return
    const width = parseFloat(widthStr) || 1
    const rowY = parseFloat(rowStr)
    if (isNaN(rowY)) return

    addLayoutKey(kanataKey, label, width, rowY)

    // 入力クリア
    const kanataInput = document.getElementById('new-key-kanata')
    const labelInput = document.getElementById('new-key-label')
    if (kanataInput) kanataInput.value = ''
    if (labelInput) labelInput.value = ''
  })

  // 状態変更時の再描画
  subscribe((s) => {
    renderKeyboard(s)
    renderVilKeyboard(s)
    renderLayers(s)
    renderDefsrcPanel(s)
    updateFeatureTabs(s)
    renderFeaturePanel(s)

    // layout-selectの選択状態を同期
    const layoutSelectEl = document.getElementById('layout-select')
    if (layoutSelectEl && layoutSelectEl.value !== s.layout) {
      layoutSelectEl.value = s.layout
    }

    // レイアウト編集モード UI 同期
    const editPanel = document.getElementById('layout-edit-panel')
    const hintEl = document.getElementById('defsrc-hint')

    if (editPanel) {
      editPanel.style.display = s.layoutEditMode ? 'flex' : 'none'

      // 行セレクタを physicalLayout に合わせて更新
      const rowSelect = document.getElementById('new-key-row')
      if (rowSelect && s.physicalLayout) {
        const rows = getDistinctRowYValues(s.physicalLayout)
        const prev = rowSelect.value
        rowSelect.innerHTML = ''
        for (const r of rows) {
          const opt = document.createElement('option')
          opt.value = r
          opt.textContent = `Row ${r}`
          rowSelect.appendChild(opt)
        }
        if (prev) rowSelect.value = prev
      }
    }
    // defcfg設定の同期
    const cfgUnmapped = document.getElementById('cfg-process-unmapped')
    const cfgConcurrent = document.getElementById('cfg-concurrent-tap-hold')
    const cfgRapid = document.getElementById('cfg-rapid-event-delay')
    if (cfgUnmapped) cfgUnmapped.checked = s.settings.processUnmappedKeys !== false
    if (cfgConcurrent) cfgConcurrent.checked = s.settings.concurrentTapHold !== false
    if (cfgRapid) cfgRapid.value = s.settings.rapidEventDelay ?? 5

    // キーラベルモード ボタン同期
    const btnLabelUs = document.getElementById('btn-label-us')
    const btnLabelJis = document.getElementById('btn-label-jis')
    if (btnLabelUs) btnLabelUs.classList.toggle('defsrc-btn-active', s.keyLabelMode === 'us')
    if (btnLabelJis) btnLabelJis.classList.toggle('defsrc-btn-active', s.keyLabelMode === 'jis')

    if (hintEl) {
      hintEl.innerHTML = s.layoutEditMode
        ? '左クリック: 物理キー編集　右クリック: キー削除'
        : '左クリック: キー設定<br>Shift+クリック / 右クリック: defsrc切替<br>ドラッグ&ドロップ: キー入替'
    }
  })

  await changeLayout('us-ansi-60')
}

document.addEventListener('DOMContentLoaded', initApp)
