// ============================================================
// アプリケーション本体 (アクション・描画の統括)
// ============================================================

import { getState, setState, updateProject, subscribe, getResolved } from './store.js'
import { createProject, layerCount } from '../../src/core/project.mjs'
import { LAYOUT_PRESETS, getPresetKeys } from '../../src/core/layouts.mjs'
import { renderKeyboard, segmentColor } from './keyboard.js'
import { keyConfigLabel, getKeyLabel } from './labels.js'
import { renderLayers } from './layers.js'
import { renderMappingPanel } from './mapping-panel.js'
import { renderEditor } from './editor.js'
import { renderMacrosPanel } from './macros.js'
import { renderTapDancePanel } from './tap-dance.js'
import { renderCombosPanel } from './combos.js'
import { renderOverridesPanel } from './overrides.js'
import { renderSettingsPanel } from './settings-panel.js'
import { renderPreviewPanel } from './preview.js'
import {
  exportKbdFile, saveProjectFile, readProjectFile, importVilFiles, importExtraFiles, autoSave, autoLoad, clearAutoSave,
} from './export.js'

// ============================================================
// アクション
// ============================================================

function hasWork(project) {
  return !!project.source || (project.edits || []).some((e) => e && Object.keys(e).length > 0)
}

export const actions = {
  setView(view) {
    setState({ view, pickSegment: null, selectedSource: null })
  },

  changeTargetLayout(layoutId) {
    const s = getState()
    if (hasWork(s.project) && !confirm('ノートPC配列を変更すると、始点・個別の割り当て・手動変更したキーがリセットされます。よろしいですか？')) {
      setState({})
      return
    }
    const preset = LAYOUT_PRESETS[layoutId]
    updateProject((p) => ({
      ...p,
      target: { layoutId, keys: getPresetKeys(layoutId) },
      mapping: { starts: {}, pins: {} },
      edits: (p.edits || []).map(() => ({})),
      defsrcInclude: [],
      defsrcExclude: [],
    }))
    setState({ selectedTarget: null, keyLabelMode: preset?.keyLabelMode || getState().keyLabelMode })
  },

  importVil() {
    document.getElementById('file-input-vil').click()
  },

  importExtras() {
    document.getElementById('file-input-extras').click()
  },

  // ---- 対応付け ----
  setStart(segId, value) {
    updateProject((p) => {
      const starts = { ...(p.mapping.starts || {}) }
      if (value === undefined) delete starts[segId]
      else starts[segId] = value
      return { ...p, mapping: { ...p.mapping, starts } }
    })
  },

  startPick(segId) {
    setState({ pickSegment: segId, selectedSource: null })
  },

  // ソース s をターゲット t へ割り当て (t に別のキーがあれば入れ替え)
  pin(s, t) {
    const resolved = getResolved()
    updateProject((p) => {
      const pins = { ...(p.mapping.pins || {}) }
      if (t !== null) {
        const other = resolved.inverse[t]
        if (other !== null && other !== undefined && other !== s) pins[other] = resolved.map[s] ?? null
      }
      pins[s] = t
      return { ...p, mapping: { ...p.mapping, pins } }
    })
    setState({ selectedSource: null })
  },

  resetPins() {
    updateProject((p) => ({ ...p, mapping: { ...p.mapping, pins: {} } }))
  },

  resetMapping() {
    if (!confirm('始点の指定と個別の割り当てをすべて自動に戻しますか？')) return
    updateProject((p) => ({ ...p, mapping: { starts: {}, pins: {} } }))
  },

  // ---- レイヤー ----
  setActiveLayer(i) {
    setState({ activeLayer: i })
  },

  addLayer() {
    updateProject((p) => {
      const n = layerCount(p)
      const names = Array.from({ length: n }, (_, i) => p.layerNames?.[i] || (i === 0 ? 'base' : `layer${i}`))
      const edits = Array.from({ length: n }, (_, i) => p.edits?.[i] || {})
      return { ...p, layerNames: [...names, `layer${n}`], edits: [...edits, {}] }
    })
    setState({ activeLayer: layerCount(getState().project) - 1 })
  },

  removeLastLayer() {
    updateProject((p) => ({ ...p, layerNames: p.layerNames.slice(0, -1), edits: (p.edits || []).slice(0, p.layerNames.length - 1) }))
    setState((s) => ({ activeLayer: Math.min(s.activeLayer, layerCount(s.project) - 1) }))
  },

  renameLayer(i, name) {
    updateProject((p) => {
      const names = Array.from({ length: layerCount(p) }, (_, j) => p.layerNames?.[j] || (j === 0 ? 'base' : `layer${j}`))
      names[i] = name
      return { ...p, layerNames: names }
    })
  },

  // ---- キー編集 ----
  selectTarget(t) {
    setState((s) => ({ selectedTarget: s.selectedTarget === t ? null : t, featureTab: 'key' }))
  },

  setEdit(layer, t, kc) {
    updateProject((p) => {
      const edits = Array.from({ length: layerCount(p) }, (_, i) => ({ ...(p.edits?.[i] || {}) }))
      edits[layer][t] = kc || { type: 'disabled' }
      return { ...p, edits }
    })
  },

  clearEdit(layer, t) {
    updateProject((p) => {
      const edits = (p.edits || []).map((e) => ({ ...e }))
      if (edits[layer]) delete edits[layer][t]
      return { ...p, edits }
    })
  },

  swapKeys(layer, a, b) {
    const resolved = getResolved()
    const ka = resolved.layers[layer].keys[a]
    const kb = resolved.layers[layer].keys[b]
    updateProject((p) => {
      const edits = Array.from({ length: layerCount(p) }, (_, i) => ({ ...(p.edits?.[i] || {}) }))
      edits[layer][a] = kb
      edits[layer][b] = ka
      return { ...p, edits }
    })
  },

  toggleDefsrc(t) {
    const inDefsrc = getResolved().defsrc.includes(t)
    updateProject((p) => {
      const include = new Set(p.defsrcInclude || [])
      const exclude = new Set(p.defsrcExclude || [])
      if (inDefsrc) {
        include.delete(t)
        exclude.add(t)
      } else {
        exclude.delete(t)
        include.add(t)
      }
      return { ...p, defsrcInclude: [...include], defsrcExclude: [...exclude] }
    })
  },

  // ---- ノートPC配列の編集 ----
  updateTargetKey(t, patch) {
    updateProject((p) => ({
      ...p,
      target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: p.target.keys.map((k, i) => (i === t ? { ...k, ...patch } : k)) },
    }))
  },

  deleteTargetKey(t) {
    const shift = (i) => (i === t ? null : i > t ? i - 1 : i)
    updateProject((p) => {
      const edits = (p.edits || []).map((e) => {
        const out = {}
        for (const [k, v] of Object.entries(e || {})) {
          const n = shift(Number(k))
          if (n !== null) out[n] = v
        }
        return out
      })
      const starts = {}
      for (const [k, v] of Object.entries(p.mapping.starts || {})) {
        if (v === null) starts[k] = null
        else if (shift(v) !== null) starts[k] = shift(v)
      }
      const pins = {}
      for (const [k, v] of Object.entries(p.mapping.pins || {})) pins[k] = v === null ? null : shift(v)
      return {
        ...p,
        target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: p.target.keys.filter((_, i) => i !== t) },
        edits,
        mapping: { starts, pins },
        defsrcInclude: (p.defsrcInclude || []).map(shift).filter((v) => v !== null),
        defsrcExclude: (p.defsrcExclude || []).map(shift).filter((v) => v !== null),
      }
    })
    setState({ selectedTarget: null })
  },

  addTargetKey(kanataKey, label, width, rowY) {
    updateProject((p) => {
      const row = p.target.keys.filter((k) => Math.abs(k.y - rowY) < 0.01).sort((a, b) => a.x - b.x)
      const last = row[row.length - 1]
      const key = { x: last ? last.x + last.w : 0, y: rowY, w: width, h: last?.h || 1, kanataKey, label: label || getKeyLabel(kanataKey, getState().keyLabelMode) }
      return { ...p, target: { ...p.target, layoutId: p.target.layoutId.startsWith('custom') ? p.target.layoutId : `custom-${p.target.layoutId}`, keys: [...p.target.keys, key] } }
    })
  },

  // ---- 機能設定 ----
  setList(name, list) {
    updateProject((p) => ({ ...p, [name]: list }))
  },

  setQmk(qmk) {
    updateProject((p) => ({ ...p, qmk }))
  },

  setKanata(kanata) {
    updateProject((p) => ({ ...p, kanata }))
  },

  setFeatureTab(tab) {
    setState({ featureTab: tab })
  },

  // ---- ファイル ----
  exportKbd() {
    try {
      exportKbdFile(getState().project)
    } catch (err) {
      alert(`変換に失敗しました: ${err.message}`)
    }
  },

  saveProject() {
    saveProjectFile(getState().project)
  },

  newProject() {
    if (!confirm('現在の内容を破棄して新規作成しますか？')) return
    clearAutoSave()
    setState({ project: createProject({ layoutId: 'jis-laptop' }), view: 'mapping', activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, keyLabelMode: 'jis' })
  },
}

// ============================================================
// 描画
// ============================================================

let hoverSource = null
let hoverTarget = null

function segmentIndexMap(resolved) {
  const m = new Map()
  resolved.segments.forEach((seg, i) => seg.keys.forEach((s) => m.set(s, i)))
  return m
}

function renderTargetKeyboard(state, resolved) {
  const container = document.getElementById('keyboard-container')
  const { project, view, keyLabelMode: mode, activeLayer } = state
  const tk = project.target.keys
  const source = project.source
  const segIdx = segmentIndexMap(resolved)
  const layerNames = resolved.layers.map((l) => l.name)
  const defsrc = new Set(resolved.defsrc)

  renderKeyboard(container, tk, {
    render: (t) => {
      const k = tk[t]
      const classes = []
      if (k.fixed) classes.push('key-fixed')
      if (state.layoutEditMode) {
        if (state.selectedTarget === t) classes.push('key-selected')
        return { main: k.label || k.kanataKey || '', corner: k.kanataKey, classes, title: k.kanataKey }
      }
      const s = resolved.inverse[t]
      if (view === 'mapping') {
        if (s === null) {
          classes.push('key-passthrough')
          return { main: k.label || getKeyLabel(k.kanataKey, mode), classes, title: '対応付けなし (Kanata を通さずそのまま入力)' }
        }
        if (hoverSource === s) classes.push('key-hover-link')
        const label = keyConfigLabel(source.layers[0][s], mode, layerNames)
        return {
          ...label,
          classes,
          badge: s + 1,
          corner: k.label || k.kanataKey,
          style: { background: segmentColor(segIdx.get(s) ?? 0) },
          title: `ノートPC: ${k.label || k.kanataKey} ← 自作キーボード #${s + 1}`,
        }
      }
      // キーマップ表示
      const kc = resolved.layers[activeLayer].keys[t]
      const label = keyConfigLabel(kc, mode, layerNames)
      if (!defsrc.has(t)) classes.push('key-passthrough')
      if (state.selectedTarget === t) classes.push('key-selected')
      if (project.edits?.[activeLayer]?.[t]) classes.push('key-edited')
      if (hoverSource !== null && resolved.inverse[t] === hoverSource) classes.push('key-hover-link')
      return { ...label, classes, corner: k.kanataKey, title: `${k.label || k.kanataKey}${s !== null ? ` ← 自作 #${s + 1}` : ''}` }
    },
    onClick: (t, e) => {
      const s = getState()
      if (s.layoutEditMode) return actions.selectTarget(t)
      if (s.view === 'mapping') {
        if (tk[t].fixed) return
        if (s.pickSegment) {
          actions.setStart(s.pickSegment, t)
          setState({ pickSegment: null })
        } else if (s.selectedSource !== null) {
          actions.pin(s.selectedSource, t)
        } else if (resolved.inverse[t] !== null) {
          setState({ selectedSource: resolved.inverse[t] })
        }
        return
      }
      if (e.shiftKey) return actions.toggleDefsrc(t)
      actions.selectTarget(t)
    },
    onContext: (t) => {
      const s = getState()
      if (s.layoutEditMode) return actions.deleteTargetKey(t)
      if (s.view === 'mapping') {
        const src = resolved.inverse[t]
        if (src !== null) actions.pin(src, null)
        return
      }
      actions.toggleDefsrc(t)
    },
    draggable: () => !state.layoutEditMode && view === 'keymap',
    dragData: (t) => `tgt:${t}`,
    onDrop: (data, t) => {
      if (data.startsWith('src:')) actions.pin(parseInt(data.slice(4), 10), t)
      else if (data.startsWith('tgt:')) {
        const from = parseInt(data.slice(4), 10)
        if (from !== t) actions.swapKeys(getState().activeLayer, from, t)
      }
    },
    onHover: (t) => {
      hoverTarget = t
      highlightSource()
    },
  })
}

function renderSourceKeyboard(state, resolved) {
  const pane = document.getElementById('vil-keyboard-pane')
  const container = document.getElementById('vil-keyboard-container')
  const { project, view, keyLabelMode: mode, activeLayer } = state
  const source = project.source
  if (!source) {
    pane.style.display = 'none'
    container.innerHTML = ''
    return
  }
  pane.style.display = ''
  const tk = project.target.keys
  const segIdx = segmentIndexMap(resolved)
  const layerNames = resolved.layers.map((l) => l.name)
  const layer = view === 'mapping' ? 0 : Math.min(activeLayer, source.layers.length - 1)
  document.getElementById('vil-keyboard-label').textContent =
    `自作キーボード: ${source.name || ''} (レイヤー ${layer}${view === 'mapping' ? '・対応付けはベースレイヤーで表示' : ''})`

  renderKeyboard(container, source.keys, {
    render: (s) => {
      const label = keyConfigLabel(source.layers[layer][s], mode, layerNames)
      const t = resolved.map[s]
      const classes = ['vil-key']
      if (t === null) classes.push('key-unmapped')
      if (state.selectedSource === s) classes.push('key-selected')
      if (view === 'keymap' && state.selectedTarget !== null && t === state.selectedTarget) classes.push('key-hover-link')
      return {
        ...label,
        classes,
        badge: s + 1,
        corner: t !== null ? (tk[t].label || tk[t].kanataKey) : '未割当',
        style: view === 'mapping' ? { background: segmentColor(segIdx.get(s) ?? 0) } : undefined,
        title: `#${s + 1} (row ${source.keys[s].row}, col ${source.keys[s].col}) → ${t !== null ? tk[t].kanataKey : '未割当'}`,
      }
    },
    onClick: (s) => {
      const st = getState()
      if (st.view === 'mapping') {
        setState({ selectedSource: st.selectedSource === s ? null : s, pickSegment: null })
      } else if (resolved.map[s] !== null) {
        actions.selectTarget(resolved.map[s])
      }
    },
    onContext: (s) => actions.pin(s, null),
    draggable: () => true,
    dragData: (s) => `src:${s}`,
    onHover: (s) => {
      hoverSource = s
      highlightTarget()
    },
  })
}

// ホバー時の対応キー強調 (再描画なしで class を切り替える)
function highlightTarget() {
  const resolved = getResolved()
  document.querySelectorAll('#keyboard-container .key').forEach((node) => {
    const t = Number(node.dataset.index)
    node.classList.toggle('key-hover-link', hoverSource !== null && resolved.inverse[t] === hoverSource)
  })
}

function highlightSource() {
  const resolved = getResolved()
  document.querySelectorAll('#vil-keyboard-container .key').forEach((node) => {
    const s = Number(node.dataset.index)
    node.classList.toggle('key-hover-link', hoverTarget !== null && resolved.map[s] === hoverTarget)
  })
}

const FEATURE_TABS = [
  ['key', 'キー設定'],
  ['macros', 'マクロ'],
  ['tap-dance', 'タップダンス'],
  ['combos', 'コンボ'],
  ['overrides', 'オーバーライド'],
  ['settings', 'Vial設定'],
  ['preview', '出力プレビュー'],
]

function renderFeatureTabs(state) {
  const container = document.getElementById('feature-tabs')
  container.innerHTML = ''
  const p = state.project
  const counts = { macros: p.macros?.length, 'tap-dance': p.tapDances?.length, combos: p.combos?.length, overrides: (p.keyOverrides?.length || 0) + (p.altRepeatKeys?.length || 0) }
  for (const [id, label] of FEATURE_TABS) {
    const btn = document.createElement('button')
    btn.className = `feature-tab${state.featureTab === id ? ' feature-tab-active' : ''}`
    btn.textContent = label
    if (counts[id]) {
      const b = document.createElement('span')
      b.className = 'feature-tab-badge'
      b.textContent = counts[id]
      btn.appendChild(b)
    }
    btn.addEventListener('click', () => actions.setFeatureTab(id))
    container.appendChild(btn)
  }
}

function renderFeaturePanel(state, resolved) {
  const editor = document.getElementById('editor-panel')
  const feature = document.getElementById('feature-panel')
  if (state.featureTab === 'key') {
    feature.style.display = 'none'
    editor.style.display = 'block'
    renderEditor(state, resolved, actions)
    return
  }
  editor.style.display = 'none'
  feature.style.display = 'block'
  switch (state.featureTab) {
    case 'macros': return renderMacrosPanel(state, actions)
    case 'tap-dance': return renderTapDancePanel(state, resolved, actions)
    case 'combos': return renderCombosPanel(state, resolved, actions)
    case 'overrides': return renderOverridesPanel(state, resolved, actions)
    case 'settings': return renderSettingsPanel(state, actions)
    case 'preview': return renderPreviewPanel(state, actions)
    default: return undefined
  }
}

let saveTimer = null

function render(state) {
  const resolved = getResolved()
  const isMapping = state.view === 'mapping' && !state.layoutEditMode

  document.querySelectorAll('.view-tab').forEach((b) => b.classList.toggle('view-tab-active', b.dataset.view === state.view))
  document.getElementById('btn-label-us').classList.toggle('defsrc-btn-active', state.keyLabelMode === 'us')
  document.getElementById('btn-label-jis').classList.toggle('defsrc-btn-active', state.keyLabelMode === 'jis')
  document.getElementById('btn-layout-edit').classList.toggle('defsrc-btn-active', state.layoutEditMode)
  document.getElementById('layout-edit-panel').style.display = state.layoutEditMode ? 'flex' : 'none'
  document.getElementById('target-keyboard-label').textContent = state.layoutEditMode
    ? 'ノートPC配列の編集 (クリック: 編集 / 右クリック: 削除)'
    : `ノートPC: ${LAYOUT_PRESETS[state.project.target.layoutId]?.name || state.project.target.layoutId}${isMapping ? '' : ` — レイヤー ${state.activeLayer}: ${resolved.layers[state.activeLayer]?.name || ''}`}`
  document.getElementById('status-summary').textContent = summary(state, resolved)
  const hint = document.getElementById('defsrc-hint')
  hint.innerHTML = isMapping
    ? '自作キーをクリック → ノートPCのキーをクリックで割り当て<br>ドラッグ&ドロップも可 / 右クリックで解除'
    : state.layoutEditMode
      ? 'クリック: キー名を編集<br>右クリック: キーを削除'
      : 'クリック: キー設定<br>Shift+クリック / 右クリック: リマップ対象の切替<br>ドラッグ&ドロップ: キー入れ替え'

  const rowSelect = document.getElementById('new-key-row')
  if (state.layoutEditMode && rowSelect) {
    const prev = rowSelect.value
    rowSelect.innerHTML = ''
    const rows = [...new Set(state.project.target.keys.map((k) => k.y))].sort((a, b) => a - b)
    rows.forEach((y, i) => rowSelect.appendChild(Object.assign(document.createElement('option'), { value: y, textContent: `${i + 1} 段目` })))
    if (prev) rowSelect.value = prev
  }

  renderTargetKeyboard(state, resolved)
  renderSourceKeyboard(state, resolved)

  document.getElementById('mapping-panel').style.display = isMapping ? '' : 'none'
  document.getElementById('keymap-area').style.display = isMapping ? 'none' : ''
  if (isMapping) {
    renderMappingPanel(state, resolved, actions)
  } else {
    renderLayers(state, resolved, actions)
    renderFeatureTabs(state)
    renderFeaturePanel(state, resolved)
  }

  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => autoSave(getState().project), 400)
}

function summary(state, resolved) {
  const p = state.project
  if (!p.source) return '.vil 未読み込み'
  const mapped = resolved.map.filter((t) => t !== null).length
  return `${p.source.name || '自作キーボード'}: ${mapped}/${p.source.keys.length} キー割り当て済み / ${resolved.layers.length} レイヤー`
}

// ============================================================
// 初期化
// ============================================================

async function handleFiles(input, fn) {
  const files = [...input.files]
  input.value = ''
  if (files.length === 0) return
  try {
    const next = await fn(getState().project, files)
    const warnings = next.source?.warnings || []
    setState({ project: next, activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, view: 'mapping' })
    if (warnings.length) console.warn('読み込み時の注意:\n' + warnings.join('\n'))
  } catch (err) {
    alert(err.message)
  }
}

function initApp() {
  document.querySelectorAll('.view-tab').forEach((b) => b.addEventListener('click', () => actions.setView(b.dataset.view)))
  document.getElementById('btn-export-kbd').addEventListener('click', actions.exportKbd)
  document.getElementById('btn-save-project').addEventListener('click', actions.saveProject)
  document.getElementById('btn-new-project').addEventListener('click', actions.newProject)
  document.getElementById('btn-load-project').addEventListener('click', () => document.getElementById('file-input-project').click())
  document.getElementById('btn-import-vil').addEventListener('click', actions.importVil)
  document.getElementById('file-input-vil').addEventListener('change', (e) => handleFiles(e.target, importVilFiles))
  document.getElementById('file-input-extras').addEventListener('change', (e) => handleFiles(e.target, importExtraFiles))
  document.getElementById('file-input-project').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const project = await readProjectFile(file)
      setState({ project, activeLayer: 0, selectedTarget: null, selectedSource: null, pickSegment: null, keyLabelMode: LAYOUT_PRESETS[project.target.layoutId]?.keyLabelMode || getState().keyLabelMode })
    } catch (err) {
      alert(`プロジェクトの読み込みに失敗しました: ${err.message}`)
    }
  })
  document.getElementById('btn-label-us').addEventListener('click', () => setState({ keyLabelMode: 'us' }))
  document.getElementById('btn-label-jis').addEventListener('click', () => setState({ keyLabelMode: 'jis' }))
  document.getElementById('btn-layout-edit').addEventListener('click', () => setState((s) => ({ layoutEditMode: !s.layoutEditMode, selectedTarget: null, view: s.layoutEditMode ? s.view : 'keymap', featureTab: 'key' })))
  document.getElementById('btn-add-layout-key').addEventListener('click', () => {
    const kanataKey = document.getElementById('new-key-kanata').value.trim()
    const label = document.getElementById('new-key-label').value.trim()
    const width = parseFloat(document.getElementById('new-key-width').value) || 1
    const rowY = parseFloat(document.getElementById('new-key-row').value)
    if (!kanataKey || Number.isNaN(rowY)) return
    actions.addTargetKey(kanataKey, label, width, rowY)
    document.getElementById('new-key-kanata').value = ''
    document.getElementById('new-key-label').value = ''
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setState({ selectedSource: null, pickSegment: null, selectedTarget: null })
  })

  window.addEventListener('pagehide', () => autoSave(getState().project))
  subscribe(render)
  const restored = autoLoad()
  if (restored) {
    setState({ project: restored, keyLabelMode: LAYOUT_PRESETS[restored.target.layoutId]?.keyLabelMode || 'jis' })
  } else {
    render(getState())
  }
}

document.addEventListener('DOMContentLoaded', initApp)
