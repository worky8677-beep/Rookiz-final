---
description: CLAUDE.md 컨벤션 기준 코드 품질 검사
argument-hint: 파일 경로 (생략 시 현재 파일)
---

$ARGUMENTS 파일을 아래 기준으로 검사한다.

## 검사 항목

**즉시 오류 (ERROR)**
- default export 사용 여부 → named export로 교체
- barrel 파일(index.js) 존재 여부
- TypeScript(.ts/.tsx) 파일 혼입
- 하드코딩 색상값 (#fff, rgb 등) → CSS 변수로 교체
- createBrowserRouter를 main.jsx 외 파일에서 사용

**경고 (WARNING)**
- FontAwesome 외 아이콘 라이브러리 사용
- Tailwind v4 임의값(arbitrary value) 사용 `[px값]`
- 한국어 외 주석 작성
- try/catch 없는 async 함수

**개선 (INFO)**
- 식별자 길이 20자 초과
- 컴포넌트 파일명 대문자로 시작하지 않음

**리팩터링 - React/Tailwind (REFACTOR)**

- 인라인 style 속성 또는 CSS-in-JS 하드코딩 → Tailwind v4 유틸리티 클래스로 교체
  - 감지 패턴: `style={{ ... }}`, `style="..."`, `className="..."` 내 임의값 `[*]`
  - 변환 기준: spacing/color/typography 토큰은 `@theme` 블록의 CSS 변수 우선 적용
  - 예시: `style={{ marginTop: '16px' }}` → `className="mt-4"`

- 동일 JSX 구조가 2회 이상 반복 → 공통 컴포넌트로 추출
  - 감지 패턴: 3줄 이상 동일한 JSX 블록이 같은 파일에 2개 이상 존재
  - 추출 기준: props로 가변 값을 받고, named export 단일 컴포넌트로 분리
  - 예시: 반복되는 `<div className="card">...</div>` → `<Card />` 컴포넌트

- 하드코딩 디자인 토큰(색상·크기·간격)이 컴포넌트 내부에 고정 → props로 외부 주입
  - 감지 패턴: 동일 컴포넌트가 color/size/variant를 내부에서 직접 결정
  - 변환 기준: `variant`, `size`, `color` props를 추가하고 기본값을 구조분해로 지정
  - 예시: `className="text-[--color-primary] text-lg"` 고정 → `color`·`size` prop 수신

**리팩터링 - 보편 (REFACTOR)**

- 함수 길이 50줄 초과 → 단일 책임 원칙에 따라 분리
  - 감지 패턴: 함수/컴포넌트 본문이 50줄을 넘거나 들여쓰기 depth가 3단계 이상
  - 분리 기준: 데이터 가공·UI 렌더·이벤트 핸들러를 각각 별도 함수로 분리
  - 예시: 하나의 함수에서 fetch·가공·상태 갱신을 모두 처리 → `fetchData` / `normalize` / `update`로 분리

- 매직 넘버·매직 문자열 → 상수 선언
  - 감지 패턴: 함수 본문에 의미 불명의 숫자·문자열 리터럴이 직접 사용됨
  - 변환 기준: 파일 상단 또는 별도 `constants.js`에 `const`로 선언, 대문자 스네이크 케이스
  - 예시: `if (status === 3)` → `const PUBLISHED = 3; if (status === PUBLISHED)`

- 중첩 조건문(if/else 3단계 이상) → 얼리 리턴 패턴으로 평탄화
  - 감지 패턴: if-else 또는 삼항 연산자가 3단계 이상 중첩
  - 변환 기준: guard clause(보호절)를 앞에 두고 정상 흐름을 최하단에 배치
  - 예시: `if (a) { if (b) { if (c) { ... } } }` → 각 조건 불만족 시 즉시 return

- 중복 로직 → 유틸 함수로 추출
  - 감지 패턴: 동일한 로직(날짜 포맷·문자열 가공·계산 등)이 2개 이상 파일에 산재
  - 변환 기준: `src/utils/` 하위에 순수 함수로 분리, 단일 책임·단일 입출력 유지
  - 예시: 여러 컴포넌트의 날짜 포맷 로직 → `formatDate(date)` 유틸 함수

- 불필요한 상태(state) 제거 → 파생값(derived value)으로 대체
  - 감지 패턴: 다른 state에서 계산 가능한 값을 별도 useState로 관리
  - 변환 기준: 렌더 중 인라인 계산 또는 useMemo로 대체
  - 예시: `const [fullName, setFullName]` → `const fullName = \`${first} ${last}\``

- 불명확한 식별자 → 의도가 드러나는 이름으로 교체
  - 감지 패턴: 단일 문자 변수(`x`, `e` 제외), `data2`, `temp`, `flag`, `info` 등 범용명
  - 변환 기준: 도메인 맥락이 담긴 명사·동사 조합으로 교체, 20자 이내 유지
  - 예시: `const data2 = res.json()` → `const userData = await res.json()`

- 비동기 오류 처리 누락 → try/catch 및 에러 상태 추가
  - 감지 패턴: `await` 사용 함수에 try/catch 없거나, 에러 시 UI 처리 미존재
  - 변환 기준: try/catch로 감싸고 `error` state를 두어 사용자에게 피드백 제공
  - 예시: `const res = await fetch(url)` → try/catch + `setError(err.message)`

- 사이드이펙트 없는 로직 → 순수 함수로 분리
  - 감지 패턴: 컴포넌트 내부에서 외부 상태를 직접 변경하거나 전역 변수에 의존
  - 변환 기준: 입력만으로 출력이 결정되는 순수 함수로 추출, 테스트 가능성 확보
  - 예시: 컴포넌트 내 배열 직접 정렬 → `const sorted = sortByDate(items)` 유틸 호출

**정리 (CLEANUP)**

- 주석 처리된 코드 블록 삭제
  - 감지 패턴: `//` 또는 `/* */`로 막아둔 코드 라인이 1줄 이상 연속 존재
  - 삭제 기준: 버전 관리는 Git이 담당한다. 주석 처리된 코드는 즉시 삭제
  - 예외: 의도적인 비활성화(A/B 테스트, 피처 플래그)는 이유 주석과 함께 유지
  - 예시: `// const old = fetch(url)` → 삭제

- 자명한 주석 삭제
  - 감지 패턴: 코드 자체로 의미가 명확한데 같은 내용을 반복 설명하는 주석
  - 삭제 기준: 주석 없이 코드만 읽어도 의도를 알 수 있으면 삭제
  - 예외: 복잡한 비즈니스 로직·외부 API 제약·의도적 우회 처리는 유지
  - 예시: `// count에 1을 더한다\nsetCount(count + 1)` → 주석만 삭제

- 완료·임시 표시 주석 삭제
  - 감지 패턴: `TODO`, `FIXME`, `HACK`, `임시`, `테스트용`, `나중에` 키워드 포함 주석
  - 삭제 기준: 이미 해결된 TODO는 즉시 삭제. 미해결 TODO는 GitHub Issue로 이관 권고
  - 예시: `// TODO: 나중에 에러 처리 추가` → 삭제 후 Issue 등록 권고

- 미사용 변수 삭제
  - 감지 패턴: 선언 후 파일 내에서 한 번도 참조되지 않는 `const`·`let` 변수
  - 삭제 기준: 참조 횟수 0이면 무조건 삭제. 향후 사용 예정이라는 이유는 인정하지 않음
  - 예시: `const tmp = calcTotal()` (이후 미참조) → 삭제

- 미사용 함수 삭제
  - 감지 패턴: 정의 후 같은 파일 또는 import 경로에서 호출되지 않는 함수
  - 삭제 기준: export된 함수는 프로젝트 전체 grep 후 참조 없으면 삭제
  - 예시: `const handleOld = () => { ... }` (어디서도 호출 안 됨) → 삭제

- 미사용 import 삭제
  - 감지 패턴: import했으나 JSX·로직 어디에도 사용되지 않는 모듈·컴포넌트·아이콘
  - 삭제 기준: 번들 크기에 직접 영향을 주므로 최우선 삭제 대상
  - 예시: `import { FaHeart } from 'react-icons/fa'` (미사용) → 삭제

## 출력 형식

심각도별로 분류하고, 각 항목마다:
1. 문제 코드 스니펫
2. 원인 설명 (초보자 기준)
3. 수정 코드 (CLEANUP 항목은 "삭제"로 표기)

마지막에 품질 점수 /100과 한 줄 요약을 출력한다.