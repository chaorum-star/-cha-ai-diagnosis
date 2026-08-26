# 차팀장 AI 직원진단

## AI / 코드 작업 시작 전 필독

이 저장소를 ChatGPT 웹·데스크톱, Codex, Claude, 기타 코딩 에이전트로 수정할 때 아래 문서를 먼저 읽습니다.

1. [`AGENTS.md`](./AGENTS.md) — **최상위 작업·QA·배포 규칙 / Single Source of Truth**
2. [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) — production 배포 전 필수 회귀 QA
3. [`CHANGELOG.md`](./CHANGELOG.md) — 최근 변경과 이미 해결한 회귀 이슈
4. 디자인 수정 시 `.agents/skills/cha-design-director/SKILL.md`

### Release rule

`요청 정리 → staging 수정 → 자동 검사 → 모바일/전체 회귀 QA → 사용자 확인 → main production`

- 수정 후 즉시 production 배포하지 않습니다.
- 390px / 430px 모바일 렌더링 확인 없이 모바일 QA 완료라고 하지 않습니다.
- loader/string replace 핫픽스를 버전마다 누적하지 않습니다.
- 하나를 고쳐도 전체 핵심 플로우를 다시 확인합니다.

### Branch

- `main` — production
- `staging` — 다음 배포 후보

### Production

GitHub Pages에서 `main` 기준으로 서비스합니다.
