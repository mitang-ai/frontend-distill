<div align="center">
  <h1>Frontend Distill</h1>
  <h2>Web フロントエンドを AI が再利用しやすいシステム資産へ蒸留する</h2>
  <h3>frontend-distill skill</h3>
  <p>見た目だけでなく、構造、リズム、レスポンシブ制約まで抽出します。</p>
  <p>AI に渡すのは単なる雰囲気ではなく、再利用可能なフロントエンドの根拠です。</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    Other Languages / 他の言語:
    <a href="./README.md">简体中文</a> ·
    <a href="./README_EN.md">English</a> ·
    <a href="./README_KO.md">한국어</a> ·
    <a href="./README_ES.md">Español</a>
  </p>
</div>

`Frontend Distill` は、実在する Web サイトを AI が再利用しやすいフロントエンド資産へ変換するための、オープンソースの skill + toolchain です。

単なる CSS 値の収集や、見た目だけを真似るための README ではありません。  
サイトの表層から、再利用可能な制約を取り出し、それを AI が扱いやすい形へ整理することが目的です。

この README の構成リズムは Hua Shu の OSS ドキュメントの組み立て方から着想を得ていますが、タイトル、語り口、構成、表現は `Frontend Distill` 用に再設計しています。

---

## 解決したい問題

[`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) は、`DESIGN.md` が AI に視覚スタイルを渡すうえで有効だと示しました。

ただし実務で困るのは、色が似ないことよりも次のような点です。

- ページ骨格が不安定
- セクションのリズムが弱い
- デスクトップで詰まって見える
- モバイルで積み方が不自然
- CTA、ナビ、本文の構成がモデル任せになる

つまり、多くの資料は「どう見えるべきか」は伝えられても、「どう組むべきか」は十分に伝えられていません。

`Frontend Distill` はその不足を埋めるためのプロジェクトです。

## プロジェクトの位置づけ

このプロジェクトは単なる extractor ではなく、次の 3 つの組み合わせです。

- 精密なプロンプトで駆動する skill
- 決定的に抽出と整形を行うツール群
- AI が再利用しやすい成果物

反復作業はできるだけスクリプトに任せ、判断が必要な部分だけをモデルに残すのが基本方針です。

## 主な成果物

`Frontend Distill` は現在、次の 4 種類の成果物を中心に設計されています。

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

役割は分かれています。

- Markdown は人間と AI の両方に向けた高レベルの説明
- JSON はツールや agent 向けの低曖昧・低 token な構造化入力

## なぜ token を節約できるのか

長いプロンプトだけで AI にサイトを見せ、要約と推論を全部任せると、よく起きる問題は次の 3 つです。

- フローがぶれやすい
- ランダム性が高い
- token 消費が大きい

このプロジェクトは逆向きに設計されています。

- プロンプトはオーケストレーションと制約担当
- スクリプトは抽出、クラスタリング、重複排除、トリミング担当
- AI は最後に整理済みの結果だけを読む

そのため、単発の vibe prompt ではなく、フロントエンド蒸留パイプラインとして機能します。

## インストール

まずリポジトリを clone します。

```bash
git clone <your-repo-url>
cd frontend-distill
```

依存関係をインストールします。

```bash
npm install
```

skill をローカルの skills ディレクトリへ入れる場合:

```bash
npm run skill:install -- --target "C:\\Users\\your-name\\.claude\\skills"
```

agent がリポジトリのパスから直接 skill を読める場合は、次をそのまま使えます。

- [`skill/frontend-distill`](./skill/frontend-distill)

## 使い方

1. ブラウザ、またはブラウザ操作が可能な agent で対象サイトを開きます。
2. ページのコンソールで [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js) を実行します。
3. 得られた JSON を正規化、検証、分割ツールへ渡します。
4. 生成された bundle、tokens、Markdown ガイドを `frontend-distill` skill へ渡します。

コマンド例:

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

## 何を蒸留するのか

フロントエンドの再利用は 1 層では成立しません。現在は 5 層を対象にしています。

層 | 主な内容 | 意味
--- | --- | ---
Visual | 色、タイポグラフィ、影、角丸、装飾効果 | 見た目が近いかを決める
Component | ボタン、カード、入力欄、ナビ、タグ、変種 | コンポーネントの細部を安定させる
Layout | コンテナ、グリッド、セクションのリズム、可読幅、ページ骨格 | 画面全体の呼吸感を決める
Responsive | ブレークポイント、折りたたみ規則、余白圧縮、ナビ変化、viewport 証拠 | 複数デバイスで成立するかを決める
Reuse | `DESIGN.md`、`LAYOUT.md`、構造化 tokens | AI が低コストで再利用できるかを決める

最初の 2 層だけだと、AI は「似ている UI」を作りがちです。  
残り 3 層まで明示すると、「構造的にも妥当な UI」に近づきます。

## 仕組み

`Frontend Distill` は対象サイトに対して 4 段階で動きます。

1. フロントエンド証拠を集める  
   visual token、component sample、layout signal、responsive clue、CSS variable、decorative effect、state 関連情報を取得します。

2. 生データを正規化する  
   色、余白、style signature、component variant を重複排除し、クラスタ化し、トリミングし、標準化します。

3. 再利用成果物を組み立てる  
   `extraction-bundle` を作り、`design-tokens.json` と `layout-tokens.json` に分割し、`DESIGN.md` と `LAYOUT.md` の入力も準備します。

4. skill が消費する  
   skill はまず構造化 summary と tokens を読み、その後 Markdown ガイドを読むことで、自由生成と token 浪費を減らします。

## すでに含まれているもの

このリポジトリにはすでに次が含まれています。

- repo 内蔵 skill
- ブラウザ抽出スクリプト
- 正規化、検証、分割ツール
- 構造化 schema
- `DESIGN.md` ガイド
- `LAYOUT.md` ガイド
- 上流分析ドキュメント

つまり、ただのアイデアではなく、実際に動かせる skill toolchain の土台になっています。

## 境界

このプロジェクトには意図的な境界があります。

- 読み取るのは公開レンダリング結果であり、非公開デザインソースではありません
- 得意なのは繰り返し現れるフロントエンド規則の抽出であり、ブランド戦略や事業意図の理解ではありません
- 構造証拠は残せますが、すべてのインタラクション状態を 1 回で網羅できるとは限りません
- 多 viewport のレスポンシブ取得は、ブラウザ機能を持つ agent と組み合わせるとより強くなります

この限界を明示することが、出力の信頼性につながります。

## リポジトリ構成

```text
frontend-distill/
├── skill/
│   └── frontend-distill/
│       ├── SKILL.md
│       ├── extract-script.md
│       ├── reference.md
│       ├── layout-reference.md
│       └── skill-output-template.md
├── tools/
│   ├── browser/
│   │   └── extract_design_tokens.js
│   ├── install-skill.mjs
│   ├── normalize-extraction-bundle.mjs
│   ├── split-extraction-bundle.mjs
│   ├── validate-extraction-bundle.mjs
│   └── lib/
│       └── bundle-utils.mjs
├── schemas/
│   └── extraction-bundle.schema.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── UPSTREAM_ANALYSIS.md
├── examples/
│   └── sample-raw-extraction.json
├── package.json
├── .gitignore
└── LICENSE
```

## 公開ドキュメント

- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- Upstream analysis: [`docs/UPSTREAM_ANALYSIS.md`](./docs/UPSTREAM_ANALYSIS.md)

## ライセンス

MIT License. See [`LICENSE`](./LICENSE).
