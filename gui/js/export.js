// ============================================================
// エクスポート / インポート処理
// ============================================================

import { getState, setState } from './store.js'
import {
  generateKbdFromState,
  parseVilData,
  qmkKeyToGuiKey,
  extractDefsrcKey,
  vilMacroToGui,
  vilComboToGui,
  vilOverrideToGui,
} from './converter.js'
import { flattenLayout, loadLayout } from './layouts.js'

// ============================================================
// .kbd エクスポート
// ============================================================

export function exportKbd() {
  const state = getState()
  const kbdContent = generateKbdFromState(state)
  downloadFile('keymap.kbd', kbdContent, 'text/plain')
}

// ============================================================
// .vil インポート
// ============================================================

export async function importVil(file) {
  const state = getState()
  const text = await file.text()
  const vilData = parseVilData(text)

  if (!vilData.layout || vilData.layout.length === 0) {
    alert('layoutデータが見つかりません。有効な.vilファイルか確認してください。')
    return
  }

  const layout = vilData.layout

  // srcレイアウト（ノートPC側）は現在のphysicalLayoutを維持
  const physicalLayout = state.physicalLayout
  const physKeyCount = physicalLayout.length

  // vil base layer のキーをフラット化
  const vilBaseKeys = []
  for (const row of (layout[0] || [])) {
    for (const key of row) {
      vilBaseKeys.push(key)
    }
  }
  const vilKeyCount = vilBaseKeys.length

  // ノートPC: kanataKey → インデックスリストのマップ
  const laptopKeyMap = new Map()
  for (let i = 0; i < physicalLayout.length; i++) {
    const k = physicalLayout[i].kanataKey
    if (!laptopKeyMap.has(k)) laptopKeyMap.set(k, [])
    laptopKeyMap.get(k).push(i)
  }

  // 名前ベースマッチング: vil キー位置 → ノートPCキーインデックス
  const usedLaptopIndices = new Set()
  const vilPosToLaptopIdx = new Map()
  for (let vilPos = 0; vilPos < vilBaseKeys.length; vilPos++) {
    const tapKey = extractDefsrcKey(vilBaseKeys[vilPos])
    if (!tapKey || tapKey === 'XX') continue
    const candidates = laptopKeyMap.get(tapKey) || []
    const available = candidates.find((idx) => !usedLaptopIndices.has(idx))
    if (available !== undefined) {
      usedLaptopIndices.add(available)
      vilPosToLaptopIdx.set(vilPos, available)
    }
  }

  // 各レイヤーをノートPCサイズで構築
  // layer0: 名前ベースマッチングで配置（マッチしないキーはtransparent）
  // layer1以降: VILの並び順をそのまま配置（D&Dで並べ替え前提）
  const layers = layout.map((layer, layerIdx) => {
    const keys = Array.from({ length: physKeyCount }, () => ({
      type: 'transparent',
      label: '▽',
      kanataKey: '_',
    }))
    let vilPos = 0
    for (const row of layer) {
      for (const vilKey of row) {
        if (layerIdx === 0) {
          const laptopIdx = vilPosToLaptopIdx.get(vilPos)
          if (laptopIdx !== undefined) {
            keys[laptopIdx] = qmkKeyToGuiKey(vilKey)
          }
        } else {
          if (vilPos < physKeyCount) {
            keys[vilPos] = qmkKeyToGuiKey(vilKey)
          }
        }
        vilPos++
      }
    }
    return {
      name: layerIdx === 0 ? 'base' : `layer${layerIdx}`,
      keys,
    }
  })

  // VIL元キーボードのグリッドレイアウト（行列構造をそのまま保持）
  const vilPhysicalLayout = []
  const vilBaseLayer = layout[0] || []
  for (let rowIdx = 0; rowIdx < vilBaseLayer.length; rowIdx++) {
    const row = vilBaseLayer[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const kanataKey = extractDefsrcKey(row[colIdx])
      vilPhysicalLayout.push({
        x: colIdx,
        y: rowIdx,
        w: 1,
        h: 1,
        kanataKey: kanataKey || 'XX',
        label: kanataKey === 'XX' ? '' : kanataKey,
      })
    }
  }

  // VIL元キーボードの各レイヤーキー配列
  const vilLayers = layout.map((layer) => {
    const keys = []
    for (const row of layer) {
      for (const vilKey of row) {
        keys.push(qmkKeyToGuiKey(vilKey))
      }
    }
    return keys
  })

  // defsrcKeys = マッチしたノートPCキーインデックスの集合
  const defsrcKeys = new Set(usedLaptopIndices)

  // マクロをGUI形式に変換
  const macros = (vilData.macro || [])
    .map((m, i) => vilMacroToGui(m, i))
    .filter(Boolean)

  // コンボをGUI形式に変換
  const combos = (vilData.combo || [])
    .map((c, i) => vilComboToGui(c, i))
    .filter(Boolean)

  // キーオーバーライドをGUI形式に変換
  const keyOverrides = (vilData.key_override || [])
    .map((ko, i) => vilOverrideToGui(ko, i))
    .filter(Boolean)

  setState({
    vilData,
    vilKeyCount,
    vilPhysicalLayout,
    vilLayers,
    defsrcKeys,
    layers,
    activeLayer: 0,
    selectedKey: null,
    macros,
    tapDances: vilData.tap_dance || [],
    tapDancesGui: [],
    combos,
    keyOverrides,
  })
}

async function guessPhysicalLayout(baseLayer, totalKeys) {
  // プリセットレイアウトを試す
  try {
    const usLayout = await loadLayout('us-ansi-60')
    const usKeys = flattenLayout(usLayout)
    if (usKeys.length === totalKeys) {
      return usKeys
    }
  } catch {
    // プリセットが合わない場合はカスタム生成
  }

  // カスタムレイアウトを生成
  const keys = []
  for (let rowIdx = 0; rowIdx < baseLayer.length; rowIdx++) {
    const row = baseLayer[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const kanataKey = extractDefsrcKey(row[colIdx])
      keys.push({
        x: colIdx,
        y: rowIdx,
        w: 1,
        h: 1,
        kanataKey,
        label: kanataKey === 'XX' ? '' : kanataKey,
      })
    }
  }
  return keys
}

// ============================================================
// プロジェクト保存/読み込み
// ============================================================

export function saveProject() {
  const state = getState()

  const project = {
    version: 1,
    layout: state.layout,
    physicalLayout: state.physicalLayout,
    defsrcKeys: Array.from(state.defsrcKeys || []),
    layers: state.layers,
    macros: state.macros,
    tapDances: state.tapDances,
    tapDancesGui: state.tapDancesGui,
    combos: state.combos,
    keyOverrides: state.keyOverrides,
    settings: state.settings,
    vilKeyCount: state.vilKeyCount ?? null,
    vilPhysicalLayout: state.vilPhysicalLayout || [],
    vilLayers: state.vilLayers || [],
  }

  const json = JSON.stringify(project, null, 2)
  downloadFile('vil2kanata-project.json', json, 'application/json')
}

export async function loadProject(file) {
  const text = await file.text()

  let project
  try {
    project = JSON.parse(text)
  } catch {
    alert('プロジェクトファイルのパースに失敗しました。')
    return
  }

  if (!project.version || !project.layers) {
    alert('有効なプロジェクトファイルではありません。')
    return
  }

  const physicalLayout = project.physicalLayout || []
  const defsrcKeys = project.defsrcKeys
    ? new Set(project.defsrcKeys)
    : new Set(physicalLayout.map((_, i) => i))

  setState({
    layout: project.layout || 'us-ansi-60',
    physicalLayout,
    defsrcKeys,
    layers: project.layers,
    activeLayer: 0,
    selectedKey: null,
    macros: project.macros || [],
    tapDances: project.tapDances || [],
    tapDancesGui: project.tapDancesGui || [],
    combos: project.combos || [],
    keyOverrides: project.keyOverrides || [],
    settings: {
      tapTime: 200,
      holdTime: 200,
      processUnmappedKeys: true,
      concurrentTapHold: true,
      rapidEventDelay: 5,
      ...(project.settings || {}),
    },
    vilKeyCount: project.vilKeyCount ?? null,
    vilPhysicalLayout: project.vilPhysicalLayout || [],
    vilLayers: project.vilLayers || [],
  })
}

// ============================================================
// LocalStorage保存/復元
// ============================================================

const STORAGE_KEY = 'vil2kanata-autosave'

export function autoSave() {
  const state = getState()
  try {
    const data = {
      layout: state.layout,
      physicalLayout: state.physicalLayout,
      layers: state.layers,
      settings: state.settings,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage容量超過時は無視
  }
}

export function autoLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ============================================================
// ヘルパー
// ============================================================

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    URL.revokeObjectURL(url)
  }
}
