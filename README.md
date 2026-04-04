# 🎬 루키즈 (Rookiz)

> 만 13세 미만 아이들을 위한 키즈 OTT 서비스

## 프로젝트 소개

루키즈는 **키즈(4~7세)**와 **주니어(8~12세)** 연령대에 맞춘 안전한 영상 콘텐츠 플랫폼입니다.  
AI 가이드 캐릭터 **'루'**가 아이들의 취향에 맞는 콘텐츠를 추천하고, **눈 보호(Eye Guard)** 기능으로 적정 시청 거리를 안내합니다.

## 주요 기능

- **연령별 맞춤 콘텐츠** — 키즈/주니어 모드에 따라 콘텐츠 필터링 및 UI 전환
- **AI 챗봇 '루'** — HuggingFace Qwen2.5-72B 기반 맞춤 콘텐츠 추천
- **Eye Guard** — MediaPipe 얼굴 감지를 활용한 시청 거리 보호 기능
- **글로벌 영어 콘텐츠** — 영어 애니메이션으로 자연스러운 언어 학습
- **프로필 관리** — 다중 프로필 + PIN 인증 기반 연령 제한
- **비디오 플레이어** — react-player 기반 커스텀 컨트롤 UI

## 기술 스택

| 영역 | 기술 |
|------|------|
| **프론트엔드** | React 19, Vite, Tailwind CSS v4, React Router v7, Axios |
| **백엔드** | Python FastAPI |
| **AI** | HuggingFace Qwen2.5-72B-Instruct |
| **API** | TMDB API |
| **배포** | Render |

## 프로젝트 구조

```
Rookiz/
├── frontend/          # React 19 + Tailwind CSS v4
│   ├── src/
│   │   ├── api/       # TMDB API 호출
│   │   ├── components/# 공용 컴포넌트 (Nav, Card, Footer 등)
│   │   ├── context/   # 전역 상태 (Profile, MovieModal, Mission)
│   │   ├── hooks/     # 커스텀 훅 (useEyeGuard 등)
│   │   ├── pages/     # 페이지 (Main, Detail, Category, Search 등)
│   │   └── styles/    # Tailwind 토큰 및 글로벌 스타일
│   └── public/
└── backend/           # Python FastAPI + AI 챗봇
    └── main.py
```

## 시작하기

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

### 백엔드

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 환경 변수

```
# frontend/.env
VITE_TMDB_API_KEY=your_tmdb_api_key

# backend/.env
HF_TOKEN=your_huggingface_token
```

## 팀 정보

- **팀 규모**: 3명
- **개발 기간**: 2026.03.24 ~ 2026.04.03 (9일)
- **개발 방식**: Gemini CLI / Claude CLI 바이브 코딩
- **디자인 도구**: Google Stitch, Figma
