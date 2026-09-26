import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

test('gui/bundle.js が src/core と gui/js から再生成された最新版である', () => {
  const out = execFileSync(process.execPath, [path.join(root, 'build.js'), '--check'], { encoding: 'utf-8' })
  assert.match(out, /up to date/)
})

test('CLI: --help と基本変換', () => {
  const cli = path.join(root, 'vil2kanata.js')
  const help = execFileSync(process.execPath, [cli, '--help'], { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] })
  assert.equal(help, '')
  const out = execFileSync(process.execPath, [cli, path.join(root, 'gui', 'test.vil'), '-t', 'jis-laptop', '--quiet'], { encoding: 'utf-8' })
  assert.match(out, /\(defsrc/)
  assert.match(out, /\(deflayer base/)
})
