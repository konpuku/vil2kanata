// ============================================================
// キー設定エディタ (選択中のノートPCキー × アクティブレイヤー)
// ============================================================

import { el, keyConfigEditor, keyGrid, section } from './pickers.js'
import { getKeyLabel, keyConfigLabel } from './labels.js'
import { EISU_TO_F13_REG, isWinNoReleaseKey, scancodeMapRestoreReg, toUtf16le } from '../../src/core/windows.mjs'
import { downloadFile } from './export.js'

export function renderEditor(state, resolved, actions) {
  const panel = document.getElementById('editor-panel')
  if (!panel) return
  panel.innerHTML = ''
  const { project, selectedTarget: t, activeLayer, keyLabelMode: mode } = state
  const tk = project.target.keys

  if (t === null || t === undefined || !tk[t]) {
    panel.appendChild(el('p', { class: 'feature-empty', text: state.layoutEditMode
      ? 'ノートPCのキーをクリックすると、キー名 (defsrc 名) や幅を編集できます。'
      : 'ノートPCのキーをクリックすると、そのキーの動作を編集できます。' }))
    return
  }

  if (state.layoutEditMode) {
    renderPhysicalEditor(panel, state, actions)
    return
  }

  const kc = resolved.layers[activeLayer]?.keys[t]
  const edited = !!project.edits?.[activeLayer]?.[t]
  const src = resolved.inverse[t]
  const inDefsrc = resolved.defsrc.includes(t)
  const layerNames = resolved.layers.map((l) => l.name)

  const origin = src !== null && src !== undefined
    ? `自作キーボード #${src + 1} (row ${project.source.keys[src].row}, col ${project.source.keys[src].col}) の設定`
    : '対応付けなし'
  panel.appendChild(el('div', { class: 'editor-header' }, [
    el('h3', {}, ['キー設定: ', el('span', { class: 'editor-key-name', text: `${tk[t].label || tk[t].kanataKey} (${tk[t].kanataKey})` })]),
    el('span', { class: 'editor-layer-info', text: `レイヤー ${activeLayer}: ${layerNames[activeLayer]}` }),
  ]))
  panel.appendChild(el('div', { class: 'feature-row' }, [
    el('span', { class: 'feature-unit', text: edited ? `手動変更中 (元: ${origin})` : origin }),
    edited ? el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '手動変更を取り消す', onclick: () => actions.clearEdit(activeLayer, t) }) : null,
    el('button', {
      class: 'defsrc-btn defsrc-btn-sm',
      text: inDefsrc ? 'リマップ対象から外す' : 'リマップ対象に含める',
      title: 'defsrc に含めるかどうか (外したキーは Kanata を通さずそのまま入力されます)',
      onclick: () => actions.toggleDefsrc(t),
    }),
  ]))
  if (isWinNoReleaseKey(tk[t]) && project.kanata.os === 'windows') {
    panel.appendChild(noReleaseNotice(t, actions))
  }
  if (!inDefsrc) {
    panel.appendChild(el('p', { class: 'editor-hint', text: 'このキーはリマップ対象外 (defsrc に含まれない) ため、どのレイヤーでもノートPC本来のキーとして動作します。' }))
  }

  panel.appendChild(keyConfigEditor(kc, {
    mode,
    layerNames,
    macros: project.macros,
    tapDances: project.tapDances,
    userKeys: project.userKeys,
    onChange: (next) => actions.setEdit(activeLayer, t, next),
  }))

  if (kc?.type === 'user') {
    const info = project.userKeys?.[kc.index]
    panel.appendChild(el('p', { class: 'editor-hint', text: info?.kanata
      ? `keymap.c から推定: ${info.kanata}`
      : 'USER キーコードの動作はファームウェア依存です。keymap.c を読み込むと自動推定します。推定できない場合は「Kanata 式を直接入力」で指定してください。' }))
  }
  const label = keyConfigLabel(kc, mode, layerNames)
  panel.appendChild(el('p', { class: 'editor-hint', text: `表示: ${label.main}${label.sub ? ` / ${label.sub}` : ''}` }))
}

// JIS 英数キー (Windows では離したイベントが届かない) の回避策
function noReleaseNotice(t, actions) {
  return el('div', { class: 'notice-box' }, [
    el('strong', { text: '注意: Windows では英数キーを「離した」ことを Kanata が検出できません' }),
    el('p', { text: '日本語キーボードドライバーが英数キーの「押した」イベントしか送らないため、Kanata からは押しっぱなしに見えます。Mod-Tap 等を割り当てるとホールド扱いになり、修飾キーが押されたままになります。' }),
    el('p', { text: '回避策: ① 下のレジストリ設定で英数キーを F13 に置き換えて再起動 → ② 「このキーを f13 として扱う」を押して .kbd を出力し直す' }),
    el('div', { class: 'feature-row' }, [
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '① 英数→F13 のレジストリ設定 (.reg)', onclick: () => downloadFile('vil2kanata-eisu-to-f13.reg', toUtf16le(EISU_TO_F13_REG), 'text/plain') }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '元に戻す .reg', onclick: () => downloadFile('vil2kanata-restore-keyboard.reg', toUtf16le(scancodeMapRestoreReg()), 'text/plain') }),
      el('button', { class: 'defsrc-btn defsrc-btn-sm', text: '② このキーを f13 として扱う', onclick: () => actions.updateTargetKey(t, { kanataKey: 'f13', label: '英数(F13)', winNoRelease: false }) }),
    ]),
  ])
}

function renderPhysicalEditor(panel, state, actions) {
  const { project, selectedTarget: t, keyLabelMode: mode } = state
  const key = project.target.keys[t]
  panel.appendChild(el('div', { class: 'editor-header' }, [
    el('h3', {}, ['ノートPCのキー: ', el('span', { class: 'editor-key-name', text: key.label || key.kanataKey || '(なし)' })]),
    el('span', { class: 'editor-layer-info', text: `defsrc 名: ${key.kanataKey || '(対象外)'}` }),
  ]))
  panel.appendChild(el('p', { class: 'editor-hint', text: 'このキーを押したときに Kanata が受け取るキー名 (defsrc 名) を設定します。刻印ではなく、OS から見たキーを選んでください。' }))
  panel.appendChild(section('キー名', keyGrid(key.kanataKey, mode, (k) => actions.updateTargetKey(t, { kanataKey: k, label: getKeyLabel(k, mode), fixed: false }))))

  const nameInput = el('input', { type: 'text', class: 'editor-search', value: key.kanataKey || '', placeholder: 'kanata キー名 (例: mhnk)' })
  const labelInput = el('input', { type: 'text', class: 'editor-search', value: key.label || '', placeholder: '表示ラベル' })
  const widthInput = el('input', { type: 'number', class: 'feature-number-input', value: key.w, min: 0.5, max: 10, step: 0.25 })
  const fixed = el('input', { type: 'checkbox' })
  fixed.checked = !!key.fixed
  panel.appendChild(el('div', { class: 'feature-row feature-row-wrap' }, [
    nameInput, labelInput, el('span', { class: 'feature-unit', text: '幅' }), widthInput,
    el('label', { class: 'modifier-checkbox-label' }, [fixed, 'OS から見えないキー (Fn 等)']),
    el('button', {
      class: 'defsrc-btn defsrc-btn-sm',
      text: '適用',
      onclick: () => actions.updateTargetKey(t, {
        kanataKey: nameInput.value.trim(),
        label: labelInput.value.trim() || nameInput.value.trim(),
        w: parseFloat(widthInput.value) || key.w,
        fixed: fixed.checked || !nameInput.value.trim(),
      }),
    }),
    el('button', { class: 'feature-del-btn', text: 'このキーを削除', onclick: () => actions.deleteTargetKey(t) }),
  ]))
}
