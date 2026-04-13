# Frontend Distill

`Frontend Distill`는 실제 웹사이트의 프론트엔드를 AI가 재사용하기 쉬운 자산으로 증류하기 위한 skill + toolchain 프로젝트입니다.

이 프로젝트는 단순히 색상이나 타이포그래피만 추출하지 않습니다. 다음 세 가지 층을 함께 다룹니다.

- 시각 디자인
- 레이아웃 구조
- 반응형 동작

그래서 AI가 단순히 “비슷하게 보이는 UI”가 아니라, 구조적으로도 더 그럴듯한 UI를 만들 수 있도록 돕습니다.

## 주요 산출물

- `DESIGN.md`
- `LAYOUT.md`
- `design-tokens.json`
- `layout-tokens.json`

## 사용 흐름

1. 브라우저에서 대상 사이트를 연다
2. [`tools/browser/extract_design_tokens.js`](./tools/browser/extract_design_tokens.js) 를 실행한다
3. 추출된 JSON을 정규화 도구로 처리한다
4. `frontend-distill` skill로 재사용한다

## 참고 문서

- [简体中文 README](./README.md)
- [English README](./README.en.md)
