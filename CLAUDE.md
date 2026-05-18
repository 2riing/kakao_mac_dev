# oss-customer-kakao-web

카카오 알림톡 웹뷰 서비스 

Stack: Vite 6 + React 19 + TS 5.6 + Tailwind 4 + React Router 7 + TanStack Query 5 + Zustand 5 + axios 1.7

## claude.md rules

- this CLAUDE.md 수정 전 사용자 확인 필수.
- this CLAUDE.md 간결하게 유지. 설명·예시는 정본 문서로 위임
- 마크다운은 plain text editor 가독성 우선. 표·이모지 지양

## code rules

- 임의 약어 도입 금지. naming-dictionary 준수
- 명시적 분리 우선 — providers/router/AuthGuard 등 책임 단위로 파일 분리 (한 파일에 인라인 지양)
- import 방향: app → pages → components → entities → shared (역방향 금지)
- 동일 layer의 다른 도메인끼리 import 금지
- 여러 도메인 합치기는 `pages`에서만
- 도메인은 폴더 경로로만 import. `@entities/auth` OK, `@entities/auth/api` 금지
- 새 라이브러리(npm 패키지) 추가 금지. 진짜 필요 시 사용자 확인 필수

## domain

- `auth` — OTP 발송·검증·재발송, 세션, 마스킹 연락처
- `order` — 오더기본, 청약상세, 오더상태
- `reservation` — 예약 조회·변경·확정·가용수
- `worker` — 작업자 정보

## folder structure

```
src/
├── app/          main.tsx, App.tsx, providers.tsx, router.tsx
├── pages/        화면 (components 조립)
├── components/   도메인별 UI (auth, order, reservation, worker)
├── entities/     도메인별 데이터 (api, store, hooks, types)
└── shared/       공통 (api, ui, lib, hooks, config, model, styles, assets)
```

## documents

- `README.md` — 셋업·실행·폴더 구조 요약
- `docs/api.yaml` — OpenAPI 3.1 백엔드 명세
- `docs/naming-conventions.md` — 사내 표준 약어 사전 + 케이스 변환 룰

## API mock

백엔드 미정합 동안 `src/__mocks__/*.json` + axios adapter 분기. `VITE_USE_MOCK=true`일 때만 동작. 백엔드 답 오면 mocks 폴더 + 분기 코드 삭제로 정리.

## environment
외부 개발 완료 후 사내망 수동 이관 예정 