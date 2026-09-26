// ============================================================
// 状態管理ストア
//
// state.project が変換の唯一の情報源 (src/core/project.mjs の v2 形式)。
// それ以外は画面表示用の一時状態。
// ============================================================

import { createProject, resolveProject } from '../../src/core/project.mjs'

let state = {
  project: createProject({ layoutId: 'jis-laptop' }),
  view: 'mapping',        // 'mapping' (対応付け) | 'keymap' (キーマップ編集)
  activeLayer: 0,
  selectedTarget: null,   // キーマップ編集で選択中のノートPCキー
  selectedSource: null,   // 対応付けで選択中の自作キーボードのキー
  pickSegment: null,      // 始点をクリック指定中のセグメント ID
  featureTab: 'key',
  keyLabelMode: 'jis',
  layoutEditMode: false,  // ノートPC配列の編集モード
}

const listeners = new Set()
let resolvedCache = { project: null, value: null }

export function getState() {
  return state
}

export function setState(updater) {
  const patch = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...patch }
  for (const listener of listeners) listener(state)
}

export function updateProject(fn) {
  setState((s) => ({ project: fn(s.project) }))
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// 対応付け・レイヤー解決結果 (project が変わった時だけ再計算)
export function getResolved() {
  if (resolvedCache.project !== state.project) {
    resolvedCache = { project: state.project, value: resolveProject(state.project) }
  }
  return resolvedCache.value
}
