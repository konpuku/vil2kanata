// ============================================================
// defsrcサイドパネルのレンダリング
// ============================================================

export function renderDefsrcPanel(state) {
  const countEl = document.getElementById('defsrc-count')
  if (!countEl) return

  const total = state.physicalLayout ? state.physicalLayout.length : 0
  const selected = state.defsrcKeys ? state.defsrcKeys.size : 0
  countEl.textContent = `${selected} / ${total} キー`

  // vilキー数との一致チェック
  const matchEl = document.getElementById('defsrc-match')
  if (!matchEl) return

  if (state.vilKeyCount !== null && state.vilKeyCount > 0) {
    const needed = state.vilKeyCount
    const ok = selected === needed
    matchEl.style.display = 'block'
    if (ok) {
      matchEl.textContent = `✓ 自作キー(${needed}個)と一致`
      matchEl.className = 'defsrc-match defsrc-match-ok'
    } else {
      const diff = selected - needed
      const diffStr = diff > 0 ? `+${diff}` : `${diff}`
      matchEl.textContent = `⚠ 自作キー${needed}個 / 選択${selected}個 (${diffStr})`
      matchEl.className = 'defsrc-match defsrc-match-warn'
    }
  } else {
    matchEl.style.display = 'none'
  }
}
