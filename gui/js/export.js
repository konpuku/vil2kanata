// ============================================================
// ファイル入出力 (.vil / vial.json / keymap.c / config.h / プロジェクト / .kbd)
// ============================================================

import { importVil } from '../../src/core/vial.mjs'
import { attachSource, loadProjectData, projectToKbd, serializeProject } from '../../src/core/project.mjs'

// 最後に読み込んだ入力ファイル (vial.json を後から追加したときの再読込用)
const rawInputs = { vil: null, vilName: '', vialJson: null, keymapC: null, configH: null }

export function downloadFile(filename, content, mimeType) {
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

export function exportKbdFile(project) {
  const { text } = projectToKbd(project)
  const base = (project.source?.name || 'keymap').replace(/\.[^.]+$/, '')
  downloadFile(`${base}.kbd`, text, 'text/plain')
}

export function saveProjectFile(project) {
  downloadFile('vil2kanata-project.json', serializeProject(project), 'application/json')
}

export async function readProjectFile(file) {
  return loadProjectData(JSON.parse(await file.text()))
}

/**
 * ファイル種別を判定して rawInputs に格納
 */
async function classify(files) {
  for (const file of files) {
    const text = await file.text()
    const name = file.name.toLowerCase()
    if (name.endsWith('.c')) rawInputs.keymapC = text
    else if (name.endsWith('.h')) rawInputs.configH = text
    else {
      let json
      try {
        json = JSON.parse(text)
      } catch {
        throw new Error(`${file.name}: JSON として読み込めません`)
      }
      if (Array.isArray(json.layout)) {
        rawInputs.vil = json
        rawInputs.vilName = file.name
      } else if (json.layouts && json.layouts.keymap) {
        rawInputs.vialJson = json
      } else {
        throw new Error(`${file.name}: .vil / vial.json のどちらでもありません`)
      }
    }
  }
}

function buildSource() {
  return importVil(rawInputs.vil, {
    vialJson: rawInputs.vialJson,
    keymapC: rawInputs.keymapC,
    configH: rawInputs.configH,
    name: rawInputs.vilName,
  })
}

/**
 * .vil (と任意の補助ファイル) を読み込んでプロジェクトに取り込む
 */
export async function importVilFiles(project, files) {
  rawInputs.vialJson = null
  rawInputs.keymapC = null
  rawInputs.configH = null
  await classify(files)
  if (!rawInputs.vil) throw new Error('.vil ファイルが含まれていません')
  return attachSource(project, buildSource())
}

/**
 * vial.json / keymap.c / config.h を後から追加 (手動変更とレイヤー名は保持)
 */
export async function importExtraFiles(project, files) {
  await classify(files)
  if (!rawInputs.vil) throw new Error('先に .vil ファイルを読み込んでください')
  const next = attachSource(project, buildSource())
  next.edits = next.edits.map((_, i) => project.edits?.[i] || {})
  next.layerNames = next.layerNames.map((n, i) => project.layerNames?.[i] || n)
  return next
}

// ============================================================
// 自動保存 (この端末のブラウザのみ)
// ============================================================

const STORAGE_KEY = 'vil2kanata-project-v2'

export function autoSave(project) {
  try {
    localStorage.setItem(STORAGE_KEY, serializeProject(project))
  } catch {
    // 容量超過・プライベートモード等は無視
  }
}

export function autoLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? loadProjectData(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function clearAutoSave() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
