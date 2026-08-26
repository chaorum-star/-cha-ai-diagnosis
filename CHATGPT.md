# ChatGPT 작업 진입점

이 저장소를 ChatGPT 웹, 데스크톱 앱, 연결된 GitHub 작업, 코드 작업에서 다룰 때 **작업 시작 전에 반드시 루트의 `AGENTS.md`를 읽고 따른다.**

필수 순서:

1. `AGENTS.md`
2. `QA_CHECKLIST.md`
3. `CHANGELOG.md`
4. 디자인 수정 시 `.agents/skills/cha-design-director/SKILL.md`

핵심 원칙:

- 수정 즉시 production 배포 금지
- staging → QA → 사용자 확인 → main
- 390px / 430px 모바일 실제 렌더링 QA 필수
- 한 부분 수정 후 전체 핵심 플로우 회귀 테스트
- loader/string replace 핫픽스 누적 금지
- 확인하지 않은 항목을 PASS라고 말하지 않기

세부 규칙의 유일한 원본(Single Source of Truth)은 `AGENTS.md`다.
