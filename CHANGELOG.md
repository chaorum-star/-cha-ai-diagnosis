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
