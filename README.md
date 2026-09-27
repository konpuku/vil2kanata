# vil2kanata

Vial (.vil) の設定を、ソフトウェアキーリマッパー [Kanata](https://github.com/jtroo/kanata) の設定ファイル (.kbd) に変換するツールです。
自作キーボード (Vial 対応) で使っているキーマップ・マクロ・タップダンス・コンボ・QMK 設定を、ノートPC のキーボードでそのまま使えるようにします。

- **ブラウザ GUI** (`gui/index.html`): 対応付けを見ながら調整・編集できます (推奨)
- **CLI** (`vil2kanata.js`): 同じ変換ロジックをコマンドラインから使えます

GUI と CLI は同じ変換コア (`src/core/`) を使っているため、出力結果は同一です。

---

## GUI エディタ

`gui/index.html` をブラウザで開くだけで使えます (インストール不要)。

### 作業の流れ

#### ① 対応付け — 「始点を答える」だけで全キーを割り当て

1. **ノートPCの配列を選ぶ** — `JIS ノートPC (Fn・矢印付き)` など。手元と違うキーは左パネルの「ノートPC配列を編集」で追加・削除・名前変更できます。
2. **自作キーボードの設定を読み込む** — `.vil` を選択します。
   `vial.json` (キーボード定義) を一緒に選ぶと、分割キーボードの左右や親指キーを**実際の形**で扱えます。
   `keymap.c` / `config.h` も一緒に選ぶと、USER キーコードの動作や TAPPING_TERM 等も取り込みます。
3. **各行の始点を確認する (ヒアリング)** — 自作キーボードの各行 (分割キーボードは左右別) について、
   「先頭のキーはノートPCのどのキーか」を答えます。
   - キー名が一致する行 (`Q` ↔ `Q` など) は**自動で推定済み**です
   - 名前で決まらない行 (親指キー等) は近くの行から推定されます
   - 違っていればプルダウンで選ぶか、「キーで指定」を押してノートPCのキーをクリックします
   - 始点が決まると、残りのキーは右方向へ順番に割り当てられます
4. **個別に微調整する** — 自作キーボードのキーをクリック → ノートPCのキーをクリック (またはドラッグ&ドロップ) で割り当て。
   割り当て先に別のキーがあれば入れ替わります。右クリックで割り当て解除。

対応付けは**全レイヤー共通**です。一度合わせれば、すべてのレイヤーに反映されます。

#### ② キーマップ編集

- レイヤータブで切り替え、ノートPCのキーをクリックすると動作を編集できます
  (編集したキーは左上にオレンジの点。「手動変更を取り消す」で対応付けの値に戻ります)
- Shift+クリック / 右クリックで「リマップ対象 (defsrc) に含めるか」を切り替え
- 機能タブ: マクロ / タップダンス / コンボ / オーバーライド (+ Alt Repeat Key) / **Vial設定** / **出力プレビュー**

#### 保存・エクスポート

- **.kbd エクスポート**: Kanata の設定ファイルをダウンロード
- **保存 / 読込**: プロジェクト (対応付け・手動変更・設定) を JSON で保存。旧バージョンで保存したファイルも読み込めます
- 作業内容はブラウザに自動保存され、次回開いたときに復元されます

---

## Vial 機能の再現

| Vial / QMK | Kanata での再現 |
|---|---|
| 基本キー・修飾付きキー (`LSFT(KC_1)`, `C_S(KC_V)`, `KC_EXLM` 等) | キー名 / 出力チョード (`S-1`, `C-S-v`) |
| Mod-Tap (`LCTL_T`, `MEH_T`, `MT(...)` 等、複数修飾も可) | `tap-hold` 系 (修飾が複数なら `multi`) |
| Layer-Tap (`LT1(kc)`, `LT(1, kc)`) | `tap-hold` 系 + `layer-while-held` |
| `MO` / `TO` / `TG` / `DF` / `OSL` / `TT` / `LM` / `OSM` | `layer-while-held` / `layer-switch` (TG・TT は対象レイヤー上で解除) / `one-shot` 等 |
| **Tapping Term / Quick Tap Term** | `hold-time` / `tap-time` |
| **Permissive Hold / Hold On Other Key Press** | `tap-hold-release` / `tap-hold-press` |
| **Chordal Hold** | 同じ手のキーを列挙した `tap-hold-release-keys` |
| マクロ (tap / down / up / text / delay) | `macro` (down〜up の修飾はチョード化、数字は `Digit1` 形式、遅延は数値) |
| タップダンス (タップ / ホールド / ダブルタップ / タップ後ホールド / 個別 Tapping term) | `tap-dance` + `tap-hold` |
| コンボ (**COMBO_TERM**、出力は任意のキーコード) | `defchordsv2` (構成キーが同じ動作にならないレイヤーでは無効化) |
| キーオーバーライド (有効/無効、左右修飾、one mod) | `defoverrides` |
| Alt Repeat Key / Repeat Key | `switch` + `key-history` / `rpt-any` |
| Grave Escape (+ Override 設定) / Space Cadet / `KC_SFTENT` | `switch` / `tap-hold-press` |
| Caps Word | `caps-word-toggle` |
| **One Shot Keys タイムアウト** / **Tapping Toggle** | `one-shot-press` のタイムアウト / `TT` のタップ回数 |
| **Auto Shift** (タイムアウト、英字/数字/記号の除外) | 対象キーを `tap-hold` (ホールドで Shift) に置き換え |
| **Magic** (Caps⇔Ctrl、Alt⇔GUI、GUI 無効 等) | キーマップ上のキーを入れ替えて出力 |
| **Mouse keys** (間隔・移動量・最大速度・加速時間・ホイール間隔) | `movemouse-accel-*` / `mwheel-*` / `movemouse-speed` |
| USER キーコード (keymap.c がある場合) | `process_record_user` を解析して `tap-hold-release` 等で近似 |
| レイアウトオプション (vial.json の labels) | `.vil` の `layout_options` に従ってキーを選択 |

Kanata v1.10 で**再現できない項目**は、出力ファイル先頭のコメントと GUI の「出力プレビュー」に一覧表示されます
(例: Retro Tapping、Flow Tap、キーオーバーライドのレイヤー限定・Negative mods、エンコーダー、ブートローダー等の本体機能)。

### OS ごとの違い

「Vial設定」タブ (CLI は `--os`) で出力先 OS を選べます。

| キー | Windows | Linux | macOS |
|---|---|---|---|
| `KC_LANG1` (IME ON) | `(arbitrary-code 242)` VK_DBE_HIRAGANA | `deflocalkeys-linux` (122) | `kana` |
| `KC_LANG2` (IME OFF) | `(arbitrary-code 26)` VK_IME_OFF | `deflocalkeys-linux` (123) | `eisu` |
| `KC_RO` (ろ) | `ro` | `deflocalkeys-linux` (89) | `ro` |

`KC_KANA` は Windows では韓国語 IME 用の VK_KANA になるため、日本語 IME の ON/OFF には `KC_LANG1` / `KC_LANG2` を使ってください。

### Windows + JIS 配列の英数キー・カタカナ/ひらがなキー

Windows の日本語キーボードドライバーは、次のキーについて**「押した」イベントしか送らず「離した」イベントを送りません**
(`kanata --debug` で確認済み)。Kanata からは押しっぱなしに見えるため、Mod-Tap / Layer-Tap 等を割り当てると
常にホールド扱いになり、修飾キーやレイヤーが押されたままになります。

| キー | スキャンコード | Kanata での見え方 | 置き換え先 |
|---|---|---|---|
| 英数 (Caps Lock) | 0x3A | `caps` の押下のみ | F13 |
| カタカナ/ひらがな | 0x70 | `KEY_KATAKANA` の押下のみ (defsrc の `kana` とも一致しない) | F14 |

Kanata の設定だけでは解決できないため、OS 側でキーを置き換えます。

1. `tools/windows/vil2kanata-jis-ime-keys-to-f13-f14.reg` を実行し (管理者権限)、サインアウトまたは再起動する
2. GUI でそのキーを選び「このキーを f13 / f14 として扱う」を押す (または defsrc の `caps` → `f13`、`kana` → `f14` に変更) して .kbd を出力し直す

元に戻すときは `tools/windows/vil2kanata-restore-keyboard.reg` を実行します。
Scancode Map は 1 つの値なので、既に別の設定をしている場合は上書きされます。
Kanata を起動していないときは、これらのキーは F13 / F14 として動作します (IME の切り替えには使えなくなります)。
該当する割り当てがあると、出力ファイル先頭の注意と GUI のキー設定画面に表示されます。

### マクロの文字入力 (text アクション)

- **JIS** (既定): OS が JIS 配列のとき、その文字がそのまま入力されるキーに変換します (`@` → `[` の位置のキー)
- **US**: QMK の `send_string` と同じ (US 配列のキーコード)。自作キーボードで実際に入力されていた文字と同じになります

---

## CLI

[Node.js](https://nodejs.org/) (v18 以降) が必要です。

```bash
# ノートPC配列を指定して自動で対応付け (推奨)
node vil2kanata.js my.vil -t jis-laptop -o keymap.kbd

# vial.json / keymap.c / config.h のあるフォルダも読み込む
node vil2kanata.js my.vil -t jis-laptop -f path/to/keymaps/vial -o keymap.kbd

# 対応付けの行セグメントと推定された始点を確認 (ヒアリング用)
node vil2kanata.js my.vil -t jis-laptop -f path/to/keymaps/vial --list-segments

# 始点を指定 (右手親指の先頭キーを「変換」キーへ)
node vil2kanata.js my.vil -t jis-laptop --start r3s1=henk -o keymap.kbd

# GUI で保存したプロジェクトを使う (対応付け・手動変更を反映)
node vil2kanata.js --project vil2kanata-project.json -o keymap.kbd
```

| オプション | 説明 |
|---|---|
| `-o, --output FILE` | 出力ファイル (省略時は標準出力) |
| `-t, --target PRESET` | ノートPC配列: `jis-laptop`, `jis-60`, `us-ansi-60`, `us-ansi-fn`, `us-ansi-tkl`。省略時は自作キーボードの配列をそのまま defsrc にします |
| `-s, --start SEG=KEY` | 行セグメントの始点 (複数可)。`KEY` はノートPC側の kanata キー名、`none` で割り当てなし |
| `-p, --project FILE` | GUI のプロジェクトファイル |
| `-f, --firmware-dir DIR` | `vial.json` / `keymap.c` / `config.h` を読むフォルダ |
| `--vial-json`, `--keymap-c`, `--config-h` | 個別に指定 |
| `--os windows\|linux\|macos` | 出力先 OS (既定: windows) |
| `--text-layout jis\|us` | マクロの文字入力方式 (既定: jis) |
| `--list-segments` | セグメント一覧を表示して終了 |

---

## 動作確認

- 出力は Kanata v1.10.1 の `kanata --check` で構文検証しています (`npm test`)
- Vial Protocol v6 / VIA Protocol v9 の `.vil`
