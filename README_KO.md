<div align="center">
  <h1>Frontend Distill</h1>
  <h2>웹 프론트엔드를 AI가 재사용할 수 있는 시스템 자산으로 증류합니다</h2>
  <h3>frontend-distill skill</h3>
  <p>스타일만 추출하지 않습니다. 구조, 리듬, 반응형 제약까지 다룹니다.</p>
  <p>AI에게 “어떻게 보여야 하는가”뿐 아니라 “어떻게 배치되고 접혀야 하는가”도 전달합니다.</p>

  <p>
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Claude%20Code-Skill-blue" alt="Claude Code Skill" />
    <img src="https://img.shields.io/badge/Frontend-Distill-black" alt="Frontend Distill" />
  </p>

  <p>
    Other Languages / 다른 언어:
    <a href="./README.md">简体中文</a> ·
    <a href="./README_EN.md">English</a> ·
    <a href="./README_JA.md">日本語</a> ·
    <a href="./README_ES.md">Español</a>
  </p>
</div>

`Frontend Distill`는 실제 웹사이트를 AI가 더 안정적으로 재사용할 수 있는 프론트엔드 자산으로 변환하기 위한 오픈소스 skill + toolchain입니다.

이 프로젝트는 단순한 CSS 덤프도 아니고, 시각 레퍼런스용 README 하나를 더 만드는 작업도 아닙니다.  
사이트의 표면에서 재사용 가능한 제약을 추출하고, 그것을 AI가 읽기 쉬운 형태로 다시 정리하는 것이 목적입니다.

이 README의 구성 리듬은 Hua Shu의 오픈소스 문서 방식에서 영감을 받았지만, 제목, 어조, 설명 구조는 `Frontend Distill`에 맞게 새로 작성했습니다.

---

## 해결하려는 문제

[`awesome-design-md`](https://github.com/VoltAgent/awesome-design-md)는 `DESIGN.md`가 시각 스타일을 AI에게 전달하는 데 매우 유용하다는 점을 보여주었습니다.

하지만 실제로 더 자주 문제가 되는 것은 색상이 비슷하지 않은 것이 아니라 다음과 같은 부분입니다.

- 페이지 골격이 불안정하다
- 섹션 리듬이 약하다
- 데스크톱에서 화면이 답답하다
- 모바일 스택이 어색하다
- CTA, 네비게이션, 본문 구조를 모델이 임의로 결정한다

즉, 많은 자료가 “어떻게 보여야 하는지”는 전달하지만, “페이지를 어떻게 구성해야 하는지”는 충분히 명시하지 못합니다.

`Frontend Distill`는 바로 그 빈틈을 메우기 위해 만들어졌습니다.

## 프로젝트의 위치

이 프로젝트는 단순한 추출기가 아니라 세 가지의 결합입니다.

- 정밀 프롬프트로 구동되는 skill
- 결정적으로 추출과 정규화를 수행하는 도구
- AI 재사용에 맞춰 설계된 출력물

반복 작업은 스크립트가 맡고, 판단이 필요한 부분만 모델이 담당하도록 만드는 것이 핵심입니다.

## 핵심 산출물

`Frontend Distill`는 현재 네 가지 산출물을 중심으로 구성되어 있습니다.

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

이 네 가지는 서로 역할이 다릅니다.

- Markdown은 사람과 AI 모두를 위한 상위 설명
- JSON은 도구와 워크플로를 위한 저모호성, 저토큰 구조 입력

## 왜 토큰을 절약하는가

긴 프롬프트만으로 AI에게 사이트를 보게 하고, 시스템을 추론하고, 직접 요약하게 하면 보통 다음 문제가 생깁니다.

- 흐름이 흔들린다
- 랜덤성이 높아진다
- 토큰 사용량이 커진다

이 프로젝트는 그 반대로 설계되었습니다.

- 프롬프트는 오케스트레이션과 제약만 담당
- 스크립트는 추출, 군집화, 중복 제거, 트리밍 담당
- AI는 마지막에 정리된 결과만 읽는다

그래서 일회성 분위기 프롬프트보다, 프론트엔드 증류 파이프라인에 가깝습니다.

## 설치

먼저 저장소를 clone 합니다.

```bash
git clone <your-repo-url>
cd frontend-distill
```

의존성을 설치합니다.

```bash
npm install
```

skill을 로컬 skills 디렉터리에 설치하려면:

```bash
npm run skill:install -- --target "C:\\Users\\your-name\\.claude\\skills"
```

agent가 저장소 경로에서 skill을 직접 읽을 수 있다면 다음 경로를 바로 사용할 수도 있습니다.

- [`skill/frontend-distill`](./skill/frontend-distill)

## 사용 흐름

1. 브라우저 또는 브라우저 접근 권한이 있는 agent로 대상 사이트를 엽니다.
2. 페이지 콘솔에서 [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js)를 실행합니다.
3. 생성된 JSON을 정규화, 검증, 분리 도구에 전달합니다.
4. 결과 bundle, tokens, Markdown 가이드를 `frontend-distill` skill에 넘깁니다.

예시 명령:

```bash
npm run bundle:normalize -- --input ./examples/sample-raw-extraction.json --output ./output/extraction-bundle.json
npm run bundle:validate -- --input ./output/extraction-bundle.json
npm run bundle:split -- --input ./output/extraction-bundle.json --design-output ./output/design-tokens.json --layout-output ./output/layout-tokens.json
```

## 무엇을 증류하는가

프론트엔드 시스템은 한 층으로 설명되지 않습니다. 현재 프로젝트는 다섯 층을 대상으로 합니다.

층 | 주요 내용 | 의미
--- | --- | ---
Visual | 색상, 타이포그래피, 그림자, 라운드, 장식 효과 | 스타일 유사도를 결정
Component | 버튼, 카드, 입력창, 내비게이션, 태그, 변형 | 컴포넌트 디테일 안정화
Layout | 컨테이너, 그리드, 섹션 리듬, 읽기 폭, 페이지 골격 | 화면 호흡과 구조를 결정
Responsive | 브레이크포인트, 접힘 규칙, 간격 압축, 내비 변화, viewport 증거 | 여러 기기에서 유지되는지 결정
Reuse | `DESIGN.md`, `LAYOUT.md`, 구조화된 tokens | AI가 저비용으로 재사용 가능한지 결정

앞의 두 층만 있으면 AI는 “비슷해 보이는 UI”를 만들 가능성이 큽니다.  
나머지 세 층까지 명시되면 구조적으로도 더 설득력 있는 결과를 기대할 수 있습니다.

## 작동 방식

`Frontend Distill`는 대상 사이트에 대해 네 단계로 동작합니다.

1. 프론트엔드 증거 수집  
   visual token, component sample, layout signal, responsive clue, CSS variable, decorative effect, state 관련 정보를 수집합니다.

2. 원시 결과 정규화  
   색상, 간격값, style signature, component variant를 중복 제거하고, 군집화하고, 트리밍하고, 표준화합니다.

3. 재사용 가능한 산출물 생성  
   `extraction-bundle`을 만들고, 이를 `design-tokens.json`과 `layout-tokens.json`으로 나누며, `DESIGN.md`와 `LAYOUT.md` 입력도 준비합니다.

4. skill이 결과 소비  
   skill은 먼저 구조화된 summary와 tokens를 읽고, 그 다음 Markdown 가이드를 읽어 자유로운 추측과 토큰 낭비를 줄입니다.

## 이미 포함된 것

현재 저장소에는 이미 다음이 포함되어 있습니다.

- repo 내부 skill
- 브라우저 추출 스크립트
- 정규화, 검증, 분리 도구
- 구조화 schema
- `DESIGN.md` 가이드
- `LAYOUT.md` 가이드
- 상위 프로젝트 분석 문서

즉, 이것은 단순한 프롬프트 아이디어가 아니라 실제로 사용할 수 있는 skill toolchain의 기반입니다.

## 정직한 경계

이 프로젝트는 일부 경계를 분명하게 유지합니다.

- 공개 렌더링 결과를 읽는 것이지, 비공개 디자인 원본을 읽는 것은 아닙니다
- 반복되는 프론트엔드 패턴 추출에는 강하지만, 비즈니스 전략이나 브랜드 의도 이해가 목적은 아닙니다
- 구조 증거를 기록할 수는 있어도, 모든 인터랙션 상태를 한 번에 포착한다고 보장하지는 않습니다
- 다중 viewport 반응형 수집은 브라우저 기능이 있는 agent와 함께 사용할 때 더 강력합니다

이 한계를 명확히 적는 것이 오히려 결과를 더 신뢰할 수 있게 만듭니다.

## 저장소 구조

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

## 공개 문서

- Architecture: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- Roadmap: [`docs/ROADMAP.md`](./docs/ROADMAP.md)
- Upstream analysis: [`docs/UPSTREAM_ANALYSIS.md`](./docs/UPSTREAM_ANALYSIS.md)

## 라이선스

MIT License. See [`LICENSE`](./LICENSE).
