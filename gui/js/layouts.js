// ============================================================
// レイアウトプリセット管理
// ============================================================

const layoutCache = new Map()

export async function loadLayout(layoutId) {
  if (layoutCache.has(layoutId)) {
    return layoutCache.get(layoutId)
  }

  const fileMap = {
    'us-ansi-60': 'us-ansi.json',
    'us-ansi-fn': 'us-ansi-fn.json',
    'us-ansi-tkl': 'us-ansi-tkl.json',
    'jis-60': 'jis.json',
  }

  const fileName = fileMap[layoutId]
  if (!fileName) {
    throw new Error(`未知のレイアウト: ${layoutId}`)
  }

  const response = await fetch(`layouts/${fileName}`)
  if (!response.ok) {
    throw new Error(`レイアウトファイルの読み込みに失敗: ${fileName}`)
  }

  const layout = await response.json()
  layoutCache.set(layoutId, layout)
  return layout
}

export function getAvailableLayouts() {
  return [
    { id: 'us-ansi-60',  name: 'US ANSI 60%' },
    { id: 'us-ansi-fn',  name: 'US ANSI Fn Row' },
    { id: 'us-ansi-tkl', name: 'US ANSI TKL' },
    { id: 'jis-60',      name: 'JIS 60%' },
  ]
}

// レイアウトから物理キー配列をフラットにして返す
export function flattenLayout(layoutData) {
  const keys = []
  for (const row of layoutData.rows) {
    for (const key of row) {
      keys.push({ ...key })
    }
  }
  return keys
}

// レイアウトの総キー数を取得
export function getKeyCount(layoutData) {
  let count = 0
  for (const row of layoutData.rows) {
    count += row.length
  }
  return count
}
