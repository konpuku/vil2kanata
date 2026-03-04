// vil2kanata GUI - バンドル済みスクリプト
// このファイルは build.js で自動生成されます。直接編集しないでください。
// ソースファイル: gui/js/*.js
;(function() {
"use strict";
const V2K = {};

// === store.js ===
(function() {
// ============================================================
// 状態管理ストア（循環依存回避のため独立モジュール）
// ============================================================

let state = {
  layout: 'us-ansi-60',
  physicalLayout: [],
  defsrcKeys: new Set(),
  layers: [
    { name: 'base', keys: [] },
  ],
  activeLayer: 0,
  selectedKey: null,
  macros: [],
  tapDances: [],
  tapDancesGui: [],
  combos: [],
  keyOverrides: [],
  settings: {
    tapTime: 200,
    holdTime: 200,
    processUnmappedKeys: true,
    concurrentTapHold: true,
    rapidEventDelay: 5,
  },
  vilData: null,
  vilKeyCount: null,  // .vilから読み込んだ自作キーボードのキー数
  vilPhysicalLayout: [],  // VIL元キーボードのグリッドレイアウト
  vilLayers: [],           // VIL元キーボードの各レイヤーキー配列
  layoutEditMode: false,
  keyLabelMode: 'us',
}

const listeners = new Set()

function getState() {
  return state
}

function setState(updater) {
  const newState = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...newState }
  for (const listener of listeners) {
    listener(state)
  }
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

  V2K.getState = getState;
  V2K.setState = setState;
  V2K.subscribe = subscribe;
})();

// === layouts.js ===
(function() {
// ============================================================
// レイアウトプリセット管理（インライン定義 — fetch不要）
// ============================================================

const LAYOUT_DATA = {
  'us-ansi-60': {
    "name": "US ANSI 60%",
    "id": "us-ansi-60",
    "rows": [
      [
        {"x": 0, "y": 0, "w": 1, "h": 1, "kanataKey": "grv", "label": "`"},
        {"x": 1, "y": 0, "w": 1, "h": 1, "kanataKey": "1", "label": "1"},
        {"x": 2, "y": 0, "w": 1, "h": 1, "kanataKey": "2", "label": "2"},
        {"x": 3, "y": 0, "w": 1, "h": 1, "kanataKey": "3", "label": "3"},
        {"x": 4, "y": 0, "w": 1, "h": 1, "kanataKey": "4", "label": "4"},
        {"x": 5, "y": 0, "w": 1, "h": 1, "kanataKey": "5", "label": "5"},
        {"x": 6, "y": 0, "w": 1, "h": 1, "kanataKey": "6", "label": "6"},
        {"x": 7, "y": 0, "w": 1, "h": 1, "kanataKey": "7", "label": "7"},
        {"x": 8, "y": 0, "w": 1, "h": 1, "kanataKey": "8", "label": "8"},
        {"x": 9, "y": 0, "w": 1, "h": 1, "kanataKey": "9", "label": "9"},
        {"x": 10, "y": 0, "w": 1, "h": 1, "kanataKey": "0", "label": "0"},
        {"x": 11, "y": 0, "w": 1, "h": 1, "kanataKey": "-", "label": "-"},
        {"x": 12, "y": 0, "w": 1, "h": 1, "kanataKey": "=", "label": "="},
        {"x": 13, "y": 0, "w": 2, "h": 1, "kanataKey": "bspc", "label": "Bksp"}
      ],
      [
        {"x": 0, "y": 1, "w": 1.5, "h": 1, "kanataKey": "tab", "label": "Tab"},
        {"x": 1.5, "y": 1, "w": 1, "h": 1, "kanataKey": "q", "label": "Q"},
        {"x": 2.5, "y": 1, "w": 1, "h": 1, "kanataKey": "w", "label": "W"},
        {"x": 3.5, "y": 1, "w": 1, "h": 1, "kanataKey": "e", "label": "E"},
        {"x": 4.5, "y": 1, "w": 1, "h": 1, "kanataKey": "r", "label": "R"},
        {"x": 5.5, "y": 1, "w": 1, "h": 1, "kanataKey": "t", "label": "T"},
        {"x": 6.5, "y": 1, "w": 1, "h": 1, "kanataKey": "y", "label": "Y"},
        {"x": 7.5, "y": 1, "w": 1, "h": 1, "kanataKey": "u", "label": "U"},
        {"x": 8.5, "y": 1, "w": 1, "h": 1, "kanataKey": "i", "label": "I"},
        {"x": 9.5, "y": 1, "w": 1, "h": 1, "kanataKey": "o", "label": "O"},
        {"x": 10.5, "y": 1, "w": 1, "h": 1, "kanataKey": "p", "label": "P"},
        {"x": 11.5, "y": 1, "w": 1, "h": 1, "kanataKey": "[", "label": "["},
        {"x": 12.5, "y": 1, "w": 1, "h": 1, "kanataKey": "]", "label": "]"},
        {"x": 13.5, "y": 1, "w": 1.5, "h": 1, "kanataKey": "\\", "label": "\\"}
      ],
      [
        {"x": 0, "y": 2, "w": 1.75, "h": 1, "kanataKey": "caps", "label": "Caps"},
        {"x": 1.75, "y": 2, "w": 1, "h": 1, "kanataKey": "a", "label": "A"},
        {"x": 2.75, "y": 2, "w": 1, "h": 1, "kanataKey": "s", "label": "S"},
        {"x": 3.75, "y": 2, "w": 1, "h": 1, "kanataKey": "d", "label": "D"},
        {"x": 4.75, "y": 2, "w": 1, "h": 1, "kanataKey": "f", "label": "F"},
        {"x": 5.75, "y": 2, "w": 1, "h": 1, "kanataKey": "g", "label": "G"},
        {"x": 6.75, "y": 2, "w": 1, "h": 1, "kanataKey": "h", "label": "H"},
        {"x": 7.75, "y": 2, "w": 1, "h": 1, "kanataKey": "j", "label": "J"},
        {"x": 8.75, "y": 2, "w": 1, "h": 1, "kanataKey": "k", "label": "K"},
        {"x": 9.75, "y": 2, "w": 1, "h": 1, "kanataKey": "l", "label": "L"},
        {"x": 10.75, "y": 2, "w": 1, "h": 1, "kanataKey": ";", "label": ";"},
        {"x": 11.75, "y": 2, "w": 1, "h": 1, "kanataKey": "'", "label": "'"},
        {"x": 12.75, "y": 2, "w": 2.25, "h": 1, "kanataKey": "ret", "label": "Enter"}
      ],
      [
        {"x": 0, "y": 3, "w": 2.25, "h": 1, "kanataKey": "lsft", "label": "LShift"},
        {"x": 2.25, "y": 3, "w": 1, "h": 1, "kanataKey": "z", "label": "Z"},
        {"x": 3.25, "y": 3, "w": 1, "h": 1, "kanataKey": "x", "label": "X"},
        {"x": 4.25, "y": 3, "w": 1, "h": 1, "kanataKey": "c", "label": "C"},
        {"x": 5.25, "y": 3, "w": 1, "h": 1, "kanataKey": "v", "label": "V"},
        {"x": 6.25, "y": 3, "w": 1, "h": 1, "kanataKey": "b", "label": "B"},
        {"x": 7.25, "y": 3, "w": 1, "h": 1, "kanataKey": "n", "label": "N"},
        {"x": 8.25, "y": 3, "w": 1, "h": 1, "kanataKey": "m", "label": "M"},
        {"x": 9.25, "y": 3, "w": 1, "h": 1, "kanataKey": ",", "label": ","},
        {"x": 10.25, "y": 3, "w": 1, "h": 1, "kanataKey": ".", "label": "."},
        {"x": 11.25, "y": 3, "w": 1, "h": 1, "kanataKey": "/", "label": "/"},
        {"x": 12.25, "y": 3, "w": 2.75, "h": 1, "kanataKey": "rsft", "label": "RShift"}
      ],
      [
        {"x": 0, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lctl", "label": "LCtrl"},
        {"x": 1.25, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lmet", "label": "Win"},
        {"x": 2.5, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lalt", "label": "LAlt"},
        {"x": 3.75, "y": 4, "w": 6.25, "h": 1, "kanataKey": "spc", "label": "Space"},
        {"x": 10, "y": 4, "w": 1.25, "h": 1, "kanataKey": "ralt", "label": "RAlt"},
        {"x": 11.25, "y": 4, "w": 1.25, "h": 1, "kanataKey": "rmet", "label": "Win"},
        {"x": 12.5, "y": 4, "w": 1.25, "h": 1, "kanataKey": "menu", "label": "Menu"},
        {"x": 13.75, "y": 4, "w": 1.25, "h": 1, "kanataKey": "rctl", "label": "RCtrl"}
      ]
    ]
  },
  'us-ansi-fn': {
    "name": "US ANSI Fn Row",
    "id": "us-ansi-fn",
    "rows": [
      [
        {"x": 0, "y": 0, "w": 1, "h": 1, "kanataKey": "esc", "label": "Esc"},
        {"x": 2, "y": 0, "w": 1, "h": 1, "kanataKey": "f1", "label": "F1"},
        {"x": 3, "y": 0, "w": 1, "h": 1, "kanataKey": "f2", "label": "F2"},
        {"x": 4, "y": 0, "w": 1, "h": 1, "kanataKey": "f3", "label": "F3"},
        {"x": 5, "y": 0, "w": 1, "h": 1, "kanataKey": "f4", "label": "F4"},
        {"x": 6.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f5", "label": "F5"},
        {"x": 7.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f6", "label": "F6"},
        {"x": 8.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f7", "label": "F7"},
        {"x": 9.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f8", "label": "F8"},
        {"x": 11, "y": 0, "w": 1, "h": 1, "kanataKey": "f9", "label": "F9"},
        {"x": 12, "y": 0, "w": 1, "h": 1, "kanataKey": "f10", "label": "F10"},
        {"x": 13, "y": 0, "w": 1, "h": 1, "kanataKey": "f11", "label": "F11"},
        {"x": 14, "y": 0, "w": 1, "h": 1, "kanataKey": "f12", "label": "F12"}
      ],
      [
        {"x": 0, "y": 1.5, "w": 1, "h": 1, "kanataKey": "grv", "label": "`"},
        {"x": 1, "y": 1.5, "w": 1, "h": 1, "kanataKey": "1", "label": "1"},
        {"x": 2, "y": 1.5, "w": 1, "h": 1, "kanataKey": "2", "label": "2"},
        {"x": 3, "y": 1.5, "w": 1, "h": 1, "kanataKey": "3", "label": "3"},
        {"x": 4, "y": 1.5, "w": 1, "h": 1, "kanataKey": "4", "label": "4"},
        {"x": 5, "y": 1.5, "w": 1, "h": 1, "kanataKey": "5", "label": "5"},
        {"x": 6, "y": 1.5, "w": 1, "h": 1, "kanataKey": "6", "label": "6"},
        {"x": 7, "y": 1.5, "w": 1, "h": 1, "kanataKey": "7", "label": "7"},
        {"x": 8, "y": 1.5, "w": 1, "h": 1, "kanataKey": "8", "label": "8"},
        {"x": 9, "y": 1.5, "w": 1, "h": 1, "kanataKey": "9", "label": "9"},
        {"x": 10, "y": 1.5, "w": 1, "h": 1, "kanataKey": "0", "label": "0"},
        {"x": 11, "y": 1.5, "w": 1, "h": 1, "kanataKey": "-", "label": "-"},
        {"x": 12, "y": 1.5, "w": 1, "h": 1, "kanataKey": "=", "label": "="},
        {"x": 13, "y": 1.5, "w": 2, "h": 1, "kanataKey": "bspc", "label": "Bksp"}
      ],
      [
        {"x": 0, "y": 2.5, "w": 1.5, "h": 1, "kanataKey": "tab", "label": "Tab"},
        {"x": 1.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "q", "label": "Q"},
        {"x": 2.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "w", "label": "W"},
        {"x": 3.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "e", "label": "E"},
        {"x": 4.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "r", "label": "R"},
        {"x": 5.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "t", "label": "T"},
        {"x": 6.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "y", "label": "Y"},
        {"x": 7.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "u", "label": "U"},
        {"x": 8.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "i", "label": "I"},
        {"x": 9.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "o", "label": "O"},
        {"x": 10.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "p", "label": "P"},
        {"x": 11.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "[", "label": "["},
        {"x": 12.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "]", "label": "]"},
        {"x": 13.5, "y": 2.5, "w": 1.5, "h": 1, "kanataKey": "\\", "label": "\\"}
      ],
      [
        {"x": 0, "y": 3.5, "w": 1.75, "h": 1, "kanataKey": "caps", "label": "Caps"},
        {"x": 1.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "a", "label": "A"},
        {"x": 2.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "s", "label": "S"},
        {"x": 3.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "d", "label": "D"},
        {"x": 4.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "f", "label": "F"},
        {"x": 5.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "g", "label": "G"},
        {"x": 6.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "h", "label": "H"},
        {"x": 7.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "j", "label": "J"},
        {"x": 8.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "k", "label": "K"},
        {"x": 9.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "l", "label": "L"},
        {"x": 10.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": ";", "label": ";"},
        {"x": 11.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "'", "label": "'"},
        {"x": 12.75, "y": 3.5, "w": 2.25, "h": 1, "kanataKey": "ret", "label": "Enter"}
      ],
      [
        {"x": 0, "y": 4.5, "w": 2.25, "h": 1, "kanataKey": "lsft", "label": "LShift"},
        {"x": 2.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "z", "label": "Z"},
        {"x": 3.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "x", "label": "X"},
        {"x": 4.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "c", "label": "C"},
        {"x": 5.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "v", "label": "V"},
        {"x": 6.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "b", "label": "B"},
        {"x": 7.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "n", "label": "N"},
        {"x": 8.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "m", "label": "M"},
        {"x": 9.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": ",", "label": ","},
        {"x": 10.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": ".", "label": "."},
        {"x": 11.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "/", "label": "/"},
        {"x": 12.25, "y": 4.5, "w": 2.75, "h": 1, "kanataKey": "rsft", "label": "RShift"}
      ],
      [
        {"x": 0, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lctl", "label": "LCtrl"},
        {"x": 1.25, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lmet", "label": "Win"},
        {"x": 2.5, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lalt", "label": "LAlt"},
        {"x": 3.75, "y": 5.5, "w": 6.25, "h": 1, "kanataKey": "spc", "label": "Space"},
        {"x": 10, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "ralt", "label": "RAlt"},
        {"x": 11.25, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "rmet", "label": "Win"},
        {"x": 12.5, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "menu", "label": "Menu"},
        {"x": 13.75, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "rctl", "label": "RCtrl"}
      ]
    ]
  },
  'us-ansi-tkl': {
    "name": "US ANSI TKL",
    "id": "us-ansi-tkl",
    "rows": [
      [
        {"x": 0, "y": 0, "w": 1, "h": 1, "kanataKey": "esc", "label": "Esc"},
        {"x": 2, "y": 0, "w": 1, "h": 1, "kanataKey": "f1", "label": "F1"},
        {"x": 3, "y": 0, "w": 1, "h": 1, "kanataKey": "f2", "label": "F2"},
        {"x": 4, "y": 0, "w": 1, "h": 1, "kanataKey": "f3", "label": "F3"},
        {"x": 5, "y": 0, "w": 1, "h": 1, "kanataKey": "f4", "label": "F4"},
        {"x": 6.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f5", "label": "F5"},
        {"x": 7.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f6", "label": "F6"},
        {"x": 8.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f7", "label": "F7"},
        {"x": 9.5, "y": 0, "w": 1, "h": 1, "kanataKey": "f8", "label": "F8"},
        {"x": 11, "y": 0, "w": 1, "h": 1, "kanataKey": "f9", "label": "F9"},
        {"x": 12, "y": 0, "w": 1, "h": 1, "kanataKey": "f10", "label": "F10"},
        {"x": 13, "y": 0, "w": 1, "h": 1, "kanataKey": "f11", "label": "F11"},
        {"x": 14, "y": 0, "w": 1, "h": 1, "kanataKey": "f12", "label": "F12"},
        {"x": 15.5, "y": 0, "w": 1, "h": 1, "kanataKey": "prnt", "label": "PrtSc"},
        {"x": 16.5, "y": 0, "w": 1, "h": 1, "kanataKey": "slck", "label": "ScrLk"},
        {"x": 17.5, "y": 0, "w": 1, "h": 1, "kanataKey": "pause", "label": "Pause"}
      ],
      [
        {"x": 0, "y": 1.5, "w": 1, "h": 1, "kanataKey": "grv", "label": "`"},
        {"x": 1, "y": 1.5, "w": 1, "h": 1, "kanataKey": "1", "label": "1"},
        {"x": 2, "y": 1.5, "w": 1, "h": 1, "kanataKey": "2", "label": "2"},
        {"x": 3, "y": 1.5, "w": 1, "h": 1, "kanataKey": "3", "label": "3"},
        {"x": 4, "y": 1.5, "w": 1, "h": 1, "kanataKey": "4", "label": "4"},
        {"x": 5, "y": 1.5, "w": 1, "h": 1, "kanataKey": "5", "label": "5"},
        {"x": 6, "y": 1.5, "w": 1, "h": 1, "kanataKey": "6", "label": "6"},
        {"x": 7, "y": 1.5, "w": 1, "h": 1, "kanataKey": "7", "label": "7"},
        {"x": 8, "y": 1.5, "w": 1, "h": 1, "kanataKey": "8", "label": "8"},
        {"x": 9, "y": 1.5, "w": 1, "h": 1, "kanataKey": "9", "label": "9"},
        {"x": 10, "y": 1.5, "w": 1, "h": 1, "kanataKey": "0", "label": "0"},
        {"x": 11, "y": 1.5, "w": 1, "h": 1, "kanataKey": "-", "label": "-"},
        {"x": 12, "y": 1.5, "w": 1, "h": 1, "kanataKey": "=", "label": "="},
        {"x": 13, "y": 1.5, "w": 2, "h": 1, "kanataKey": "bspc", "label": "Bksp"},
        {"x": 15.5, "y": 1.5, "w": 1, "h": 1, "kanataKey": "ins", "label": "Ins"},
        {"x": 16.5, "y": 1.5, "w": 1, "h": 1, "kanataKey": "home", "label": "Home"},
        {"x": 17.5, "y": 1.5, "w": 1, "h": 1, "kanataKey": "pgup", "label": "PgUp"}
      ],
      [
        {"x": 0, "y": 2.5, "w": 1.5, "h": 1, "kanataKey": "tab", "label": "Tab"},
        {"x": 1.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "q", "label": "Q"},
        {"x": 2.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "w", "label": "W"},
        {"x": 3.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "e", "label": "E"},
        {"x": 4.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "r", "label": "R"},
        {"x": 5.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "t", "label": "T"},
        {"x": 6.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "y", "label": "Y"},
        {"x": 7.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "u", "label": "U"},
        {"x": 8.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "i", "label": "I"},
        {"x": 9.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "o", "label": "O"},
        {"x": 10.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "p", "label": "P"},
        {"x": 11.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "[", "label": "["},
        {"x": 12.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "]", "label": "]"},
        {"x": 13.5, "y": 2.5, "w": 1.5, "h": 1, "kanataKey": "\\", "label": "\\"},
        {"x": 15.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "del", "label": "Del"},
        {"x": 16.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "end", "label": "End"},
        {"x": 17.5, "y": 2.5, "w": 1, "h": 1, "kanataKey": "pgdn", "label": "PgDn"}
      ],
      [
        {"x": 0, "y": 3.5, "w": 1.75, "h": 1, "kanataKey": "caps", "label": "Caps"},
        {"x": 1.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "a", "label": "A"},
        {"x": 2.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "s", "label": "S"},
        {"x": 3.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "d", "label": "D"},
        {"x": 4.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "f", "label": "F"},
        {"x": 5.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "g", "label": "G"},
        {"x": 6.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "h", "label": "H"},
        {"x": 7.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "j", "label": "J"},
        {"x": 8.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "k", "label": "K"},
        {"x": 9.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "l", "label": "L"},
        {"x": 10.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": ";", "label": ";"},
        {"x": 11.75, "y": 3.5, "w": 1, "h": 1, "kanataKey": "'", "label": "'"},
        {"x": 12.75, "y": 3.5, "w": 2.25, "h": 1, "kanataKey": "ret", "label": "Enter"}
      ],
      [
        {"x": 0, "y": 4.5, "w": 2.25, "h": 1, "kanataKey": "lsft", "label": "LShift"},
        {"x": 2.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "z", "label": "Z"},
        {"x": 3.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "x", "label": "X"},
        {"x": 4.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "c", "label": "C"},
        {"x": 5.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "v", "label": "V"},
        {"x": 6.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "b", "label": "B"},
        {"x": 7.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "n", "label": "N"},
        {"x": 8.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "m", "label": "M"},
        {"x": 9.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": ",", "label": ","},
        {"x": 10.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": ".", "label": "."},
        {"x": 11.25, "y": 4.5, "w": 1, "h": 1, "kanataKey": "/", "label": "/"},
        {"x": 12.25, "y": 4.5, "w": 2.75, "h": 1, "kanataKey": "rsft", "label": "RShift"},
        {"x": 16.5, "y": 4.5, "w": 1, "h": 1, "kanataKey": "up", "label": "\u2191"}
      ],
      [
        {"x": 0, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lctl", "label": "LCtrl"},
        {"x": 1.25, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lmet", "label": "Win"},
        {"x": 2.5, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "lalt", "label": "LAlt"},
        {"x": 3.75, "y": 5.5, "w": 6.25, "h": 1, "kanataKey": "spc", "label": "Space"},
        {"x": 10, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "ralt", "label": "RAlt"},
        {"x": 11.25, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "rmet", "label": "Win"},
        {"x": 12.5, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "menu", "label": "Menu"},
        {"x": 13.75, "y": 5.5, "w": 1.25, "h": 1, "kanataKey": "rctl", "label": "RCtrl"},
        {"x": 15.5, "y": 5.5, "w": 1, "h": 1, "kanataKey": "left", "label": "\u2190"},
        {"x": 16.5, "y": 5.5, "w": 1, "h": 1, "kanataKey": "down", "label": "\u2193"},
        {"x": 17.5, "y": 5.5, "w": 1, "h": 1, "kanataKey": "rght", "label": "\u2192"}
      ]
    ]
  },
  'jis-60': {
    "name": "JIS 109\u30ad\u30fc (60%\u76f8\u5f53)",
    "id": "jis-60",
    "rows": [
      [
        {"x": 0, "y": 0, "w": 1, "h": 1, "kanataKey": "grv", "label": "\u534a\u89d2"},
        {"x": 1, "y": 0, "w": 1, "h": 1, "kanataKey": "1", "label": "1"},
        {"x": 2, "y": 0, "w": 1, "h": 1, "kanataKey": "2", "label": "2"},
        {"x": 3, "y": 0, "w": 1, "h": 1, "kanataKey": "3", "label": "3"},
        {"x": 4, "y": 0, "w": 1, "h": 1, "kanataKey": "4", "label": "4"},
        {"x": 5, "y": 0, "w": 1, "h": 1, "kanataKey": "5", "label": "5"},
        {"x": 6, "y": 0, "w": 1, "h": 1, "kanataKey": "6", "label": "6"},
        {"x": 7, "y": 0, "w": 1, "h": 1, "kanataKey": "7", "label": "7"},
        {"x": 8, "y": 0, "w": 1, "h": 1, "kanataKey": "8", "label": "8"},
        {"x": 9, "y": 0, "w": 1, "h": 1, "kanataKey": "9", "label": "9"},
        {"x": 10, "y": 0, "w": 1, "h": 1, "kanataKey": "0", "label": "0"},
        {"x": 11, "y": 0, "w": 1, "h": 1, "kanataKey": "-", "label": "-"},
        {"x": 12, "y": 0, "w": 1, "h": 1, "kanataKey": "=", "label": "^"},
        {"x": 13, "y": 0, "w": 1, "h": 1, "kanataKey": "\u00a5", "label": "\u00a5"},
        {"x": 14, "y": 0, "w": 1, "h": 1, "kanataKey": "bspc", "label": "BS"}
      ],
      [
        {"x": 0, "y": 1, "w": 1.5, "h": 1, "kanataKey": "tab", "label": "Tab"},
        {"x": 1.5, "y": 1, "w": 1, "h": 1, "kanataKey": "q", "label": "Q"},
        {"x": 2.5, "y": 1, "w": 1, "h": 1, "kanataKey": "w", "label": "W"},
        {"x": 3.5, "y": 1, "w": 1, "h": 1, "kanataKey": "e", "label": "E"},
        {"x": 4.5, "y": 1, "w": 1, "h": 1, "kanataKey": "r", "label": "R"},
        {"x": 5.5, "y": 1, "w": 1, "h": 1, "kanataKey": "t", "label": "T"},
        {"x": 6.5, "y": 1, "w": 1, "h": 1, "kanataKey": "y", "label": "Y"},
        {"x": 7.5, "y": 1, "w": 1, "h": 1, "kanataKey": "u", "label": "U"},
        {"x": 8.5, "y": 1, "w": 1, "h": 1, "kanataKey": "i", "label": "I"},
        {"x": 9.5, "y": 1, "w": 1, "h": 1, "kanataKey": "o", "label": "O"},
        {"x": 10.5, "y": 1, "w": 1, "h": 1, "kanataKey": "p", "label": "P"},
        {"x": 11.5, "y": 1, "w": 1, "h": 1, "kanataKey": "[", "label": "@"},
        {"x": 12.5, "y": 1, "w": 1, "h": 1, "kanataKey": "]", "label": "["},
        {"x": 13.75, "y": 1, "w": 1.25, "h": 2, "kanataKey": "ret", "label": "Enter"}
      ],
      [
        {"x": 0, "y": 2, "w": 1.75, "h": 1, "kanataKey": "caps", "label": "\u82f1\u6570"},
        {"x": 1.75, "y": 2, "w": 1, "h": 1, "kanataKey": "a", "label": "A"},
        {"x": 2.75, "y": 2, "w": 1, "h": 1, "kanataKey": "s", "label": "S"},
        {"x": 3.75, "y": 2, "w": 1, "h": 1, "kanataKey": "d", "label": "D"},
        {"x": 4.75, "y": 2, "w": 1, "h": 1, "kanataKey": "f", "label": "F"},
        {"x": 5.75, "y": 2, "w": 1, "h": 1, "kanataKey": "g", "label": "G"},
        {"x": 6.75, "y": 2, "w": 1, "h": 1, "kanataKey": "h", "label": "H"},
        {"x": 7.75, "y": 2, "w": 1, "h": 1, "kanataKey": "j", "label": "J"},
        {"x": 8.75, "y": 2, "w": 1, "h": 1, "kanataKey": "k", "label": "K"},
        {"x": 9.75, "y": 2, "w": 1, "h": 1, "kanataKey": "l", "label": "L"},
        {"x": 10.75, "y": 2, "w": 1, "h": 1, "kanataKey": ";", "label": ";"},
        {"x": 11.75, "y": 2, "w": 1, "h": 1, "kanataKey": "'", "label": ":"},
        {"x": 12.75, "y": 2, "w": 1, "h": 1, "kanataKey": "\\", "label": "]"}
      ],
      [
        {"x": 0, "y": 3, "w": 2.25, "h": 1, "kanataKey": "lsft", "label": "LShift"},
        {"x": 2.25, "y": 3, "w": 1, "h": 1, "kanataKey": "z", "label": "Z"},
        {"x": 3.25, "y": 3, "w": 1, "h": 1, "kanataKey": "x", "label": "X"},
        {"x": 4.25, "y": 3, "w": 1, "h": 1, "kanataKey": "c", "label": "C"},
        {"x": 5.25, "y": 3, "w": 1, "h": 1, "kanataKey": "v", "label": "V"},
        {"x": 6.25, "y": 3, "w": 1, "h": 1, "kanataKey": "b", "label": "B"},
        {"x": 7.25, "y": 3, "w": 1, "h": 1, "kanataKey": "n", "label": "N"},
        {"x": 8.25, "y": 3, "w": 1, "h": 1, "kanataKey": "m", "label": "M"},
        {"x": 9.25, "y": 3, "w": 1, "h": 1, "kanataKey": ",", "label": ","},
        {"x": 10.25, "y": 3, "w": 1, "h": 1, "kanataKey": ".", "label": "."},
        {"x": 11.25, "y": 3, "w": 1, "h": 1, "kanataKey": "/", "label": "/"},
        {"x": 12.25, "y": 3, "w": 1, "h": 1, "kanataKey": "ro", "label": "\\"},
        {"x": 13.25, "y": 3, "w": 1.75, "h": 1, "kanataKey": "rsft", "label": "RShift"}
      ],
      [
        {"x": 0, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lctl", "label": "Ctrl"},
        {"x": 1.25, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lmet", "label": "Win"},
        {"x": 2.5, "y": 4, "w": 1.25, "h": 1, "kanataKey": "lalt", "label": "Alt"},
        {"x": 3.75, "y": 4, "w": 1.5, "h": 1, "kanataKey": "kana", "label": "\u7121\u5909\u63db"},
        {"x": 5.25, "y": 4, "w": 3.5, "h": 1, "kanataKey": "spc", "label": "Space"},
        {"x": 8.75, "y": 4, "w": 1.5, "h": 1, "kanataKey": "kana", "label": "\u5909\u63db"},
        {"x": 10.25, "y": 4, "w": 1, "h": 1, "kanataKey": "ralt", "label": "\u304b\u306a"},
        {"x": 11.25, "y": 4, "w": 1.25, "h": 1, "kanataKey": "rmet", "label": "Win"},
        {"x": 12.5, "y": 4, "w": 1.25, "h": 1, "kanataKey": "menu", "label": "Menu"},
        {"x": 13.75, "y": 4, "w": 1.25, "h": 1, "kanataKey": "rctl", "label": "Ctrl"}
      ]
    ]
  }
}

async function loadLayout(layoutId) {
  const layout = LAYOUT_DATA[layoutId]
  if (!layout) {
    throw new Error(`未知のレイアウト: ${layoutId}`)
  }
  return layout
}

function getAvailableLayouts() {
  return [
    { id: 'us-ansi-60',  name: 'US ANSI 60%' },
    { id: 'us-ansi-fn',  name: 'US ANSI Fn Row' },
    { id: 'us-ansi-tkl', name: 'US ANSI TKL' },
    { id: 'jis-60',      name: 'JIS 60%' },
  ]
}

// レイアウトから物理キー配列をフラットにして返す
function flattenLayout(layoutData) {
  const keys = []
  for (const row of layoutData.rows) {
    for (const key of row) {
      keys.push({ ...key })
    }
  }
  return keys
}

// レイアウトの総キー数を取得
function getKeyCount(layoutData) {
  let count = 0
  for (const row of layoutData.rows) {
    count += row.length
  }
  return count
}

  V2K.loadLayout = loadLayout;
  V2K.getAvailableLayouts = getAvailableLayouts;
  V2K.flattenLayout = flattenLayout;
  V2K.getKeyCount = getKeyCount;
})();

// === converter.js ===
(function() {
// ============================================================
// vil2kanata ブラウザ対応版変換ロジック
// vil2kanata.js から fs/path 依存を除去した ES Module 版
// ============================================================

// QMK → Kanata キーコードマッピング
const BASIC_KEYCODE_MAP = {
  KC_A: 'a', KC_B: 'b', KC_C: 'c', KC_D: 'd', KC_E: 'e',
  KC_F: 'f', KC_G: 'g', KC_H: 'h', KC_I: 'i', KC_J: 'j',
  KC_K: 'k', KC_L: 'l', KC_M: 'm', KC_N: 'n', KC_O: 'o',
  KC_P: 'p', KC_Q: 'q', KC_R: 'r', KC_S: 's', KC_T: 't',
  KC_U: 'u', KC_V: 'v', KC_W: 'w', KC_X: 'x', KC_Y: 'y',
  KC_Z: 'z',

  KC_1: '1', KC_2: '2', KC_3: '3', KC_4: '4', KC_5: '5',
  KC_6: '6', KC_7: '7', KC_8: '8', KC_9: '9', KC_0: '0',

  KC_F1: 'f1', KC_F2: 'f2', KC_F3: 'f3', KC_F4: 'f4',
  KC_F5: 'f5', KC_F6: 'f6', KC_F7: 'f7', KC_F8: 'f8',
  KC_F9: 'f9', KC_F10: 'f10', KC_F11: 'f11', KC_F12: 'f12',
  KC_F13: 'f13', KC_F14: 'f14', KC_F15: 'f15', KC_F16: 'f16',
  KC_F17: 'f17', KC_F18: 'f18', KC_F19: 'f19', KC_F20: 'f20',
  KC_F21: 'f21', KC_F22: 'f22', KC_F23: 'f23', KC_F24: 'f24',

  KC_ENTER: 'ret', KC_ENT: 'ret',
  KC_ESCAPE: 'esc', KC_ESC: 'esc',
  KC_BSPACE: 'bspc', KC_BSPC: 'bspc',
  KC_TAB: 'tab',
  KC_SPACE: 'spc', KC_SPC: 'spc',
  KC_CAPSLOCK: 'caps', KC_CAPS: 'caps',
  KC_DELETE: 'del', KC_DEL: 'del',
  KC_INSERT: 'ins', KC_INS: 'ins',
  KC_PSCREEN: 'prnt', KC_PSCR: 'prnt',
  KC_SCROLLLOCK: 'slck', KC_SLCK: 'slck',
  KC_PAUSE: 'pause', KC_PAUS: 'pause',

  KC_MINUS: '-', KC_MINS: '-',
  KC_EQUAL: '=', KC_EQL: '=',
  KC_LBRACKET: '[', KC_LBRC: '[',
  KC_RBRACKET: ']', KC_RBRC: ']',
  KC_BACKSLASH: '\\', KC_BSLASH: '\\', KC_BSLS: '\\',
  KC_SCOLON: ';', KC_SCLN: ';',
  KC_QUOTE: '\'', KC_QUOT: '\'',
  KC_GRAVE: 'grv', KC_GRV: 'grv',
  KC_COMMA: ',', KC_COMM: ',',
  KC_DOT: '.', KC_PDOT: '.',
  KC_SLASH: '/', KC_SLSH: '/',

  KC_PGUP: 'pgup',
  KC_PGDOWN: 'pgdn', KC_PGDN: 'pgdn',
  KC_HOME: 'home',
  KC_END: 'end',
  KC_LEFT: 'left',
  KC_RIGHT: 'rght',
  KC_UP: 'up',
  KC_DOWN: 'down',

  KC_LCTRL: 'lctl', KC_LCTL: 'lctl',
  KC_LSHIFT: 'lsft', KC_LSFT: 'lsft',
  KC_LALT: 'lalt',
  KC_LGUI: 'lmet',
  KC_RCTRL: 'rctl', KC_RCTL: 'rctl',
  KC_RSHIFT: 'rsft', KC_RSFT: 'rsft',
  KC_RALT: 'ralt',
  KC_RGUI: 'rmet',

  KC_RO: 'ro',
  KC_JYEN: '¥',
  KC_NONUS_HASH: '\\',
  KC_LANG1: 'kana', KC_LNG1: 'kana',
  KC_INT5: 'mhnk',
  KC_INT4: 'henk',
  KC_APPLICATION: 'menu', KC_APP: 'menu',

  KC_BTN1: 'mlft',
  KC_BTN2: 'mrgt',
  KC_BTN3: 'mmid',

  KC_KP_PLUS: 'kp+',
  KC_KP_MINUS: 'kp-',
  KC_KP_ASTERISK: 'kp*',
  KC_KP_SLASH: 'kp/',
  KC_KP_DOT: 'kp.',
  KC_KP_ENTER: 'kprt',
  KC_KP_0: 'kp0', KC_KP_1: 'kp1', KC_KP_2: 'kp2', KC_KP_3: 'kp3',
  KC_KP_4: 'kp4', KC_KP_5: 'kp5', KC_KP_6: 'kp6', KC_KP_7: 'kp7',
  KC_KP_8: 'kp8', KC_KP_9: 'kp9',

  KC_TRNS: '_', KC_TRANSPARENT: '_',
  KC_NO: 'XX',

  KC_MUTE: 'mute',
  KC_VOLU: 'volu',
  KC_VOLD: 'vold',
  KC_MNXT: 'next',
  KC_MPRV: 'prev',
  KC_MPLY: 'pp',
  KC_MSTP: 'stop',

  KC_LRLD: 'lrld',
}

const ARBITRARY_CODE_KEYS = {
  KC_LANG1: { name: 'lang1', code: 242, comment: ';; IME ON (VK_DBE_HIRAGANA)' },
  KC_LNG1: { name: 'lang1', code: 242, comment: ';; IME ON (VK_DBE_HIRAGANA)' },
  KC_LANG2: { name: 'lang2', code: 26, comment: ';; IME OFF (VK_IME_OFF)' },
  KC_LNG2: { name: 'lang2', code: 26, comment: ';; IME OFF (VK_IME_OFF)' },
}

// kanataキー名 → arbitrary-code 変換が必要なキー（Windowsでkanataが正しくマッピングしないもの）
const KANATA_NAME_TO_ARBITRARY = {
  'lang1': 242,  // VK_DBE_HIRAGANA (IME ON)
  'lang2': 26,   // VK_IME_OFF (IME OFF)
  'eisu': 26,    // lang2の別名
}

// kanataキー名を.kbd出力用に変換（arbitrary-codeが必要なキーを自動変換）
function resolveKanataKey(kanataKey) {
  if (!kanataKey) return kanataKey
  const code = KANATA_NAME_TO_ARBITRARY[kanataKey]
  if (code !== undefined) return `(arbitrary-code ${code})`
  return kanataKey
}

const MOD_PREFIX_MAP = {
  LSFT: 'S-', RSFT: 'RS-',
  LCTL: 'C-', RCTL: 'RC-',
  LALT: 'A-', RALT: 'RA-',
  LGUI: 'M-', RGUI: 'RM-',
}

const MOD_TAP_HOLD_MAP = {
  LSFT: 'lsft', RSFT: 'rsft',
  LCTL: 'lctl', RCTL: 'rctl',
  LALT: 'lalt', RALT: 'ralt',
  LGUI: 'lmet', RGUI: 'rmet',
}

const COMPOUND_MOD_MAP = {
  C_S: 'C-S-',
  LCA: 'C-A-',
  MEH: 'C-A-S-',
  HYPR: 'C-A-S-M-',
}

const TEXT_TO_KEYS_JIS = {
  'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e',
  'f': 'f', 'g': 'g', 'h': 'h', 'i': 'i', 'j': 'j',
  'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o',
  'p': 'p', 'q': 'q', 'r': 'r', 's': 's', 't': 't',
  'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y',
  'z': 'z',
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '-': '-', ' ': 'spc',
  '.': '.', ',': ',', '/': '/', ';': ';',
  '[': '[', ']': ']', '\\': '\\',
  '!': 'S-1', '@': '[', '#': 'S-3', '$': 'S-4', '%': 'S-5',
  '^': '=', '&': 'S-6', '*': 'S-\'', '(': 'S-8', ')': 'S-9',
  '_': 'S-ro', '+': 'S-;', '=': 'S--',
  '{': 'S-[', '}': 'S-]', '|': 'S-¥',
  ':': ':', '\'': 'S-7', '"': 'S-2',
  '<': 'S-,', '>': 'S-.', '?': 'S-/',
  '~': 'S-=',
  '`': 'S-[',
}

const MOUSE_MOVE_MAP = {
  KC_MS_L: { name: 'ms-l', value: '(movemouse-left 1 1)' },
  KC_MS_R: { name: 'ms-r', value: '(movemouse-right 1 1)' },
  KC_MS_U: { name: 'ms-u', value: '(movemouse-up 1 1)' },
  KC_MS_D: { name: 'ms-d', value: '(movemouse-down 1 1)' },
}

const DEFSRC_SUBSTITUTE_POOL = [
  'f13', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20',
  'f21', 'f22', 'f23', 'f24',
  'ins', 'pause', 'slck', 'prnt',
  'kp0', 'kp1', 'kp2', 'kp3', 'kp4', 'kp5',
  'kp6', 'kp7', 'kp8', 'kp9',
]

const MACRO_MOD_MAPPING = {
  LSHIFT: 'LSFT', RSHIFT: 'RSFT', LSFT: 'LSFT', RSFT: 'RSFT',
  LCTRL: 'LCTL', RCTRL: 'RCTL', LCTL: 'LCTL', RCTL: 'RCTL',
  LALT: 'LALT', RALT: 'RALT',
  LGUI: 'LGUI', RGUI: 'RGUI',
}

// ============================================================
// パーサー関数
// ============================================================

function parseModified(str) {
  for (const [prefix, kanataPrefix] of Object.entries(COMPOUND_MOD_MAP)) {
    const open = prefix + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: kanataPrefix, key: parseKeycode(inner) }
    }
  }

  for (const mod of Object.keys(MOD_PREFIX_MAP)) {
    const open = mod + '('
    if (str.startsWith(open) && str.endsWith(')')) {
      const inner = str.slice(open.length, -1)
      return { type: 'modified', prefix: MOD_PREFIX_MAP[mod], key: parseKeycode(inner) }
    }
  }

  return null
}

function parseModTap(str) {
  const match = str.match(/^(LSFT|RSFT|LCTL|RCTL|LALT|RALT|LGUI|RGUI)_T\((.+)\)$/)
  if (!match) return null
  const mod = MOD_TAP_HOLD_MAP[match[1]]
  const key = convertBasicKeycode(match[2])
  return { type: 'mod-tap', mod, key }
}

function parseLayerTap(str) {
  const match = str.match(/^LT(\d+)\((.+)\)$/)
  if (!match) return null
  const layer = parseInt(match[1], 10)
  const key = convertBasicKeycode(match[2])
  return { type: 'layer-tap', layer, key }
}

function parseLayerOp(str) {
  const match = str.match(/^(MO|TO|TG|DF)\((\d+)\)$/)
  if (!match) return null
  return { type: 'layer-op', op: match[1], layer: parseInt(match[2], 10) }
}

function parseMacroRef(str) {
  const match = str.match(/^M(\d+)$/)
  if (!match) return null
  return { type: 'macro-ref', index: parseInt(match[1], 10) }
}

function parseTapDanceRef(str) {
  const match = str.match(/^TD\((\d+)\)$/)
  if (!match) return null
  return { type: 'tap-dance-ref', index: parseInt(match[1], 10) }
}

function parseUserKeycode(str) {
  const match = str.match(/^USER(\d+)$/)
  if (!match) return null
  return { type: 'user', index: parseInt(match[1], 10) }
}

// ============================================================
// キーコード変換
// ============================================================

function convertBasicKeycode(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    return `(arbitrary-code ${ARBITRARY_CODE_KEYS[qmkStr].code})`
  }
  return 'XX'
}

function convertModified(parsed) {
  const keyStr = typeof parsed.key === 'string' ? parsed.key : formatKeycode(parsed.key)
  return `${parsed.prefix}${keyStr}`
}

function formatKeycode(parsed) {
  if (typeof parsed === 'string') return parsed
  if (parsed && parsed.type === 'modified') {
    return convertModified(parsed)
  }
  return 'XX'
}

function parseKeycode(qmkStr) {
  if (!qmkStr || qmkStr === '') return 'XX'
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modified = parseModified(qmkStr)
  if (modified) return modified
  return qmkStr
}

function extractDefsrcKey(key) {
  if (!key || typeof key !== 'string') return 'XX'
  if (BASIC_KEYCODE_MAP[key] !== undefined) return BASIC_KEYCODE_MAP[key]
  if (ARBITRARY_CODE_KEYS[key]) return 'XX'
  const modTap = parseModTap(key)
  if (modTap) return modTap.key
  const layerTap = parseLayerTap(key)
  if (layerTap) {
    if (layerTap.key.startsWith('XX') || layerTap.key.startsWith('@') || layerTap.key.startsWith('(')) return 'XX'
    return layerTap.key
  }
  const userKey = parseUserKeycode(key)
  if (userKey) return `f${13 + userKey.index}`
  return 'XX'
}

function convertKeycode(qmkStr, aliasContext) {
  if (!qmkStr || qmkStr === '' || typeof qmkStr !== 'string') return { kanata: 'XX' }

  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return { kanata: BASIC_KEYCODE_MAP[qmkStr] }
  }

  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    const arb = ARBITRARY_CODE_KEYS[qmkStr]
    aliasContext.registerArbitraryCode(arb.name, arb.code, arb.comment)
    return { kanata: `@${arb.name}` }
  }

  if (MOUSE_MOVE_MAP[qmkStr]) {
    const mouse = MOUSE_MOVE_MAP[qmkStr]
    aliasContext.registerMouseMove(mouse.name, mouse.value)
    return { kanata: `@${mouse.name}` }
  }

  const modTap = parseModTap(qmkStr)
  if (modTap) {
    const name = aliasContext.registerModTap(modTap)
    return { kanata: `@${name}` }
  }

  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) {
    const name = aliasContext.registerLayerTap(layerTap)
    return { kanata: `@${name}` }
  }

  const layerOp = parseLayerOp(qmkStr)
  if (layerOp) {
    const name = aliasContext.registerLayerOp(layerOp)
    return { kanata: `@${name}` }
  }

  const macroRef = parseMacroRef(qmkStr)
  if (macroRef) {
    return { kanata: `@m${macroRef.index}` }
  }

  const tdRef = parseTapDanceRef(qmkStr)
  if (tdRef) {
    return { kanata: `@td${tdRef.index}` }
  }

  const userKey = parseUserKeycode(qmkStr)
  if (userKey) {
    const name = aliasContext.registerUser(userKey)
    return { kanata: `@${name}` }
  }

  const modified = parseModified(qmkStr)
  if (modified) {
    const kanataStr = formatKeycode(modified)
    const name = aliasContext.registerModified(qmkStr, kanataStr)
    return { kanata: `@${name}` }
  }

  return { kanata: 'XX' }
}

// ============================================================
// マクロ変換
// ============================================================

function convertMacroKeycode(qmkStr) {
  if (qmkStr === 'KC_TRNS' || qmkStr === 'KC_TRANSPARENT') {
    return null
  }
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    return formatKeycode(modified)
  }
  return 'XX'
}

function convertTextToKeys(text) {
  const keys = []
  for (const ch of text) {
    if (TEXT_TO_KEYS_JIS[ch]) {
      keys.push(TEXT_TO_KEYS_JIS[ch])
    } else {
      keys.push('XX')
    }
  }
  return keys
}

function optimizeMacroActions(actions) {
  const result = []
  let i = 0

  while (i < actions.length) {
    const action = actions[i]
    const actionType = action[0]

    if (actionType === 'text') {
      result.push({ type: 'text', text: action[1] })
      i++
      continue
    }

    if (actionType === 'down') {
      if (action.length > 2) {
        result.push({ type: 'tap', keys: action.slice(1) })
        i++
        continue
      }

      const modKey = action[1]
      const modName = modKey.replace('KC_', '')
      const normalizedMod = MACRO_MOD_MAPPING[modName]
      if (normalizedMod && MOD_PREFIX_MAP[normalizedMod]) {
        const tapsBeforeUp = []
        let j = i + 1
        let foundUp = false

        while (j < actions.length) {
          const next = actions[j]
          if (next[0] === 'tap') {
            tapsBeforeUp.push(...next.slice(1))
            j++
          } else if (next[0] === 'up' && next[1] === modKey) {
            foundUp = true
            j++
            break
          } else {
            break
          }
        }

        if (foundUp && tapsBeforeUp.length > 0) {
          result.push({
            type: 'modified-tap',
            prefix: MOD_PREFIX_MAP[normalizedMod],
            keys: tapsBeforeUp,
          })
          i = j
          continue
        }
      }

      result.push({ type: 'down', key: modKey })
      i++
      continue
    }

    if (actionType === 'tap') {
      result.push({ type: 'tap', keys: action.slice(1) })
      i++
      continue
    }

    if (actionType === 'up') {
      result.push({ type: 'up', key: action[1] })
      i++
      continue
    }

    result.push({ type: 'unknown', raw: action })
    i++
  }

  return result
}

function convertMacro(macroActions) {
  if (!macroActions || macroActions.length === 0) return null

  const optimized = optimizeMacroActions(macroActions)
  const parts = []

  for (const action of optimized) {
    if (action.type === 'tap') {
      const converted = action.keys.map(convertMacroKeycode).filter(Boolean)
      parts.push(...converted)
    } else if (action.type === 'modified-tap') {
      for (const key of action.keys) {
        const converted = convertMacroKeycode(key)
        if (converted) {
          parts.push(`${action.prefix}${converted}`)
        }
      }
    } else if (action.type === 'text') {
      parts.push(...convertTextToKeys(action.text))
    } else if (action.type === 'down') {
      parts.push(`;; hold: ${action.key}`)
    } else if (action.type === 'up') {
      parts.push(`;; release: ${action.key}`)
    }
  }

  if (parts.length === 0) return null
  return `(macro ${parts.join(' ')})`
}

// ============================================================
// タップダンス変換
// ============================================================

function convertBasicOrModified(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  if (ARBITRARY_CODE_KEYS[qmkStr]) {
    return `@${ARBITRARY_CODE_KEYS[qmkStr].name}`
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    return formatKeycode(modified)
  }
  const modTap = parseModTap(qmkStr)
  if (modTap) {
    return `(tap-hold-release $tap-time $hold-time ${modTap.key} ${modTap.mod})`
  }
  return 'XX'
}

function convertTapDance(tdData, index) {
  const [onTap, onHold, onDoubleTap, onTapHold, tappingTerm] = tdData

  const isActive = (k) => k && k !== 'KC_NO'
  const hasOnTap = isActive(onTap)
  const hasOnHold = isActive(onHold)
  const hasOnDoubleTap = isActive(onDoubleTap)
  const hasOnTapHold = isActive(onTapHold)

  if (!hasOnTap && !hasOnHold && !hasOnDoubleTap && !hasOnTapHold) {
    return null
  }

  const tapKey = hasOnTap ? convertBasicOrModified(onTap) : 'XX'
  const holdKey = hasOnHold ? convertBasicOrModified(onHold) : null
  const doubleTapKey = hasOnDoubleTap ? convertBasicOrModified(onDoubleTap) : null
  const tapHoldKey = hasOnTapHold ? convertBasicOrModified(onTapHold) : null
  const term = tappingTerm || 200
  const comment = `;; TD${index}: tap=${onTap} hold=${onHold} 2tap=${onDoubleTap} tap_hold=${onTapHold}`

  function buildSecondAction() {
    const dt = hasOnDoubleTap ? doubleTapKey : tapKey
    if (hasOnTapHold) {
      return `(tap-hold-release $tap-time $hold-time ${dt} ${tapHoldKey})`
    }
    return dt
  }

  const actions = []

  if (hasOnHold) {
    actions.push(`(tap-hold-release $tap-time $hold-time ${tapKey} ${holdKey})`)
  } else {
    actions.push(tapKey)
  }

  if (hasOnDoubleTap || hasOnTapHold) {
    actions.push(buildSecondAction())
  }

  return {
    name: `td${index}`,
    value: `(tap-dance ${term} (${actions.join(' ')}))`,
    comment,
  }
}

// ============================================================
// コンボ変換
// ============================================================

function comboInputKey(qmkStr) {
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return BASIC_KEYCODE_MAP[qmkStr]
  }
  const modTap = parseModTap(qmkStr)
  if (modTap) return modTap.key
  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) return layerTap.key
  const userKey = parseUserKeycode(qmkStr)
  if (userKey) return `usr${String(userKey.index).padStart(2, '0')}`
  return convertBasicOrModified(qmkStr)
}

function convertComboWithPositions(comboData, macroNames, qmkToPositions, uniqueDefsrcKeys) {
  const [key1, key2, key3, key4, result] = comboData
  const keys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')

  if (keys.length < 2) return null

  const usedPositions = new Set()
  const inputKeys = keys.map((qmkStr) => {
    const positions = qmkToPositions.get(qmkStr) || []
    for (const pos of positions) {
      if (!usedPositions.has(pos)) {
        usedPositions.add(pos)
        return uniqueDefsrcKeys[pos]
      }
    }
    return comboInputKey(qmkStr)
  })

  const hasDuplicateKeys = new Set(inputKeys).size !== inputKeys.length
  const duplicateWarning = hasDuplicateKeys
    ? ' ;; WARNING: 重複キーあり'
    : ''

  let resultStr
  const macroRef = parseMacroRef(result)
  if (macroRef && macroNames.has(macroRef.index)) {
    resultStr = `@m${macroRef.index}`
  } else if (BASIC_KEYCODE_MAP[result] !== undefined) {
    resultStr = BASIC_KEYCODE_MAP[result]
  } else {
    resultStr = convertBasicOrModified(result)
  }

  const comment = `;; ${keys.join(' + ')} → ${result}${duplicateWarning}`

  return {
    keys: inputKeys,
    result: resultStr,
    comment,
  }
}

// ============================================================
// キーオーバーライド変換
// ============================================================

const TRIGGER_MOD_BITS = {
  1: 'LCtrl', 2: 'LShift', 4: 'LAlt', 8: 'LGui',
  16: 'RCtrl', 32: 'RShift', 64: 'RAlt', 128: 'RGui',
}

const TRIGGER_MOD_TO_KANATA = {
  1: 'lctl', 2: 'lsft', 4: 'lalt', 8: 'lmet',
  16: 'rctl', 32: 'rsft', 64: 'ralt', 128: 'rmet',
}

const MOD_LR_PAIRS = [
  [1, 16], [2, 32], [4, 64], [8, 128],
]

function describeTriggerMods(modBits) {
  const mods = []
  for (const [bit, name] of Object.entries(TRIGGER_MOD_BITS)) {
    if (modBits & parseInt(bit, 10)) {
      mods.push(name)
    }
  }
  return mods.length > 0 ? mods.join('+') : 'none'
}

function expandTriggerMods(modBits) {
  if (modBits === 0) return [[]]

  const allMods = []
  for (const [bit, name] of Object.entries(TRIGGER_MOD_TO_KANATA)) {
    if (modBits & parseInt(bit, 10)) {
      allMods.push({ bit: parseInt(bit, 10), name })
    }
  }

  const pairsToExpand = []
  const fixedMods = []

  for (const mod of allMods) {
    let isPaired = false
    for (const [leftBit, rightBit] of MOD_LR_PAIRS) {
      if ((mod.bit === leftBit || mod.bit === rightBit) &&
          (modBits & leftBit) && (modBits & rightBit)) {
        if (mod.bit === leftBit) {
          pairsToExpand.push([
            TRIGGER_MOD_TO_KANATA[leftBit],
            TRIGGER_MOD_TO_KANATA[rightBit],
          ])
        }
        isPaired = true
        break
      }
    }
    if (!isPaired) {
      fixedMods.push(mod.name)
    }
  }

  if (pairsToExpand.length === 0) {
    return [allMods.map((m) => m.name)]
  }

  let combos = [fixedMods]
  for (const pair of pairsToExpand) {
    const newCombos = []
    for (const combo of combos) {
      for (const mod of pair) {
        newCombos.push([...combo, mod])
      }
    }
    combos = newCombos
  }
  return combos
}

function parseKanataPrefixToMods(prefix) {
  const modMap = {
    'S-': 'lsft', 'RS-': 'rsft',
    'C-': 'lctl', 'RC-': 'rctl',
    'A-': 'lalt', 'RA-': 'ralt',
    'M-': 'lmet', 'RM-': 'rmet',
  }
  const mods = []
  let remaining = prefix
  while (remaining.length > 0) {
    let matched = false
    for (const [pfx, mod] of Object.entries(modMap).sort((a, b) => b[0].length - a[0].length)) {
      if (remaining.startsWith(pfx)) {
        mods.push(mod)
        remaining = remaining.slice(pfx.length)
        matched = true
        break
      }
    }
    if (!matched) break
  }
  return mods
}

function convertReplacementToKanata(qmkStr) {
  if (!qmkStr || qmkStr === 'KC_NO') return null
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    return [BASIC_KEYCODE_MAP[qmkStr]]
  }
  const modified = parseModified(qmkStr)
  if (modified) {
    const mods = parseKanataPrefixToMods(modified.prefix)
    const key = typeof modified.key === 'string' ? modified.key : 'XX'
    return [...mods, key]
  }
  return null
}

function convertKeyOverride(ko) {
  const triggerQmk = ko.trigger || 'KC_NO'
  const replacementQmk = ko.replacement || 'KC_NO'
  const modBits = ko.trigger_mods || 0

  if (triggerQmk === 'KC_NO' && replacementQmk === 'KC_NO') return null

  const triggerKey = extractDefsrcKey(triggerQmk)
  if (!triggerKey || triggerKey === 'XX') return null

  const replacementKeys = convertReplacementToKanata(replacementQmk)
  if (!replacementKeys) return null

  const modCombos = expandTriggerMods(modBits)
  const triggerModsDesc = describeTriggerMods(modBits)
  const comment = `${triggerQmk} + ${triggerModsDesc} → ${replacementQmk}`

  const entries = modCombos.map((mods) => ({
    trigger: [...mods, triggerKey].join(' '),
    replacement: replacementKeys.join(' '),
    comment,
  }))

  return { entries }
}

// ============================================================
// defsrc重複キー解消
// ============================================================

function makeDefsrcKeysUnique(allKeys) {
  const usedKeys = new Set(allKeys)
  const seen = new Map()
  const uniqueKeys = []
  const duplicateInfo = []
  let subIdx = 0

  for (let i = 0; i < allKeys.length; i++) {
    const key = allKeys[i]
    if (key === 'XX' || key === '_') {
      while (subIdx < DEFSRC_SUBSTITUTE_POOL.length && usedKeys.has(DEFSRC_SUBSTITUTE_POOL[subIdx])) {
        subIdx++
      }
      if (subIdx < DEFSRC_SUBSTITUTE_POOL.length) {
        const sub = DEFSRC_SUBSTITUTE_POOL[subIdx]
        uniqueKeys.push(sub)
        usedKeys.add(sub)
        duplicateInfo.push({ original: key, substitute: sub, position: i })
        subIdx++
      } else {
        uniqueKeys.push(key)
      }
    } else if (!seen.has(key)) {
      seen.set(key, i)
      uniqueKeys.push(key)
    } else {
      while (subIdx < DEFSRC_SUBSTITUTE_POOL.length && usedKeys.has(DEFSRC_SUBSTITUTE_POOL[subIdx])) {
        subIdx++
      }
      if (subIdx < DEFSRC_SUBSTITUTE_POOL.length) {
        const sub = DEFSRC_SUBSTITUTE_POOL[subIdx]
        uniqueKeys.push(sub)
        usedKeys.add(sub)
        duplicateInfo.push({ original: key, substitute: sub, position: i })
        subIdx++
      } else {
        uniqueKeys.push(key)
      }
    }
  }

  return { uniqueKeys, duplicateInfo }
}

// ============================================================
// エイリアスコンテキスト
// ============================================================

function createAliasContext() {
  const aliases = new Map()

  return {
    registerModTap(parsed) {
      const variant = parsed.variant || 'tap-hold-release'
      const extraKeys = parsed.extraKeys || ''
      const suffix = variant !== 'tap-hold-release' ? `-${variant}` : ''
      const extraSuffix = extraKeys ? `-${extraKeys.replace(/\s+/g, '')}` : ''
      const name = `${parsed.key}-${parsed.mod}${suffix}${extraSuffix}`
      if (!aliases.has(name)) {
        const extraPart = extraKeys ? ` ${extraKeys}` : ''
        aliases.set(name, {
          type: 'mod-tap',
          value: `(${variant} $tap-time $hold-time ${parsed.key} ${parsed.mod}${extraPart})`,
          comment: null,
        })
      }
      return name
    },

    registerLayerTap(parsed) {
      const variant = parsed.variant || 'tap-hold-release'
      const extraKeys = parsed.extraKeys || ''
      const suffix = variant !== 'tap-hold-release' ? `-${variant}` : ''
      const extraSuffix = extraKeys ? `-${extraKeys.replace(/\s+/g, '')}` : ''
      const name = `l${parsed.layer}-${parsed.key}${suffix}${extraSuffix}`
      if (!aliases.has(name)) {
        const extraPart = extraKeys ? ` ${extraKeys}` : ''
        aliases.set(name, {
          type: 'layer-tap',
          value: `(${variant} $tap-time $hold-time ${parsed.key} (layer-while-held layer${parsed.layer})${extraPart})`,
          comment: null,
        })
      }
      return name
    },

    registerLayerOp(parsed) {
      const opMap = {
        MO: 'layer-while-held',
        TO: 'layer-switch',
        TG: 'layer-toggle',
        DF: 'layer-switch',
      }
      const kanataOp = opMap[parsed.op] || 'layer-toggle'
      const name = `${parsed.op.toLowerCase()}${parsed.layer}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'layer-op',
          value: `(${kanataOp} layer${parsed.layer})`,
          comment: null,
        })
      }
      return name
    },

    registerModified(qmkStr, kanataStr) {
      const safeName = qmkStr
        .replace(/\(/g, '_')
        .replace(/\)/g, '')
        .replace(/KC_/g, '')
        .toLowerCase()
      const name = `k-${safeName}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'modified',
          value: kanataStr,
          comment: `;; ${qmkStr}`,
        })
      }
      return name
    },

    registerUser(parsed) {
      const nn = String(parsed.index).padStart(2, '0')
      const name = `usr${nn}`
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'user',
          value: `XX ;; USER${nn}: ユーザー定義キーコード（要手動設定）`,
          comment: null,
        })
      }
      return name
    },

    registerArbitraryCode(name, code, comment) {
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'arbitrary-code',
          value: `(arbitrary-code ${code})`,
          comment: comment || null,
        })
      }
      return name
    },

    registerMouseMove(name, value) {
      if (!aliases.has(name)) {
        aliases.set(name, {
          type: 'mouse',
          value,
          comment: null,
        })
      }
      return name
    },

    getAliases() {
      return aliases
    },
  }
}

// ============================================================
// キー名パディング
// ============================================================

function padKeys(keys) {
  if (keys.length === 0) return []
  const maxLen = Math.max(...keys.map((k) => k.length))
  const padTo = Math.max(maxLen, 4)
  return keys.map((k) => k.padEnd(padTo))
}

// ============================================================
// メイン変換: .vilデータ → .kbd文字列
// ============================================================

function generateKanataConfig(vilData, inputFileName) {
  const aliasContext = createAliasContext()
  const layout = vilData.layout || []
  const macros = vilData.macro || []
  const tapDances = vilData.tap_dance || []
  const combos = vilData.combo || []
  const keyOverrides = vilData.key_override || []

  const layerCount = layout.length
  const rowCount = layout[0] ? layout[0].length : 0
  const colCount = layout[0] && layout[0][0] ? layout[0][0].length : 0

  // 1. マクロ変換
  const macroAliases = new Map()
  for (let i = 0; i < macros.length; i++) {
    const macroData = macros[i]
    if (!macroData || macroData.length === 0) continue
    const kanataStr = convertMacro(macroData)
    if (kanataStr) {
      macroAliases.set(i, {
        name: `m${i}`,
        value: kanataStr,
        comment: `;; M${i}: ${JSON.stringify(macroData)}`,
      })
    }
  }

  // 2. タップダンス変換
  const tdAliases = []
  for (let i = 0; i < tapDances.length; i++) {
    const td = convertTapDance(tapDances[i], i)
    if (td) {
      tdAliases.push(td)
    }
  }

  // 3. レイヤーキー変換
  const convertedLayers = layout.map((layer) =>
    layer.map((row) =>
      row.map((key) => convertKeycode(key, aliasContext))
    )
  )

  // 3.5. defsrcキー計算
  const baseLayer = layout[0] || []
  const defsrcRows = []
  const allDefsrcKeys = []
  const baseLayerFlat = []
  for (const row of baseLayer) {
    const defsrcKeys = row.map((key) => {
      baseLayerFlat.push(key)
      return extractDefsrcKey(key)
    })
    defsrcRows.push(defsrcKeys)
    allDefsrcKeys.push(...defsrcKeys)
  }

  const { uniqueKeys: uniqueDefsrcKeys, duplicateInfo } = makeDefsrcKeysUnique(allDefsrcKeys)

  // QMKキーコード → ベースレイヤー位置マップ
  const qmkToPositions = new Map()
  for (let i = 0; i < baseLayerFlat.length; i++) {
    if (!qmkToPositions.has(baseLayerFlat[i])) {
      qmkToPositions.set(baseLayerFlat[i], [])
    }
    qmkToPositions.get(baseLayerFlat[i]).push(i)
  }

  // 3.6. arbitrary-codeキーのエイリアス登録
  const allKeycodes = new Set()
  for (const layer of layout) {
    for (const row of layer) {
      for (const key of row) {
        allKeycodes.add(key)
      }
    }
  }
  for (const combo of combos) {
    for (const key of combo) {
      if (key) allKeycodes.add(key)
    }
  }
  for (const [qmkStr, arb] of Object.entries(ARBITRARY_CODE_KEYS)) {
    if (allKeycodes.has(qmkStr)) {
      aliasContext.registerArbitraryCode(arb.name, arb.code, arb.comment)
    }
  }

  // 4. コンボ変換
  const macroNameSet = new Set(macroAliases.keys())
  const convertedCombos = combos
    .map((c) => convertComboWithPositions(c, macroNameSet, qmkToPositions, uniqueDefsrcKeys))
    .filter(Boolean)

  // 5. キーオーバーライド変換
  const koResults = keyOverrides
    .map(convertKeyOverride)
    .filter(Boolean)
  const koEntries = koResults.flatMap((r) => r.entries)

  // 出力組み立て
  const lines = []

  lines.push(`;; Generated by vil2kanata GUI`)
  lines.push(`;; Source: ${inputFileName}`)
  lines.push(`;; Layers: ${layerCount}, Macros: ${macroAliases.size}, TapDance: ${tdAliases.length}, Combos: ${convertedCombos.length}`)
  lines.push('')

  lines.push('(defcfg')
  lines.push('  process-unmapped-keys yes')
  lines.push('  concurrent-tap-hold yes')
  lines.push(')')
  lines.push('')

  const tapTime = 200
  lines.push('(defvar')
  lines.push(`  tap-time ${tapTime}`)
  lines.push(`  hold-time ${tapTime}`)
  lines.push(')')
  lines.push('')

  lines.push(';; ============================================================')
  lines.push(`;; defsrc: 物理レイアウト (${colCount}x${rowCount})`)
  lines.push(';; ============================================================')
  lines.push('(defsrc')
  let defsrcOffset = 0
  for (const row of defsrcRows) {
    const uniqueRow = uniqueDefsrcKeys.slice(defsrcOffset, defsrcOffset + row.length)
    lines.push(`  ${padKeys(uniqueRow).join(' ')}`)
    defsrcOffset += row.length
  }
  lines.push(')')

  if (duplicateInfo.length > 0) {
    lines.push(`;; NOTE: defsrc内の重複キーを自動的に代替キーに置換しました:`)
    for (const dup of duplicateInfo) {
      lines.push(`;;   ${dup.original} → ${dup.substitute} (位置: ${dup.position})`)
    }
  }
  lines.push('')

  lines.push('(defalias')

  const allAliases = aliasContext.getAliases()
  if (allAliases.size > 0) {
    lines.push('  ;; Mod-Tap / Layer-Tap / Modified keys')
    for (const [name, alias] of allAliases) {
      if (alias.comment) {
        lines.push(`  ${alias.comment}`)
      }
      lines.push(`  ${name} ${alias.value}`)
    }
    lines.push('')
  }

  if (macroAliases.size > 0) {
    lines.push('  ;; Macros')
    for (const [, macro] of macroAliases) {
      lines.push(`  ${macro.comment}`)
      lines.push(`  ${macro.name} ${macro.value}`)
    }
    lines.push('')
  }

  if (tdAliases.length > 0) {
    lines.push('  ;; Tap Dance')
    for (const td of tdAliases) {
      lines.push(`  ${td.comment}`)
      lines.push(`  ${td.name} ${td.value}`)
    }
    lines.push('')
  }

  lines.push(')')
  lines.push('')

  if (convertedCombos.length > 0) {
    lines.push('(defchordsv2')
    for (const combo of convertedCombos) {
      lines.push(`  ${combo.comment}`)
      lines.push(`  (${combo.keys.join(' ')})  ${combo.result}  200  all-released  ()`)
    }
    lines.push(')')
    lines.push('')
  }

  const layerNames = layout.map((_, i) => (i === 0 ? 'base' : `layer${i}`))
  for (let i = 0; i < layout.length; i++) {
    lines.push(`(deflayer ${layerNames[i]}`)
    const convertedLayer = convertedLayers[i]
    for (const row of convertedLayer) {
      const keys = row.map((r) => r.kanata)
      lines.push(`  ${padKeys(keys).join(' ')}`)
    }
    lines.push(')')
    lines.push('')
  }

  if (koEntries.length > 0) {
    lines.push(';; ============================================================')
    lines.push(';; Key Overrides')
    lines.push(';; ============================================================')
    lines.push('(defoverrides')
    const seenComments = new Set()
    for (const entry of koEntries) {
      if (!seenComments.has(entry.comment)) {
        lines.push(`  ;; ${entry.comment}`)
        seenComments.add(entry.comment)
      }
      lines.push(`  (${entry.trigger}) (${entry.replacement})`)
    }
    lines.push(')')
    lines.push('')
  }

  return lines.join('\n')
}

// ============================================================
// GUI状態 → .kbd生成 (Phase 4用)
// ============================================================

function generateKbdFromState(state) {
  const aliasContext = createAliasContext()
  const lines = []

  lines.push(';; Generated by vil2kanata GUI')
  lines.push('')

  // defcfg
  lines.push('(defcfg')
  if (state.settings.processUnmappedKeys !== false) {
    lines.push('  process-unmapped-keys yes')
  }
  if (state.settings.concurrentTapHold !== false) {
    lines.push('  concurrent-tap-hold yes')
  }
  if (state.settings.rapidEventDelay > 0) {
    lines.push(`  rapid-event-delay ${state.settings.rapidEventDelay}`)
  }
  lines.push(')')
  lines.push('')

  // defvar
  lines.push('(defvar')
  lines.push(`  tap-time ${state.settings.tapTime}`)
  lines.push(`  hold-time ${state.settings.holdTime}`)
  lines.push(')')
  lines.push('')

  // defsrcKeysに含まれるインデックスを決定
  const defsrcKeys = state.defsrcKeys
  const includedIndices = (defsrcKeys && defsrcKeys.size > 0)
    ? [...defsrcKeys].sort((a, b) => a - b)
    : state.physicalLayout.map((_, i) => i)

  // defsrc（選択キーのみ）
  const filteredPhysicalKeys = includedIndices.map((i) => state.physicalLayout[i].kanataKey)
  const { uniqueKeys, duplicateInfo } = makeDefsrcKeysUnique(filteredPhysicalKeys)

  lines.push('(defsrc')
  lines.push(`  ${padKeys(uniqueKeys).join(' ')}`)
  lines.push(')')
  if (duplicateInfo.length > 0) {
    for (const dup of duplicateInfo) {
      lines.push(`;;   ${dup.original} → ${dup.substitute} (位置: ${dup.position})`)
    }
  }
  lines.push('')

  // レイヤーのキーコードを変換（defsrcKeysでフィルタリング）
  const convertedLayers = state.layers.map((layer) =>
    includedIndices.map((i) => {
      const keyConfig = layer.keys[i]
      if (!keyConfig || !keyConfig.type) return { kanata: 'XX' }

      switch (keyConfig.type) {
        case 'basic':
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
        case 'modified':
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
        case 'mod-tap': {
          const name = aliasContext.registerModTap({
            key: keyConfig.tapKey,
            mod: keyConfig.holdMod,
            variant: keyConfig.tapHoldVariant,
            extraKeys: keyConfig.tapHoldExtraKeys,
          })
          return { kanata: `@${name}` }
        }
        case 'layer-tap': {
          const name = aliasContext.registerLayerTap({
            layer: keyConfig.layer,
            key: keyConfig.tapKey,
            variant: keyConfig.tapHoldVariant,
            extraKeys: keyConfig.tapHoldExtraKeys,
          })
          return { kanata: `@${name}` }
        }
        case 'layer-op': {
          const name = aliasContext.registerLayerOp({
            op: keyConfig.op,
            layer: keyConfig.layer,
          })
          return { kanata: `@${name}` }
        }
        case 'macro':
          return { kanata: `@m${keyConfig.index}` }
        case 'tap-dance': {
          // GUI形式のtap-danceに該当するIDがあればtdgプレフィックス
          const guiTds = state.tapDancesGui || []
          const isGuiTd = guiTds.some((t) => t && t.id === keyConfig.index)
          return { kanata: isGuiTd ? `@tdg${keyConfig.index}` : `@td${keyConfig.index}` }
        }
        case 'transparent':
          return { kanata: '_' }
        case 'disabled':
          return { kanata: 'XX' }
        default:
          return { kanata: resolveKanataKey(keyConfig.kanataKey) || 'XX' }
      }
    })
  )

  // Macros (GUI形式: {id, actions:[{type,key/text}]})
  const guiMacros = (state.macros || []).filter(
    (m) => m && m.id !== undefined && m.actions && m.actions.length > 0,
  )
  const macroEntries = []
  for (const macro of guiMacros) {
    const parts = []
    for (const action of macro.actions) {
      if (action.type === 'tap' && action.key) {
        parts.push(resolveKanataKey(action.key))
      } else if (action.type === 'text') {
        for (const ch of (action.text || '')) {
          if (TEXT_TO_KEYS_JIS[ch]) parts.push(TEXT_TO_KEYS_JIS[ch])
        }
      } else if (action.type === 'delay' && action.duration) {
        parts.push(`(pause ${action.duration})`)
      }
    }
    if (parts.length > 0) {
      const labelComment = macro.label ? ` ;; ${macro.label}` : ''
      macroEntries.push({ index: macro.id, value: `(macro ${parts.join(' ')})${labelComment}` })
    }
  }

  // Tap Dance (VIL形式パススルー)
  const tdAliases = []
  if (state.tapDances && state.tapDances.length > 0) {
    for (let i = 0; i < state.tapDances.length; i++) {
      const td = convertTapDance(state.tapDances[i], i)
      if (td) tdAliases.push(td)
    }
  }

  // Tap Dance (GUI形式: VILパススルーと区別するためtdgプレフィックス)
  const guiTapDances = (state.tapDancesGui || []).filter(
    (t) => t && t.id !== undefined && t.actions && t.actions.length > 0,
  )
  for (const td of guiTapDances) {
    const actions = td.actions
      .map((a) => resolveKanataKey(a.kanataKey) || 'XX')
      .filter((k) => k)
    if (actions.length > 0) {
      const timeout = td.timeout || 200
      tdAliases.push({
        name: `tdg${td.id}`,
        value: `(tap-dance ${timeout} (${actions.join(' ')}))`,
        comment: null,
      })
    }
  }

  // defalias
  const allAliases = aliasContext.getAliases()
  if (allAliases.size > 0 || macroEntries.length > 0 || tdAliases.length > 0) {
    lines.push('(defalias')
    if (allAliases.size > 0) {
      lines.push('  ;; Mod-Tap / Layer-Tap / Modified keys')
      for (const [name, alias] of allAliases) {
        if (alias.comment) {
          lines.push(`  ${alias.comment}`)
        }
        lines.push(`  ${name} ${alias.value}`)
      }
    }
    if (macroEntries.length > 0) {
      lines.push('  ;; Macros')
      for (const m of macroEntries) {
        lines.push(`  m${m.index} ${m.value}`)
      }
    }
    if (tdAliases.length > 0) {
      lines.push('  ;; Tap Dance')
      for (const td of tdAliases) {
        if (td.comment) lines.push(`  ${td.comment}`)
        lines.push(`  ${td.name} ${td.value}`)
      }
    }
    lines.push(')')
    lines.push('')
  }

  // deflayer
  for (let i = 0; i < state.layers.length; i++) {
    const layerName = state.layers[i].name
    const keys = convertedLayers[i].map((r) => r.kanata)
    lines.push(`(deflayer ${layerName}`)
    lines.push(`  ${padKeys(keys).join(' ')}`)
    lines.push(')')
    lines.push('')
  }

  // Combos → defchordsv2 (GUI形式: {id, keys, result, timeout})
  // コンボのトリガーキーはbaseレイヤーのkanataKeyで保存されているため、
  // 物理キー(defsrc)のkanataKeyに逆引き変換する
  const baseToPhysMap = new Map()
  if (state.physicalLayout && state.layers && state.layers.length > 0) {
    const baseKeys = state.layers[0].keys || []
    for (let i = 0; i < state.physicalLayout.length; i++) {
      if (state.defsrcKeys && state.defsrcKeys.size > 0 && !state.defsrcKeys.has(i)) continue
      const layerKey = baseKeys[i]
      if (layerKey && layerKey.kanataKey && layerKey.kanataKey !== '_' && layerKey.kanataKey !== 'XX') {
        if (!baseToPhysMap.has(layerKey.kanataKey)) {
          baseToPhysMap.set(layerKey.kanataKey, state.physicalLayout[i].kanataKey)
        }
      }
    }
  }

  const guiCombos = (state.combos || []).filter(
    (c) => c && c.id !== undefined && c.keys && c.keys.length >= 2 && c.result,
  )
  if (guiCombos.length > 0) {
    lines.push('(defchordsv2')
    for (const combo of guiCombos) {
      const timeout = combo.timeout || 200
      const physKeys = combo.keys.map((k) => resolveKanataKey(baseToPhysMap.get(k) || k))
      const resolvedResult = resolveKanataKey(combo.result)
      lines.push(`  ;; ${combo.keys.join(' + ')} → ${combo.result}`)
      lines.push(`  (${physKeys.join(' ')})  ${resolvedResult}  ${timeout}  all-released  ()`)
    }
    lines.push(')')
    lines.push('')
  }

  // Key Overrides → defoverrides (GUI形式: {id, trigger, triggerMods, replacementKey, replacementMods})
  const guiOverrides = (state.keyOverrides || []).filter(
    (ko) => ko && ko.id !== undefined && ko.trigger && ko.replacementKey,
  )
  if (guiOverrides.length > 0) {
    lines.push('(defoverrides')
    for (const ko of guiOverrides) {
      const triggerParts = [...(ko.triggerMods || []), ko.trigger].map((k) => resolveKanataKey(k))
      const replacementParts = [...(ko.replacementMods || []), ko.replacementKey].map((k) => resolveKanataKey(k))
      lines.push(`  ;; ${triggerParts.join('+')} → ${replacementParts.join('+')}`)
      lines.push(`  (${triggerParts.join(' ')}) (${replacementParts.join(' ')})`)
    }
    lines.push(')')
    lines.push('')
  }

  return lines.join('\n')
}

// ============================================================
// VIL → GUI形式変換関数
// ============================================================

function vilMacroToGui(macroActions, id) {
  if (!macroActions || macroActions.length === 0) return null
  const optimized = optimizeMacroActions(macroActions)
  const actions = []
  for (const action of optimized) {
    if (action.type === 'tap') {
      for (const key of action.keys) {
        const kanataKey = convertMacroKeycode(key)
        if (kanataKey) actions.push({ type: 'tap', key: kanataKey })
      }
    } else if (action.type === 'modified-tap') {
      for (const key of action.keys) {
        const kanataKey = convertMacroKeycode(key)
        if (kanataKey) actions.push({ type: 'tap', key: `${action.prefix}${kanataKey}` })
      }
    } else if (action.type === 'text') {
      actions.push({ type: 'text', text: action.text })
    }
  }
  return { id, actions }
}

function vilComboToGui(comboData, id) {
  const [key1, key2, key3, key4, result] = comboData
  const inputQmkKeys = [key1, key2, key3, key4].filter((k) => k && k !== 'KC_NO')
  if (inputQmkKeys.length < 2) return null

  const keys = inputQmkKeys.map((k) => {
    if (BASIC_KEYCODE_MAP[k] !== undefined) return BASIC_KEYCODE_MAP[k]
    const modTap = parseModTap(k)
    if (modTap) return modTap.key
    const layerTap = parseLayerTap(k)
    if (layerTap) return layerTap.key
    return convertBasicOrModified(k)
  }).filter((k) => k && k !== 'XX')

  if (keys.length < 2) return null

  let resultKey
  if (BASIC_KEYCODE_MAP[result] !== undefined) {
    resultKey = BASIC_KEYCODE_MAP[result]
  } else {
    resultKey = convertBasicOrModified(result)
  }
  if (!resultKey || resultKey === 'XX') return null

  return { id, keys, result: resultKey, timeout: 200 }
}

function vilOverrideToGui(ko, id) {
  const triggerQmk = ko.trigger || 'KC_NO'
  const replacementQmk = ko.replacement || 'KC_NO'
  const modBits = ko.trigger_mods || 0

  if (triggerQmk === 'KC_NO' && replacementQmk === 'KC_NO') return null

  const trigger = extractDefsrcKey(triggerQmk)
  if (!trigger || trigger === 'XX') return null

  const triggerMods = []
  for (const [bit, mod] of Object.entries(TRIGGER_MOD_TO_KANATA)) {
    if (modBits & parseInt(bit, 10)) triggerMods.push(mod)
  }

  let replacementKey = null
  const replacementMods = []

  if (replacementQmk !== 'KC_NO' && replacementQmk !== '') {
    if (BASIC_KEYCODE_MAP[replacementQmk] !== undefined) {
      replacementKey = BASIC_KEYCODE_MAP[replacementQmk]
    } else {
      const modified = parseModified(replacementQmk)
      if (modified) {
        const mods = parseKanataPrefixToMods(modified.prefix)
        replacementMods.push(...mods)
        replacementKey = typeof modified.key === 'string' ? modified.key : 'XX'
      }
    }
  }

  if (!replacementKey) return null

  return { id, trigger, triggerMods, replacementKey, replacementMods }
}

// ============================================================
// .vilパース: バイナリ/JSONどちらにも対応
// ============================================================

function parseVilData(content) {
  try {
    return JSON.parse(content)
  } catch {
    throw new Error('.vilファイルのパースに失敗しました。JSON形式を確認してください。')
  }
}

// QMKキーコード → GUI用の構造化キー定義に変換
function qmkKeyToGuiKey(qmkStr) {
  if (!qmkStr || qmkStr === '' || typeof qmkStr !== 'string') {
    return { type: 'disabled', label: '', kanataKey: 'XX' }
  }

  if (qmkStr === 'KC_TRNS' || qmkStr === 'KC_TRANSPARENT') {
    return { type: 'transparent', label: '▽', kanataKey: '_' }
  }

  if (qmkStr === 'KC_NO') {
    return { type: 'disabled', label: '', kanataKey: 'XX' }
  }

  // 基本キーコード
  if (BASIC_KEYCODE_MAP[qmkStr] !== undefined) {
    const kanata = BASIC_KEYCODE_MAP[qmkStr]
    const label = qmkStr.replace('KC_', '')
    return { type: 'basic', label, kanataKey: kanata, qmk: qmkStr }
  }

  // Mod-Tap
  const modTap = parseModTap(qmkStr)
  if (modTap) {
    const tapLabel = modTap.key.toUpperCase()
    const holdLabel = modTap.mod.toUpperCase()
    return {
      type: 'mod-tap',
      label: tapLabel,
      holdLabel,
      tapKey: modTap.key,
      holdMod: modTap.mod,
      qmk: qmkStr,
    }
  }

  // Layer-Tap
  const layerTap = parseLayerTap(qmkStr)
  if (layerTap) {
    const tapLabel = layerTap.key.toUpperCase()
    const holdLabel = `L${layerTap.layer}`
    return {
      type: 'layer-tap',
      label: tapLabel,
      holdLabel,
      tapKey: layerTap.key,
      layer: layerTap.layer,
      qmk: qmkStr,
    }
  }

  // レイヤー操作
  const layerOp = parseLayerOp(qmkStr)
  if (layerOp) {
    return {
      type: 'layer-op',
      label: `${layerOp.op}(${layerOp.layer})`,
      op: layerOp.op,
      layer: layerOp.layer,
      qmk: qmkStr,
    }
  }

  // マクロ
  const macroRef = parseMacroRef(qmkStr)
  if (macroRef) {
    return {
      type: 'macro',
      label: `M${macroRef.index}`,
      index: macroRef.index,
      qmk: qmkStr,
    }
  }

  // タップダンス
  const tdRef = parseTapDanceRef(qmkStr)
  if (tdRef) {
    return {
      type: 'tap-dance',
      label: `TD${tdRef.index}`,
      index: tdRef.index,
      qmk: qmkStr,
    }
  }

  // USER
  const userKey = parseUserKeycode(qmkStr)
  if (userKey) {
    return {
      type: 'user',
      label: `U${userKey.index}`,
      index: userKey.index,
      qmk: qmkStr,
    }
  }

  // 修飾付き
  const modified = parseModified(qmkStr)
  if (modified) {
    const kanataStr = formatKeycode(modified)
    return {
      type: 'modified',
      label: kanataStr,
      kanataKey: kanataStr,
      qmk: qmkStr,
    }
  }

  return { type: 'unknown', label: qmkStr, kanataKey: 'XX', qmk: qmkStr }
}

// Kanataキー名 → 表示用ラベル (US配列)
const KANATA_KEY_LABELS = {
  'ret': 'Enter', 'esc': 'Esc', 'bspc': 'Bksp', 'tab': 'Tab',
  'spc': 'Space', 'caps': 'Caps', 'del': 'Del', 'ins': 'Ins',
  'prnt': 'PrtSc', 'slck': 'ScrLk', 'pause': 'Pause',
  'pgup': 'PgUp', 'pgdn': 'PgDn', 'home': 'Home', 'end': 'End',
  'left': '←', 'rght': '→', 'up': '↑', 'down': '↓',
  'lctl': 'LCtrl', 'lsft': 'LShift', 'lalt': 'LAlt', 'lmet': 'LWin',
  'rctl': 'RCtrl', 'rsft': 'RShift', 'ralt': 'RAlt', 'rmet': 'RWin',
  'grv': '`', 'ro': 'Ro', 'kana': 'かな', 'mhnk': '無変換', 'henk': '変換', 'menu': 'Menu',
  'lang1': 'IME ON', 'lang2': 'IME OFF',
  'mlft': 'MLeft', 'mrgt': 'MRight', 'mmid': 'MMid',
  'mute': 'Mute', 'volu': 'Vol+', 'vold': 'Vol-',
  'next': 'Next', 'prev': 'Prev', 'pp': 'Play', 'stop': 'Stop',
  'lrld': 'Reload',
  '_': '▽', 'XX': '',
  // 追加キー
  'nlck': 'NumLk', 'nlk': 'NumLk',
  '102d': '102nd', 'lsgt': '102nd', 'nubs': '102nd',
  'ssrq': 'SysRq', 'sys': 'SysRq',
  'fn': 'Fn',
  'eisu': '英数',
  'bck': 'Back', 'fwd': 'Fwd',
  'eject': 'Eject',
  'bru': 'Bri+', 'brup': 'Bri+',
  'brdn': 'Bri-', 'brdwn': 'Bri-', 'brdown': 'Bri-',
  'blup': 'KBLi+', 'bldn': 'KBLi-',
  'hmpg': 'Home🌐', 'homepage': 'Home🌐',
  'mdia': 'Media', 'media': 'Media',
  'mail': 'Mail', 'email': 'Email',
  'calc': 'Calc',
  'plyr': 'Player', 'player': 'Player',
  'powr': 'Power', 'power': 'Power',
  'zzz': 'Sleep', 'sleep': 'Sleep',
  'wkup': 'Wake',
  'comp': 'Compose', 'cmps': 'Compose', 'cmp': 'Compose',
  'mbck': 'MBack', 'mfwd': 'MFwd',
  'mwu': 'MWU', 'mwd': 'MWD', 'mwl': 'MWL', 'mwr': 'MWR',
  'kp=': 'KP=', 'clr': 'Clear',
  'kp,': 'KP,',
  'lpar': 'KP(', 'kp(': 'KP(',
  'rpar': 'KP)', 'kp)': 'KP)',
  'sls': 'Spotlight', 'dtn': 'Dictation', 'dnd': 'DND',
  'mctl': 'MCtrl', 'lpad': 'LPad',
  'hiragana': 'ひらがな', 'katakana': 'カタカナ',
  'mvmt': 'MouseMv',
}

// JIS配列で表示が異なるキーのラベルマップ
const KANATA_KEY_LABELS_JIS = {
  '[': '@',
  ']': '[',
  '\\': ']',
  '\'': ':',
  '=': '^',
  'grv': '半/全',
  '¥': '¥',
  'ro': '\\',
}

function getKeyLabel(kanataKey, mode) {
  if (!kanataKey) return ''
  if (mode === 'jis' && KANATA_KEY_LABELS_JIS[kanataKey]) {
    return KANATA_KEY_LABELS_JIS[kanataKey]
  }
  if (KANATA_KEY_LABELS[kanataKey]) return KANATA_KEY_LABELS[kanataKey]
  if (kanataKey.length === 1) return kanataKey.toUpperCase()
  if (kanataKey.startsWith('f') && /^f\d+$/.test(kanataKey)) return kanataKey.toUpperCase()
  return kanataKey
}

// Shift+キー → 出力文字マップ
const SHIFTED_OUTPUT_US = {
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+', '[': '{', ']': '}', '\\': '|',
  ';': ':', "'": '"', 'grv': '~', ',': '<', '.': '>', '/': '?',
}

const SHIFTED_OUTPUT_JIS = {
  '1': '!', '2': '"', '3': '#', '4': '$', '5': '%',
  '6': '&', '7': "'", '8': '(', '9': ')', '0': '',
  '-': '=', '=': '~', '[': '`', ']': '{', '\\': '}',
  ';': '+', "'": '*', 'grv': '~', ',': '<', '.': '>', '/': '?',
}

// modified キー (例: "S-9") → 出力内容ラベル
function getModifiedKeyLabel(kanataKey, mode) {
  if (!kanataKey) return ''

  // "S-<key>" 形式のShiftのみの場合、出力文字を返す
  const shiftMatch = kanataKey.match(/^S-(.+)$/)
  if (shiftMatch) {
    const baseKey = shiftMatch[1]
    const shiftMap = mode === 'jis' ? SHIFTED_OUTPUT_JIS : SHIFTED_OUTPUT_US

    // Shift+記号/数字 → 出力文字
    if (shiftMap[baseKey] !== undefined) {
      return shiftMap[baseKey] || kanataKey
    }
    // Shift+英字 → 大文字
    if (baseKey.length === 1 && /^[a-z]$/.test(baseKey)) {
      return baseKey.toUpperCase()
    }
    // Shift+特殊キー → ラベル付き表示
    const baseLabel = getKeyLabel(baseKey, mode)
    return `S-${baseLabel}`
  }

  // 複数修飾キー: プレフィックス部分を短縮表示、ベースキーはラベル変換
  const modMatch = kanataKey.match(/^((?:[A-Z]+-)+)(.+)$/)
  if (modMatch) {
    const prefix = modMatch[1]
    const baseKey = modMatch[2]
    const baseLabel = getKeyLabel(baseKey, mode)
    return `${prefix}${baseLabel}`
  }

  return kanataKey
}

// BASIC_KEYCODE_MAP に含まれないkanata追加キー
// str_to_oscode (kanata parser/src/keys/mod.rs) から抽出
const EXTRA_KANATA_KEYS = [
  // NumLock
  'nlck',
  // Non-US 102nd key
  '102d', 'lsgt', 'nubs',
  // SysRq
  'ssrq',
  // Fn
  'fn',
  // IME ON/OFF (Windows: arbitrary-code経由)
  'lang1', 'lang2',
  // ブラウザ
  'bck', 'fwd',
  // 輝度
  'bru', 'brdn',
  // キーボードバックライト
  'blup', 'bldn',
  // イジェクト
  'eject',
  // アプリ起動
  'hmpg', 'mdia', 'mail', 'email', 'calc',
  // 電源
  'powr', 'zzz', 'wkup',
  // Compose
  'comp',
  // マウス追加
  'mbck', 'mfwd',
  'mwu', 'mwd', 'mwl', 'mwr',
  // テンキー追加
  'kp=', 'kp,', 'lpar', 'rpar',
  // macOS固有
  'sls', 'dtn', 'dnd', 'mctl', 'lpad',
  // 日本語入力
  'hiragana', 'katakana',
  // マウス移動ダミー
  'mvmt',
]

// Kanataキー名の逆引き（表示ラベル → kanataキー名のリスト）
function getAllBasicKeys(mode) {
  const seen = new Set()
  const keys = []
  for (const [qmk, kanata] of Object.entries(BASIC_KEYCODE_MAP)) {
    if (!seen.has(kanata) && kanata !== '_' && kanata !== 'XX') {
      seen.add(kanata)
      keys.push({
        kanata,
        label: getKeyLabel(kanata, mode),
        qmk,
      })
    }
  }
  // 追加kanataキー（QMKマッピングなし）
  for (const kanata of EXTRA_KANATA_KEYS) {
    if (!seen.has(kanata)) {
      seen.add(kanata)
      keys.push({
        kanata,
        label: getKeyLabel(kanata, mode),
        qmk: '',
      })
    }
  }
  return keys
}

  V2K.resolveKanataKey = resolveKanataKey;
  V2K.parseModified = parseModified;
  V2K.parseModTap = parseModTap;
  V2K.parseLayerTap = parseLayerTap;
  V2K.parseLayerOp = parseLayerOp;
  V2K.convertBasicKeycode = convertBasicKeycode;
  V2K.extractDefsrcKey = extractDefsrcKey;
  V2K.convertKeycode = convertKeycode;
  V2K.convertTapDance = convertTapDance;
  V2K.createAliasContext = createAliasContext;
  V2K.generateKanataConfig = generateKanataConfig;
  V2K.generateKbdFromState = generateKbdFromState;
  V2K.vilMacroToGui = vilMacroToGui;
  V2K.vilComboToGui = vilComboToGui;
  V2K.vilOverrideToGui = vilOverrideToGui;
  V2K.parseVilData = parseVilData;
  V2K.qmkKeyToGuiKey = qmkKeyToGuiKey;
  V2K.getKeyLabel = getKeyLabel;
  V2K.getModifiedKeyLabel = getModifiedKeyLabel;
  V2K.getAllBasicKeys = getAllBasicKeys;
  V2K.BASIC_KEYCODE_MAP = BASIC_KEYCODE_MAP;
  V2K.ARBITRARY_CODE_KEYS = ARBITRARY_CODE_KEYS;
  V2K.MOD_PREFIX_MAP = MOD_PREFIX_MAP;
  V2K.TEXT_TO_KEYS_JIS = TEXT_TO_KEYS_JIS;
  V2K.TRIGGER_MOD_TO_KANATA = TRIGGER_MOD_TO_KANATA;
  V2K.KANATA_KEY_LABELS = KANATA_KEY_LABELS;
  V2K.KANATA_KEY_LABELS_JIS = KANATA_KEY_LABELS_JIS;
})();

// === defsrc.js ===
(function() {
// ============================================================
// defsrcサイドパネルのレンダリング
// ============================================================

function renderDefsrcPanel(state) {
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

  V2K.renderDefsrcPanel = renderDefsrcPanel;
})();

// === layers.js ===
(function() {
// ============================================================
// レイヤー管理UI
// ============================================================

let callbacks = {
  setActiveLayer: null,
  addLayer: null,
  removeLayer: null,
  renameLayer: null,
  enterSrcMode: null,
}

function setLayerCallbacks(cbs) {
  callbacks = { ...callbacks, ...cbs }
}

function renderLayers(state) {
  const container = document.getElementById('layer-tabs')
  if (!container) return

  container.innerHTML = ''

  const { layers, activeLayer, layoutEditMode } = state

  // srcタブ（物理キー設定）
  const srcTab = document.createElement('div')
  srcTab.className = 'layer-tab layer-tab-src'
  if (layoutEditMode) srcTab.classList.add('layer-tab-active')

  const srcName = document.createElement('span')
  srcName.className = 'layer-tab-name'
  srcName.textContent = 'src'
  srcTab.appendChild(srcName)

  srcTab.addEventListener('click', () => {
    if (callbacks.enterSrcMode) callbacks.enterSrcMode()
  })
  container.appendChild(srcTab)

  // 通常レイヤータブ
  for (let i = 0; i < layers.length; i++) {
    const tab = document.createElement('div')
    tab.className = 'layer-tab'
    if (!layoutEditMode && i === activeLayer) tab.classList.add('layer-tab-active')

    const nameSpan = document.createElement('span')
    nameSpan.className = 'layer-tab-name'
    nameSpan.textContent = layers[i].name
    nameSpan.addEventListener('dblclick', () => {
      const newName = prompt('レイヤー名:', layers[i].name)
      if (newName && newName.trim()) {
        const sanitized = newName.trim().replace(/[^a-zA-Z0-9_-]/g, '')
        if (sanitized.length > 0 && sanitized.length <= 30 && callbacks.renameLayer) {
          callbacks.renameLayer(i, sanitized)
        }
      }
    })

    tab.appendChild(nameSpan)

    if (i > 0) {
      const removeBtn = document.createElement('button')
      removeBtn.className = 'layer-tab-remove'
      removeBtn.textContent = '\u00d7'
      removeBtn.title = 'レイヤーを削除'
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        if (confirm(`レイヤー "${layers[i].name}" を削除しますか？`) && callbacks.removeLayer) {
          callbacks.removeLayer(i)
        }
      })
      tab.appendChild(removeBtn)
    }

    tab.addEventListener('click', () => {
      if (callbacks.setActiveLayer) callbacks.setActiveLayer(i)
    })
    container.appendChild(tab)
  }

  const addBtn = document.createElement('div')
  addBtn.className = 'layer-tab layer-tab-add'
  addBtn.textContent = '+'
  addBtn.title = 'レイヤーを追加'
  addBtn.addEventListener('click', () => {
    const name = `layer${layers.length}`
    if (callbacks.addLayer) callbacks.addLayer(name)
  })
  container.appendChild(addBtn)
}

  V2K.setLayerCallbacks = setLayerCallbacks;
  V2K.renderLayers = renderLayers;
})();

// === keyboard.js ===
(function() {
  const getKeyLabel = V2K.getKeyLabel;
  const getModifiedKeyLabel = V2K.getModifiedKeyLabel;

// ============================================================
// キーボードレンダリング・インタラクション
// ============================================================


const KEY_UNIT = 54
const KEY_GAP = 4
const KEY_PADDING = 8

let onSelectKeyCallback = null
let onToggleDefsrcCallback = null
let onDeleteLayoutKeyCallback = null
let onSwapKeysCallback = null
let onDropVilKeyCallback = null

function setSelectKeyCallback(cb) {
  onSelectKeyCallback = cb
}

function setToggleDefsrcCallback(cb) {
  onToggleDefsrcCallback = cb
}

function setDeleteLayoutKeyCallback(cb) {
  onDeleteLayoutKeyCallback = cb
}

function setSwapKeysCallback(cb) {
  onSwapKeysCallback = cb
}

function setDropVilKeyCallback(cb) {
  onDropVilKeyCallback = cb
}

function renderKeyboard(state) {
  const container = document.getElementById('keyboard-container')
  if (!container) return

  container.innerHTML = ''

  const { physicalLayout, layers, activeLayer, selectedKey, defsrcKeys, vilKeyCount, layoutEditMode, keyLabelMode } = state
  if (!physicalLayout || physicalLayout.length === 0) return

  const currentLayerKeys = layers[activeLayer]?.keys || []

  // defsrcキーの選択順序マップ（インデックス → 0始まりの順序）
  // .vilインポート済みの場合のみ番号を表示
  const showDefsrcNum = vilKeyCount !== null
  const defsrcOrder = new Map()
  if (showDefsrcNum && defsrcKeys) {
    let order = 0
    for (const idx of [...defsrcKeys].sort((a, b) => a - b)) {
      defsrcOrder.set(idx, order++)
    }
  }

  let maxX = 0
  let maxY = 0
  for (const key of physicalLayout) {
    const right = (key.x + key.w) * KEY_UNIT + KEY_GAP
    const bottom = (key.y + key.h) * KEY_UNIT + KEY_GAP
    if (right > maxX) maxX = right
    if (bottom > maxY) maxY = bottom
  }

  const keyboard = document.createElement('div')
  keyboard.className = 'keyboard'
  keyboard.style.width = `${maxX + KEY_PADDING}px`
  keyboard.style.height = `${maxY + KEY_PADDING}px`
  keyboard.style.position = 'relative'

  for (let i = 0; i < physicalLayout.length; i++) {
    const physKey = physicalLayout[i]
    const layerKey = currentLayerKeys[i]
    const isSelected = i === selectedKey
    const isInDefsrc = !defsrcKeys || defsrcKeys.size === 0 || defsrcKeys.has(i)
    const defsrcNum = showDefsrcNum ? defsrcOrder.get(i) : undefined

    const keyEl = createKeyElement(physKey, layerKey, i, isSelected, isInDefsrc, defsrcNum, layoutEditMode, keyLabelMode)
    keyboard.appendChild(keyEl)
  }

  container.appendChild(keyboard)
}

function createKeyElement(physKey, layerKey, index, isSelected, isInDefsrc, defsrcNum, layoutEditMode, keyLabelMode) {
  const el = document.createElement('div')
  el.className = 'key'

  const width = physKey.w * KEY_UNIT - KEY_GAP
  const height = physKey.h * KEY_UNIT - KEY_GAP
  const left = physKey.x * KEY_UNIT + KEY_GAP / 2
  const top = physKey.y * KEY_UNIT + KEY_GAP / 2

  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.left = `${left}px`
  el.style.top = `${top}px`
  el.style.position = 'absolute'

  if (layoutEditMode) {
    // srcモード: 物理キーのkanata設定を表示
    if (isSelected) el.classList.add('key-selected')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = getKeyLabel(physKey.kanataKey, keyLabelMode) || physKey.label || ''
    el.appendChild(labelEl)
  } else if (!isInDefsrc) {
    el.classList.add('key-passthrough')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = physKey.label || physKey.kanataKey || ''
    el.appendChild(labelEl)
  } else if (!layerKey || layerKey.type === 'disabled') {
    if (isSelected) el.classList.add('key-selected')
    else el.classList.add('key-disabled')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    el.appendChild(labelEl)
  } else if (layerKey.type === 'mod-tap' || layerKey.type === 'layer-tap') {
    el.classList.add('key-dual')
    if (isSelected) el.classList.add('key-selected')
    renderDualKey(el, layerKey, keyLabelMode)
  } else {
    if (isSelected) el.classList.add('key-selected')
    else if (layerKey.type === 'transparent') el.classList.add('key-transparent')
    else if (layerKey.type === 'layer-op') el.classList.add('key-layer-op')
    else if (layerKey.type === 'macro') el.classList.add('key-macro')
    else if (layerKey.type === 'tap-dance') el.classList.add('key-tap-dance')

    const label = getDisplayLabel(physKey, layerKey, keyLabelMode)
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = label
    el.appendChild(labelEl)
  }

  // defsrc番号表示（.vilインポート後かつdefsrcに含まれる場合）
  if (isInDefsrc && defsrcNum !== undefined) {
    const numEl = document.createElement('span')
    numEl.className = 'key-defsrc-num'
    numEl.textContent = defsrcNum + 1
    el.appendChild(numEl)
  }

  // レイヤー編集時: 物理キーのkanataKeyをサブラベルで表示
  if (!layoutEditMode && physKey && physKey.kanataKey) {
    const physLabel = document.createElement('span')
    physLabel.className = 'key-phys-label'
    physLabel.textContent = physKey.kanataKey
    el.appendChild(physLabel)
  }

  // レイアウト編集モード: 削除ボタンを表示
  if (layoutEditMode) {
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'key-delete-btn'
    deleteBtn.textContent = '×'
    deleteBtn.title = 'このキーを削除'
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      if (onDeleteLayoutKeyCallback) onDeleteLayoutKeyCallback(index)
    })
    el.appendChild(deleteBtn)
  }

  // 左クリック:
  //   defsrc外のキー → defsrcに追加（トグル）
  //   defsrc内のキー → Shift: defsrcトグル / 通常: キー選択
  // 右クリック → defsrcトグル or キー削除
  el.addEventListener('click', (e) => {
    if (layoutEditMode) {
      if (onSelectKeyCallback) onSelectKeyCallback(index)
    } else if (!isInDefsrc) {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    } else if (e.shiftKey) {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    } else {
      if (onSelectKeyCallback) onSelectKeyCallback(index)
    }
  })
  el.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    if (layoutEditMode) {
      if (onDeleteLayoutKeyCallback) onDeleteLayoutKeyCallback(index)
    } else {
      if (onToggleDefsrcCallback) onToggleDefsrcCallback(index)
    }
  })

  // ドラッグ&ドロップ（defsrc内のキーのみ）
  if (isInDefsrc && !layoutEditMode) {
    el.draggable = true
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', String(index))
      e.dataTransfer.effectAllowed = 'move'
      el.classList.add('key-dragging')
    })
    el.addEventListener('dragover', (e) => {
      e.preventDefault()
      el.classList.add('key-drag-over')
    })
    el.addEventListener('dragleave', () => {
      el.classList.remove('key-drag-over')
    })
    el.addEventListener('drop', (e) => {
      e.preventDefault()
      el.classList.remove('key-drag-over')
      const data = e.dataTransfer.getData('text/plain')
      if (data.startsWith('vil:')) {
        const vilIndex = parseInt(data.slice(4), 10)
        if (!isNaN(vilIndex) && onDropVilKeyCallback) {
          onDropVilKeyCallback(vilIndex, index)
        }
      } else {
        const fromIndex = parseInt(data, 10)
        if (!isNaN(fromIndex) && fromIndex !== index) {
          if (onSwapKeysCallback) onSwapKeysCallback(fromIndex, index)
        }
      }
    })
    el.addEventListener('dragend', () => {
      el.classList.remove('key-dragging')
      el.classList.remove('key-drag-over')
    })
  }

  return el
}

function renderDualKey(el, layerKey, keyLabelMode) {
  const topLabel = document.createElement('span')
  topLabel.className = 'key-label-top'

  const bottomLabel = document.createElement('span')
  bottomLabel.className = 'key-label-bottom'

  if (layerKey.type === 'mod-tap') {
    topLabel.textContent = getKeyLabel(layerKey.tapKey, keyLabelMode) || layerKey.label || ''
    bottomLabel.textContent = layerKey.holdMod?.toUpperCase() || layerKey.holdLabel || ''
  } else if (layerKey.type === 'layer-tap') {
    topLabel.textContent = getKeyLabel(layerKey.tapKey, keyLabelMode) || layerKey.label || ''
    bottomLabel.textContent = layerKey.holdLabel || `L${layerKey.layer}`
  }

  el.appendChild(topLabel)
  el.appendChild(bottomLabel)
}

function getDisplayLabel(physKey, layerKey, keyLabelMode) {
  if (!layerKey) return physKey.label || ''

  switch (layerKey.type) {
    case 'basic':
      return getKeyLabel(layerKey.kanataKey, keyLabelMode) || layerKey.label || ''
    case 'transparent':
      return '▽'
    case 'disabled':
      return ''
    case 'layer-op':
      return layerKey.label || `${layerKey.op}(${layerKey.layer})`
    case 'macro':
      return layerKey.label || `M${layerKey.index}`
    case 'tap-dance':
      return layerKey.label || `TD${layerKey.index}`
    case 'user':
      return layerKey.label || `U${layerKey.index}`
    case 'modified':
      return getModifiedKeyLabel(layerKey.kanataKey, keyLabelMode) || layerKey.label || ''
    default:
      return layerKey.label || ''
  }
}

// ============================================================
// VILソースキーボード描画
// ============================================================

function renderVilKeyboard(state) {
  const container = document.getElementById('vil-keyboard-container')
  if (!container) { console.warn('vil-keyboard-container not found'); return }

  const pane = document.getElementById('vil-keyboard-pane')
  const { vilPhysicalLayout, vilLayers, activeLayer, keyLabelMode } = state
  console.log('renderVilKeyboard:', vilPhysicalLayout?.length, 'keys,', vilLayers?.length, 'layers')

  if (!vilPhysicalLayout || vilPhysicalLayout.length === 0) {
    container.innerHTML = ''
    if (pane) pane.style.display = 'none'
    return
  }

  if (pane) pane.style.display = 'flex'
  container.innerHTML = ''

  const vilKeys = vilLayers[activeLayer] || []

  let maxX = 0
  let maxY = 0
  for (const key of vilPhysicalLayout) {
    const right = (key.x + key.w) * KEY_UNIT + KEY_GAP
    const bottom = (key.y + key.h) * KEY_UNIT + KEY_GAP
    if (right > maxX) maxX = right
    if (bottom > maxY) maxY = bottom
  }

  const keyboard = document.createElement('div')
  keyboard.className = 'keyboard'
  keyboard.style.width = `${maxX + KEY_PADDING}px`
  keyboard.style.height = `${maxY + KEY_PADDING}px`
  keyboard.style.position = 'relative'

  for (let i = 0; i < vilPhysicalLayout.length; i++) {
    const physKey = vilPhysicalLayout[i]
    const layerKey = vilKeys[i] || null
    const keyEl = createVilKeyElement(physKey, layerKey, i, keyLabelMode)
    keyboard.appendChild(keyEl)
  }

  container.appendChild(keyboard)
}

function createVilKeyElement(physKey, layerKey, index, keyLabelMode) {
  const el = document.createElement('div')
  el.className = 'key vil-key'

  const width = physKey.w * KEY_UNIT - KEY_GAP
  const height = physKey.h * KEY_UNIT - KEY_GAP
  const left = physKey.x * KEY_UNIT + KEY_GAP / 2
  const top = physKey.y * KEY_UNIT + KEY_GAP / 2

  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.left = `${left}px`
  el.style.top = `${top}px`
  el.style.position = 'absolute'

  if (!layerKey || layerKey.type === 'disabled') {
    el.classList.add('key-disabled')
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    el.appendChild(labelEl)
  } else if (layerKey.type === 'mod-tap' || layerKey.type === 'layer-tap') {
    el.classList.add('key-dual')
    renderDualKey(el, layerKey, keyLabelMode)
  } else {
    if (layerKey.type === 'transparent') el.classList.add('key-transparent')
    else if (layerKey.type === 'layer-op') el.classList.add('key-layer-op')
    else if (layerKey.type === 'macro') el.classList.add('key-macro')
    else if (layerKey.type === 'tap-dance') el.classList.add('key-tap-dance')

    const label = getDisplayLabel(physKey, layerKey, keyLabelMode)
    const labelEl = document.createElement('span')
    labelEl.className = 'key-label'
    labelEl.textContent = label
    el.appendChild(labelEl)
  }

  // VILインデックス番号
  const numEl = document.createElement('span')
  numEl.className = 'key-defsrc-num vil-key-num'
  numEl.textContent = index + 1
  el.appendChild(numEl)

  // ドラッグ可能（コピー操作）
  el.draggable = true
  el.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', `vil:${index}`)
    e.dataTransfer.effectAllowed = 'copy'
    el.classList.add('key-dragging')
  })
  el.addEventListener('dragend', () => {
    el.classList.remove('key-dragging')
  })

  return el
}

  V2K.setSelectKeyCallback = setSelectKeyCallback;
  V2K.setToggleDefsrcCallback = setToggleDefsrcCallback;
  V2K.setDeleteLayoutKeyCallback = setDeleteLayoutKeyCallback;
  V2K.setSwapKeysCallback = setSwapKeysCallback;
  V2K.setDropVilKeyCallback = setDropVilKeyCallback;
  V2K.renderKeyboard = renderKeyboard;
  V2K.renderVilKeyboard = renderVilKeyboard;
})();

// === editor.js ===
(function() {
  const getAllBasicKeys = V2K.getAllBasicKeys;
  const getKeyLabel = V2K.getKeyLabel;
  const BASIC_KEYCODE_MAP = V2K.BASIC_KEYCODE_MAP;

// ============================================================
// キー設定エディタパネル
// ============================================================


let onUpdateKeyCallback = null
let onUpdatePhysicalKeyCallback = null

function setUpdateKeyCallback(cb) {
  onUpdateKeyCallback = cb
}

function setUpdatePhysicalKeyCallback(cb) {
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

function renderEditor(state) {
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

function hideEditor() {
  const panel = document.getElementById('editor-panel')
  if (panel) {
    panel.style.display = 'none'
  }
}

  V2K.setUpdateKeyCallback = setUpdateKeyCallback;
  V2K.setUpdatePhysicalKeyCallback = setUpdatePhysicalKeyCallback;
  V2K.renderEditor = renderEditor;
  V2K.hideEditor = hideEditor;
})();

// === combos.js ===
(function() {
  const getKeyLabel = V2K.getKeyLabel;
  const getModifiedKeyLabel = V2K.getModifiedKeyLabel;
  const getAllBasicKeys = V2K.getAllBasicKeys;

// ============================================================
// コンボ管理パネル
// ============================================================


let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

// baseレイヤーのキー割当からセレクト用リストを生成
function getBaseLayerKeys(state, keyLabelMode) {
  const { physicalLayout, layers, defsrcKeys } = state
  if (!physicalLayout || !layers || layers.length === 0) return []

  const baseKeys = layers[0].keys || []
  const seen = new Set()
  const result = []

  for (let i = 0; i < physicalLayout.length; i++) {
    // defsrcに含まれるキーのみ
    if (defsrcKeys && defsrcKeys.size > 0 && !defsrcKeys.has(i)) continue

    const layerKey = baseKeys[i]
    if (!layerKey || layerKey.type === 'disabled' || layerKey.type === 'transparent') continue

    const kanataKey = layerKey.kanataKey
    if (!kanataKey || kanataKey === '_' || kanataKey === 'XX' || seen.has(kanataKey)) continue
    seen.add(kanataKey)

    let label
    if (layerKey.type === 'modified') {
      label = getModifiedKeyLabel(kanataKey, keyLabelMode)
    } else {
      label = getKeyLabel(kanataKey, keyLabelMode)
    }

    result.push({ kanataKey, label })
  }

  return result
}

function createBaseKeySelect(currentValue, baseLayerKeys) {
  const select = document.createElement('select')
  select.className = 'feature-key-select'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー選択 --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of baseLayerKeys) {
    const opt = document.createElement('option')
    opt.value = key.kanataKey
    opt.textContent = `${key.label} (${key.kanataKey})`
    if (key.kanataKey === currentValue) opt.selected = true
    select.appendChild(opt)
  }

  return select
}

function createResultKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー選択 --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of getBasicKeys()) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }
  return select
}

function renderCombosPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'コンボ管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = '同時押しで別のキーを発動'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ コンボ追加'
  addBtn.addEventListener('click', () => callbacks.onAddCombo())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const combos = state.combos || []
  if (combos.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'コンボがありません。同時押しでキーを発動させるコンボを追加してください。'
    panel.appendChild(empty)
    return
  }

  // baseレイヤーキーリストをトリガー用に生成
  const baseLayerKeys = getBaseLayerKeys(state, state.keyLabelMode)

  for (const combo of combos) {
    if (!combo || combo.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行: ID + タイムアウト + 削除ボタン
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `C${combo.id}`
    headerRow.appendChild(idLabel)

    const timeoutLabel = document.createElement('span')
    timeoutLabel.className = 'feature-unit'
    timeoutLabel.textContent = '判定時間:'
    headerRow.appendChild(timeoutLabel)

    const timeoutInput = document.createElement('input')
    timeoutInput.type = 'number'
    timeoutInput.className = 'feature-number-input'
    timeoutInput.value = combo.timeout || 200
    timeoutInput.min = 10
    timeoutInput.max = 2000
    timeoutInput.title = 'タイムアウト (ms)'
    timeoutInput.addEventListener('change', () => {
      const val = parseInt(timeoutInput.value, 10)
      if (!isNaN(val) && val >= 10) callbacks.onUpdateCombo(combo.id, { timeout: val })
    })
    headerRow.appendChild(timeoutInput)

    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    headerRow.appendChild(msLabel)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = '× 削除'
    delBtn.title = '削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveCombo(combo.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    // キー行: トリガーキー群 → 出力キー
    const keyRow = document.createElement('div')
    keyRow.className = 'feature-row feature-row-wrap combo-key-row'

    const triggerLabel = document.createElement('span')
    triggerLabel.className = 'feature-unit'
    triggerLabel.textContent = '同時押し:'
    keyRow.appendChild(triggerLabel)

    // トリガーキーのセレクト群（可変）
    const currentKeys = combo.keys || ['', '']
    const keySelects = []

    function renderKeySelects() {
      // 既存のセレクトとボタンを削除
      while (keyRow.children.length > 1) keyRow.removeChild(keyRow.lastChild)
      keySelects.length = 0

      for (let ki = 0; ki < currentKeys.length; ki++) {
        const kSel = createBaseKeySelect(currentKeys[ki] || '', baseLayerKeys)
        kSel.title = `トリガーキー${ki + 1}`
        const kiCopy = ki
        kSel.addEventListener('change', () => {
          const newKeys = [...currentKeys]
          newKeys[kiCopy] = kSel.value
          callbacks.onUpdateCombo(combo.id, { keys: newKeys })
        })
        keyRow.appendChild(kSel)
        keySelects.push(kSel)

        if (ki < currentKeys.length - 1) {
          const plus = document.createElement('span')
          plus.className = 'feature-operator'
          plus.textContent = '+'
          keyRow.appendChild(plus)
        }
      }

      // キー追加ボタン（最大4キー）
      if (currentKeys.length < 4) {
        const addKeyBtn = document.createElement('button')
        addKeyBtn.className = 'feature-add-action-btn'
        addKeyBtn.textContent = '+ キー'
        addKeyBtn.title = 'トリガーキーを追加（最大4個）'
        addKeyBtn.addEventListener('click', () => {
          currentKeys.push('')
          callbacks.onUpdateCombo(combo.id, { keys: [...currentKeys] })
          renderKeySelects()
        })
        keyRow.appendChild(addKeyBtn)
      }

      // キー削除ボタン（最低2キー）
      if (currentKeys.length > 2) {
        const removeKeyBtn = document.createElement('button')
        removeKeyBtn.className = 'feature-del-btn feature-del-btn-sm'
        removeKeyBtn.textContent = '- キー'
        removeKeyBtn.title = '最後のトリガーキーを削除'
        removeKeyBtn.addEventListener('click', () => {
          currentKeys.pop()
          callbacks.onUpdateCombo(combo.id, { keys: [...currentKeys] })
          renderKeySelects()
        })
        keyRow.appendChild(removeKeyBtn)
      }
    }

    renderKeySelects()
    item.appendChild(keyRow)

    // 出力キー行（結果は任意のキーを選べる）
    const resultRow = document.createElement('div')
    resultRow.className = 'feature-row'

    const arrowLabel = document.createElement('span')
    arrowLabel.className = 'feature-unit'
    arrowLabel.textContent = '→ 出力:'
    resultRow.appendChild(arrowLabel)

    const resultSelect = createResultKeySelect(combo.result || '')
    resultSelect.title = '出力キー'
    resultSelect.addEventListener('change', () => {
      callbacks.onUpdateCombo(combo.id, { result: resultSelect.value })
    })
    resultRow.appendChild(resultSelect)

    item.appendChild(resultRow)
    panel.appendChild(item)
  }
}

  V2K.renderCombosPanel = renderCombosPanel;
})();

// === macros.js ===
(function() {
  const getAllBasicKeys = V2K.getAllBasicKeys;

// ============================================================
// マクロ管理パネル
// ============================================================


let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

function createKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select feature-key-select-sm'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of getBasicKeys()) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }
  return select
}

function renderActionItem(action, macroId, actionIndex, callbacks) {
  const item = document.createElement('div')
  item.className = 'macro-action-item'

  // アクション種別セレクト
  const typeSelect = document.createElement('select')
  typeSelect.className = 'feature-key-select feature-key-select-sm'
  for (const [val, label] of [['tap', 'キー'], ['text', 'テキスト'], ['delay', '待機']]) {
    const opt = document.createElement('option')
    opt.value = val
    opt.textContent = label
    if (action.type === val) opt.selected = true
    typeSelect.appendChild(opt)
  }
  typeSelect.addEventListener('change', () => {
    let newAction
    if (typeSelect.value === 'tap') newAction = { type: 'tap', key: '' }
    else if (typeSelect.value === 'text') newAction = { type: 'text', text: '' }
    else newAction = { type: 'delay', duration: 50 }
    callbacks.onUpdateMacroAction(macroId, actionIndex, newAction)
  })
  item.appendChild(typeSelect)

  if (action.type === 'tap') {
    const keySelect = createKeySelect(action.key || '')
    keySelect.addEventListener('change', () => {
      callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, key: keySelect.value })
    })
    item.appendChild(keySelect)
  } else if (action.type === 'text') {
    const textInput = document.createElement('input')
    textInput.type = 'text'
    textInput.className = 'feature-text-input'
    textInput.value = action.text || ''
    textInput.placeholder = '入力テキスト'
    textInput.addEventListener('change', () => {
      callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, text: textInput.value })
    })
    item.appendChild(textInput)
  } else if (action.type === 'delay') {
    const durInput = document.createElement('input')
    durInput.type = 'number'
    durInput.className = 'feature-number-input'
    durInput.value = action.duration || 50
    durInput.min = 1
    durInput.max = 5000
    durInput.title = '待機時間 (ms)'
    durInput.addEventListener('change', () => {
      const val = parseInt(durInput.value, 10)
      if (!isNaN(val) && val > 0) {
        callbacks.onUpdateMacroAction(macroId, actionIndex, { ...action, duration: val })
      }
    })
    item.appendChild(durInput)
    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    item.appendChild(msLabel)
  }

  const delBtn = document.createElement('button')
  delBtn.className = 'feature-del-btn feature-del-btn-sm'
  delBtn.textContent = '×'
  delBtn.title = 'アクション削除'
  delBtn.addEventListener('click', () => callbacks.onRemoveMacroAction(macroId, actionIndex))
  item.appendChild(delBtn)

  return item
}

function renderMacrosPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'マクロ管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = 'キーシーケンスを自動実行'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ マクロ追加'
  addBtn.addEventListener('click', () => callbacks.onAddMacro())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const macros = state.macros || []
  if (macros.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'マクロがありません。キーシーケンスを自動実行するマクロを追加してください。'
    panel.appendChild(empty)
    return
  }

  for (const macro of macros) {
    if (!macro || macro.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行: ID + ラベル + アクション追加ボタン + 削除
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `M${macro.id}`
    headerRow.appendChild(idLabel)

    // 名前フィールド
    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.className = 'feature-text-input macro-name-input'
    nameInput.value = macro.label || ''
    nameInput.placeholder = '名前（任意）'
    nameInput.title = 'マクロの名前（表示用）'
    nameInput.addEventListener('change', () => {
      callbacks.onUpdateMacro(macro.id, { label: nameInput.value })
    })
    headerRow.appendChild(nameInput)

    const addActionTap = document.createElement('button')
    addActionTap.className = 'feature-add-action-btn'
    addActionTap.textContent = '+ キー'
    addActionTap.title = 'キー入力アクション追加'
    addActionTap.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'tap'))
    headerRow.appendChild(addActionTap)

    const addActionText = document.createElement('button')
    addActionText.className = 'feature-add-action-btn'
    addActionText.textContent = '+ テキスト'
    addActionText.title = 'テキスト入力アクション追加'
    addActionText.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'text'))
    headerRow.appendChild(addActionText)

    const addActionDelay = document.createElement('button')
    addActionDelay.className = 'feature-add-action-btn'
    addActionDelay.textContent = '+ 待機'
    addActionDelay.title = '待機アクション追加'
    addActionDelay.addEventListener('click', () => callbacks.onAddMacroAction(macro.id, 'delay'))
    headerRow.appendChild(addActionDelay)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = 'マクロ削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveMacro(macro.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    const actionList = document.createElement('div')
    actionList.className = 'macro-action-list'

    const actions = macro.actions || []
    if (actions.length === 0) {
      const hint = document.createElement('span')
      hint.className = 'feature-hint'
      hint.textContent = 'アクションを追加してください（キー / テキスト / 待機）'
      actionList.appendChild(hint)
    } else {
      for (let i = 0; i < actions.length; i++) {
        actionList.appendChild(renderActionItem(actions[i], macro.id, i, callbacks))
      }
    }

    item.appendChild(actionList)
    panel.appendChild(item)
  }
}

  V2K.renderMacrosPanel = renderMacrosPanel;
})();

// === tap-dance.js ===
(function() {
  const getAllBasicKeys = V2K.getAllBasicKeys;

// ============================================================
// タップダンス管理パネル
// ============================================================


let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

function createKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select feature-key-select-sm'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of getBasicKeys()) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }
  return select
}

function renderTdActionItem(action, tdId, actionIndex, callbacks) {
  const item = document.createElement('div')
  item.className = 'macro-action-item'

  const indexLabel = document.createElement('span')
  indexLabel.className = 'feature-item-id'
  indexLabel.textContent = `${actionIndex + 1}回`
  indexLabel.title = `${actionIndex + 1}回タップ時のアクション`
  item.appendChild(indexLabel)

  const keySelect = createKeySelect(action.kanataKey || '')
  keySelect.addEventListener('change', () => {
    const kanata = keySelect.value
    const label = kanata ? kanata.toUpperCase() : ''
    callbacks.onUpdateTapDanceAction(tdId, actionIndex, {
      type: 'basic',
      kanataKey: kanata,
      label,
    })
  })
  item.appendChild(keySelect)

  const delBtn = document.createElement('button')
  delBtn.className = 'feature-del-btn feature-del-btn-sm'
  delBtn.textContent = '×'
  delBtn.title = 'アクション削除'
  delBtn.addEventListener('click', () => callbacks.onRemoveTapDanceAction(tdId, actionIndex))
  item.appendChild(delBtn)

  return item
}

function renderTapDancePanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'タップダンス管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = 'タップ回数に応じて異なるキーを出力'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ タップダンス追加'
  addBtn.addEventListener('click', () => callbacks.onAddTapDance())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const tapDancesGui = state.tapDancesGui || []
  if (tapDancesGui.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'タップダンスがありません。タップ回数に応じた動作を設定してください。'
    panel.appendChild(empty)
    return
  }

  for (const td of tapDancesGui) {
    if (!td || td.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    // ヘッダー行
    const headerRow = document.createElement('div')
    headerRow.className = 'feature-row'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `TD${td.id}`
    headerRow.appendChild(idLabel)

    // タイムアウト
    const timeoutLabel = document.createElement('label')
    timeoutLabel.className = 'feature-inline-label'
    timeoutLabel.textContent = 'Timeout:'
    headerRow.appendChild(timeoutLabel)

    const timeoutInput = document.createElement('input')
    timeoutInput.type = 'number'
    timeoutInput.className = 'feature-number-input'
    timeoutInput.value = td.timeout || 200
    timeoutInput.min = 50
    timeoutInput.max = 2000
    timeoutInput.step = 10
    timeoutInput.title = 'タップダンスのタイムアウト (ms)'
    timeoutInput.addEventListener('change', () => {
      const val = parseInt(timeoutInput.value, 10)
      if (!isNaN(val) && val > 0) {
        callbacks.onUpdateTapDance(td.id, { timeout: val })
      }
    })
    headerRow.appendChild(timeoutInput)

    const msLabel = document.createElement('span')
    msLabel.className = 'feature-unit'
    msLabel.textContent = 'ms'
    headerRow.appendChild(msLabel)

    // アクション追加ボタン
    const addActionBtn = document.createElement('button')
    addActionBtn.className = 'feature-add-action-btn'
    addActionBtn.textContent = '+ アクション'
    addActionBtn.title = 'タップアクション追加'
    addActionBtn.addEventListener('click', () => callbacks.onAddTapDanceAction(td.id))
    headerRow.appendChild(addActionBtn)

    // 削除ボタン
    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = 'TD削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveTapDance(td.id))
    headerRow.appendChild(delBtn)

    item.appendChild(headerRow)

    // アクションリスト
    const actionList = document.createElement('div')
    actionList.className = 'macro-action-list'

    const actions = td.actions || []
    if (actions.length === 0) {
      const hint = document.createElement('span')
      hint.className = 'feature-hint'
      hint.textContent = 'アクションを追加してください（1回タップ, 2回タップ, ...）'
      actionList.appendChild(hint)
    } else {
      for (let i = 0; i < actions.length; i++) {
        actionList.appendChild(renderTdActionItem(actions[i], td.id, i, callbacks))
      }
    }

    item.appendChild(actionList)
    panel.appendChild(item)
  }
}

  V2K.renderTapDancePanel = renderTapDancePanel;
})();

// === overrides.js ===
(function() {
  const getAllBasicKeys = V2K.getAllBasicKeys;

// ============================================================
// キーオーバーライド管理パネル
// ============================================================


let cachedBasicKeys = null

function getBasicKeys() {
  if (!cachedBasicKeys) cachedBasicKeys = getAllBasicKeys()
  return cachedBasicKeys
}

function createKeySelect(currentValue) {
  const select = document.createElement('select')
  select.className = 'feature-key-select'

  const emptyOpt = document.createElement('option')
  emptyOpt.value = ''
  emptyOpt.textContent = '-- キー選択 --'
  if (!currentValue) emptyOpt.selected = true
  select.appendChild(emptyOpt)

  for (const key of getBasicKeys()) {
    const opt = document.createElement('option')
    opt.value = key.kanata
    opt.textContent = `${key.label} (${key.kanata})`
    if (key.kanata === currentValue) opt.selected = true
    select.appendChild(opt)
  }
  return select
}

const MOD_DEFS = [
  { value: 'lsft', label: 'LShift' },
  { value: 'rsft', label: 'RShift' },
  { value: 'lctl', label: 'LCtrl' },
  { value: 'rctl', label: 'RCtrl' },
  { value: 'lalt', label: 'LAlt' },
  { value: 'ralt', label: 'RAlt' },
  { value: 'lmet', label: 'LWin' },
  { value: 'rmet', label: 'RWin' },
]

function createModCheckboxes(currentMods, onChange) {
  const row = document.createElement('div')
  row.className = 'modifier-checkbox-row modifier-checkbox-row-sm'

  let mods = [...(currentMods || [])]

  for (const mod of MOD_DEFS) {
    const cbLabel = document.createElement('label')
    cbLabel.className = 'modifier-checkbox-label modifier-checkbox-label-sm'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = mods.includes(mod.value)
    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (!mods.includes(mod.value)) mods.push(mod.value)
      } else {
        mods = mods.filter((m) => m !== mod.value)
      }
      onChange([...mods])
    })
    cbLabel.appendChild(cb)
    cbLabel.appendChild(document.createTextNode(mod.label))
    row.appendChild(cbLabel)
  }
  return row
}

function renderOverridesPanel(state, callbacks) {
  const panel = document.getElementById('feature-panel')
  if (!panel) return

  panel.innerHTML = ''

  const header = document.createElement('div')
  header.className = 'feature-panel-header'
  const h3 = document.createElement('h3')
  h3.textContent = 'キーオーバーライド管理'
  const desc = document.createElement('span')
  desc.className = 'feature-panel-desc'
  desc.textContent = '修飾キー+キーの組み合わせを別のキーに置き換え'
  const addBtn = document.createElement('button')
  addBtn.className = 'feature-add-btn'
  addBtn.textContent = '+ オーバーライド追加'
  addBtn.addEventListener('click', () => callbacks.onAddOverride())
  header.appendChild(h3)
  header.appendChild(desc)
  header.appendChild(addBtn)
  panel.appendChild(header)

  const overrides = state.keyOverrides || []
  if (overrides.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'feature-empty'
    empty.textContent = 'キーオーバーライドがありません。修飾キー+キーの組み合わせを別のキーに置き換えます。'
    panel.appendChild(empty)
    return
  }

  for (const ko of overrides) {
    if (!ko || ko.id === undefined) continue

    const item = document.createElement('div')
    item.className = 'feature-item'

    const row = document.createElement('div')
    row.className = 'feature-row feature-row-wrap'

    const idLabel = document.createElement('span')
    idLabel.className = 'feature-item-id'
    idLabel.textContent = `O${ko.id}`
    row.appendChild(idLabel)

    const triggerLabel = document.createElement('span')
    triggerLabel.className = 'feature-unit'
    triggerLabel.textContent = '入力:'
    row.appendChild(triggerLabel)

    // トリガー修飾キーチェックボックス
    const triggerModBoxes = createModCheckboxes(ko.triggerMods || [], (newMods) => {
      callbacks.onUpdateOverride(ko.id, { triggerMods: newMods })
    })
    row.appendChild(triggerModBoxes)

    // トリガーキー
    const triggerSelect = createKeySelect(ko.trigger || '')
    triggerSelect.title = 'トリガーキー'
    triggerSelect.addEventListener('change', () => {
      callbacks.onUpdateOverride(ko.id, { trigger: triggerSelect.value })
    })
    row.appendChild(triggerSelect)

    const arrow = document.createElement('span')
    arrow.className = 'feature-operator'
    arrow.textContent = '→'
    row.appendChild(arrow)

    const replLabel = document.createElement('span')
    replLabel.className = 'feature-unit'
    replLabel.textContent = '出力:'
    row.appendChild(replLabel)

    // 置き換え修飾キーチェックボックス
    const replModBoxes = createModCheckboxes(ko.replacementMods || [], (newMods) => {
      callbacks.onUpdateOverride(ko.id, { replacementMods: newMods })
    })
    row.appendChild(replModBoxes)

    // 置き換えキー
    const replSelect = createKeySelect(ko.replacementKey || '')
    replSelect.title = '置き換えキー'
    replSelect.addEventListener('change', () => {
      callbacks.onUpdateOverride(ko.id, { replacementKey: replSelect.value })
    })
    row.appendChild(replSelect)

    const delBtn = document.createElement('button')
    delBtn.className = 'feature-del-btn'
    delBtn.textContent = '×'
    delBtn.title = '削除'
    delBtn.addEventListener('click', () => callbacks.onRemoveOverride(ko.id))
    row.appendChild(delBtn)

    item.appendChild(row)
    panel.appendChild(item)
  }
}

  V2K.renderOverridesPanel = renderOverridesPanel;
})();

// === export.js ===
(function() {
  const getState = V2K.getState;
  const setState = V2K.setState;
  const generateKbdFromState = V2K.generateKbdFromState;
  const parseVilData = V2K.parseVilData;
  const qmkKeyToGuiKey = V2K.qmkKeyToGuiKey;
  const extractDefsrcKey = V2K.extractDefsrcKey;
  const vilMacroToGui = V2K.vilMacroToGui;
  const vilComboToGui = V2K.vilComboToGui;
  const vilOverrideToGui = V2K.vilOverrideToGui;
  const flattenLayout = V2K.flattenLayout;
  const loadLayout = V2K.loadLayout;

// ============================================================
// エクスポート / インポート処理
// ============================================================




// ============================================================
// .kbd エクスポート
// ============================================================

function exportKbd() {
  const state = getState()
  const kbdContent = generateKbdFromState(state)
  downloadFile('keymap.kbd', kbdContent, 'text/plain')
}

// ============================================================
// .vil インポート
// ============================================================

async function importVil(file) {
  const state = getState()
  const text = await file.text()
  const vilData = parseVilData(text)

  if (!vilData.layout || vilData.layout.length === 0) {
    alert('layoutデータが見つかりません。有効な.vilファイルか確認してください。')
    return
  }

  const layout = vilData.layout

  // srcレイアウト（ノートPC側）は現在のphysicalLayoutを維持
  const physicalLayout = state.physicalLayout
  const physKeyCount = physicalLayout.length

  // vil base layer のキーをフラット化
  const vilBaseKeys = []
  for (const row of (layout[0] || [])) {
    for (const key of row) {
      vilBaseKeys.push(key)
    }
  }
  const vilKeyCount = vilBaseKeys.length

  // ノートPC: kanataKey → インデックスリストのマップ
  const laptopKeyMap = new Map()
  for (let i = 0; i < physicalLayout.length; i++) {
    const k = physicalLayout[i].kanataKey
    if (!laptopKeyMap.has(k)) laptopKeyMap.set(k, [])
    laptopKeyMap.get(k).push(i)
  }

  // 名前ベースマッチング: vil キー位置 → ノートPCキーインデックス
  const usedLaptopIndices = new Set()
  const vilPosToLaptopIdx = new Map()
  for (let vilPos = 0; vilPos < vilBaseKeys.length; vilPos++) {
    const tapKey = extractDefsrcKey(vilBaseKeys[vilPos])
    if (!tapKey || tapKey === 'XX') continue
    const candidates = laptopKeyMap.get(tapKey) || []
    const available = candidates.find((idx) => !usedLaptopIndices.has(idx))
    if (available !== undefined) {
      usedLaptopIndices.add(available)
      vilPosToLaptopIdx.set(vilPos, available)
    }
  }

  // 各レイヤーをノートPCサイズで構築
  // layer0: 名前ベースマッチングで配置（マッチしないキーはtransparent）
  // layer1以降: VILの並び順をそのまま配置（D&Dで並べ替え前提）
  const layers = layout.map((layer, layerIdx) => {
    const keys = Array.from({ length: physKeyCount }, () => ({
      type: 'transparent',
      label: '▽',
      kanataKey: '_',
    }))
    let vilPos = 0
    for (const row of layer) {
      for (const vilKey of row) {
        if (layerIdx === 0) {
          const laptopIdx = vilPosToLaptopIdx.get(vilPos)
          if (laptopIdx !== undefined) {
            keys[laptopIdx] = qmkKeyToGuiKey(vilKey)
          }
        } else {
          if (vilPos < physKeyCount) {
            keys[vilPos] = qmkKeyToGuiKey(vilKey)
          }
        }
        vilPos++
      }
    }
    return {
      name: layerIdx === 0 ? 'base' : `layer${layerIdx}`,
      keys,
    }
  })

  // VIL元キーボードのグリッドレイアウト（行列構造をそのまま保持）
  const vilPhysicalLayout = []
  const vilBaseLayer = layout[0] || []
  for (let rowIdx = 0; rowIdx < vilBaseLayer.length; rowIdx++) {
    const row = vilBaseLayer[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const kanataKey = extractDefsrcKey(row[colIdx])
      vilPhysicalLayout.push({
        x: colIdx,
        y: rowIdx,
        w: 1,
        h: 1,
        kanataKey: kanataKey || 'XX',
        label: kanataKey === 'XX' ? '' : kanataKey,
      })
    }
  }

  // VIL元キーボードの各レイヤーキー配列
  const vilLayers = layout.map((layer) => {
    const keys = []
    for (const row of layer) {
      for (const vilKey of row) {
        keys.push(qmkKeyToGuiKey(vilKey))
      }
    }
    return keys
  })

  // defsrcKeys = マッチしたノートPCキーインデックスの集合
  const defsrcKeys = new Set(usedLaptopIndices)

  // マクロをGUI形式に変換
  const macros = (vilData.macro || [])
    .map((m, i) => vilMacroToGui(m, i))
    .filter(Boolean)

  // コンボをGUI形式に変換
  const combos = (vilData.combo || [])
    .map((c, i) => vilComboToGui(c, i))
    .filter(Boolean)

  // キーオーバーライドをGUI形式に変換
  const keyOverrides = (vilData.key_override || [])
    .map((ko, i) => vilOverrideToGui(ko, i))
    .filter(Boolean)

  setState({
    vilData,
    vilKeyCount,
    vilPhysicalLayout,
    vilLayers,
    defsrcKeys,
    layers,
    activeLayer: 0,
    selectedKey: null,
    macros,
    tapDances: vilData.tap_dance || [],
    tapDancesGui: [],
    combos,
    keyOverrides,
  })
}

async function guessPhysicalLayout(baseLayer, totalKeys) {
  // プリセットレイアウトを試す
  try {
    const usLayout = await loadLayout('us-ansi-60')
    const usKeys = flattenLayout(usLayout)
    if (usKeys.length === totalKeys) {
      return usKeys
    }
  } catch {
    // プリセットが合わない場合はカスタム生成
  }

  // カスタムレイアウトを生成
  const keys = []
  for (let rowIdx = 0; rowIdx < baseLayer.length; rowIdx++) {
    const row = baseLayer[rowIdx]
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const kanataKey = extractDefsrcKey(row[colIdx])
      keys.push({
        x: colIdx,
        y: rowIdx,
        w: 1,
        h: 1,
        kanataKey,
        label: kanataKey === 'XX' ? '' : kanataKey,
      })
    }
  }
  return keys
}

// ============================================================
// プロジェクト保存/読み込み
// ============================================================

function saveProject() {
  const state = getState()

  const project = {
    version: 1,
    layout: state.layout,
    physicalLayout: state.physicalLayout,
    defsrcKeys: Array.from(state.defsrcKeys || []),
    layers: state.layers,
    macros: state.macros,
    tapDances: state.tapDances,
    tapDancesGui: state.tapDancesGui,
    combos: state.combos,
    keyOverrides: state.keyOverrides,
    settings: state.settings,
    vilKeyCount: state.vilKeyCount ?? null,
    vilPhysicalLayout: state.vilPhysicalLayout || [],
    vilLayers: state.vilLayers || [],
  }

  const json = JSON.stringify(project, null, 2)
  downloadFile('vil2kanata-project.json', json, 'application/json')
}

async function loadProject(file) {
  const text = await file.text()

  let project
  try {
    project = JSON.parse(text)
  } catch {
    alert('プロジェクトファイルのパースに失敗しました。')
    return
  }

  if (!project.version || !project.layers) {
    alert('有効なプロジェクトファイルではありません。')
    return
  }

  const physicalLayout = project.physicalLayout || []
  const defsrcKeys = project.defsrcKeys
    ? new Set(project.defsrcKeys)
    : new Set(physicalLayout.map((_, i) => i))

  setState({
    layout: project.layout || 'us-ansi-60',
    physicalLayout,
    defsrcKeys,
    layers: project.layers,
    activeLayer: 0,
    selectedKey: null,
    macros: project.macros || [],
    tapDances: project.tapDances || [],
    tapDancesGui: project.tapDancesGui || [],
    combos: project.combos || [],
    keyOverrides: project.keyOverrides || [],
    settings: {
      tapTime: 200,
      holdTime: 200,
      processUnmappedKeys: true,
      concurrentTapHold: true,
      rapidEventDelay: 5,
      ...(project.settings || {}),
    },
    vilKeyCount: project.vilKeyCount ?? null,
    vilPhysicalLayout: project.vilPhysicalLayout || [],
    vilLayers: project.vilLayers || [],
  })
}

// ============================================================
// LocalStorage保存/復元
// ============================================================

const STORAGE_KEY = 'vil2kanata-autosave'

function autoSave() {
  const state = getState()
  try {
    const data = {
      layout: state.layout,
      physicalLayout: state.physicalLayout,
      layers: state.layers,
      settings: state.settings,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage容量超過時は無視
  }
}

function autoLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ============================================================
// ヘルパー
// ============================================================

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    URL.revokeObjectURL(url)
  }
}

  V2K.exportKbd = exportKbd;
  V2K.importVil = importVil;
  V2K.saveProject = saveProject;
  V2K.loadProject = loadProject;
  V2K.autoSave = autoSave;
  V2K.autoLoad = autoLoad;
})();

// === app.js ===
(function() {
  const getState = V2K.getState;
  const setState = V2K.setState;
  const subscribe = V2K.subscribe;
  const loadLayout = V2K.loadLayout;
  const getAvailableLayouts = V2K.getAvailableLayouts;
  const flattenLayout = V2K.flattenLayout;
  const renderKeyboard = V2K.renderKeyboard;
  const renderVilKeyboard = V2K.renderVilKeyboard;
  const setSelectKeyCallback = V2K.setSelectKeyCallback;
  const setToggleDefsrcCallback = V2K.setToggleDefsrcCallback;
  const setDeleteLayoutKeyCallback = V2K.setDeleteLayoutKeyCallback;
  const setSwapKeysCallback = V2K.setSwapKeysCallback;
  const setDropVilKeyCallback = V2K.setDropVilKeyCallback;
  const renderEditor = V2K.renderEditor;
  const hideEditor = V2K.hideEditor;
  const setUpdateKeyCallback = V2K.setUpdateKeyCallback;
  const setUpdatePhysicalKeyCallback = V2K.setUpdatePhysicalKeyCallback;
  const renderLayers = V2K.renderLayers;
  const setLayerCallbacks = V2K.setLayerCallbacks;
  const renderDefsrcPanel = V2K.renderDefsrcPanel;
  const exportKbd = V2K.exportKbd;
  const importVil = V2K.importVil;
  const saveProject = V2K.saveProject;
  const loadProject = V2K.loadProject;
  const renderCombosPanel = V2K.renderCombosPanel;
  const renderOverridesPanel = V2K.renderOverridesPanel;
  const renderMacrosPanel = V2K.renderMacrosPanel;
  const renderTapDancePanel = V2K.renderTapDancePanel;

// ============================================================
// アプリケーション初期化・アクション
// ============================================================












// ============================================================
// 機能タブ管理
// ============================================================

let activeFeatureTab = 'keymap'

// ============================================================
// アクション
// ============================================================

async function changeLayout(layoutId) {
  const state = getState()
  const layoutData = await loadLayout(layoutId)
  const physicalLayout = flattenLayout(layoutData)
  const keyCount = physicalLayout.length

  const layers = state.layers.map((layer, layerIdx) => {
    const keys = [...layer.keys]
    while (keys.length < keyCount) {
      const idx = keys.length
      if (layerIdx === 0 && physicalLayout[idx]) {
        const phys = physicalLayout[idx]
        keys.push({
          type: 'basic',
          label: phys.label || phys.kanataKey,
          kanataKey: phys.kanataKey,
        })
      } else {
        keys.push({ type: 'transparent', label: '▽', kanataKey: '_' })
      }
    }
    return { ...layer, keys: keys.slice(0, keyCount) }
  })

  const defsrcKeys = new Set(physicalLayout.map((_, i) => i))

  const keyLabelMode = layoutId.startsWith('jis-') ? 'jis' : getState().keyLabelMode

  setState({
    layout: layoutId,
    physicalLayout,
    defsrcKeys,
    layers,
    selectedKey: null,
    keyLabelMode,
  })
}

function selectKey(index) {
  const state = getState()
  const newSelected = index === state.selectedKey ? null : index
  // キー選択時は「キー設定」タブを自動表示（setStateより先に変更）
  if (newSelected !== null && activeFeatureTab !== 'keymap') {
    activeFeatureTab = 'keymap'
  }
  setState({ selectedKey: newSelected })
}

function toggleDefsrcKey(index) {
  const state = getState()
  const defsrcKeys = new Set(state.defsrcKeys)
  if (defsrcKeys.has(index)) {
    defsrcKeys.delete(index)
    if (state.selectedKey === index) setState({ defsrcKeys, selectedKey: null })
    else setState({ defsrcKeys })
  } else {
    defsrcKeys.add(index)
    setState({ defsrcKeys })
  }
}

function swapKeys(fromIndex, toIndex) {
  const state = getState()
  const { activeLayer } = state
  const layers = state.layers.map((layer, i) => {
    if (i !== activeLayer) return layer
    const keys = layer.keys.map((key, j) => {
      if (j === fromIndex) return layer.keys[toIndex]
      if (j === toIndex) return layer.keys[fromIndex]
      return key
    })
    return { ...layer, keys }
  })
  setState({ layers })
}

function selectAllDefsrcKeys() {
  const state = getState()
  const defsrcKeys = new Set(state.physicalLayout.map((_, i) => i))
  setState({ defsrcKeys })
}

function clearAllDefsrcKeys() {
  setState({ defsrcKeys: new Set(), selectedKey: null })
}

function updateKey(layerIndex, keyIndex, keyConfig) {
  const state = getState()
  const layers = state.layers.map((layer, i) => {
    if (i !== layerIndex) return layer
    const keys = layer.keys.map((key, j) => {
      if (j !== keyIndex) return key
      return { ...keyConfig }
    })
    return { ...layer, keys }
  })
  setState({ layers })
}

function setActiveLayer(index) {
  setState({ activeLayer: index, layoutEditMode: false, selectedKey: null })
}

function enterSrcMode() {
  setState({ layoutEditMode: true, selectedKey: null })
}

function addLayer(name) {
  const state = getState()
  const keyCount = state.physicalLayout.length
  const keys = Array.from({ length: keyCount }, () => ({
    type: 'transparent',
    label: '▽',
    kanataKey: '_',
  }))
  const layers = [...state.layers, { name, keys }]
  setState({ layers })
}

function removeLayer(index) {
  const state = getState()
  if (index === 0 || state.layers.length <= 1) return
  const layers = state.layers.filter((_, i) => i !== index)
  const activeLayer = state.activeLayer >= layers.length
    ? layers.length - 1
    : state.activeLayer
  setState({ layers, activeLayer, selectedKey: null })
}

// ============================================================
// 物理キー編集（レイアウト編集モード用）
// ============================================================

function updatePhysicalKey(index, kanataKey, label) {
  const state = getState()
  const { physicalLayout, layers } = state

  if (!physicalLayout || index < 0 || index >= physicalLayout.length) return

  const newPhysicalLayout = physicalLayout.map((key, i) => {
    if (i !== index) return key
    return { ...key, kanataKey, label }
  })

  // レイヤー0の対応キーも更新
  const newLayers = layers.map((layer, layerIdx) => {
    if (layerIdx !== 0) return layer
    const keys = layer.keys.map((key, keyIdx) => {
      if (keyIdx !== index) return key
      return { ...key, kanataKey, label }
    })
    return { ...layer, keys }
  })

  setState({ physicalLayout: newPhysicalLayout, layers: newLayers })
}

// ============================================================
// レイアウト編集
// ============================================================

function toggleLayoutEditMode() {
  const state = getState()
  setState({ layoutEditMode: !state.layoutEditMode, selectedKey: null })
}

function deleteAndReflowLayout(physicalLayout, deleteIndex) {
  const deletedKey = physicalLayout[deleteIndex]
  const rowY = deletedKey.y

  const remaining = physicalLayout.filter((_, i) => i !== deleteIndex)

  // 削除されたキーと同じ行の残りキーを x 順に取得
  const originalRowKeys = physicalLayout
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)
  const firstX = originalRowKeys[0]?.x ?? 0

  const remainingRowKeys = remaining
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)

  // x 座標を詰め直す
  let xAccum = firstX
  const reflowed = remainingRowKeys.map((key) => {
    const newKey = { ...key, x: xAccum }
    xAccum += key.w
    return newKey
  })

  const reflowMap = new Map()
  for (let i = 0; i < remainingRowKeys.length; i++) {
    reflowMap.set(remainingRowKeys[i], reflowed[i])
  }

  return remaining.map((key) => reflowMap.get(key) ?? key)
}

function deleteLayoutKey(index) {
  const state = getState()
  const { physicalLayout, layers, defsrcKeys, selectedKey } = state
  if (!physicalLayout || index < 0 || index >= physicalLayout.length) return

  const newPhysicalLayout = deleteAndReflowLayout(physicalLayout, index)

  const newLayers = layers.map((layer) => ({
    ...layer,
    keys: layer.keys.filter((_, i) => i !== index),
  }))

  const newDefsrcKeys = new Set()
  for (const idx of defsrcKeys || []) {
    if (idx < index) newDefsrcKeys.add(idx)
    else if (idx > index) newDefsrcKeys.add(idx - 1)
  }

  const newSelectedKey =
    selectedKey === index
      ? null
      : selectedKey !== null && selectedKey > index
        ? selectedKey - 1
        : selectedKey

  setState({
    physicalLayout: newPhysicalLayout,
    layers: newLayers,
    defsrcKeys: newDefsrcKeys,
    selectedKey: newSelectedKey,
  })
}

function addLayoutKey(kanataKey, label, width, rowY) {
  const state = getState()
  const { physicalLayout, layers } = state

  const rowKeys = physicalLayout
    .filter((k) => k.y === rowY)
    .sort((a, b) => a.x - b.x)
  const lastKey = rowKeys[rowKeys.length - 1]
  const newX = lastKey ? lastKey.x + lastKey.w : 0

  const newPhysKey = {
    x: newX,
    y: rowY,
    w: width,
    h: 1,
    kanataKey,
    label: label || kanataKey,
  }

  const newPhysicalLayout = [...physicalLayout, newPhysKey]
  const newLayers = layers.map((layer) => ({
    ...layer,
    keys: [...layer.keys, { type: 'transparent', label: '▽', kanataKey: '_' }],
  }))

  setState({ physicalLayout: newPhysicalLayout, layers: newLayers })
}

function getDistinctRowYValues(physicalLayout) {
  const rows = new Set(physicalLayout.map((k) => k.y))
  return [...rows].sort((a, b) => a - b)
}

function renameLayer(index, name) {
  const state = getState()
  const layers = state.layers.map((layer, i) => {
    if (i !== index) return layer
    return { ...layer, name }
  })
  setState({ layers })
}

// ============================================================
// キーラベルモード切替
// ============================================================

function setKeyLabelMode(mode) {
  setState({ keyLabelMode: mode })
}

// ============================================================
// VILキーボードからのドロップ
// ============================================================

function dropVilKey(vilKeyIndex, physKeyIndex) {
  const state = getState()
  const { activeLayer, vilLayers } = state
  const vilLayerKeys = vilLayers[activeLayer]
  if (!vilLayerKeys || !vilLayerKeys[vilKeyIndex]) return

  const vilKey = { ...vilLayerKeys[vilKeyIndex] }
  updateKey(activeLayer, physKeyIndex, vilKey)
}

// ============================================================
// コンボ CRUD
// ============================================================

function addCombo() {
  const state = getState()
  const combos = state.combos || []
  const newId = combos.length > 0 ? Math.max(...combos.map((c) => c.id)) + 1 : 0
  setState({ combos: [...combos, { id: newId, keys: ['', ''], result: '', timeout: 200 }] })
}

function removeCombo(id) {
  const state = getState()
  setState({ combos: (state.combos || []).filter((c) => c.id !== id) })
}

function updateCombo(id, updates) {
  const state = getState()
  setState({
    combos: (state.combos || []).map((c) => (c.id === id ? { ...c, ...updates } : c)),
  })
}

// ============================================================
// キーオーバーライド CRUD
// ============================================================

function addOverride() {
  const state = getState()
  const overrides = state.keyOverrides || []
  const newId = overrides.length > 0 ? Math.max(...overrides.map((o) => o.id)) + 1 : 0
  setState({
    keyOverrides: [...overrides, { id: newId, trigger: '', triggerMods: [], replacementKey: '', replacementMods: [] }],
  })
}

function removeOverride(id) {
  const state = getState()
  setState({ keyOverrides: (state.keyOverrides || []).filter((o) => o.id !== id) })
}

function updateOverride(id, updates) {
  const state = getState()
  setState({
    keyOverrides: (state.keyOverrides || []).map((o) => (o.id === id ? { ...o, ...updates } : o)),
  })
}

// ============================================================
// マクロ CRUD
// ============================================================

function addMacro() {
  const state = getState()
  const macros = state.macros || []
  const newId = macros.length > 0 ? Math.max(...macros.map((m) => m.id)) + 1 : 0
  setState({ macros: [...macros, { id: newId, actions: [] }] })
}

function removeMacro(id) {
  const state = getState()
  setState({ macros: (state.macros || []).filter((m) => m.id !== id) })
}

function updateMacro(id, updates) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => (m.id === id ? { ...m, ...updates } : m)),
  })
}

function addMacroAction(macroId, actionType) {
  const state = getState()
  let newAction
  if (actionType === 'tap') newAction = { type: 'tap', key: '' }
  else if (actionType === 'delay') newAction = { type: 'delay', duration: 50 }
  else newAction = { type: 'text', text: '' }
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return { ...m, actions: [...(m.actions || []), newAction] }
    }),
  })
}

function removeMacroAction(macroId, actionIndex) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return { ...m, actions: (m.actions || []).filter((_, i) => i !== actionIndex) }
    }),
  })
}

function updateMacroAction(macroId, actionIndex, updates) {
  const state = getState()
  setState({
    macros: (state.macros || []).map((m) => {
      if (m.id !== macroId) return m
      return {
        ...m,
        actions: (m.actions || []).map((a, i) => (i === actionIndex ? { ...a, ...updates } : a)),
      }
    }),
  })
}

// ============================================================
// タップダンスCRUD (GUI形式)
// ============================================================

function addTapDance() {
  const state = getState()
  const tds = state.tapDancesGui || []
  const newId = tds.length > 0 ? Math.max(...tds.map((t) => t.id)) + 1 : 0
  setState({ tapDancesGui: [...tds, { id: newId, timeout: 200, actions: [] }] })
}

function removeTapDance(id) {
  const state = getState()
  setState({ tapDancesGui: (state.tapDancesGui || []).filter((t) => t.id !== id) })
}

function updateTapDance(id, updates) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })
}

function addTapDanceAction(tdId) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return { ...t, actions: [...(t.actions || []), { type: 'basic', kanataKey: '', label: '' }] }
    }),
  })
}

function removeTapDanceAction(tdId, actionIndex) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return { ...t, actions: (t.actions || []).filter((_, i) => i !== actionIndex) }
    }),
  })
}

function updateTapDanceAction(tdId, actionIndex, updates) {
  const state = getState()
  setState({
    tapDancesGui: (state.tapDancesGui || []).map((t) => {
      if (t.id !== tdId) return t
      return {
        ...t,
        actions: (t.actions || []).map((a, i) => (i === actionIndex ? { ...a, ...updates } : a)),
      }
    }),
  })
}

// ============================================================
// 機能タブUI
// ============================================================

function updateFeatureTabs(state) {
  const tabs = document.querySelectorAll('.feature-tab')
  for (const tab of tabs) {
    if (tab.dataset.tab === activeFeatureTab) {
      tab.classList.add('feature-tab-active')
    } else {
      tab.classList.remove('feature-tab-active')
    }
  }

  // バッジ更新
  const macros = state.macros || []
  const tapDancesGui = state.tapDancesGui || []
  const combos = state.combos || []
  const overrides = state.keyOverrides || []

  const badgeMacros = document.getElementById('badge-macros')
  const badgeTapDance = document.getElementById('badge-tap-dance')
  const badgeCombos = document.getElementById('badge-combos')
  const badgeOverrides = document.getElementById('badge-overrides')

  if (badgeMacros) badgeMacros.textContent = macros.length > 0 ? macros.length : ''
  if (badgeTapDance) badgeTapDance.textContent = tapDancesGui.length > 0 ? tapDancesGui.length : ''
  if (badgeCombos) badgeCombos.textContent = combos.length > 0 ? combos.length : ''
  if (badgeOverrides) badgeOverrides.textContent = overrides.length > 0 ? overrides.length : ''

  // 選択キーの表示を「キー設定」タブに反映
  const keymapTab = document.querySelector('.feature-tab[data-tab="keymap"]')
  if (keymapTab) {
    if (state.selectedKey !== null && state.physicalLayout?.[state.selectedKey]) {
      const physKey = state.physicalLayout[state.selectedKey]
      keymapTab.textContent = `キー設定: ${physKey.label || physKey.kanataKey}`
    } else {
      keymapTab.textContent = 'キー設定'
    }
  }
}

function renderFeaturePanel(state) {
  const editorPanel = document.getElementById('editor-panel')
  const featurePanel = document.getElementById('feature-panel')

  if (activeFeatureTab === 'keymap') {
    if (featurePanel) featurePanel.style.display = 'none'
    if (editorPanel) {
      if (state.selectedKey !== null) {
        editorPanel.style.display = 'block'
        renderEditor(state)
      } else {
        hideEditor()
      }
    }
  } else {
    if (editorPanel) editorPanel.style.display = 'none'
    if (featurePanel) {
      featurePanel.style.display = 'block'

      const comboCallbacks = {
        onAddCombo: addCombo,
        onRemoveCombo: removeCombo,
        onUpdateCombo: updateCombo,
      }
      const overrideCallbacks = {
        onAddOverride: addOverride,
        onRemoveOverride: removeOverride,
        onUpdateOverride: updateOverride,
      }
      const macroCallbacks = {
        onAddMacro: addMacro,
        onRemoveMacro: removeMacro,
        onUpdateMacro: updateMacro,
        onAddMacroAction: addMacroAction,
        onRemoveMacroAction: removeMacroAction,
        onUpdateMacroAction: updateMacroAction,
      }
      const tapDanceCallbacks = {
        onAddTapDance: addTapDance,
        onRemoveTapDance: removeTapDance,
        onUpdateTapDance: updateTapDance,
        onAddTapDanceAction: addTapDanceAction,
        onRemoveTapDanceAction: removeTapDanceAction,
        onUpdateTapDanceAction: updateTapDanceAction,
      }

      switch (activeFeatureTab) {
        case 'macros':
          renderMacrosPanel(state, macroCallbacks)
          break
        case 'tap-dance':
          renderTapDancePanel(state, tapDanceCallbacks)
          break
        case 'combos':
          renderCombosPanel(state, comboCallbacks)
          break
        case 'overrides':
          renderOverridesPanel(state, overrideCallbacks)
          break
        default:
          break
      }
    }
  }
}

// ============================================================
// 初期化
// ============================================================

async function initApp() {
  const layoutSelect = document.getElementById('layout-select')
  for (const layout of getAvailableLayouts()) {
    const option = document.createElement('option')
    option.value = layout.id
    option.textContent = layout.name
    layoutSelect.appendChild(option)
  }

  layoutSelect.addEventListener('change', (e) => {
    changeLayout(e.target.value)
  })

  document.getElementById('btn-import-vil').addEventListener('click', () => {
    document.getElementById('file-input-vil').click()
  })

  document.getElementById('file-input-vil').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file) {
      await importVil(file)
      e.target.value = ''
    }
  })

  document.getElementById('btn-export-kbd').addEventListener('click', () => {
    exportKbd()
  })

  document.getElementById('btn-save-project').addEventListener('click', () => {
    saveProject()
  })

  document.getElementById('btn-load-project').addEventListener('click', () => {
    document.getElementById('file-input-project').click()
  })

  document.getElementById('file-input-project').addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file) {
      await loadProject(file)
      e.target.value = ''
    }
  })

  document.getElementById('btn-defsrc-all').addEventListener('click', () => {
    selectAllDefsrcKeys()
  })

  document.getElementById('btn-defsrc-clear').addEventListener('click', () => {
    clearAllDefsrcKeys()
  })

  document.getElementById('tap-time').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      setState({ settings: { ...state.settings, tapTime: val } })
    }
  })

  document.getElementById('hold-time').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val > 0) {
      setState({ settings: { ...state.settings, holdTime: val } })
    }
  })

  document.getElementById('cfg-process-unmapped').addEventListener('change', (e) => {
    const state = getState()
    setState({ settings: { ...state.settings, processUnmappedKeys: e.target.checked } })
  })

  document.getElementById('cfg-concurrent-tap-hold').addEventListener('change', (e) => {
    const state = getState()
    setState({ settings: { ...state.settings, concurrentTapHold: e.target.checked } })
  })

  document.getElementById('cfg-rapid-event-delay').addEventListener('change', (e) => {
    const state = getState()
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 0) {
      setState({ settings: { ...state.settings, rapidEventDelay: val } })
    }
  })

  // 機能タブクリックハンドラ
  const featureTabs = document.querySelectorAll('.feature-tab')
  for (const tab of featureTabs) {
    tab.addEventListener('click', () => {
      activeFeatureTab = tab.dataset.tab
      const s = getState()
      updateFeatureTabs(s)
      renderFeaturePanel(s)
    })
  }

  // コールバック登録（循環依存回避）
  setSelectKeyCallback(selectKey)
  setToggleDefsrcCallback(toggleDefsrcKey)
  setDeleteLayoutKeyCallback(deleteLayoutKey)
  setSwapKeysCallback(swapKeys)
  setDropVilKeyCallback(dropVilKey)
  setUpdateKeyCallback(updateKey)
  setUpdatePhysicalKeyCallback(updatePhysicalKey)
  setLayerCallbacks({ setActiveLayer, addLayer, removeLayer, renameLayer, enterSrcMode })

  // キーラベルモード切替ボタン
  document.getElementById('btn-label-us')?.addEventListener('click', () => {
    setKeyLabelMode('us')
  })
  document.getElementById('btn-label-jis')?.addEventListener('click', () => {
    setKeyLabelMode('jis')
  })

  // キー追加フォーム
  document.getElementById('btn-add-layout-key')?.addEventListener('click', () => {
    const kanataKey = document.getElementById('new-key-kanata')?.value.trim()
    const label = document.getElementById('new-key-label')?.value.trim()
    const widthStr = document.getElementById('new-key-width')?.value
    const rowStr = document.getElementById('new-key-row')?.value

    if (!kanataKey) return
    const width = parseFloat(widthStr) || 1
    const rowY = parseFloat(rowStr)
    if (isNaN(rowY)) return

    addLayoutKey(kanataKey, label, width, rowY)

    // 入力クリア
    const kanataInput = document.getElementById('new-key-kanata')
    const labelInput = document.getElementById('new-key-label')
    if (kanataInput) kanataInput.value = ''
    if (labelInput) labelInput.value = ''
  })

  // 状態変更時の再描画
  subscribe((s) => {
    renderKeyboard(s)
    renderVilKeyboard(s)
    renderLayers(s)
    renderDefsrcPanel(s)
    updateFeatureTabs(s)
    renderFeaturePanel(s)

    // layout-selectの選択状態を同期
    const layoutSelectEl = document.getElementById('layout-select')
    if (layoutSelectEl && layoutSelectEl.value !== s.layout) {
      layoutSelectEl.value = s.layout
    }

    // レイアウト編集モード UI 同期
    const editPanel = document.getElementById('layout-edit-panel')
    const hintEl = document.getElementById('defsrc-hint')

    if (editPanel) {
      editPanel.style.display = s.layoutEditMode ? 'flex' : 'none'

      // 行セレクタを physicalLayout に合わせて更新
      const rowSelect = document.getElementById('new-key-row')
      if (rowSelect && s.physicalLayout) {
        const rows = getDistinctRowYValues(s.physicalLayout)
        const prev = rowSelect.value
        rowSelect.innerHTML = ''
        for (const r of rows) {
          const opt = document.createElement('option')
          opt.value = r
          opt.textContent = `Row ${r}`
          rowSelect.appendChild(opt)
        }
        if (prev) rowSelect.value = prev
      }
    }
    // defcfg設定の同期
    const cfgUnmapped = document.getElementById('cfg-process-unmapped')
    const cfgConcurrent = document.getElementById('cfg-concurrent-tap-hold')
    const cfgRapid = document.getElementById('cfg-rapid-event-delay')
    if (cfgUnmapped) cfgUnmapped.checked = s.settings.processUnmappedKeys !== false
    if (cfgConcurrent) cfgConcurrent.checked = s.settings.concurrentTapHold !== false
    if (cfgRapid) cfgRapid.value = s.settings.rapidEventDelay ?? 5

    // キーラベルモード ボタン同期
    const btnLabelUs = document.getElementById('btn-label-us')
    const btnLabelJis = document.getElementById('btn-label-jis')
    if (btnLabelUs) btnLabelUs.classList.toggle('defsrc-btn-active', s.keyLabelMode === 'us')
    if (btnLabelJis) btnLabelJis.classList.toggle('defsrc-btn-active', s.keyLabelMode === 'jis')

    if (hintEl) {
      hintEl.innerHTML = s.layoutEditMode
        ? '左クリック: 物理キー編集　右クリック: キー削除'
        : '左クリック: キー設定<br>Shift+クリック / 右クリック: defsrc切替<br>ドラッグ&ドロップ: キー入替'
    }
  })

  await changeLayout('us-ansi-60')
}

document.addEventListener('DOMContentLoaded', initApp)

  V2K.changeLayout = changeLayout;
  V2K.selectKey = selectKey;
  V2K.toggleDefsrcKey = toggleDefsrcKey;
  V2K.swapKeys = swapKeys;
  V2K.selectAllDefsrcKeys = selectAllDefsrcKeys;
  V2K.clearAllDefsrcKeys = clearAllDefsrcKeys;
  V2K.updateKey = updateKey;
  V2K.setActiveLayer = setActiveLayer;
  V2K.enterSrcMode = enterSrcMode;
  V2K.addLayer = addLayer;
  V2K.removeLayer = removeLayer;
  V2K.updatePhysicalKey = updatePhysicalKey;
  V2K.toggleLayoutEditMode = toggleLayoutEditMode;
  V2K.deleteLayoutKey = deleteLayoutKey;
  V2K.addLayoutKey = addLayoutKey;
  V2K.getDistinctRowYValues = getDistinctRowYValues;
  V2K.renameLayer = renameLayer;
  V2K.setKeyLabelMode = setKeyLabelMode;
  V2K.dropVilKey = dropVilKey;
  V2K.addCombo = addCombo;
  V2K.removeCombo = removeCombo;
  V2K.updateCombo = updateCombo;
  V2K.addOverride = addOverride;
  V2K.removeOverride = removeOverride;
  V2K.updateOverride = updateOverride;
  V2K.addMacro = addMacro;
  V2K.removeMacro = removeMacro;
  V2K.updateMacro = updateMacro;
  V2K.addMacroAction = addMacroAction;
  V2K.removeMacroAction = removeMacroAction;
  V2K.updateMacroAction = updateMacroAction;
  V2K.addTapDance = addTapDance;
  V2K.removeTapDance = removeTapDance;
  V2K.updateTapDance = updateTapDance;
  V2K.addTapDanceAction = addTapDanceAction;
  V2K.removeTapDanceAction = removeTapDanceAction;
  V2K.updateTapDanceAction = updateTapDanceAction;
})();

})();
