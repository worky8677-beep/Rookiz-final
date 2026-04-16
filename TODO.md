# 📋 Rookiz 프로젝트 코드 품질 검사 TODO 리스트

## 🚨 즉시 오류 (ERROR)
- [ ] **Nav.jsx 컴포넌트 분리**
    - `PinModal`, `AddProfileModal`, `NavProfile`을 `src/components/` 하위 개별 파일로 분리
    - 모든 공용 컴포넌트에 **named export** 적용 (`export function ...`)

## ⚠️ 경고 (WARNING)
- [ ] **디자인 토큰 정교화 및 임의값(`[]`) 제거**
    - `tokens.css`에 미등록된 값들을 `@theme` 블록에 추가
        - `z-index` (60, 100, 200 등)
        - `border-radius` (27px 등)
        - `animation` 및 `keyframes` (slideUp 등)
    - JSX 내의 `top-[...]`, `w-[...]` 등 하드코딩된 임의값 클래스 교체

## ℹ️ 개선 (INFO)
- [ ] **미사용 코드 및 로직 최적화**
    - `MainPage.jsx` 내 사용되지 않는 `trending` 상태 및 API 호출 삭제
    - 기타 컴포넌트 내 미사용 import 및 변수 전수 조사 후 삭제

## 🛠️ 리팩터링 (REFACTOR)
- [ ] **거대 컴포넌트 쪼개기**
    - `NavProfile`의 비즈니스 로직(프로필 전환, PIN 검증)과 UI 렌더링 분리
    - 함수 본문 50줄 이내 유지 원칙 준수
- [ ] **상수 데이터 외부화**
    - `MainPage.jsx`의 `CHARACTERS` 배열 등 하드코딩된 데이터를 `src/constants/`로 분리

## 🧹 정리 (CLEANUP)
- [ ] **불필요한 주석 삭제**
    - 코드의 의도가 명확한 섹션 구분 주석(`/* ── ... ── */`) 삭제
    - 개발 완료된 TODO 또는 테스트용 주석 삭제

---

### 📊 최종 품질 점수: 82/100
**요약:** 디자인 시스템 준수 상태는 양호하나, 유지보수성을 위해 `Nav.jsx` 모듈화와 테일윈드 v4 토큰화 작업이 우선적으로 필요함.
