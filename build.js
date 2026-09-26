#!/usr/bin/env node
// ============================================================
// ES Modules → 単一スクリプトバンドラー
// file:// プロトコルで動作させるため、全モジュールを1ファイルに結合する
//
// 使い方: node build.js          バンドル生成
//         node build.js --check  バンドルが最新か確認 (CI / テスト用)
// 出力:   gui/bundle.js
// ============================================================

const fs = require('fs')
const path = require('path')

const root = __dirname
const outFile = path.join(root, 'gui', 'bundle.js')

// 依存順（循環なし）。src/core は CLI と共通の変換ロジック
const moduleOrder = [
  'src/core/keycodes.mjs',
  'src/core/qmk.mjs',
  'src/core/settings.mjs',
  'src/core/kle.mjs',
  'src/core/firmware.mjs',
  'src/core/vial.mjs',
  'src/core/mapping.mjs',
  'src/core/layouts.mjs',
  'src/core/text.mjs',
  'src/core/emit.mjs',
  'src/core/project.mjs',
  'gui/js/store.js',
  'gui/js/labels.js',
  'gui/js/pickers.js',
  'gui/js/keyboard.js',
  'gui/js/layers.js',
  'gui/js/mapping-panel.js',
  'gui/js/editor.js',
  'gui/js/macros.js',
  'gui/js/tap-dance.js',
  'gui/js/combos.js',
  'gui/js/overrides.js',
  'gui/js/settings-panel.js',
  'gui/js/preview.js',
  'gui/js/export.js',
  'gui/js/app.js',
]

const IMPORT_RE = /^import\s+\{([^}]+)\}\s+from\s+'[^']+'\s*;?\s*$/gm

function processModule(relPath, exportOwners) {
  let code = fs.readFileSync(path.join(root, relPath), 'utf-8')

  const exportedNames = []
  let m
  const funcRegex = /^export\s+(async\s+)?function\s+(\w+)/gm
  while ((m = funcRegex.exec(code)) !== null) exportedNames.push(m[2])
  const varRegex = /^export\s+(?:const|let|var|class)\s+(\w+)/gm
  while ((m = varRegex.exec(code)) !== null) exportedNames.push(m[1])

  if (/^export\s+(\*|\{|default)/m.test(code)) {
    throw new Error(`${relPath}: export * / export { } / export default はバンドラー非対応です`)
  }
  for (const name of exportedNames) {
    if (exportOwners.has(name)) {
      throw new Error(`export 名の重複: ${name} (${exportOwners.get(name)} と ${relPath})`)
    }
    exportOwners.set(name, relPath)
  }

  const importedNames = []
  while ((m = IMPORT_RE.exec(code)) !== null) {
    importedNames.push(...m[1].split(',').map((n) => n.trim()).filter(Boolean))
  }
  code = code.replace(IMPORT_RE, '')
  code = code.replace(/^export\s+(async\s+function|function|const|let|var|class)\s/gm, '$1 ')

  let aliases = ''
  for (const name of importedNames) {
    if (!exportOwners.has(name)) throw new Error(`${relPath}: ${name} の import 元が未定義 (moduleOrder を確認)`)
    aliases += `  const ${name} = V2K.${name};\n`
  }
  let assigns = ''
  for (const name of exportedNames) assigns += `  V2K.${name} = ${name};\n`

  let result = `// === ${relPath} ===\n`
  result += '(function() {\n'
  if (aliases) result += aliases + '\n'
  result += code + '\n'
  if (assigns) result += assigns
  result += '})();\n\n'
  return result
}

function buildBundle() {
  const owners = new Map()
  let bundle = '// vil2kanata GUI - バンドル済みスクリプト\n'
  bundle += '// このファイルは build.js で自動生成されます。直接編集しないでください。\n'
  bundle += '// ソースファイル: src/core/*.mjs, gui/js/*.js\n'
  bundle += ';(function() {\n"use strict";\nconst V2K = {};\n\n'
  for (const rel of moduleOrder) bundle += processModule(rel, owners)
  bundle += '})();\n'
  return bundle
}

const bundle = buildBundle()
if (process.argv.includes('--check')) {
  const current = fs.existsSync(outFile) ? fs.readFileSync(outFile, 'utf-8') : ''
  if (current !== bundle) {
    console.error('gui/bundle.js が最新ではありません。node build.js を実行してください。')
    process.exit(1)
  }
  console.log('gui/bundle.js is up to date')
} else {
  fs.writeFileSync(outFile, bundle, 'utf-8')
  const sizeKB = (fs.statSync(outFile).size / 1024).toFixed(1)
  console.log(`bundle created: gui/bundle.js (${sizeKB} KB)`)
  console.log(`modules: ${moduleOrder.length}`)
}
