# vil2kanata

Vial (.vil) の設定ファイルを Kanata (.kbd) の設定ファイルに変換する CLI ツール。

外付けキーボード (Vial対応) の設定を、ソフトウェアキーリマッパー [Kanata](https://github.com/jtroo/kanata) に移植する用途を想定しています。Node.js 単体で動作し、外部依存はありません。

## 使い方

```bash
# stdout に出力
node vil2kanata.js input.vil

# ファイルに出力
node vil2kanata.js input.vil --output output.kbd
```

## 変換対象

| Vial (.vil) | Kanata (.kbd) |
|---|---|
| 基本キーコード (`KC_A` など) | Kanata キー名 (`a`) |
| Mod-Tap (`LGUI_T(KC_A)`) | `(tap-hold-release 200 200 a lmet)` |
| Layer-Tap (`LT1(KC_BSPACE)`) | `(tap-hold-release 200 200 bspc (layer-toggle layer1))` |
| 修飾付きキー (`LSFT(KC_8)`) | `S-8` |
| レイヤー操作 (`MO(n)`, `TO(n)` 等) | `(layer-toggle ...)` / `(layer-switch ...)` |
| マクロ | `(macro ...)` (down/tap/up パターンを自動最適化) |
| タップダンス | `(tap-dance ...)` + `(tap-hold-release ...)` |
| コンボ | `(defchordsv2 ...)` |
| キーオーバーライド | コメントとして出力 (Kanata に直接対応なし) |
| マウスキー | `(movemouse-* 1 1)`, `mlft`, `mrgt` |
| 日本語キー (`KC_RO`, `KC_LANG1` 等) | `ro`, `kana`, `eisu` 等 |

## 出力後の手動調整

変換結果はそのままでは動作しません。以下の調整が必要です。

### defsrc の書き換え

`defsrc` はベースレイヤーのキー名から自動生成されますが、実際の物理キーボードのレイアウトに合わせて書き換える必要があります。特にノート PC の JIS キーボードに合わせる場合、キーの数や配置が異なります。

重複キーがある場合は警告コメントが出力されます。

### USER キーコード

`USER01` 等のユーザー定義キーコードはプレースホルダー (`f14` 等) に変換されます。実際のキーに置き換えてください。

### キーオーバーライド

QMK の Key Override 機能は Kanata に直接対応する機能がないため、コメントとして元の設定が出力されます。必要に応じて `fork` や `switch` で実装してください。

## 動作確認済み環境

- Vial Protocol v6 / VIA Protocol v9
- Bancouver40 (4x10, 5 レイヤー)

## ライセンス

MIT
