// ============================================================
// キーボード描画 (ノートPC / 自作キーボード共通)
// ============================================================

import { keyCorners } from '../../src/core/kle.mjs'

const KEY_UNIT = 50
const KEY_GAP = 4
const PADDING = 6

/**
 * @param {HTMLElement} container
 * @param {Array} keys  [{x, y, w, h, r?, rx?, ry?}]
 * @param {object} opts
 *   render(i) → { main, sub, kind, classes: [], badge, corner, title }
 *   onClick(i, event), onContext(i, event), draggable(i), onDrop(fromData, i)
 *   dragData(i) → string
 */
export function renderKeyboard(container, keys, opts) {
  container.innerHTML = ''
  if (!keys || keys.length === 0) return

  let maxX = 0
  let maxY = 0
  for (const k of keys) {
    for (const [x, y] of keyCorners({ r: 0, rx: 0, ry: 0, ...k })) {
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  const board = document.createElement('div')
  board.className = 'keyboard'
  board.style.width = `${maxX * KEY_UNIT + PADDING * 2}px`
  board.style.height = `${maxY * KEY_UNIT + PADDING * 2}px`

  keys.forEach((k, i) => {
    const info = opts.render(i) || {}
    const el = document.createElement('div')
    el.className = ['key', `key-kind-${info.kind || 'basic'}`, ...(info.classes || [])].join(' ')
    el.dataset.index = i
    el.style.left = `${k.x * KEY_UNIT + PADDING + KEY_GAP / 2}px`
    el.style.top = `${k.y * KEY_UNIT + PADDING + KEY_GAP / 2}px`
    el.style.width = `${k.w * KEY_UNIT - KEY_GAP}px`
    el.style.height = `${k.h * KEY_UNIT - KEY_GAP}px`
    if (k.r) {
      el.style.transformOrigin = `${(k.rx - k.x) * KEY_UNIT - KEY_GAP / 2}px ${(k.ry - k.y) * KEY_UNIT - KEY_GAP / 2}px`
      el.style.transform = `rotate(${k.r}deg)`
    }
    if (info.title) el.title = info.title
    if (info.style) Object.assign(el.style, info.style)

    if (info.sub) {
      el.appendChild(span('key-label-top', info.main))
      el.appendChild(span('key-label-bottom', info.sub))
    } else {
      el.appendChild(span('key-label', info.main))
    }
    if (info.corner) el.appendChild(span('key-phys-label', info.corner))
    if (info.badge !== undefined && info.badge !== null) el.appendChild(span('key-defsrc-num', String(info.badge)))

    if (opts.onClick) el.addEventListener('click', (e) => opts.onClick(i, e))
    el.addEventListener('contextmenu', (e) => {
      if (!opts.onContext) return
      e.preventDefault()
      opts.onContext(i, e)
    })
    if (opts.draggable && opts.draggable(i)) {
      el.draggable = true
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', opts.dragData ? opts.dragData(i) : String(i))
        e.dataTransfer.effectAllowed = 'copyMove'
        el.classList.add('key-dragging')
      })
      el.addEventListener('dragend', () => el.classList.remove('key-dragging'))
    }
    if (opts.onDrop) {
      el.addEventListener('dragover', (e) => {
        e.preventDefault()
        el.classList.add('key-drag-over')
      })
      el.addEventListener('dragleave', () => el.classList.remove('key-drag-over'))
      el.addEventListener('drop', (e) => {
        e.preventDefault()
        el.classList.remove('key-drag-over')
        opts.onDrop(e.dataTransfer.getData('text/plain'), i)
      })
    }
    if (opts.onHover) {
      el.addEventListener('mouseenter', () => opts.onHover(i))
      el.addEventListener('mouseleave', () => opts.onHover(null))
    }
    board.appendChild(el)
  })
  container.appendChild(board)
}

function span(cls, text) {
  const s = document.createElement('span')
  s.className = cls
  s.textContent = text ?? ''
  return s
}

// セグメントの色分け (色だけに頼らないよう番号バッジも併用する)
export function segmentColor(index) {
  const hues = [205, 30, 140, 280, 55, 330, 180, 100, 250, 0]
  return `hsl(${hues[index % hues.length]}, 55%, 32%)`
}
