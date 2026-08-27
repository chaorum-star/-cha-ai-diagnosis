# CHANGELOG — 차팀장 AI 직원진단

이 파일은 이미 해결한 문제를 다시 만들지 않기 위한 회귀 기록이다.

## Governance setup — 2026-08-26

### Added
- `AGENTS.md`: 저장소 최상위 AI/코드/QA/배포 규칙
- `QA_CHECKLIST.md`: production 배포 전 필수 회귀 QA
- `CHATGPT.md`: ChatGPT 웹/데스크톱/연결 작업 진입점
- `CLAUDE.md`: Claude 작업 진입점
- README에 작업 시작 규칙 연결

### Release policy
- 앞으로 기본 개발 흐름은 `staging → QA → 사용자 확인 → main`
- production에 연속적인 loader/string replacement hotfix 누적 금지
- 다음 구조 변경 전 현재 누적 hotfix를 깨끗한 source로 flatten하는 작업 권장

---

## v31 — 빠른 진단 TOP3 모바일 카드 깨짐 수정

### Fixed
- Instagram 인앱 브라우저 등 좁은 모바일 viewport에서 1순위 숫자가 카드 밖으로 밀리던 문제
- 2·3순위 후보 카드의 순위/제목/점수 열이 서로 밀리지 않도록 모바일 grid를 명시적으로 고정
- rank 첫 요소에 남아 있던 absolute/transform 계열 배치를 모바일에서 해제
- 결과 카드 내부 overflow와 min-width를 정리해 viewport 밖으로 튀어나가지 않도록 보강

### Regression guard
- 빠른 진단 1순위 상세 카드의 순위 숫자는 카드 내부에 있어야 함
- 후보 카드의 점수 배지는 오른쪽 카드 경계 안에 있어야 함
- 긴 AI 직원명이 들어와도 가운데 제목 열만 줄바꿈되고 좌우 열은 유지돼야 함
- CSS 캐시 버전 `v31` 적용

---

## v30 — 진단 후 실행 가이드 + 복사 사용법 명확화

### Added
- 결과 페이지에 `진단 후, 이제 뭐 하지?` 3단계 실행 가이드 추가
- 1순위 업무에 맞춰 첫 자료 모으기 행동을 동적으로 안내
- 복사 버튼을 `ChatGPT에 붙여넣을 시작문장 복사하기`로 변경
- 복사 후 `AI 열기 → 붙여넣기 → 내 자료 추가` 사용법을 버튼 바로 아래에 노출
- 복사되는 내용에 1순위 업무, 첫 행동, AI/사람 역할 구분, 가장 단순한 구축 순서를 묻는 시작 프롬프트 포함

### Conversion bridge
- 무료 진단 범위: 무엇부터 맡길지 → 어떤 자료를 준비할지 → AI/사람 역할 구분 → 첫 행동
- 상담 범위: 실제 환경 확인 → 툴 선택 → 연결 → 자동화 시스템 구축
- 상담 CTA 앞에 `혼자 준비한 다음 막힌다면` 맥락을 추가해 무료 결과에서 상담으로 갑자기 점프하지 않도록 조정

### Why
- 사용자 피드백: `진단하고 나서 그다음엔 어떻게 해야 하지?`가 남음
- 사용자 피드백: 복사 버튼을 눌러도 복사한 내용을 어디에, 어떻게 활용해야 하는지 이해하기 어려움

### QA
- `solution-intake.js` 문법 검사 PASS
- 새 다음 단계 카드 → 기존 내일 할 일 → 상담 CTA 순서 DOM 검사 PASS
- 복사 버튼이 중복 강화되지 않도록 idempotency guard 확인
- 복사 결과가 단순 할 일 한 줄이 아니라 실행용 프롬프트인지 확인
- 모바일용 카드/버튼 줄바꿈 CSS와 `word-break: keep-all` 유지

### Known limitation
- 업종별 최종 툴 선정과 실제 연결은 진단만으로 단정하지 않고 상담/구축 단계에서 현재 사용 도구와 제약을 확인한다.

---

## v28 — 모바일 진행칩 리플로우

### Fixed
- 심층진단 상단 업무 진행칩이 모바일 우측에서 잘리던 문제
- 모바일에서 진행칩을 2열 grid로 전환
- 홀수 마지막 항목 전체폭 처리
- 긴 업무명 자연스러운 줄바꿈

### Regression guard
- 390px / 430px에서 진행칩 viewport 초과 여부 확인
- `min-width`, `nowrap`, horizontal overflow 재발 검사

---

## v27 — 복사 UX + 상담 안전망

### Fixed
- `첫 자료 모으기`가 버튼처럼 보이지만 실제 액션이 없던 문제
- `내일 할 일 복사하기` 실제 버튼으로 변경
- Clipboard API 실패 시 fallback 추가
- 복사 성공/실패 토스트 피드백 추가
- 카카오 상담 CTA에 진단 결과 복사 흐름 연결

### Copy UX rule
- 버튼을 눌렀는데 아무 반응이 없는 상태는 release blocker

### 상담 안전망
다음 의미의 안내를 결과 CTA 근처에 유지:

> 결과가 애매하거나 실제 적용에서 막히면, 진단 결과를 들고 차팀장 채널에 문의해주세요.

---

## v26 — 모바일 하단 브라우저 UI 겹침

### Fixed
- iPhone 인앱 브라우저/Safari 하단 chrome이 결과 마지막 영역과 CTA를 가리던 문제
- safe-area 및 추가 bottom scroll clearance 반영

### Regression guard
- 결과 최하단까지 실제 스크롤 확인
- CTA가 브라우저 하단 UI 위로 완전히 올라오는지 확인

---

## v24 — 모바일 Enter 안내 제거

### Fixed
- 모바일 질문 화면에 데스크톱용 `Enter` 안내가 노출되던 문제
- 모바일/운영 화면에서 keyhint 제거

### UX rule
- 모바일에는 Enter 키보드 안내를 표시하지 않는다.
- 데스크톱에서만 보조 입력 UX로 사용 가능

---

## v22~v23 — 모바일 결과 가독성 / 한글 리플로우

### Fixed
- WHY 영역 제목이 한 글자씩 세로로 쪼개지던 responsive selector 충돌
- HOW 플로우 모바일 재배치
- TOP3 가로 잘림
- 진한 보라 배경에서 검정 텍스트로 가독성이 떨어지던 문제

### Typography rule
- `word-break: keep-all`
- 특별한 이유 없이 `overflow-wrap:anywhere` 사용 금지
- 진한 배경에서는 충분한 명도 대비 확보

---

## v21 — 결과 페이지 가치 강화

### Result structure
`결론 → WHY → HOW → 준비물/병목 → TOP3 비교 → 내일 할 일 → 상담 CTA`

### Product rule
결과 페이지는 점수표가 아니라 작은 업무 컨설팅처럼 느껴져야 한다.

---

## Verified external link

현재 차팀장 카카오 상담 채널:

`https://pf.kakao.com/_xgudwX/chat`

과거 오픈채팅 링크를 상담 CTA로 다시 사용하지 않는다.
