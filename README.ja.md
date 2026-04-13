# Frontend Distill

`Frontend Distill` は、実在する Web サイトのフロントエンドを AI が再利用しやすい資産へ蒸留するための skill + toolchain です。

このプロジェクトが扱うのは色やタイポグラフィだけではありません。主に次の 3 層を一緒に扱います。

- 視覚デザイン
- レイアウト構造
- レスポンシブ挙動

そのため、AI に「似た雰囲気」だけではなく、「構造的にもそれらしい」UI を作らせることを目指しています。

## 主な出力

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## 使い方の流れ

1. ブラウザで対象サイトを開く
2. [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js) を実行する
3. 抽出 JSON を正規化ツールへ渡す
4. skill `frontend-distill` で再利用する

## 参照

- [简体中文 README](./README.md)
- [English README](./README.en.md)
