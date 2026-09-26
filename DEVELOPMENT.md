# 開発ドキュメント

## 構成

```
src/core/          変換ロジック (CLI と GUI で共通・DOM / fs に依存しない ES Modules)
  keycodes.mjs     QMK / Vial キーコード表 (vial-gui keycodes_v6 準拠)
  qmk.mjs          キーコード文字列・数値 → keyConfig (正規化キー表現)
  settings.mjs     Vial QMK Settings (qsid) のデコード
  kle.mjs          KLE / vial.json の解析 (回転・レイアウトオプション対応)
  firmware.mjs     keymap.c / config.h のテキスト解析 (USER キーコード推定)
  vial.mjs         .vil (+ vial.json 等) → ソースモデル
  mapping.mjs      ソース (自作KB) → ターゲット (ノートPC) の自動対応付け
  layouts.mjs      ノートPC配列プリセット
  text.mjs         マクロの text → キー列 (US / JIS)
  emit.mjs         Kanata (.kbd) 出力器 (唯一の出力実装)
  project.mjs      プロジェクト (v2) の組み立て・保存形式・v1 移行
  index.mjs        CLI / テスト用のまとめ
vil2kanata.js      CLI (引数処理と入出力のみ)
gui/js/*.js        GUI (状態管理・描画)
gui/bundle.js      build.js が src/core と gui/js を結合した生成物 (file:// で動かすため)
test/              node:test によるテストとフィクスチャ (Corne 型分割キーボード)
```

## データの流れ

```
 .vil ─┐
 vial.json ─┼─ importVil() ──→ ソースモデル ──┐
 keymap.c / config.h ─┘   (keys, layers, macros, TD,   │
                           combos, KO, settings...)    │
                                                       ▼
 ノートPC配列 (layouts.mjs) ──────────────→ プロジェクト v2
                                  { target, source, mapping{starts,pins},
                                    edits[layer][targetIdx], macros..., qmk, kanata }
                                                       │
                                        resolveProject()  ← computeMapping()
                                                       │
                                  ノートPC基準のレイヤー + defsrc + 左右の手
                                                       │
                                                  emitKanata()
                                                       ▼
                                                     .kbd
```

- **keyConfig** がすべてのキー表現の共通形式です (`qmk.mjs` 冒頭のコメント参照)。
  GUI のエディタもこの形式を直接編集します。
- **対応付け (mapping)** は「セグメントの始点 (`starts`)」と「個別ピン (`pins`)」だけを保存し、
  実際の割り当ては毎回 `computeMapping()` で再計算します。そのため全レイヤーに同じ対応付けが適用され、
  始点を変えても手動変更 (`edits`) は失われません。
- `edits` はノートPC側のキー位置に対する手動変更で、対応付けより優先されます。

## 自動対応付けのアルゴリズム (mapping.mjs)

1. ソースのキーを中心座標の y で行に分け、行内で隙間 (> 0.6u) があれば別セグメントにする
   (分割キーボードの左右・親指クラスタが別セグメントになる)
2. セグメントごとに始点を決める
   - `starts` にユーザー指定があればそれを使う (`null` = 割り当てない)
   - ベースレイヤーのタップキー名とノートPCのキー名が一致する組から (行, 列オフセット) を投票し、
     最多票を採用 (4 キー以上のセグメントは 2 票以上必要)
   - 決まらないセグメントは、最も近い確定済みセグメントの行ずれと横位置から推定
3. 始点から右へ順番に割り当て (優先度: ユーザー指定 → 自動 → 推定。先に取られたキーはスキップ)
4. `pins` は常に最優先

## Vial → Kanata の対応で注意している点

- `macro` 内の `0`〜`9` は Kanata では**遅延 (ms)** として解釈されるため `Digit1` 形式で出力する
- `layer-toggle` は Kanata では `layer-while-held` の別名。QMK の `TG` は `layer-switch` で実装し、
  対象レイヤー上 (透過でベースの TG に落ちる位置を含む) ではベースへ戻る動作にする
- `delegate-to-first-layer yes` で「切り替えたレイヤーの透過キーはレイヤー 0 に落ちる」という QMK の挙動に合わせる
- Magic のキー入れ替えは QMK と同様にキーマップ上のキーコードだけに適用し、修飾ビット・マクロ・タップダンスには適用しない
- コンボはキーコードで構成キーを探し、そのキーを出さないレイヤーを `disabled-layers` にする
- `ro` / IME キー等の OS 依存キーは `deflocalkeys-*` で定義し、1 つのファイルが Windows / Linux の両方で読めるようにする

## ビルドとテスト

```bash
node build.js            # gui/bundle.js を再生成 (src/core や gui/js を変更したら必須)
npm test                 # テスト (bundle が最新かも確認)
KANATA_BIN=/path/to/kanata npm test   # 出力を kanata --check で構文検証
```

- `build.js` は `import { ... } from '...'` を除去して 1 ファイルに結合する簡易バンドラーです。
  `export function` / `export const` のみ対応し、export 名がモジュール間で重複するとエラーにします。
- CI (`.github/workflows/test.yml`) は Kanata v1.10.1 の Linux バイナリを取得して検証します。

## Kanata のバージョン

出力は Kanata v1.10.1 で検証しています。`tap-hold-opposite-hand`、`require-prior-idle`、
`defoverridesv2` は v1.10.1 では使えないため使用していません (Chordal Hold・Flow Tap・
キーオーバーライドのレイヤー限定などが近似/非対応になっているのはこのためです)。
