# 🎬 Rookiz (루키즈) - Kids OTT Platform

<p align="center">
  <img src="frontend/public/LOGO.svg" width="200" alt="Rookiz Logo" />
</p>

> **"우리 아이를 위한 가장 안전한 놀이터"**  
> 만 13세 미만 아이들을 위한 맞춤형 키즈 OTT 서비스입니다.

---

## ✨ 프로젝트 개요

루키즈는 아이들의 연령대(**키즈 4~7세** / **주니어 8~12세**)에 따라 최적화된 콘텐츠와 인터페이스를 제공합니다.  
단순한 시청을 넘어, AI 가이드 캐릭터 **'루'**와 상호작용하고 **MediaPipe 기반의 시력 보호** 기술로 건강한 시청 습관을 만들어줍니다.

---

## 🚀 주요 핵심 기능 (Key Features)

### 👶 연령별 맞춤 UI/UX
- **모드 전환:** 프로필 선택에 따른 키즈/주니어 전용 테마 및 콘텐츠 필터링
- **직관적 인터페이스:** 텍스트 최소화 및 아이콘 중심의 쉬운 내비게이션

### 🤖 AI 가이드 '루(Roo)'
- **지능형 추천:** HuggingFace Qwen2.5 기반, 아이의 취향과 시청 패턴 분석
- **대화형 인터페이스:** 챗봇 형태의 대화를 통한 콘텐츠 탐색 가이드

### 👁️ 스마트 시력 보호 (Eye Guard)
- **실시간 거리 감지:** MediaPipe 얼굴 감지 기술 활용
- **자동 알림:** 화면과 너무 가까워지면 시청 제한 및 안내 메시지 출력
- **보호자 설정:** 눈 보호 모드 활성화/비활성화 제어

### 📺 프리미엄 비디오 플레이어
- **커스텀 컨트롤:** 아이들이 조작하기 쉬운 버튼 배치 및 직관적인 타임라인
- **자막/음성 지원:** 다국어 애니메이션 콘텐츠를 통한 자연스러운 언어 학습

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework:** `React 19`, `Vite`
- **Styling:** `Tailwind CSS v4 (Alpha)`, `CSS Tokens`
- **State Management:** `React Context API`
- **Routing:** `React Router v7`
- **Visuals:** `MediaPipe Face Detection`, `Framer Motion`

### Backend & AI
- **Framework:** `Python FastAPI`
- **AI Model:** `HuggingFace Qwen2.5-72B-Instruct`
- **External API:** `TMDB (The Movie Database) API`

### Infrastructure
- **Deployment:** `Render`
- **Design Tools:** `Figma`, `Google Stitch`

---

## 📂 프로젝트 구조 (Architecture)

```bash
Rookiz/
├── 🎨 frontend/          # React 19 + Tailwind CSS v4
│   ├── src/
│   │   ├── api/          # API 통신 로직 (Axios)
│   │   ├── components/   # 재사용 가능한 UI 컴포넌트
│   │   ├── context/      # Profile, Movie, Mission 전역 상태
│   │   ├── hooks/        # 시력 보호(useEyeGuard) 등 커스텀 훅
│   │   ├── pages/        # 메인, 상세, 카테고리, 검색 페이지
│   │   └── styles/       # 디자인 시스템 및 테마 설정
│   └── public/           # 에셋 (로고, 비디오, 캐릭터)
└── ⚙️ backend/           # Python FastAPI + AI 챗봇 서비스
    └── main.py           # 추천 엔진 및 캐릭터 AI 로직
```

---

## ⚙️ 실행 방법 (Getting Started)

### 1. Repository Clone & Setup
```bash
# 로컬 환경으로 이동
cd Rookiz-final
```

### 2. Frontend 실행
```bash
cd frontend
npm install
npm run dev
```

### 3. Backend 실행
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 👥 팀 정보 및 개발 방식

- **개발 기간:** 2026.03.24 ~ 2026.04.03 (9일)
- **개발 도구:** **Gemini CLI** & **Claude CLI**를 활용한 고도화된 바이브 코딩 (AI-Native Development)
- **협업 모델:** AI 에이전트와 인간 개발자의 긴밀한 페어 프로그래밍

---

<p align="center">
  © 2026 Rookiz Team. All rights reserved.
</p>

