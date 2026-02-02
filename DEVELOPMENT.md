# 開発ドキュメント

## 概要

vil2kanata は Vial (.vil) の設定ファイルを Kanata (.kbd) の設定ファイルに変換する Node.js CLI ツール。
外部依存なし、単一ファイル (`vil2kanata.js`) で構成される。

## .vil ファイル構造

Vial が出力する `.vil` ファイルは JSON 形式で、以下のフィールドを持つ。

```
{
  version        : number       プロトコルバージョン
  uid            : number       キーボード固有ID
  layout         : string[][][]  layout[layer][row][col] = QMKキーコード文字列
  macro          : array[][]     macro[index] = アクション配列
  tap_dance      : array[]       [on_tap, on_hold, on_double_tap, on_tap_hold, tapping_term]
  combo          : array[]       [key1, key2, key3, key4, result]
  key_override   : object[]      {trigger, replacement, trigger_mods, ...}
  settings       : object        QMK設定値
}
```

全てのキーコードは `"KC_A"`, `"LGUI_T(KC_A)"` のような **文字列** で格納されている。
数値キーコードではない点が重要。

## アーキテクチャ

```
                    ┌──────────────┐
 .vil (JSON) ──────>│ JSONパース    │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
  │ マクロ変換    │ │ TD変換       │ │ レイヤー走査  │
  │ convertMacro │ │ convertTD    │ │ convertKey   │
  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
         │                │                │
         │          ┌─────┴─────┐          │
         │          ▼           ▼          │
         │   ┌────────────┐ ┌────────┐    │
         │   │ コンボ変換  │ │ KO変換 │    │
         │   └─────┬──────┘ └───┬────┘    │
         │         │            │          │
         ▼         ▼            ▼          ▼
       ┌─────────────────────────────────────┐
       │ generateKanataConfig                │
       │ (defalias / deflayer / defchordsv2  │
       │  を組み立てて .kbd 文字列を生成)     │
       └─────────────────┬───────────────────┘
                         │
                         ▼
                    .kbd (text)
```

## 変換処理フロー

1. `.vil` ファイル読み込み → JSON パース + バリデーション
2. マクロデータ → `(macro ...)` 変換（down/tap/up パターンの自動最適化）
3. タップダンスデータ → `(tap-dance ...)` 変換
4. 全レイヤーのキーコード文字列を走査し、エイリアスが必要なものを `aliasContext` に登録
5. コンボデータ → `(defchordsv2 ...)` 変換
6. キーオーバーライド → コメントとして出力
7. `defsrc`, `defalias`, `deflayer`, `defchordsv2` を組み立てて出力

## 主要関数

### パーサー (166-252行)

| 関数 | 入力例 | 出力 |
|---|---|---|
| `parseModified(str)` | `"LSFT(KC_8)"` | `{type:'modified', prefix:'S-', key:'8'}` |
| `parseModTap(str)` | `"LGUI_T(KC_A)"` | `{type:'mod-tap', mod:'lmet', key:'a'}` |
| `parseLayerTap(str)` | `"LT1(KC_BSPACE)"` | `{type:'layer-tap', layer:1, key:'bspc'}` |
| `parseLayerOp(str)` | `"MO(2)"` | `{type:'layer-op', op:'MO', layer:2}` |
| `parseMacroRef(str)` | `"M0"` | `{type:'macro-ref', index:0}` |
| `parseTapDanceRef(str)` | `"TD(3)"` | `{type:'tap-dance-ref', index:3}` |
| `parseUserKeycode(str)` | `"USER01"` | `{type:'user', index:1}` |

### 変換 (254-389行)

| 関数 | 役割 |
|---|---|
| `convertBasicKeycode(qmkStr)` | `KC_X` → Kanata キー名 |
| `convertKeycode(qmkStr, aliasContext)` | トップレベル変換。複合キーはエイリアス登録 |
| `convertBasicOrModified(qmkStr)` | 基本 or 修飾付きキーの文字列変換 |

### マクロ (391-561行)

| 関数 | 役割 |
|---|---|
| `convertMacro(macroActions)` | アクション配列 → `(macro ...)` 文字列 |
| `optimizeMacroActions(actions)` | `down(MOD)+tap(KEY)+up(MOD)` → `S-KEY` に圧縮 |
| `convertMacroKeycode(qmkStr)` | マクロ内のキーコード変換 (`KC_TRNS` はスキップ) |
| `convertTextToKeys(text)` | `"text"` アクション → JIS キーシーケンス |

### タップダンス (563-636行)

| 関数 | 役割 |
|---|---|
| `convertTapDance(tdData, index)` | 5要素配列 → `(tap-dance ...)` 定義 |

on_hold がある場合は `tap-hold-release` と `tap-dance` を組み合わせて生成する。

### コンボ (638-694行)

| 関数 | 役割 |
|---|---|
| `comboInputKey(qmkStr)` | コンボ入力キーを defsrc 対応のキー名に変換 |
| `convertCombo(comboData, macroNames)` | `defchordsv2` エントリ生成 |

Mod-Tap / Layer-Tap キーの場合は tap キー名を使用する。

### エイリアスコンテキスト (725-821行)

`createAliasContext()` が返すオブジェクトで、変換中に発見されたエイリアスを一元管理する。

| メソッド | 用途 |
|---|---|
| `registerModTap(parsed)` | `a-lmet` のような名前で登録 |
| `registerLayerTap(parsed)` | `l1-bspc` のような名前で登録 |
| `registerLayerOp(parsed)` | `mo2` のような名前で登録 |
| `registerModified(qmkStr, kanataStr)` | `k-lsft_8` のような名前で登録 |
| `registerUser(parsed)` | `usr01` のような名前で登録 |
| `registerMouseMove(name, value)` | `ms-l` のような名前で登録 |

同じキーが複数回出現しても、エイリアスは 1 度だけ登録される。

## キーコードマッピング

### BASIC_KEYCODE_MAP (11-114行)

QMK の `KC_*` 文字列を Kanata キー名に変換する静的マッピング。
アルファベット、数字、F キー、記号、ナビゲーション、修飾キー、日本語キー、テンキー、メディアキーを網羅。

### MOD_PREFIX_MAP (117-122行)

修飾付きキーコードの Kanata プレフィックス。

```
LSFT → S-    RSFT → RS-
LCTL → C-    RCTL → RC-
LALT → A-    RALT → RA-
LGUI → M-    RGUI → RM-
```

### TEXT_TO_KEYS_JIS (143-164行)

マクロの `["text", "..."]` アクション用。文字 → JIS キーボードのキーストロークに変換する。

## マクロ最適化の仕組み

`optimizeMacroActions()` は以下のパターンを検出して圧縮する。

**入力:**
```json
["down","KC_LSHIFT"], ["tap","KC_8"], ["up","KC_LSHIFT"]
```

**処理:**
1. `down(KC_LSHIFT)` を検出
2. 後続の `tap` アクションを収集: `KC_8`
3. 対応する `up(KC_LSHIFT)` を検出
4. `{type: 'modified-tap', prefix: 'S-', keys: ['KC_8']}` に圧縮

**出力:**
```
S-8
```

複数キーの `down` (`["down","KC_BTN1","KC_BTN1"]`) は `tap` として扱う。

## タップダンスの変換パターン

QMK のタップダンスは 4 つのアクション (tap / hold / double_tap / tap_hold) を持つが、
Kanata の `tap-dance` はタップ回数のみで区別する。

hold の区別が必要な場合は `tap-hold-release` を組み合わせる。

| on_hold | on_tap_hold | 変換結果 |
|---|---|---|
| なし | なし | `(tap-dance N (tapKey doubleTapKey))` |
| あり | なし | `(tap-dance N ((tap-hold-release T T tapKey holdKey) doubleTapKey))` |
| あり | あり | `(tap-dance N ((tap-hold-release T T tapKey holdKey) (tap-hold-release T T dtKey tapHoldKey)))` |
| なし | あり | `(tap-dance N (tapKey (tap-hold-release T T dtKey tapHoldKey)))` |

## 既知の制限事項

### defsrc の自動生成

ベースレイヤーのキー名から自動生成するが、以下の問題がある。

- **重複キー**: 同じ tap キーが複数のキーに割り当てられている場合 (例: 2 つの `LT(KC_TAB)`)、defsrc に同じキー名が出現する。警告コメントは出力されるが自動解決はしない。
- **USER キー**: `f13+index` のプレースホルダーで代替する。

### キーオーバーライド

QMK の Key Override は Kanata に直接対応する機能がないため、コメントとして元の設定を出力するのみ。`fork` や `switch` での近似実装はユーザーに委ねる。

### テキストマクロの JIS 依存

`["text", "..."]` アクションの文字→キー変換は JIS レイアウトを前提としている。US レイアウトで使用する場合は `TEXT_TO_KEYS_JIS` マッピングの修正が必要。

## 動作確認済み環境

- Vial Protocol v6 / VIA Protocol v9
- Bancouver40 (4x10, 5 レイヤー, マクロ 16 スロット, タップダンス 8, コンボ 8, キーオーバーライド 8)
