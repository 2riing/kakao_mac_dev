# oss-customer-kakao-web

KT myspeed 카카오 웹뷰. 카카오 알림톡 진입 → OTP 인증 → 예약 조회·변경·확정.


## 스택

Vite 6 · React 19 · TypeScript 5.6 · Tailwind 4 · React Router 7 · TanStack Query 5 · Zustand 5 · axios 1.7


## 셋업

```bash
npm install
npm run dev
```


## 명령어

- `npm run dev` — Vite 개발 서버 (http://localhost:8080)
- `npm run build` — TS 빌드 + Vite 프로덕션 빌드
- `npm run preview` — 빌드 결과 로컬 미리보기
- `npm run lint` — ESLint 검사


## 환경 변수

| 키                 | 설명                                                 |
| ------------------ | ---------------------------------------------------- |
| VITE_API_BASE_URL  | API 서버 베이스 URL (`/v1` 까지)                     |
| VITE_USE_MOCK      | true 일 때 mock 데이터 사용 (백엔드 미정합 동안)     |

`.env.development` / `.env.production` 자동 적용.
로컬 토글은 `.env.local` 사용 (gitignore 됨).
비밀값 절대 X — 모두 백엔드에서 처리.


## 폴더 구조

```
src/
├── app/          진입점, providers, router
├── pages/        화면 (components 조립)
├── components/   도메인별 UI (auth, order, reservation, worker)
├── entities/     도메인별 데이터 (api, store, hooks, types)
└── shared/       공통 (api, ui, lib, hooks, config, model, styles, assets)
```

규칙은 `CLAUDE.md` 참조.


## 문서

- `CLAUDE.md` — AI 어시스턴트·기여자 규칙
- `docs/api.yaml` — OpenAPI 3.1 백엔드 명세
- `docs/naming-conventions.md` — 사내 표준 약어 사전


## 라이선스 도입 이력

| 패키지                  | 라이선스    | 도입일     | 비고      |
| ----------------------- | ----------- | ---------- | --------- |
| react / react-dom       | MIT         | 2026-05-13 | UI        |
| react-router            | MIT         | 2026-05-13 | 라우팅    |
| @tanstack/react-query   | MIT         | 2026-05-13 | 서버 상태 |
| zustand                 | MIT         | 2026-05-13 | 전역 상태 |
| axios                   | MIT         | 2026-05-13 | HTTP      |
| tailwindcss             | MIT         | 2026-05-13 | 스타일    |
| typescript              | Apache-2.0  | 2026-05-13 | 언어      |
| vite                    | MIT         | 2026-05-13 | 빌드      |
| eslint                  | MIT         | 2026-05-13 | 린트      |
