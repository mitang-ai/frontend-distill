<div align="center">
  <h1>Frontend Distill</h1>
  <h2>把网站前端，蒸馏成 AI 可复用系统</h2>
  <h3>前端蒸馏.skill</h3>
  <p>不只提取颜色，更提取结构。</p>
  <p>把真实网站的视觉、布局、响应式行为，整理成 AI 能稳定复用的前端资产。</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    其他语言 / Other Languages:
    <a href="./README.en.md">English</a> ·
    <a href="./README.ja.md">日本語</a> ·
    <a href="./README.ko.md">한국어</a> ·
    <a href="./README.es.md">Español</a>
  </p>
</div>

`Frontend Distill` 是一个开源的前端蒸馏.skill + 工具链，用来把真实网站蒸馏成 AI 可复用的前端资产。

它不是只提取颜色、字体、按钮样式，而是试图同时蒸馏三层：

- 视觉设计
- 布局结构
- 响应式行为

这样，AI 不只是“做得像”，还更有机会“排得对”。

本 README 的写作组织方式参考了花叔的项目表达风格，但标题表达、项目叙事与内容组织已经按当前项目重新设计。

---

## 为什么做这个项目

像 [`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) 和 [`getdesign.md`](https://getdesign.md/) 这样的项目，已经证明了 `DESIGN.md` 很适合给 AI 传递风格系统。

但它们更像是：

- 风格系统
- 视觉约束
- 组件气质

而不是：

- 页面结构系统
- 布局骨架系统
- 响应式约束系统

于是经常出现这种结果：

- 颜色、字体、组件很像
- 页面结构却拥挤、失衡、移动端不自然

`Frontend Distill` 想解决的就是这个问题。

## 它是什么

`Frontend Distill` 是：

- 一个精准提示词驱动的 skill
- 一组负责确定性提取和整理的工具
- 一套输出 AI 可复用资产的流程

最终目标不是“抓一堆 CSS 值”，而是生成可复用的前端系统资产：

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## 安装

先 clone 仓库：

```bash
git clone <your-repo-url>
cd frontend-distill
```

把 skill 安装到本地 skills 目录：

```bash
npm run skill:install -- --target "C:\\Users\\你的用户名\\.claude\\skills"
```

如果你只是想让 agent 直接读取本仓库里的前端蒸馏.skill，也可以直接使用：

- [`skill/frontend-distill`](./skill/frontend-distill)

## 快速使用

浏览器里打开目标网站后，在控制台运行：

- [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js)

把得到的 JSON 丢给工具链：

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

然后在支持 skill 的 agent 环境里使用 `frontend-distill`。

## 它蒸馏了什么

前端系统不是一层东西。这个项目当前按五层来蒸馏：

层次 | 提取内容 | 为什么重要
--- | --- | ---
视觉层 | 颜色、字体、阴影、圆角、装饰效果 | 决定“像不像”
组件层 | 按钮、卡片、输入框、导航、标签及其变体 | 决定 UI 细节是否稳定
布局层 | 容器、栅格、区块节奏、阅读宽度、页面骨架 | 决定页面是否舒展、合理
响应式层 | 断点、折叠、压缩、导航变化、当前 viewport 证据 | 决定桌面和移动端是否成立
复用层 | `DESIGN.md`、`LAYOUT.md`、结构化 tokens | 决定 AI 能不能低成本复用

如果只蒸馏前两层，AI 往往会“做得像”。  
加上后三层，AI 才更可能“做得对”。

## 诚实边界

这个项目明确有边界：

- 它读取的是公开渲染结果，不是私有设计系统
- 它擅长提取重复规律，不擅长理解产品战略意图
- 它可以捕捉结构证据，但不保证一次就完整覆盖所有交互状态
- 多 viewport 的响应式证据目前仍然更适合多次提取或浏览器型 agent 配合完成

一个不写清楚边界的蒸馏工具，不值得信任。

## 工作原理

输入一个网站后，`Frontend Distill` 做四件事：

1. 提取前端证据  
   提取视觉 token、组件样本、布局证据、响应式证据、装饰效果、伪状态、CSS 变量。

2. 标准化整理  
   去重、聚类、裁剪，把原始结果变成统一 bundle。

3. 输出复用资产  
   拆出 `design-tokens.json`、`layout-tokens.json`，并为生成 `DESIGN.md` / `LAYOUT.md` 做准备。

4. 交给 skill 消费  
   skill 优先读 summary 和结构化 tokens，再读 Markdown 规范，减少 token 浪费和自由发挥。

## 当前已经具备什么

目前仓库已经具备：

- repo 内置 skill
- 提取脚本
- bundle 标准化、校验、拆分工具
- 结构化 schema
- `DESIGN.md` 规范
- `LAYOUT.md` 规范
- 上游项目分析

也就是说，它已经不是一组零散提示词，而是一条能跑通的 skill 工具链雏形。

## 仓库结构

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

## 公开文档

- 架构: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- 路线图: [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- 上游分析: [`docs/UPSTREAM_ANALYSIS.md`](./docs/UPSTREAM_ANALYSIS.md)

## 许可证

MIT License. See [`LICENSE`](./LICENSE).
