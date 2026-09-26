// ============================================================
// Vial "QMK Settings" (.vil の settings: { qsid: value }) のデコード
//
// qsid の定義は vial-gui の qmk_settings.json に準拠。
// 値が存在しない項目は QMK のデフォルト値を使う。
// ============================================================

export const QMK_SETTINGS_DEFAULTS = {
  tappingTerm: 200,
  quickTapTerm: null,          // null = tappingTerm と同じ
  permissiveHold: false,
  holdOnOtherKeyPress: false,
  retroTapping: false,
  chordalHold: false,
  flowTapTerm: 0,
  tapCodeDelay: 0,
  tapHoldCapsDelay: 80,
  tappingToggle: 5,
  comboTerm: 50,
  oneShotTapToggle: 5,
  oneShotTimeout: 5000,
  autoShift: {
    enabled: false,
    modifiers: false,
    noSpecial: false,
    noNumeric: false,
    noAlpha: false,
    repeat: false,
    noAutoRepeat: false,
    timeout: 175,
  },
  graveEsc: { altOverride: false, ctrlOverride: false, guiOverride: false, shiftOverride: false },
  magic: {
    swapControlCapslock: false,
    capslockToControl: false,
    swapLaltLgui: false,
    swapRaltRgui: false,
    noGui: false,
    swapGraveEsc: false,
    swapBackslashBackspace: false,
    hostNkro: false,
    swapLctlLgui: false,
    swapRctlRgui: false,
  },
  mouse: {
    delay: 10,
    interval: 16,
    moveDelta: 8,
    maxSpeed: 10,
    timeToMax: 30,
    wheelDelay: 10,
    wheelInterval: 80,
    wheelMaxSpeed: 8,
    wheelTimeToMax: 40,
  },
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * .vil の settings オブジェクト → 構造化された QMK 設定
 * 戻り値: { values, present: Set<number> }
 */
export function decodeQmkSettings(raw) {
  const s = clone(QMK_SETTINGS_DEFAULTS)
  const present = new Set()
  if (!raw || typeof raw !== 'object') return { values: s, present }

  const get = (qsid) => {
    const v = raw[String(qsid)] ?? raw[qsid]
    if (v === undefined || v === null) return undefined
    present.add(qsid)
    return Number(v)
  }
  const bit = (v, b) => ((v >> b) & 1) === 1
  let v

  if ((v = get(1)) !== undefined) {
    s.graveEsc = { altOverride: bit(v, 0), ctrlOverride: bit(v, 1), guiOverride: bit(v, 2), shiftOverride: bit(v, 3) }
  }
  if ((v = get(2)) !== undefined) s.comboTerm = v
  if ((v = get(3)) !== undefined) {
    s.autoShift = {
      ...s.autoShift,
      enabled: bit(v, 0),
      modifiers: bit(v, 1),
      noSpecial: bit(v, 2),
      noNumeric: bit(v, 3),
      noAlpha: bit(v, 4),
      repeat: bit(v, 5),
      noAutoRepeat: bit(v, 6),
    }
  }
  if ((v = get(4)) !== undefined) s.autoShift.timeout = v
  if ((v = get(5)) !== undefined) s.oneShotTapToggle = v
  if ((v = get(6)) !== undefined) s.oneShotTimeout = v
  if ((v = get(7)) !== undefined) s.tappingTerm = v

  // 旧形式 (qsid 8 のビットフィールド)
  if ((v = get(8)) !== undefined) {
    s.permissiveHold = bit(v, 0)
    if (bit(v, 2)) s.quickTapTerm = 0 // Tapping Force Hold
    s.retroTapping = bit(v, 3)
  }

  const mouseKeys = ['delay', 'interval', 'moveDelta', 'maxSpeed', 'timeToMax',
    'wheelDelay', 'wheelInterval', 'wheelMaxSpeed', 'wheelTimeToMax']
  mouseKeys.forEach((key, i) => {
    const mv = get(9 + i)
    if (mv !== undefined) s.mouse[key] = mv
  })

  if ((v = get(18)) !== undefined) s.tapCodeDelay = v
  if ((v = get(19)) !== undefined) s.tapHoldCapsDelay = v
  if ((v = get(20)) !== undefined) s.tappingToggle = v
  if ((v = get(21)) !== undefined) {
    s.magic = {
      swapControlCapslock: bit(v, 0),
      capslockToControl: bit(v, 1),
      swapLaltLgui: bit(v, 2),
      swapRaltRgui: bit(v, 3),
      noGui: bit(v, 4),
      swapGraveEsc: bit(v, 5),
      swapBackslashBackspace: bit(v, 6),
      hostNkro: bit(v, 7),
      swapLctlLgui: bit(v, 8),
      swapRctlRgui: bit(v, 9),
    }
  }
  if ((v = get(22)) !== undefined) s.permissiveHold = v !== 0
  if ((v = get(23)) !== undefined) s.holdOnOtherKeyPress = v !== 0
  if ((v = get(24)) !== undefined) s.retroTapping = v !== 0
  if ((v = get(25)) !== undefined) s.quickTapTerm = v
  if ((v = get(26)) !== undefined) s.chordalHold = v !== 0
  if ((v = get(27)) !== undefined) s.flowTapTerm = v

  return { values: s, present }
}

/**
 * 未知の値を補完して設定オブジェクトを完成させる (プロジェクト読込時)
 */
export function completeQmkSettings(partial) {
  const base = clone(QMK_SETTINGS_DEFAULTS)
  if (!partial) return base
  const out = { ...base, ...partial }
  for (const key of ['autoShift', 'graveEsc', 'magic', 'mouse']) {
    out[key] = { ...base[key], ...(partial[key] || {}) }
  }
  return out
}

/**
 * QMK の tap-hold 判定モード → Kanata の tap-hold 系アクション名
 */
export function tapHoldActionFor(qmk) {
  if (qmk.holdOnOtherKeyPress) return 'tap-hold-press'
  if (qmk.permissiveHold) return 'tap-hold-release'
  return 'tap-hold'
}
