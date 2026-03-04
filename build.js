#!/usr/bin/env node
// ============================================================
// ES Modules → 単一スクリプトバンドラー
// file:// プロトコルで動作させるため、全モジュールを1ファイルに結合する
//
// 使い方: node build.js
// 出力:   gui/bundle.js
// ============================================================

const fs = require('fs')
const path = require('path')

const jsDir = path.join(__dirname, 'gui', 'js')
const outFile = path.join(__dirname, 'gui', 'bundle.js')

// 依存順（循環なし）
const moduleOrder = [
  'store.js',
  'layouts.js',
  'converter.js',
  'defsrc.js',
  'layers.js',
  'keyboard.js',
  'editor.js',
  'combos.js',
  'macros.js',
  'tap-dance.js',
  'overrides.js',
  'export.js',
  'app.js',
]

function processModule(filename) {
  const filePath = path.join(jsDir, filename)
  let code = fs.readFileSync(filePath, 'utf-8')

  // export された名前を収集
  const exportedNames = []

  // export function name / export async function name
  const funcRegex = /^export\s+(async\s+)?function\s+(\w+)/gm
  let m
  while ((m = funcRegex.exec(code)) !== null) {
    exportedNames.push(m[2])
  }

  // export const/let/var name
  const varRegex = /^export\s+(?:const|let|var)\s+(\w+)/gm
  while ((m = varRegex.exec(code)) !== null) {
    exportedNames.push(m[1])
  }

  // import された名前を収集
  const importedNames = []
  const importRegex = /^import\s+\{([^}]+)\}\s+from\s+'[^']+'\s*;?\s*$/gm
  while ((m = importRegex.exec(code)) !== null) {
    const names = m[1].split(',').map((n) => n.trim()).filter(Boolean)
    importedNames.push(...names)
  }

  // import 行を除去
  code = code.replace(/^import\s+\{[^}]+\}\s+from\s+'[^']+'\s*;?\s*$/gm, '')

  // export キーワードを除去
  code = code.replace(/^export\s+(async\s+function|function|const|let|var|class)\s/gm, '$1 ')

  // インポートされた名前のローカルエイリアス（V2K から取得）
  let aliases = ''
  for (const name of importedNames) {
    aliases += `  const ${name} = V2K.${name};\n`
  }

  // エクスポート名を V2K に登録
  let assigns = ''
  for (const name of exportedNames) {
    assigns += `  V2K.${name} = ${name};\n`
  }

  let result = `// === ${filename} ===\n`
  result += '(function() {\n'
  if (aliases) result += aliases + '\n'
  result += code + '\n'
  if (assigns) result += assigns
  result += '})();\n\n'

  return result
}

// バンドル生成
let bundle = '// vil2kanata GUI - バンドル済みスクリプト\n'
bundle += '// このファイルは build.js で自動生成されます。直接編集しないでください。\n'
bundle += '// ソースファイル: gui/js/*.js\n'
bundle += ';(function() {\n"use strict";\nconst V2K = {};\n\n'

for (const filename of moduleOrder) {
  bundle += processModule(filename)
}

bundle += '})();\n'

fs.writeFileSync(outFile, bundle, 'utf-8')

const stats = fs.statSync(outFile)
const sizeKB = (stats.size / 1024).toFixed(1)
console.log(`bundle created: gui/bundle.js (${sizeKB} KB)`)
console.log(`modules: ${moduleOrder.length}`)
