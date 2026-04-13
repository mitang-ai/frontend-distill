<div align="center">
  <h1>Frontend Distill</h1>
  <h2>把网页前端蒸馏成 AI 可复用的系统资产</h2>
  <h3>前端蒸馏.skill</h3>
  <p>不只提取样式，还提取结构、节奏与响应式约束。</p>
  <p>让 AI 读到的不只是“长什么样”，还有“该怎么排、怎么收、怎么复用”。</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    其他语言 / Other Languages:
    <a href="./README_EN.md">English</a> ·
    <a href="./README_JA.md">日本語</a> ·
    <a href="./README_KO.md">한국어</a> ·
    <a href="./README_ES.md">Español</a>
  </p>
</div>

`Frontend Distill` 是一个开源的前端蒸馏.skill + 工具链，用来把真实网站整理成 AI 更容易复用的前端系统资产。

它不是“抓一堆 CSS 值”，也不是“只做一个更花哨的 DESIGN.md”。  
它的目标是把网站前端拆成可以复用的约束，再把这些约束重新组合成更适合 AI 消费的输出。

本 README 的组织方式参考了花叔常见的开源写法，但标题、节奏、项目表达与结构已经按 `Frontend Distill` 重新编排。

---

## 它想解决什么问题

[`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) 已经证明了 `DESIGN.md` 很适合把视觉风格交给 AI。

但真实项目里，问题往往不在“颜色像不像”，而在：

- 页面骨架不稳
- 区块节奏不对
- 桌面端拥挤
- 手机端堆叠失衡
- CTA、导航、内容区的结构关系靠模型自由发挥

换句话说，很多资料能告诉 AI “界面应该长什么样”，却没有足够明确地告诉它 “页面应该怎么组织”。

`Frontend Distill` 就是为了解决这个缺口。

## 项目定位

这个项目不是单纯的提取器，而是三层组合：

- 精准提示词驱动的 skill
- 负责确定性采集与整理的工具
- 面向 AI 复用的结构化产物

它的目标不是让模型自己猜，而是尽可能把重复劳动交给脚本，把高价值判断留给模型。

## 最终产物

`Frontend Distill` 目前围绕四类核心产物工作：

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

这四者分工不同：

- Markdown 负责给人和 AI 提供高层说明
- JSON 负责给工具和 agent 提供低歧义、低 token 的结构化输入

## 为什么它更省 tokens

如果只靠长提示词让 AI 看网页、读样式、自己总结，通常会有三个问题：

- 流程容易漂
- 随机性高
- token 消耗大

这个项目的思路正好相反：

- 提示词只做编排和约束
- 脚本负责提取、聚类、去重、裁剪
- AI 最后只读取整理后的结果

所以它更接近一种“前端系统蒸馏流水线”，而不是一次性的 vibe prompt。

## 安装

先 clone 仓库：

```bash
git clone <your-repo-url>
cd frontend-distill
```

安装依赖：

```bash
npm install
```

把 skill 安装到本地 skills 目录：

```bash
npm run skill:install -- --target "C:\\Users\\你的用户名\\.claude\\skills"
```

如果你的 agent 支持直接从仓库路径加载 skill，也可以直接使用：

- [`skill/frontend-distill`](./skill/frontend-distill)

## 使用流程

1. 用具备网页访问能力的 agent 或浏览器打开目标网站。
2. 在页面控制台运行 [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js)。
3. 将原始 JSON 交给工具链进行标准化、校验与拆分。
4. 把 bundle、tokens 和 Markdown 规范交给 `frontend-distill` skill 消费。

对应命令示例：

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

## 它蒸馏哪些内容

前端系统不是单层结构。当前项目把提取目标拆成五层：

层次 | 主要内容 | 作用
--- | --- | ---
视觉层 | 颜色、字体、阴影、圆角、装饰效果 | 决定风格是否接近
组件层 | 按钮、卡片、输入框、导航、标签及其变体 | 决定组件细节是否稳定
布局层 | 容器、栅格、section 节奏、阅读宽度、页面骨架 | 决定页面是否舒展、合理
响应式层 | 断点、折叠、压缩、导航变化、viewport 证据 | 决定不同设备上是否成立
复用层 | `DESIGN.md`、`LAYOUT.md`、结构化 tokens | 决定 AI 是否能低成本复用

如果只拿到前两层，AI 往往只是“做得像”。  
把后三层也明确下来，AI 才更可能“做得对”。

## 工作原理

面对一个目标网站，`Frontend Distill` 会经历四个阶段：

1. 采集前端证据  
   采集视觉 token、组件样本、布局信息、响应式线索、CSS 变量、装饰效果与状态信息。

2. 整理原始结果  
   对颜色、间距、样式签名、组件变体做去重、聚类、裁剪与归一化。

3. 生成复用资产  
   输出 `extraction-bundle`，再拆成 `design-tokens.json` 与 `layout-tokens.json`，并为 `DESIGN.md` / `LAYOUT.md` 提供依据。

4. 交给 skill 消费  
   skill 优先读取结构化 summary 与 tokens，再读取 Markdown 规范，从而减少自由发挥和 token 浪费。

## 当前已经具备什么

仓库当前已经包含：

- repo 内置 skill
- 浏览器提取脚本
- bundle 标准化、校验、拆分工具
- 结构化 schema
- `DESIGN.md` 参考规范
- `LAYOUT.md` 参考规范
- 上游分析文档

也就是说，它已经不只是一个提示词想法，而是一条可以跑通的 skill 工具链。

## 诚实边界

这个项目有意识地保留了边界：

- 它读取的是公开渲染结果，不是私有设计源文件
- 它擅长提取重复规律，不擅长理解品牌战略或业务目标
- 它可以记录结构证据，但未必一次就覆盖所有交互态
- 多 viewport 的响应式采样仍然适合结合浏览器型 agent 进一步增强

把边界写清楚，是为了让输出更可信，而不是把能力说得过满。

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
