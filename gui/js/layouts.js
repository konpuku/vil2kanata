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

export async function loadLayout(layoutId) {
  const layout = LAYOUT_DATA[layoutId]
  if (!layout) {
    throw new Error(`未知のレイアウト: ${layoutId}`)
  }
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
