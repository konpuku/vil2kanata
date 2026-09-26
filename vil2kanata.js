#!/usr/bin/env node
'use strict'

// ============================================================
// vil2kanata CLI
// 変換ロジックは src/core/ (GUI と共通) にあり、ここは入出力のみを担当する
// ============================================================

const fs = require('fs')
const path = require('path')

const HELP = `Usage: node vil2kanata.js <input.vil> [options]
       node vil2kanata.js --project project.json [options]

Vial (.vil) → Kanata (.kbd) converter

Options:
  -o, --output FILE        出力ファイル (省略時は標準出力)
  -t, --target PRESET      ノートPCの配列プリセット。指定すると自作キーボードの
                           キーをノートPCのキーへ自動で対応付けます
                           (${'${PRESETS}'})
                           省略時は自作キーボードの配列をそのまま defsrc にします
  -s, --start SEG=KEY      行セグメントの始点を指定 (複数可)
                           例: --start r0s0=tab --start r0s1=y
                           セグメント ID は --list-segments で確認できます
  -p, --project FILE       GUI で保存したプロジェクト (.json) を使用
                           (対応付け・手動変更・各種設定を反映)
  -f, --firmware-dir DIR   vial.json / keymap.c / config.h を読み込むディレクトリ
      --vial-json FILE     vial.json (物理配置・カスタムキーコード名)
      --keymap-c FILE      keymap.c (USER キーコードの動作推定)
      --config-h FILE      config.h (TAPPING_TERM 等)
      --os OS              出力先 OS: windows (既定) | linux | macos
      --text-layout L      マクロの文字入力: jis (既定) | us (Vial 本来の動作)
      --list-segments      対応付けの行セグメントと推定された始点を表示して終了
      --quiet              警告を表示しない
  -h, --help               ヘルプを表示
`

function parseArgs(argv) {
  const opts = { starts: [] }
  const positional = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      if (i + 1 >= argv.length) throw new Error(`${a} には値が必要です`)
      return argv[++i]
    }
    switch (a) {
      case '-o': case '--output': opts.output = next(); break
      case '-t': case '--target': opts.target = next(); break
      case '-s': case '--start': opts.starts.push(next()); break
      case '-p': case '--project': opts.project = next(); break
      case '-f': case '--firmware-dir': opts.firmwareDir = next(); break
      case '--vial-json': opts.vialJson = next(); break
      case '--keymap-c': opts.keymapC = next(); break
      case '--config-h': opts.configH = next(); break
      case '--os': opts.os = next(); break
      case '--text-layout': opts.textLayout = next(); break
      case '--list-segments': opts.listSegments = true; break
      case '--quiet': opts.quiet = true; break
      case '-h': case '--help': opts.help = true; break
      default:
        if (a.startsWith('-')) throw new Error(`不明なオプション: ${a}`)
        positional.push(a)
    }
  }
  opts.input = positional[0]
  return opts
}

function readIfExists(file) {
  return file && fs.existsSync(file) ? fs.readFileSync(file, 'utf-8') : undefined
}

async function main() {
  const core = await import(path.join(__dirname, 'src', 'core', 'index.mjs'))
  let opts
  try {
    opts = parseArgs(process.argv.slice(2))
  } catch (err) {
    console.error(`エラー: ${err.message}`)
    process.exit(1)
  }
  const presets = core.getLayoutPresets().map((p) => p.id).join(', ')
  if (opts.help || (!opts.input && !opts.project)) {
    console.error(HELP.replace('${PRESETS}', presets))
    process.exit(opts.help ? 0 : 1)
  }
  if (opts.os && !['windows', 'linux', 'macos'].includes(opts.os)) {
    console.error(`エラー: --os は windows / linux / macos のいずれかです`)
    process.exit(1)
  }

  let project
  try {
    if (opts.project) {
      project = core.loadProjectData(JSON.parse(fs.readFileSync(opts.project, 'utf-8')))
    }

    if (opts.input) {
      const fwDir = opts.firmwareDir ? path.resolve(opts.firmwareDir) : null
      if (fwDir && !fs.existsSync(fwDir)) throw new Error(`ファームウェアディレクトリが見つかりません: ${fwDir}`)
      const fromDir = (name) => (fwDir ? readIfExists(path.join(fwDir, name)) : undefined)
      const vil = core.parseVilText(fs.readFileSync(opts.input, 'utf-8'))
      const source = core.importVil(vil, {
        vialJson: readIfExists(opts.vialJson) ?? fromDir('vial.json'),
        keymapC: readIfExists(opts.keymapC) ?? fromDir('keymap.c'),
        configH: readIfExists(opts.configH) ?? fromDir('config.h'),
        name: path.basename(opts.input),
      })
      if (project) {
        // プロジェクトの対応付け・手動変更はそのままに、.vil の内容で更新
        const mapping = project.mapping
        const edits = project.edits
        const names = project.layerNames
        project = core.attachSource(project, source)
        project.mapping = mapping
        project.edits = source.layers.map((_, i) => edits[i] || {})
        project.layerNames = source.layers.map((_, i) => names[i] || project.layerNames[i])
      } else if (opts.target) {
        project = core.attachSource(core.createProject({ layoutId: opts.target }), source)
      } else {
        project = core.projectFromSourceOnly(source)
      }
      if (!opts.quiet) for (const w of source.warnings) console.error(`  警告: ${w}`)
    }

    // 始点指定: SEG=KEY (KEY はターゲットの kanata キー名、または #index)
    for (const spec of opts.starts) {
      const [seg, key] = spec.split('=')
      if (!seg || key === undefined) throw new Error(`--start の形式が不正です: ${spec}`)
      let idx = null
      if (key !== '' && key !== 'none') {
        idx = key.startsWith('#')
          ? parseInt(key.slice(1), 10)
          : project.target.keys.findIndex((k) => k.kanataKey === key)
        if (idx < 0 || Number.isNaN(idx)) throw new Error(`ターゲット配列にキー ${key} がありません`)
      }
      project.mapping.starts = { ...project.mapping.starts, [seg]: idx }
    }
    if (opts.os) project.kanata.os = opts.os
    if (opts.textLayout) project.kanata.textLayout = opts.textLayout

    if (opts.listSegments) {
      printSegments(core, project)
      return
    }

    const { text, warnings } = core.projectToKbd(project)
    if (!opts.quiet) for (const w of warnings) console.error(`  注意: ${w}`)
    if (opts.output) {
      fs.writeFileSync(opts.output, text, 'utf-8')
      console.error(`変換完了: ${opts.output}`)
    } else {
      process.stdout.write(text)
    }
  } catch (err) {
    console.error(`エラー: ${err.message}`)
    process.exit(1)
  }
}

function printSegments(core, project) {
  const { segments, map } = core.resolveProject(project)
  const source = project.source
  const tk = project.target.keys
  const label = (kc) => {
    const n = core.tapKeyName(kc)
    return n || (kc ? kc.type : '?')
  }
  console.log('セグメント  方法      始点        キー (ソース→ターゲット)')
  for (const seg of segments) {
    const start = seg.startTarget !== null ? tk[seg.startTarget].kanataKey : '-'
    const keys = seg.keys.map((s) => `${label(source.layers[0][s])}→${map[s] !== null ? tk[map[s]].kanataKey : '∅'}`)
    console.log(`${seg.id.padEnd(10)}  ${String(seg.method).padEnd(8)}  ${String(start).padEnd(10)}  ${keys.join(' ')}`)
  }
}

main()
