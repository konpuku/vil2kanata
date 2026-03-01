// ============================================================
// キー設定エディタパネル
// ============================================================

import { getAllBasicKeys, getKeyLabel, BASIC_KEYCODE_MAP } from './converter.js'

let onUpdateKeyCallback = null
let onUpdatePhysicalKeyCallback = null

export function setUpdateKeyCallback(cb) {
  onUpdateKeyCallback = cb
}

export function setUpdatePhysicalKeyCallback(cb) {
  onUpdatePhysicalKeyCallback = cb
}

function updateKey(layerIndex, keyIndex, keyConfig) {
  if (onUpdateKeyCallback) {
    onUpdateKeyCallback(layerIndex, keyIndex, keyConfig)
  }
}

const MOD_OPTIONS = [
  { value: 'lsft', label: 'LShift' },
  { value: 'rsft', label: 'RShift' },
  { value: 'lctl', label: 'LCtrl' },
  { value: 'rctl', label: 'RCtrl' },
  { value: 'lalt', label: 'LAlt' },
  { value: 'ralt', label: 'RAlt' },
  { value: 'lmet', label: 'LWin/Cmd' },
  { value: 'rmet', label: 'RWin/Cmd' },
]

const LAYER_OP_OPTIONS = [
  { value: 'MO', label: 'MO (モメンタリ)' },
  { value: 'TG', label: 'TG (トグル)' },
  { value: 'TO', label: 'TO (スイッチ)' },
  { value: 'DF', label: 'DF (デフォルト変更)' },
]

const TAP_HOLD_VARIANTS = [
  { value: 'tap-hold-press', label: 'tap-hold-press' },
  { value: 'tap-hold-release', label: 'tap-hold-release' },
  { value: 'tap-hold-press-timeout', label: 'tap-hold-press-timeout' },
  { value: 'tap-hold-release-timeout', label: 'tap-hold-release-timeout' },
  { value: 'tap-hold-release-keys', label: 'tap-hold-release-keys（除外キー指定）' },
  { value: 'tap-hold-except-keys', label: 'tap-hold-except-keys（除外キー指定）' },
]

let cachedBasicKeys = null
let cachedBasicKeysMode = null

function getBasicKeys(mode) {
  if (!cachedBasicKeys || cachedBasicKeysMode !== mode) {
    cachedBasicKeys = getAllBasicKeys(mode)
    cachedBasicKeysMode = mode
  }
  return cachedBasicKeys
}

function renderTapHoldVariantSelector(panel, currentKey, activeLayer, selectedKey) {
  const section = document.createElement('div')
  section.className = 'editor-section'
  section.innerHTML = '<label>タップホールド方式:</label>'

  const variantSelect = document.createElement('select')
  variantSelect.className = 'editor-select'
  const currentVariant = currentKey.tapHoldVariant || 'tap-hold-release'
  for (const v of TAP_HOLD_VARIANTS) {
    const opt = document.createElement('option')
    opt.value = v.value
    opt.textContent = v.label
    if (currentVariant === v.value) opt.selected = true
    variantSelect.appendChild(opt)
  }

  const needsExtraKeys = (v) =>
    v === 'tap-hold-release-keys' || v === 'tap-hold-except-keys'

  variantSelect.addEventListener('change', () => {
    const variant = variantSelect.value
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      tapHoldVariant: variant,
      tapHoldExtraKeys: needsExtraKeys(variant) ? (currentKey.tapHoldExtraKeys || '') : '',
    })
  })
  section.appendChild(variantSelect)
  panel.appendChild(section)

  if (needsExtraKeys(currentVariant)) {
    const extraSection = document.createElement('div')
    extraSection.className = 'editor-section'
    extraSection.innerHTML = '<label>除外キー（スペース区切り）:</label>'

    const extraInput = document.createElement('input')
    extraInput.type = 'text'
    extraInput.className = 'editor-input'
    extraInput.value = currentKey.tapHoldExtraKeys || ''
    extraInput.placeholder = '例: a b c'
    extraInput.addEventListener('change', () => {
      updateKey(activeLayer, selectedKey, {
        ...currentKey,
        tapHoldExtraKeys: extraInput.value,
      })
    })
    extraSection.appendChild(extraInput)
    panel.appendChild(extraSection)
  }
}

export function renderEditor(state) {
  const panel = document.getElementById('editor-panel')
  if (!panel) return

  const { selectedKey, activeLayer, layers, keyLabelMode, layoutEditMode } = state
  if (selectedKey === null) {
    hideEditor()
    return
  }

  panel.style.display = 'block'

  const currentKey = layers[activeLayer]?.keys[selectedKey]
  const physKey = state.physicalLayout[selectedKey]

  panel.innerHTML = ''

  // レイアウト編集モード: 物理キーエディタを表示
  if (layoutEditMode) {
    renderPhysicalKeyEditor(panel, physKey, selectedKey, keyLabelMode)
    return
  }

  // ヘッダー
  const header = document.createElement('div')
  header.className = 'editor-header'
  header.innerHTML = `
    <h3>キー設定: <span class="editor-key-name">${physKey ? physKey.label : `#${selectedKey}`}</span></h3>
    <span class="editor-layer-info">レイヤー: ${layers[activeLayer]?.name || activeLayer}</span>
  `
  panel.appendChild(header)

  // キータイプ選択
  const typeSection = document.createElement('div')
  typeSection.className = 'editor-section'

  const typeLabel = document.createElement('label')
  typeLabel.textContent = 'キータイプ:'
  typeSection.appendChild(typeLabel)

  const typeSelect = document.createElement('select')
  typeSelect.className = 'editor-select'
  const types = [
    { value: 'basic', label: '基本キー — 単一キー入力' },
    { value: 'modified', label: '修飾付きキー — Ctrl+C 等' },
    { value: 'mod-tap', label: 'Mod-Tap — タップ=キー / ホールド=修飾' },
    { value: 'layer-tap', label: 'Layer-Tap — タップ=キー / ホールド=レイヤー' },
    { value: 'layer-op', label: 'レイヤー操作 — MO/TG/TO/DF' },
    { value: 'macro', label: 'マクロ — 事前定義マクロ参照' },
    { value: 'tap-dance', label: 'タップダンス — タップ回数で動作変更' },
    { value: 'transparent', label: '透過 (▽) — 下のレイヤーに委譲' },
    { value: 'disabled', label: '無効 (XX) — 何もしない' },
  ]

  for (const t of types) {
    const opt = document.createElement('option')
    opt.value = t.value
    opt.textContent = t.label
    if (currentKey?.type === t.value) opt.selected = true
    typeSelect.appendChild(opt)
  }

  typeSelect.addEventListener('change', () => {
    const type = typeSelect.value
    applyTypeChange(type, activeLayer, selectedKey)
  })

  typeSection.appendChild(typeSelect)
  panel.appendChild(typeSection)

  // タイプ別設定
  if (currentKey) {
    renderTypeSpecificEditor(panel, currentKey, activeLayer, selectedKey, state)
  }
}

function renderTypeSpecificEditor(panel, currentKey, activeLayer, selectedKey, state) {
  const { keyLabelMode } = state
  switch (currentKey.type) {
    case 'basic':
      renderBasicKeyEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode)
      break
    case 'modified':
      renderModifiedKeyEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode)
      break
    case 'macro':
      renderMacroKeyEditor(panel, currentKey, activeLayer, selectedKey, state)
      break
    case 'tap-dance':
      renderTapDanceKeyEditor(panel, currentKey, activeLayer, selectedKey, state)
      break
    case 'mod-tap':
      renderModTapEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode)
      break
    case 'layer-tap':
      renderLayerTapEditor(panel, currentKey, activeLayer, selectedKey, state)
      break
    case 'layer-op':
      renderLayerOpEditor(panel, currentKey, activeLayer, selectedKey, state)
      break
    default:
      break
  }
}

function renderBasicKeyEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode) {
  const section = document.createElement('div')
  section.className = 'editor-section'

  const label = document.createElement('label')
  label.textContent = 'キー:'
  section.appendChild(label)

  // 検索可能なキー選択
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.className = 'editor-search'
  searchInput.placeholder = 'キーを検索...'
  searchInput.value = currentKey.kanataKey || ''
  section.appendChild(searchInput)

  const keyGrid = document.createElement('div')
  keyGrid.className = 'key-picker-grid'

  const basicKeys = getBasicKeys(keyLabelMode)

  function renderKeyGrid(filter) {
    keyGrid.innerHTML = ''
    const filtered = filter
      ? basicKeys.filter((k) =>
          k.label.toLowerCase().includes(filter.toLowerCase()) ||
          k.kanata.toLowerCase().includes(filter.toLowerCase()) ||
          k.qmk.toLowerCase().includes(filter.toLowerCase()))
      : basicKeys

    for (const key of filtered.slice(0, 200)) {
      const btn = document.createElement('button')
      btn.className = 'key-picker-btn'
      if (key.kanata === currentKey.kanataKey) {
        btn.classList.add('key-picker-active')
      }
      btn.textContent = key.label
      btn.title = key.qmk ? `${key.kanata} (${key.qmk})` : key.kanata
      btn.addEventListener('click', () => {
        updateKey(activeLayer, selectedKey, {
          type: 'basic',
          label: key.label,
          kanataKey: key.kanata,
          qmk: key.qmk,
        })
      })
      keyGrid.appendChild(btn)
    }
  }

  renderKeyGrid('')

  searchInput.addEventListener('input', () => {
    renderKeyGrid(searchInput.value)
  })

  section.appendChild(keyGrid)
  panel.appendChild(section)
}

const MOD_PREFIX_MAP = {
  lsft: 'S-',
  lctl: 'C-',
  lalt: 'A-',
  lmet: 'M-',
}

function parseKanataKeyToModsAndBase(kanataKey) {
  const prefixToMod = {
    'RS-': 'rsft', 'RC-': 'rctl', 'RA-': 'ralt', 'RM-': 'rmet',
    'S-': 'lsft', 'C-': 'lctl', 'A-': 'lalt', 'M-': 'lmet',
  }
  const mods = []
  let remaining = kanataKey || ''
  while (remaining.length > 0) {
    let matched = false
    // 長い順でマッチを試みる
    for (const pfx of Object.keys(prefixToMod).sort((a, b) => b.length - a.length)) {
      if (remaining.startsWith(pfx)) {
        mods.push(prefixToMod[pfx])
        remaining = remaining.slice(pfx.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }
  return { mods, baseKey: remaining }
}

function renderModifiedKeyEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode) {
  let { mods, baseKey } = currentKey
  if (!mods || !baseKey) {
    const parsed = parseKanataKeyToModsAndBase(currentKey.kanataKey || 'a')
    mods = parsed.mods
    baseKey = parsed.baseKey || 'a'
  }

  let currentMods = [...(mods || [])]
  let currentBaseKey = baseKey || 'a'

  function buildAndSave() {
    const prefix = Object.entries(MOD_PREFIX_MAP)
      .filter(([mod]) => currentMods.includes(mod))
      .map(([, pfx]) => pfx)
      .join('')
    const kanataKey = prefix + currentBaseKey
    updateKey(activeLayer, selectedKey, {
      type: 'modified',
      mods: [...currentMods],
      baseKey: currentBaseKey,
      kanataKey,
      label: kanataKey,
    })
  }

  // 修飾キーチェックボックス
  const modSection = document.createElement('div')
  modSection.className = 'editor-section'
  const modLabel = document.createElement('label')
  modLabel.textContent = '修飾キー:'
  modSection.appendChild(modLabel)

  const modRow = document.createElement('div')
  modRow.className = 'modifier-checkbox-row'
  const modDefs = [
    { value: 'lsft', label: 'Shift' },
    { value: 'lctl', label: 'Ctrl' },
    { value: 'lalt', label: 'Alt' },
    { value: 'lmet', label: 'Win/Cmd' },
  ]
  for (const mod of modDefs) {
    const cbLabel = document.createElement('label')
    cbLabel.className = 'modifier-checkbox-label'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = currentMods.includes(mod.value)
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!currentMods.includes(mod.value)) currentMods.push(mod.value)
      } else {
        currentMods = currentMods.filter((m) => m !== mod.value)
      }
      buildAndSave()
    })
    cbLabel.appendChild(cb)
    cbLabel.appendChild(document.createTextNode(mod.label))
    modRow.appendChild(cbLabel)
  }
  modSection.appendChild(modRow)
  panel.appendChild(modSection)

  // 基本キー選択
  const keySection = document.createElement('div')
  keySection.className = 'editor-section'
  const keyLabel = document.createElement('label')
  keyLabel.textContent = '基本キー:'
  keySection.appendChild(keyLabel)

  const keySelect = createKeySelect(currentBaseKey, keyLabelMode)
  keySelect.addEventListener('change', () => {
    currentBaseKey = keySelect.value
    buildAndSave()
  })
  keySection.appendChild(keySelect)
  panel.appendChild(keySection)
}

function renderMacroKeyEditor(panel, currentKey, activeLayer, selectedKey, state) {
  const macros = state.macros || []

  const section = document.createElement('div')
  section.className = 'editor-section'
  const label = document.createElement('label')
  label.textContent = 'マクロ:'
  section.appendChild(label)

  if (macros.length === 0) {
    const msg = document.createElement('p')
    msg.className = 'editor-hint'
    msg.textContent = '「マクロ」タブで先にマクロを作成してください'
    section.appendChild(msg)
    panel.appendChild(section)
    return
  }

  const macroSelect = document.createElement('select')
  macroSelect.className = 'editor-select'
  for (const macro of macros) {
    if (macro === null || macro === undefined) continue
    const opt = document.createElement('option')
    opt.value = macro.id
    opt.textContent = `M${macro.id}`
    if (currentKey.index === macro.id) opt.selected = true
    macroSelect.appendChild(opt)
  }
  macroSelect.addEventListener('change', () => {
    const index = parseInt(macroSelect.value, 10)
    updateKey(activeLayer, selectedKey, {
      type: 'macro',
      index,
      label: `M${index}`,
    })
  })
  section.appendChild(macroSelect)
  panel.appendChild(section)
}

function renderTapDanceKeyEditor(panel, currentKey, activeLayer, selectedKey, state) {
  const tapDancesGui = state.tapDancesGui || []

  const section = document.createElement('div')
  section.className = 'editor-section'
  const label = document.createElement('label')
  label.textContent = 'タップダンス:'
  section.appendChild(label)

  if (tapDancesGui.length === 0) {
    const msg = document.createElement('p')
    msg.className = 'editor-hint'
    msg.textContent = '「タップダンス」タブで先にタップダンスを作成してください'
    section.appendChild(msg)
    panel.appendChild(section)
    return
  }

  const tdSelect = document.createElement('select')
  tdSelect.className = 'editor-select'
  for (const td of tapDancesGui) {
    if (td === null || td === undefined) continue
    const opt = document.createElement('option')
    opt.value = td.id
    opt.textContent = `TD${td.id}`
    if (currentKey.index === td.id) opt.selected = true
    tdSelect.appendChild(opt)
  }
  tdSelect.addEventListener('change', () => {
    const index = parseInt(tdSelect.value, 10)
    updateKey(activeLayer, selectedKey, {
      type: 'tap-dance',
      index,
      label: `TD${index}`,
    })
  })
  section.appendChild(tdSelect)
  panel.appendChild(section)
}

function renderModTapEditor(panel, currentKey, activeLayer, selectedKey, keyLabelMode) {
  // タップキー
  const tapSection = document.createElement('div')
  tapSection.className = 'editor-section'
  tapSection.innerHTML = '<label>タップ時のキー:</label>'

  const tapSelect = createKeySelect(currentKey.tapKey || '', keyLabelMode)
  tapSelect.addEventListener('change', () => {
    const kanata = tapSelect.value
    const label = getKeyLabel(kanata, keyLabelMode)
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      tapKey: kanata,
      label,
    })
  })
  tapSection.appendChild(tapSelect)
  panel.appendChild(tapSection)

  // ホールドモディファイア
  const holdSection = document.createElement('div')
  holdSection.className = 'editor-section'
  holdSection.innerHTML = '<label>ホールド時の修飾キー:</label>'

  const holdSelect = document.createElement('select')
  holdSelect.className = 'editor-select'
  for (const mod of MOD_OPTIONS) {
    const opt = document.createElement('option')
    opt.value = mod.value
    opt.textContent = mod.label
    if (currentKey.holdMod === mod.value) opt.selected = true
    holdSelect.appendChild(opt)
  }
  holdSelect.addEventListener('change', () => {
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      holdMod: holdSelect.value,
      holdLabel: holdSelect.options[holdSelect.selectedIndex].textContent,
    })
  })
  holdSection.appendChild(holdSelect)
  panel.appendChild(holdSection)

  // tap-holdバリエーション
  renderTapHoldVariantSelector(panel, currentKey, activeLayer, selectedKey)
}

function renderLayerTapEditor(panel, currentKey, activeLayer, selectedKey, state) {
  const { keyLabelMode } = state
  // タップキー
  const tapSection = document.createElement('div')
  tapSection.className = 'editor-section'
  tapSection.innerHTML = '<label>タップ時のキー:</label>'

  const tapSelect = createKeySelect(currentKey.tapKey || '', keyLabelMode)
  tapSelect.addEventListener('change', () => {
    const kanata = tapSelect.value
    const label = getKeyLabel(kanata, keyLabelMode)
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      tapKey: kanata,
      label,
    })
  })
  tapSection.appendChild(tapSelect)
  panel.appendChild(tapSection)

  // レイヤー
  const layerSection = document.createElement('div')
  layerSection.className = 'editor-section'
  layerSection.innerHTML = '<label>ホールド時のレイヤー:</label>'

  const layerSelect = document.createElement('select')
  layerSelect.className = 'editor-select'
  for (let i = 0; i < state.layers.length; i++) {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = `Layer ${i}: ${state.layers[i].name}`
    if (currentKey.layer === i) opt.selected = true
    layerSelect.appendChild(opt)
  }
  layerSelect.addEventListener('change', () => {
    const layer = parseInt(layerSelect.value, 10)
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      layer,
      holdLabel: `L${layer}`,
    })
  })
  layerSection.appendChild(layerSelect)
  panel.appendChild(layerSection)

  // tap-holdバリエーション
  renderTapHoldVariantSelector(panel, currentKey, activeLayer, selectedKey)
}

function renderLayerOpEditor(panel, currentKey, activeLayer, selectedKey, state) {
  // 操作タイプ
  const opSection = document.createElement('div')
  opSection.className = 'editor-section'
  opSection.innerHTML = '<label>レイヤー操作:</label>'

  const opSelect = document.createElement('select')
  opSelect.className = 'editor-select'
  for (const op of LAYER_OP_OPTIONS) {
    const opt = document.createElement('option')
    opt.value = op.value
    opt.textContent = op.label
    if (currentKey.op === op.value) opt.selected = true
    opSelect.appendChild(opt)
  }
  opSelect.addEventListener('change', () => {
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      op: opSelect.value,
      label: `${opSelect.value}(${currentKey.layer || 0})`,
    })
  })
  opSection.appendChild(opSelect)
  panel.appendChild(opSection)

  // レイヤー
  const layerSection = document.createElement('div')
  layerSection.className = 'editor-section'
  layerSection.innerHTML = '<label>対象レイヤー:</label>'

  const layerSelect = document.createElement('select')
  layerSelect.className = 'editor-select'
  for (let i = 0; i < state.layers.length; i++) {
    const opt = document.createElement('option')
    opt.value = i
    opt.textContent = `Layer ${i}: ${state.layers[i].name}`
    if (currentKey.layer === i) opt.selected = true
    layerSelect.appendChild(opt)
  }
  layerSelect.addEventListener('change', () => {
    const layer = parseInt(layerSelect.value, 10)
    updateKey(activeLayer, selectedKey, {
      ...currentKey,
      layer,
      label: `${currentKey.op || 'MO'}(${layer})`,
    })
  })
  layerSection.appendChild(layerSelect)
  panel.appendChild(layerSection)
}

function createKeySelect(currentValue, keyLabelMode) {
  const select = document.createElement('select')
  select.className = 'editor-select'

  const basicKeys = getBasicKeys(keyLabelMode)
  for (const key of basicKeys) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }

  return select
}

function applyTypeChange(type, activeLayer, selectedKey) {
  const defaults = {
    basic: { type: 'basic', label: 'A', kanataKey: 'a', qmk: 'KC_A' },
    modified: { type: 'modified', mods: ['lsft'], baseKey: 'a', kanataKey: 'S-a', label: 'S-a' },
    macro: { type: 'macro', index: 0, label: 'M0' },
    'tap-dance': { type: 'tap-dance', index: 0, label: 'TD0' },
    'mod-tap': { type: 'mod-tap', label: 'A', holdLabel: 'LSFT', tapKey: 'a', holdMod: 'lsft', tapHoldVariant: 'tap-hold-release', tapHoldExtraKeys: '' },
    'layer-tap': { type: 'layer-tap', label: 'A', holdLabel: 'L1', tapKey: 'a', layer: 1, tapHoldVariant: 'tap-hold-release', tapHoldExtraKeys: '' },
    'layer-op': { type: 'layer-op', label: 'MO(1)', op: 'MO', layer: 1 },
    transparent: { type: 'transparent', label: '▽', kanataKey: '_' },
    disabled: { type: 'disabled', label: '', kanataKey: 'XX' },
  }

  updateKey(activeLayer, selectedKey, defaults[type] || defaults.disabled)
}

function renderPhysicalKeyEditor(panel, physKey, selectedKey, keyLabelMode) {
  // ヘッダー
  const header = document.createElement('div')
  header.className = 'editor-header'
  header.innerHTML = `
    <h3>物理キー編集: <span class="editor-key-name">${physKey ? physKey.label : `#${selectedKey}`}</span></h3>
    <span class="editor-layer-info">kanataキー名: ${physKey?.kanataKey || '(なし)'}</span>
  `
  panel.appendChild(header)

  // 現在の値表示
  const infoSection = document.createElement('div')
  infoSection.className = 'editor-section'
  const infoLabel = document.createElement('label')
  infoLabel.textContent = 'このキーの物理的な識別子を変更します（defsrcに出力されます）'
  infoLabel.style.fontSize = '12px'
  infoLabel.style.color = '#888'
  infoSection.appendChild(infoLabel)
  panel.appendChild(infoSection)

  // キー選択（検索付き）
  const section = document.createElement('div')
  section.className = 'editor-section'

  const label = document.createElement('label')
  label.textContent = 'キー:'
  section.appendChild(label)

  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.className = 'editor-search'
  searchInput.placeholder = 'キーを検索...'
  searchInput.value = physKey?.kanataKey || ''
  section.appendChild(searchInput)

  const keyGrid = document.createElement('div')
  keyGrid.className = 'key-picker-grid'

  const basicKeys = getBasicKeys(keyLabelMode)

  function renderKeyGrid(filter) {
    keyGrid.innerHTML = ''
    const filtered = filter
      ? basicKeys.filter((k) =>
          k.label.toLowerCase().includes(filter.toLowerCase()) ||
          k.kanata.toLowerCase().includes(filter.toLowerCase()) ||
          k.qmk.toLowerCase().includes(filter.toLowerCase()))
      : basicKeys

    for (const key of filtered.slice(0, 200)) {
      const btn = document.createElement('button')
      btn.className = 'key-picker-btn'
      if (key.kanata === physKey?.kanataKey) {
        btn.classList.add('key-picker-active')
      }
      btn.textContent = key.label
      btn.title = key.qmk ? `${key.kanata} (${key.qmk})` : key.kanata
      btn.addEventListener('click', () => {
        if (onUpdatePhysicalKeyCallback) {
          onUpdatePhysicalKeyCallback(selectedKey, key.kanata, key.label)
        }
      })
      keyGrid.appendChild(btn)
    }
  }

  renderKeyGrid('')

  searchInput.addEventListener('input', () => {
    renderKeyGrid(searchInput.value)
  })

  section.appendChild(keyGrid)
  panel.appendChild(section)

  // カスタムキー名入力（リストにないキーのため）
  const customSection = document.createElement('div')
  customSection.className = 'editor-section'

  const customLabel = document.createElement('label')
  customLabel.textContent = 'カスタムキー名（リストにない場合）:'
  customSection.appendChild(customLabel)

  const customRow = document.createElement('div')
  customRow.style.display = 'flex'
  customRow.style.gap = '8px'

  const customKanataInput = document.createElement('input')
  customKanataInput.type = 'text'
  customKanataInput.className = 'editor-search'
  customKanataInput.placeholder = 'kanataキー名 (例: mhnk)'
  customKanataInput.value = ''
  customRow.appendChild(customKanataInput)

  const customLabelInput = document.createElement('input')
  customLabelInput.type = 'text'
  customLabelInput.className = 'editor-search'
  customLabelInput.placeholder = '表示ラベル (例: 無変換)'
  customLabelInput.value = ''
  customRow.appendChild(customLabelInput)

  const applyBtn = document.createElement('button')
  applyBtn.className = 'key-picker-btn'
  applyBtn.textContent = '適用'
  applyBtn.style.minWidth = '60px'
  applyBtn.addEventListener('click', () => {
    const kanataKey = customKanataInput.value.trim()
    if (!kanataKey) return
    const displayLabel = customLabelInput.value.trim() || kanataKey
    if (onUpdatePhysicalKeyCallback) {
      onUpdatePhysicalKeyCallback(selectedKey, kanataKey, displayLabel)
    }
  })
  customRow.appendChild(applyBtn)

  customSection.appendChild(customRow)
  panel.appendChild(customSection)
}

export function hideEditor() {
  const panel = document.getElementById('editor-panel')
  if (panel) {
    panel.style.display = 'none'
  }
}
