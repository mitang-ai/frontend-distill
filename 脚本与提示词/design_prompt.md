# DESIGN.md 生成提示词

> 将网站截图和提取的设计 token 数据喂给 AI，用以下提示词生成标准 DESIGN.md 文件。

---

## 提示词

```
你是一位资深 UI 设计系统专家。请根据我提供的网站截图和设计 token JSON 数据，生成一份完整的 DESIGN.md 文件。

严格按照以下 9 个章节结构输出，每个章节都必须包含：

## 1. Visual Theme & Atmosphere
描述网站的整体视觉氛围、设计哲学和情绪基调。包括：
- 整体风格定位（极简/奢华/技术感/友好等）
- 色彩情绪（冷调/暖调/中性）
- 信息密度（稀疏/适中/密集）
- 最具辨识度的 3-5 个视觉特征（用 **Key Characteristics** 列表呈现）

## 2. Color Palette & Roles
列出所有颜色并标注语义角色，按以下分组：
- **Primary**：主色、标题色、背景色（格式：`**名称** (\`#hex\`): 用途说明`）
- **Brand & Dark**：品牌深色、暗色模式色
- **Accent Colors**：强调色、装饰色
- **Interactive**：链接、hover、active、focus 状态色
- **Neutral Scale**：灰度体系、正文色、标签色
- **Surface & Borders**：边框色、分割线色
- **Shadow Colors**：阴影用色（含 rgba 值）

## 3. Typography Rules
### Font Family
列出主字体、辅助字体、等宽字体及其 fallback。
### Hierarchy
用表格呈现完整字体层级：
| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
每个层级都要有具体数值，不要用模糊描述。
### Principles
总结 3-5 条排版设计原则。

## 4. Component Stylings
逐一描述以下组件的完整样式（包含所有状态）：
- **Buttons**：每种按钮变体（Primary/Secondary/Ghost/Disabled），含 bg、text、padding、radius、border、hover 状态
- **Cards & Containers**：bg、border、radius、shadow、hover 效果
- **Badges / Tags / Pills**：bg、text、padding、radius、border、font-size
- **Inputs & Forms**：border、radius、focus 状态、label/placeholder 样式
- **Navigation**：布局、字体、间距、CTA 位置、移动端处理
- **Decorative Elements**：渐变、装饰线、特殊视觉效果

## 5. Layout Principles
- **Spacing System**：基础单位和完整间距刻度
- **Grid & Container**：最大宽度、栅格列数、典型布局模式
- **Whitespace Philosophy**：留白策略和设计意图
- **Border Radius Scale**：从小到大的圆角刻度表

## 6. Depth & Elevation
用表格呈现阴影层级系统：
| Level | Treatment | Use |
从 Level 0（无阴影）到最高层级，每级给出完整 box-shadow 值。
附加 **Shadow Philosophy** 段落解释阴影设计理念。

## 7. Do's and Don'ts
### Do
列出 8-10 条必须遵守的设计规则，每条要具体到数值。
### Don't
列出 8-10 条禁止事项，解释为什么不能这样做。

## 8. Responsive Behavior
- **Breakpoints**：用表格列出断点名称、宽度范围、关键变化
- **Touch Targets**：触摸目标尺寸要求
- **Collapsing Strategy**：各组件在不同断点的降级策略
- **Image Behavior**：图片在响应式下的处理方式

## 9. Agent Prompt Guide
- **Quick Color Reference**：快速颜色查找表（角色 → 色值）
- **Example Component Prompts**：3-5 个可直接使用的组件生成提示词，每个都包含完整的样式参数
- **Iteration Guide**：5-8 条给 AI agent 的迭代指南

## 输出要求

1. 所有颜色必须给出精确 HEX 值（如 `#533afd`），不要用模糊描述
2. 所有尺寸必须给出精确 px/rem 值
3. 阴影必须给出完整 CSS box-shadow 值
4. 字体必须给出完整 font-family 含 fallback
5. 如果 JSON 数据和截图有冲突，以 JSON 中的精确数值为准，以截图的视觉判断为辅
6. 用 Markdown 格式输出，标题用 ## 开头
7. 文件开头第一行为：# Design System Inspired by [网站名称]
```

---

## 使用流程

1. 打开目标网站，截取完整页面截图（首页 + 1-2 个典型内页）
2. 在浏览器 Console 中运行 `extract_design_tokens.js`，复制输出的 JSON
3. 将截图和 JSON 一起发给 AI，附上上面的提示词
4. 审查生成的 DESIGN.md，对照网站微调不准确的地方
5. 将 DESIGN.md 放入项目根目录，告诉 AI agent 参考它来生成 UI
