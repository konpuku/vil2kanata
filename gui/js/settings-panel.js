// ============================================================
// Vial (QMK Settings) / Kanata 出力設定パネル
// ============================================================

import { el } from './pickers.js'

const GROUPS = [
  ['Tap-Hold', [
    ['num', 'tappingTerm', 'Tapping Term (ms)', 'hold-time', 7],
    ['num', 'quickTapTerm', 'Quick Tap Term (ms, 空欄 = Tapping Term)', 'tap-time', 25],
    ['bool', 'permissiveHold', 'Permissive Hold', 'tap-hold-release', 22],
    ['bool', 'holdOnOtherKeyPress', 'Hold On Other Key Press', 'tap-hold-press', 23],
    ['bool', 'chordalHold', 'Chordal Hold', '同じ手のキーでタップ確定 (tap-hold-release-keys)', 26],
    ['bool', 'retroTapping', 'Retro Tapping', '再現不可', 24],
    ['num', 'flowTapTerm', 'Flow Tap (ms)', '再現不可', 27],
    ['num', 'tappingToggle', 'Tapping Toggle (TT の回数)', 'TT', 20],
  ]],
  ['Combo / One Shot', [
    ['num', 'comboTerm', 'Combo 判定時間 (ms)', 'defchordsv2', 2],
    ['num', 'oneShotTimeout', 'One Shot タイムアウト (ms, 0 = なし)', 'one-shot', 6],
  ]],
  ['Auto Shift', [
    ['bool', 'autoShift.enabled', '有効', 'tap-hold で Shift', 3],
    ['num', 'autoShift.timeout', 'タイムアウト (ms)', '', 4],
    ['bool', 'autoShift.noAlpha', '英字に適用しない', '', 3],
    ['bool', 'autoShift.noNumeric', '数字に適用しない', '', 3],
    ['bool', 'autoShift.noSpecial', '記号に適用しない', '', 3],
  ]],
  ['Grave Escape', [
    ['bool', 'graveEsc.altOverride', 'Alt 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.ctrlOverride', 'Ctrl 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.guiOverride', 'GUI 押下時は常に Esc', '', 1],
    ['bool', 'graveEsc.shiftOverride', 'Shift 押下時は常に Esc', '', 1],
  ]],
  ['Magic', [
    ['bool', 'magic.swapControlCapslock', 'Caps Lock と左 Ctrl を入れ替え', '', 21],
    ['bool', 'magic.capslockToControl', 'Caps Lock を Ctrl に', '', 21],
    ['bool', 'magic.swapLaltLgui', '左 Alt と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapRaltRgui', '右 Alt と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapLctlLgui', '左 Ctrl と GUI を入れ替え', '', 21],
    ['bool', 'magic.swapRctlRgui', '右 Ctrl と GUI を入れ替え', '', 21],
    ['bool', 'magic.noGui', 'GUI キーを無効化', '', 21],
    ['bool', 'magic.swapGraveEsc', '` と Esc を入れ替え', '', 21],
    ['bool', 'magic.swapBackslashBackspace', '\\ と Backspace を入れ替え', '', 21],
  ]],
  ['Mouse keys', [
    ['num', 'mouse.interval', 'カーソル移動の間隔 (ms)', 'movemouse-accel', 10],
    ['num', 'mouse.moveDelta', '移動量 (px)', '', 11],
    ['num', 'mouse.maxSpeed', '最大速度 (倍率)', '', 12],
    ['num', 'mouse.timeToMax', '最大速度までの回数', '', 13],
    ['num', 'mouse.wheelInterval', 'ホイールの間隔 (ms)', 'mwheel', 15],
  ]],
]

function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

function setPath(obj, path, value) {
  const keys = path.split('.')
  const out = { ...obj }
  let cur = out
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return out
}

export function renderSettingsPanel(state, actions) {
  const panel = document.getElementById('feature-panel')
  panel.innerHTML = ''
  const { project } = state
  const qmk = project.qmk
  const present = new Set(project.source?.qmkSettingsPresent || [])

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [
    el('h3', { text: 'Vial 設定 (QMK Settings)' }),
    el('span', { class: 'feature-panel-desc', text: '.vil の設定値を読み込み済み。● は .vil に含まれていた項目です' }),
  ]))

  const grid = el('div', { class: 'settings-grid' })
  for (const [title, fields] of GROUPS) {
    const box = el('div', { class: 'settings-group' }, [el('h4', { text: title })])
    for (const [type, path, label, note, qsid] of fields) {
      const value = getPath(qmk, path)
      let input
      if (type === 'bool') {
        input = el('input', { type: 'checkbox' })
        input.checked = !!value
        input.addEventListener('change', () => actions.setQmk(setPath(qmk, path, input.checked)))
      } else {
        input = el('input', { type: 'number', class: 'feature-number-input', value: value ?? '', min: 0, max: 65535 })
        input.addEventListener('change', () => {
          const v = input.value === '' ? null : parseInt(input.value, 10)
          if (v === null && path !== 'quickTapTerm') return
          actions.setQmk(setPath(qmk, path, v))
        })
      }
      box.appendChild(el('label', { class: 'settings-field', title: `qsid ${qsid}` }, [
        el('span', { class: 'settings-dot', text: present.has(qsid) ? '●' : '' }),
        input,
        el('span', { text: label }),
        note ? el('span', { class: 'settings-note', text: note }) : null,
      ]))
    }
    grid.appendChild(box)
  }
  panel.appendChild(grid)

  // Kanata 出力設定
  const k = project.kanata
  const setK = (patch) => actions.setKanata({ ...k, ...patch })
  const osSel = el('select', { class: 'editor-select' })
  for (const [v, label] of [['windows', 'Windows'], ['linux', 'Linux'], ['macos', 'macOS']]) {
    const opt = el('option', { value: v, text: label })
    if (k.os === v) opt.selected = true
    osSel.appendChild(opt)
  }
  osSel.addEventListener('change', () => setK({ os: osSel.value }))
  const textSel = el('select', { class: 'editor-select' })
  for (const [v, label] of [['jis', 'JIS: 文字どおりに入力 (OS が JIS 配列)'], ['us', 'US: Vial 本来の動作 (US キーコード)']]) {
    const opt = el('option', { value: v, text: label })
    if (k.textLayout === v) opt.selected = true
    textSel.appendChild(opt)
  }
  textSel.addEventListener('change', () => setK({ textLayout: textSel.value }))
  const unmapped = el('input', { type: 'checkbox' })
  unmapped.checked = k.processUnmappedKeys !== false
  unmapped.addEventListener('change', () => setK({ processUnmappedKeys: unmapped.checked }))
  const concurrent = el('input', { type: 'checkbox' })
  concurrent.checked = k.concurrentTapHold !== false
  concurrent.addEventListener('change', () => setK({ concurrentTapHold: concurrent.checked }))
  const rapid = el('input', { type: 'number', class: 'feature-number-input', value: k.rapidEventDelay ?? 5, min: 0, max: 100 })
  rapid.addEventListener('change', () => setK({ rapidEventDelay: parseInt(rapid.value, 10) || 0 }))

  panel.appendChild(el('div', { class: 'feature-panel-header' }, [el('h3', { text: 'Kanata 出力設定' })]))
  panel.appendChild(el('div', { class: 'settings-group' }, [
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), osSel, el('span', { text: '出力先 OS (IME キー等の出力方法が変わります)' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), textSel, el('span', { text: 'マクロのテキスト入力' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), unmapped, el('span', { text: 'process-unmapped-keys' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), concurrent, el('span', { text: 'concurrent-tap-hold (コンボ使用時は常に有効)' })]),
    el('label', { class: 'settings-field' }, [el('span', { class: 'settings-dot' }), rapid, el('span', { text: 'rapid-event-delay (ms)' })]),
  ]))
}
