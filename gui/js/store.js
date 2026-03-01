// ============================================================
// 状態管理ストア（循環依存回避のため独立モジュール）
// ============================================================

let state = {
  layout: 'us-ansi-60',
  physicalLayout: [],
  defsrcKeys: new Set(),
  layers: [
    { name: 'base', keys: [] },
  ],
  activeLayer: 0,
  selectedKey: null,
  macros: [],
  tapDances: [],
  tapDancesGui: [],
  combos: [],
  keyOverrides: [],
  settings: {
    tapTime: 200,
    holdTime: 200,
    processUnmappedKeys: true,
    concurrentTapHold: true,
    rapidEventDelay: 5,
  },
  vilData: null,
  vilKeyCount: null,  // .vilから読み込んだ自作キーボードのキー数
  vilPhysicalLayout: [],  // VIL元キーボードのグリッドレイアウト
  vilLayers: [],           // VIL元キーボードの各レイヤーキー配列
  layoutEditMode: false,
  keyLabelMode: 'us',
}

const listeners = new Set()

export function getState() {
  return state
}

export function setState(updater) {
  const newState = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...newState }
  for (const listener of listeners) {
    listener(state)
  }
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
