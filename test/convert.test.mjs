import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  importVil, createProject, attachSource, projectToKbd, projectFromSourceOnly,
  resolveProject, loadProjectData, emitKanata,
} from '../src/core/index.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const fx = (name) => fs.readFileSync(path.join(here, 'fixtures', name), 'utf-8')
const KANATA = process.env.KANATA_BIN

// Kanata がある環境では構文チェックまで行う (無ければスキップ)
function assertKanataValid(text, t) {
  if (!KANATA) {
    t.diagnostic('KANATA_BIN 未設定のため kanata --check をスキップ')
    return
  }
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'v2k-')), 'out.kbd')
  fs.writeFileSync(file, text)
  try {
    execFileSync(KANATA, ['--cfg', file, '--check'], { stdio: 'pipe' })
  } catch (err) {
    assert.fail(`kanata --check failed:\n${err.stdout}\n${err.stderr}\n----\n${text}`)
  }
}

function corneSource() {
  return importVil(JSON.parse(fx('corne.vil')), {
    vialJson: fx('vial.json'), keymapC: fx('keymap.c'), configH: fx('config.h'), name: 'corne.vil',
  })
}

function corneProject(layoutId = 'jis-laptop') {
  const p = attachSource(createProject({ layoutId }), corneSource())
  p.kanata.os = 'linux'
  return p
}

test('分割キーボード: 左右・親指が名前一致と近傍推定で対応付けられる', () => {
  const p = corneProject()
  const { map, segments } = resolveProject(p)
  const src = p.source
  const tk = p.target.keys
  const nameAt = (srcName) => {
    const i = src.layers[0].findIndex((kc) => (kc.kanataKey || kc.tapKey) === srcName)
    return map[i] === null ? null : tk[map[i]].kanataKey
  }
  assert.equal(nameAt('q'), 'q')
  assert.equal(nameAt('y'), 'y')
  assert.equal(nameAt('a'), 'a') // LGUI_T(KC_A)
  assert.equal(nameAt('j'), 'j') // RSFT_T(KC_J)
  assert.equal(nameAt('/'), '/')
  assert.equal(segments.length, 8)
  assert.ok(segments.find((s) => s.id === 'r3s1').method === 'inferred')
})

test('始点指定 (ヒアリング) とピン留めが自動推定より優先される', () => {
  const p = corneProject()
  const tk = p.target.keys
  const idx = (name) => tk.findIndex((k) => k.kanataKey === name)
  // 右手親指の始点を「変換」キーに
  p.mapping.starts = { r3s1: idx('henk') }
  let r = resolveProject(p)
  const seg = r.segments.find((s) => s.id === 'r3s1')
  assert.equal(tk[r.map[seg.keys[0]]].kanataKey, 'henk')
  assert.equal(seg.method, 'user')
  // 右上 BSPC を bspc キーへピン留め
  const bspcSrc = p.source.layers[0].findIndex((kc) => kc.kanataKey === 'bspc')
  p.mapping.pins = { [bspcSrc]: idx('bspc') }
  r = resolveProject(p)
  assert.equal(tk[r.map[bspcSrc]].kanataKey, 'bspc')
  // 始点 null = そのセグメントを割り当てない
  p.mapping.starts = { r3s1: null }
  r = resolveProject(p)
  assert.ok(r.segments.find((s) => s.id === 'r3s1').keys.every((s) => r.map[s] === null))
})

test('全レイヤーに同じ対応付けが適用され、手動変更は保持される', () => {
  const p = corneProject()
  const r1 = resolveProject(p)
  const tk = p.target.keys
  const qIdx = tk.findIndex((k) => k.kanataKey === 'q')
  // layer1 の q 位置は KC_1
  assert.equal(r1.layers[1].keys[qIdx].kanataKey, '1')
  p.edits[1] = { [qIdx]: { type: 'basic', kanataKey: 'f13' } }
  p.mapping.starts = { r3s1: tk.findIndex((k) => k.kanataKey === 'henk') }
  const r2 = resolveProject(p)
  assert.equal(r2.layers[1].keys[qIdx].kanataKey, 'f13')
})

test('Vial 機能の再現: 設定値・マクロ・タップダンス・コンボ・オーバーライド', (t) => {
  const { text, warnings } = projectToKbd(corneProject())
  // QMK Settings
  assert.match(text, /tap-time 120/)          // QUICK_TAP_TERM (qsid 25)
  assert.match(text, /hold-time 180/)         // TAPPING_TERM (qsid 7, config.h より .vil 優先)
  assert.match(text, /tap-hold-release-keys \$tap-time \$hold-time a lmet \(/) // Permissive Hold + Chordal Hold
  // マクロ: down/up の修飾 → チョード、数字は Digit、遅延は数値
  assert.match(text, /m0 \(macro C-c\)/)
  assert.match(text, /m2 \(macro S-Digit1 S-Digit2 Digit3 C-z\)/)
  assert.match(text, / 100 ret\)/)
  // タップダンス: hold / double tap / tap-hold と個別 tapping term
  assert.match(text, /td0 \(tap-dance 180 \(\(tap-hold-release \$tap-time 180 esc lctl\) \(tap-hold-release \$tap-time 180 grv lalt\)\)\)/)
  // コンボ: COMBO_TERM と、同じキーが出ないレイヤーでの無効化
  assert.match(text, /\(j k\) esc 40 all-released \(layer1 layer2 layer3\)/)
  assert.match(text, /\(u i\) bspc 40 all-released \(base layer2 layer3\)/)
  // 無効 (enabled=false) のオーバーライドは出力しない / 左右 Shift は個別に展開
  assert.match(text, /\(lsft bspc\) \(del\)/)
  assert.match(text, /\(rsft bspc\) \(del\)/)
  assert.doesNotMatch(text, /\(lctl a\) \(b\)/)
  // TG: 対象レイヤー上ではベースへ戻る
  assert.match(text, /tg2-off \(layer-switch base\)/)
  // One Shot のタイムアウト (qsid 6)
  assert.match(text, /one-shot-press 3000 lsft/)
  // USER キーコード (keymap.c から推定)
  assert.match(text, /usr01 \(tap-hold-release 190 190 ret lang2\)/)
  assert.ok(warnings.some((w) => w.includes('Negative mods')))
  assertKanataValid(text, t)
})

test('ターゲット未指定 (従来互換) モード', (t) => {
  const p = projectFromSourceOnly(corneSource())
  p.kanata.os = 'linux'
  const { text } = projectToKbd(p)
  assert.match(text, /\(defsrc/)
  // タップキー名のないキー (MO(1) 等) も代替キー名で defsrc に残る
  const base = text.split('(deflayer base')[1].split(')')[0]
  assert.match(base, /@mo1/)
  assert.equal(resolveProject(p).defsrc.length, p.source.keys.length)
  assertKanataValid(text, t)
})

test('全プリセットで変換結果が Kanata 構文として有効', (t) => {
  for (const id of ['jis-laptop', 'jis-60', 'us-ansi-60', 'us-ansi-fn', 'us-ansi-tkl']) {
    const { text } = projectToKbd(corneProject(id))
    assertKanataValid(text, t)
  }
  const legacy = importVil(JSON.parse(fx('../../gui/test.vil')))
  const p = attachSource(createProject({ layoutId: 'us-ansi-60' }), legacy)
  p.kanata.os = 'linux'
  assertKanataValid(projectToKbd(p).text, t)
})

test('Windows 出力: IME キーは arbitrary-code、名前が必要な箇所は deflocalkeys-win', (t) => {
  const p = corneProject()
  p.kanata.os = 'windows'
  const { text } = projectToKbd(p)
  assert.match(text, /\(arbitrary-code 242\)/)
  assert.match(text, /\(deflocalkeys-win\n(.*\n)*  lang1 242/)
  // Linux 用の定義も併記されるため、同じファイルを Linux 版 kanata でも検証できる
  assertKanataValid(text, t)
})

test('Magic 設定: キーマップ上のキーのみ入れ替え、修飾ビットとマクロは対象外', () => {
  const p = corneProject()
  p.qmk.magic.swapControlCapslock = true
  const { text } = projectToKbd(p)
  assert.match(text, /esc-lctl \(tap-hold-release-keys \$tap-time \$hold-time esc lctl/)
  assert.match(text, /m0 \(macro C-c\)/)
})

test('Auto Shift 設定で英字・数字キーが tap-hold に置き換わる', (t) => {
  const p = corneProject()
  p.qmk.autoShift.enabled = true
  p.qmk.autoShift.noNumeric = true
  const { text } = projectToKbd(p)
  assert.match(text, /as-q \(tap-hold \$tap-time 175 q S-q\)/)
  assert.doesNotMatch(text, /as-1 /)
  assertKanataValid(text, t)
})

test('v1 プロジェクト (旧 GUI 保存形式) の読み込み', (t) => {
  const v1 = {
    version: 1,
    layout: 'us-ansi-60',
    physicalLayout: [
      { x: 0, y: 0, w: 1, h: 1, kanataKey: 'a', label: 'A' },
      { x: 1, y: 0, w: 1, h: 1, kanataKey: 'b', label: 'B' },
      { x: 2, y: 0, w: 1, h: 1, kanataKey: 'c', label: 'C' },
    ],
    defsrcKeys: [0, 1, 2],
    layers: [
      { name: 'base', keys: [
        { type: 'mod-tap', tapKey: 'a', holdMod: 'lsft', tapHoldVariant: 'tap-hold-press' },
        { type: 'tap-dance', index: 0 },
        { type: 'macro', index: 0 },
      ] },
      { name: 'nav', keys: [{ type: 'modified', kanataKey: 'S-9' }, { type: 'transparent' }, { type: 'layer-op', op: 'MO', layer: 1 }] },
    ],
    macros: [{ id: 0, actions: [{ type: 'tap', key: '1' }, { type: 'delay', duration: 20 }, { type: 'text', text: 'ok' }] }],
    tapDancesGui: [{ id: 0, timeout: 250, actions: [{ type: 'basic', kanataKey: 'x' }, { type: 'basic', kanataKey: 'y' }] }],
    combos: [{ id: 0, keys: ['b', 'c'], result: 'esc', timeout: 60 }],
    keyOverrides: [{ id: 0, trigger: 'a', triggerMods: ['lsft'], replacementKey: 'b', replacementMods: [] }],
    settings: { tapTime: 150, holdTime: 220, processUnmappedKeys: true, concurrentTapHold: true, rapidEventDelay: 5 },
  }
  const p = loadProjectData(v1)
  p.kanata.os = 'linux'
  const { text } = projectToKbd(p)
  assert.match(text, /\(tap-hold-press \$tap-time \$hold-time a lsft\)/)
  assert.match(text, /td1000 \(tap-dance 250 \(x y\)\)/)
  assert.match(text, /m0 \(macro Digit1 20 o k\)/)
  assert.match(text, /tap-time 150/)
  assert.match(text, /hold-time 220/)
  assertKanataValid(text, t)
})

test('emitKanata 単体: 空に近い入力でも有効な設定を出力', (t) => {
  const { text } = emitKanata({
    targetKeys: [{ kanataKey: 'a' }, { kanataKey: 'b' }],
    layers: [{ name: 'base', keys: [{ type: 'basic', kanataKey: 'b' }, { type: 'basic', kanataKey: 'a' }] }],
    kanata: { os: 'linux' },
  })
  assert.match(text, /\(deflayer base\n  b +a/)
  assertKanataValid(text, t)
})

test('Windows + JIS 英数キーに動作を割り当てると警告し、f13 に置き換えると解消される', (t) => {
  const p = corneProject()
  p.kanata.os = 'windows'
  const warnsOf = (proj) => projectToKbd(proj).warnings.filter((w) => w.includes('英数'))
  assert.equal(warnsOf(p).length, 1) // Corne の Esc/Ctrl (Mod-Tap) が英数キーに割り当たる
  const eisu = p.target.keys.findIndex((k) => k.kanataKey === 'caps')
  p.target.keys[eisu] = { ...p.target.keys[eisu], kanataKey: 'f13', label: '英数(F13)', winNoRelease: false }
  assert.equal(warnsOf(p).length, 0)
  const { text } = projectToKbd(p)
  assert.match(text, /\(defsrc\n.*\n  f13 /)
  assertKanataValid(text, t)
})

test('Scancode Map (.reg): 英数 (0x3A) → F13 (0x64)、カタカナ/ひらがな (0x70) → F14 (0x65)', async () => {
  const { JIS_IME_KEYS_REG } = await import('../src/core/windows.mjs')
  assert.match(JIS_IME_KEYS_REG, /"Scancode Map"=hex:00,00,00,00,00,00,00,00,03,00,00,00,64,00,3a,00,65,00,70,00,00,00,00,00/)
})

test('Windows + JIS カタカナ/ひらがなキーに動作を割り当てると警告し、f14 に置き換えると解消される', (t) => {
  const p = corneProject()
  p.kanata.os = 'windows'
  const kana = p.target.keys.findIndex((k) => k.kanataKey === 'kana')
  assert.ok(resolveProject(p).map.includes(kana)) // Corne の右親指が割り当たっている
  const warnsOf = (proj) => projectToKbd(proj).warnings.filter((w) => w.includes('カタカナ'))
  assert.equal(warnsOf(p).length, 1)
  p.target.keys[kana] = { ...p.target.keys[kana], kanataKey: 'f14', label: 'かな(F14)', winNoRelease: false }
  assert.equal(warnsOf(p).length, 0)
  assertKanataValid(projectToKbd(p).text, t)
})
