import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  parseQmkKeycode, decodeQmkSettings, decodeLayoutOptions, parseVialJson, textToKeys,
} from '../src/core/index.mjs'

test('QMK キーコード: 基本・修飾・シフト済み', () => {
  assert.deepEqual(parseQmkKeycode('KC_A'), { type: 'basic', kanataKey: 'a' })
  assert.deepEqual(parseQmkKeycode('KC_BSPACE'), { type: 'basic', kanataKey: 'bspc' })
  assert.deepEqual(parseQmkKeycode('KC_EXLM'), { type: 'modified', mods: ['lsft'], baseKey: '1', kanataKey: 'S-1' })
  assert.deepEqual(parseQmkKeycode('C_S(KC_V)').kanataKey, 'C-S-v')
  assert.deepEqual(parseQmkKeycode('LCTL(LSFT(KC_A))').kanataKey, 'C-S-a')
  assert.deepEqual(parseQmkKeycode('RALT(KC_E)').kanataKey, 'RA-e')
  assert.equal(parseQmkKeycode('KC_TRNS').type, 'transparent')
  assert.equal(parseQmkKeycode('KC_NO').type, 'disabled')
  assert.equal(parseQmkKeycode(-1), null)
})

test('QMK キーコード: Mod-Tap / Layer-Tap / レイヤー操作', () => {
  assert.deepEqual(parseQmkKeycode('LGUI_T(KC_A)'), { type: 'mod-tap', tapKey: 'a', holdMods: ['lmet'], holdMod: 'lmet' })
  assert.deepEqual(parseQmkKeycode('MEH_T(KC_Z)').holdMods, ['lctl', 'lsft', 'lalt'])
  assert.deepEqual(parseQmkKeycode('MT(MOD_LCTL|MOD_LALT, KC_B)').holdMods, ['lctl', 'lalt'])
  assert.deepEqual(parseQmkKeycode('LT1(KC_SPACE)'), { type: 'layer-tap', tapKey: 'spc', layer: 1 })
  assert.deepEqual(parseQmkKeycode('LT(2, KC_ENT)'), { type: 'layer-tap', tapKey: 'ret', layer: 2 })
  for (const op of ['MO', 'TG', 'TO', 'DF', 'OSL', 'TT', 'PDF']) {
    assert.deepEqual(parseQmkKeycode(`${op}(3)`), { type: 'layer-op', op, layer: 3 })
  }
  assert.deepEqual(parseQmkKeycode('OSM(MOD_LCTL|MOD_LSFT)'), { type: 'one-shot-mod', mods: ['lctl', 'lsft'] })
  assert.deepEqual(parseQmkKeycode('LM(1, MOD_LSFT)'), { type: 'layer-mod', layer: 1, mods: ['lsft'] })
  assert.deepEqual(parseQmkKeycode('TD(4)'), { type: 'tap-dance', index: 4 })
  assert.deepEqual(parseQmkKeycode('M12'), { type: 'macro', index: 12 })
  assert.deepEqual(parseQmkKeycode('USER03'), { type: 'user', index: 3 })
  assert.deepEqual(parseQmkKeycode('KC_GESC'), { type: 'special', id: 'GESC' })
})

test('QMK キーコード: 数値 (Vial が "0x...." で保存する値)', () => {
  assert.deepEqual(parseQmkKeycode('0x4104'), { type: 'layer-tap', tapKey: 'a', layer: 1 })
  assert.deepEqual(parseQmkKeycode('0x5022'), { type: 'layer-mod', layer: 1, mods: ['lsft'] })
  assert.deepEqual(parseQmkKeycode('0x5221'), { type: 'layer-op', op: 'MO', layer: 1 })
  assert.deepEqual(parseQmkKeycode('0x2204').holdMods, ['lsft'])
  assert.equal(parseQmkKeycode('0x1204').kanataKey, 'RS-a')
})

test('QMK Settings のデコード', () => {
  const { values, present } = decodeQmkSettings({ 7: 180, 2: 30, 22: 1, 25: 100, 21: 0b1, 3: 0b1001, 4: 150 })
  assert.equal(values.tappingTerm, 180)
  assert.equal(values.comboTerm, 30)
  assert.equal(values.permissiveHold, true)
  assert.equal(values.quickTapTerm, 100)
  assert.equal(values.magic.swapControlCapslock, true)
  assert.equal(values.autoShift.enabled, true)
  assert.equal(values.autoShift.noNumeric, true)
  assert.equal(values.autoShift.timeout, 150)
  assert.ok(present.has(7))
})

test('レイアウトオプションのデコード (vial-gui と同じビット順)', () => {
  // labels: ["Split BS"(1bit), ["Bottom", "A", "B", "C"](2bit)] → value 0b1_10 = 6
  assert.deepEqual(decodeLayoutOptions(['Split BS', ['Bottom', 'A', 'B', 'C']], 6), [1, 2])
  assert.deepEqual(decodeLayoutOptions(['Split BS', ['Bottom', 'A', 'B', 'C']], 0), [0, 0])
})

test('vial.json: KLE の解析とレイアウトオプション', () => {
  const json = {
    layouts: {
      labels: ['Split Space'],
      keymap: [
        ['0,0', '0,1'],
        [{ w: 2 }, '1,0\n\n\n0,0', { x: -2 }, '1,0\n\n\n0,1', '1,1\n\n\n0,1'],
      ],
    },
  }
  const unsplit = parseVialJson(json, 0)
  assert.deepEqual(unsplit.keys.map((k) => `${k.row},${k.col}`), ['0,0', '0,1', '1,0'])
  assert.equal(unsplit.keys[2].w, 2)
  const split = parseVialJson(json, 1)
  assert.deepEqual(split.keys.map((k) => `${k.row},${k.col}`), ['0,0', '0,1', '1,0', '1,1'])
  assert.equal(split.keys[2].w, 1)
})

test('テキスト → キー (US / JIS)', () => {
  assert.deepEqual(textToKeys('@', 'us'), ['S-2'])
  assert.deepEqual(textToKeys('@', 'jis'), ['['])
  assert.deepEqual(textToKeys('_', 'jis'), ['S-ro'])
  assert.deepEqual(textToKeys('é', 'us'), [{ unicode: 'é' }])
})
