# CLAUDE.md — 루키즈 (Rookids) 키즈 OTT 서비스

## 규칙 (최우선 적용)

1. **한국어로만 응답** (영어 응답 금지)
2. **식별자는 짧게** 작성
3. **단계별로 작업 수행** (한 번에 하나씩)

---

## 프론트엔드 코딩 규칙 (반드시 준수)

### 언어 & 라이브러리
- 파일 확장자는 `.jsx` / `.js` — TypeScript 사용 금지
- 아이콘은 `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` 사용 (`@iconify` 금지)
- React Router v7 **data API** 문법 준수: `react-router`에서 import, `createBrowserRouter` + `RouterProvider` 사용
  - `<BrowserRouter>`, `<Routes>`, `<Route>` 구식 패턴 사용 금지
- 라우터 설정(`createBrowserRouter`)은 `main.jsx`에서 정의하고 `RouterProvider`를 직접 렌더링한다
- `App.jsx`는 API·컴포넌트 브릿지 역할: `<Outlet />`으로 자식 라우트를 렌더링하며, 전역 상태·컨텍스트·공통 레이아웃은 여기서 제공한다

### Export 규칙
- `src/components/common/` 하위 컴포넌트는 **named export** 사용 (`export function Foo`)
  - `export default` 금지
  - import 시 반드시 중괄호 사용: `import { Nav } from '../components/common/Nav'`
- 페이지(`src/pages/`) 및 기타 파일은 `export default function` 사용
- barrel 파일(`index.js`, `index.jsx`) 생성 금지

### Tailwind CSS v4
- **v4 전용 문법만 사용** — v3 하위 호환 고려 안 함
- **하드코딩 금지**
- **유틸리티 클래스 우선**: 디자인 토큰에 있는 색상·크기는 반드시 클래스로 표현
  - 불투명도 조합: `bg-gray-950/60`, `bg-white/12` 등
  - 그라디언트: `bg-linear-[각도] from-* to-*`
  - 토큰에 없는 값 처리 순서:
    1. `@theme` 블록에 토큰 선언 후 유틸리티 클래스 사용
    2. CSS 변수(`--var-name`)로 선언 후 `var()` 참조
    3. 위 두 방법이 불가한 경우에만 arbitrary 값 `[]` 허용
- `tailwind-merge`로 클래스 충돌 방지

### CSS 파일 구조
- 모든 CSS 파일은 `src/styles/` 폴더에서 관리
  - `src/styles/index.css` — 폰트 import, Tailwind, base 스타일
  - `src/styles/tokens.css` — `@theme` 디자인 토큰
- `main.jsx`에서 `import "./styles/index.css"` 로 진입
- 폰트는 HTML `<link>` 금지 — 반드시 `index.css`의 `@import url(...)` 방식으로 로드

### 폰트
- 폰트 로드: `src/styles/index.css` 상단 `@import url(...)` (HTML `<link>` 금지)
- Pretendard: `pretendardvariable.min.css` CDN import
- Poppins: Google Fonts CDN import
- 폰트 패밀리 토큰은 `--font-*` 명명 (`--font-family-*` 금지 — v4에서 유틸리티 클래스 미생성)
  - `--font-sans`: Pretendard 전체 폴백 스택
  - `--font-poppins`: Poppins

### 타이포그래피 토큰 구조
- 텍스트 크기는 `--text-*` + `--text-*--line-height` 쌍으로 선언 (자동 line-height 적용)
- 독립 line-height 클래스: `leading-2`(20px) / `leading-4`(28px) / `leading-6`(36px) / `leading-8`(48px) / `leading-10`(60px)

---

## 프로젝트 개요

**프로젝트명:** 루키즈 (Rookids) — 만 13세 미만 아이들을 위한 OTT 서비스
**기간:** 2026.03.24(화) ~ 2026.04.03(금) | 주말 제외 총 9일
**주요 타겟:** 키즈 (만 4–7세) / 주니어 (만 8–12세)
**AI 캐릭터:** AI 가이드 '루' — 친절하고 활기차게 맞춤 콘텐츠 추천

---

## 팀 구성 & 숙련도

- 팀 구성 : 3명
- 코딩 숙련도: **초급**
- **디자인 역량 80% / 코딩 역량 20%**
- 코드 구현은 **Gemini CLI / Claude CLI 바이브 코딩**으로 수행

---

## 기술 스택

### 기획 & 디자인
- Google Stitch (자연어 UI 아이데이션)
- Figma (디자인 시스템)

### 프론트엔드
- React 19
- vite
- react-complier
- Tailwind CSS v4
- React Router v7
- react-player
- Axios
- FontAwesome
- tailwind-merge

### 백엔드 & AI
- Python FastAPI
- HuggingFace Qwen2.5-72B-Instruct
- TMDB API
- 생성형 AI 비디오

### 인프라 & 도구
- Gemini CLI (Git + 바이브 코딩)
- Claude CLI (바이브 코딩)
- Render (배포)
- 모노레포 구조: `frontend/` + `backend/`

---

## 수행 프로세스 (총 9일)

| 단계 | 기간 | 내용 |
|------|------|------|
| 기획 | 2일 | 서비스 방향성 및 요구사항 정의 |
| 디자인 | 3일 | UI/UX 디자인 및 디자인 시스템 구축 |
| 구현 | 3일 | 프론트엔드 및 백엔드 개발 (Gemini CLI / Claude CLI 활용) |
| 검토 + 배포 | 1일 | 최종 테스트 및 Render 배포 |

---

## 핵심 워크플로우
```
Stitch 자연어 UI 생성
    ↓
Figma 내보내기 + 다듬기
    ↓
Gemini CLI / Claude CLI로 React 코드 생성
    ↓
Render 배포
```

---

## 배포 구조
```
monorepo/
├── frontend/   # React 19 + Tailwind CSS v4
└── backend/    # Python FastAPI + AI
```

배포 플랫폼: **Render**

---

## 바이브 코딩 가이드라인

> Gemini CLI 또는 Claude CLI에 자연어로 지시하고,
> 생성된 코드를 반드시 검토한 뒤 커밋하는 흐름을 유지하세요.

- 컴포넌트 단위로 작업 요청할 것
- Tailwind 클래스는 `tailwind-merge`로 충돌 방지
- API 호출은 Axios + TMDB API 기준으로 통일
- FastAPI 엔드포인트 변경 시 프론트/백 동시 확인
- 코드 생성 후 반드시 동작 확인 후 다음 단계로 진행
