# tests/

이 폴더는 **외부 개발 한정**. 사내 이관 시 통째로 삭제.

## 구성

- `e2e/` — Playwright E2E 스펙
  - `login.spec.ts` — 라우트 가드 + OTP 로그인 플로우
  - `reservation-change.spec.ts` — 예약 변경 (date → time → done)
  - `reservation-confirm.spec.ts` — 예약 확정 다이얼로그 → 완료
- `fixtures/auth.ts` — Zustand 인증 store를 sessionStorage에 시드하는 헬퍼

## 실행

### 기본 (headless, 전체 병렬)

```bash
npm run test:e2e            # chromium + webkit 모바일 둘 다, 5워커 병렬
npm run test:e2e:ui         # UI 모드 (시각화 + 클릭으로 단일 실행)
npm run test:e2e:debug      # Playwright Inspector + step-over
```

기본은 headless라 브라우저 창 안 뜸. 콘솔에 결과만 찍힘.

### 브라우저 띄워서 보기 (headed)

```bash
npm run test:e2e -- --headed                              # 다 띄움 (와다다 뜸 주의)
npm run test:e2e -- --headed --project=chromium-mobile    # chromium 모바일만
npm run test:e2e -- --headed --workers=1                  # 한 번에 하나씩만
```

### 천천히 보기

Playwright CLI에는 `--slow-mo` 옵션이 없음. 액션 사이 슬립을 주려면 `playwright.config.ts`의
`use.launchOptions.slowMo` 값을 수정해야 함. 대신 한 줄씩 보고 싶을 땐 debug 모드가 가장 쉬움.

```bash
# Playwright Inspector + 브라우저. Resume 버튼 누를 때마다 다음 액션 실행
npm run test:e2e:debug -- --project=chromium-mobile -g "OTP"
```

### 특정 시나리오만

```bash
# 이름 grep
npm run test:e2e -- -g "OTP 검증"
npm run test:e2e -- -g "예약 변경"
npm run test:e2e -- -g "예약 확정"

# 파일 단위
npm run test:e2e -- tests/e2e/login.spec.ts
npm run test:e2e -- tests/e2e/reservation-confirm.spec.ts

# 조합 (헤드 + 1워커 + 한 브라우저 + 한 시나리오)
npm run test:e2e -- --headed --workers=1 --project=chromium-mobile -g "OTP"
```

### 결과 리포트 다시 보기

```bash
npx playwright show-report   # 마지막 실행의 HTML 리포트를 브라우저로 열기
```

`playwright-report/` 자동 생성. 매 실행마다 덮어써짐.

### Playwright가 dev 서버 알아서 띄움

`npm run dev`를 자동 기동 (`webServer` 설정). 별도로 dev 서버 띄울 필요 없음.
이미 8080에 dev 서버가 떠 있으면 재사용 (`reuseExistingServer: !CI`).

> ⚠️ 폴더 구조 바꾼 직후 옛 dev 서버가 8080에 떠 있으면 Vite HMR 캐시가 stale이라 모듈 404 → React 마운트 자체가 안 됨. 테스트가 미스터리하게 다 깨지면 dev 서버 재시작이 1순위.

## 동작 전제

- `VITE_USE_MOCK=true` 강제 — `playwright.config.ts`의 `webServer.env`에서 주입
- 모든 응답은 `src/__mocks__/*.json` + `src/shared/api/mock.ts` 분기로 처리
- OTP 검증은 mock에서 항상 성공 (어떤 6자리 입력해도 통과)
- 인증 시드는 sessionStorage 키 `kakao-webview-auth`에 직접 주입

## 사내 반입 시 정리

1. 이 폴더(`tests/`) 통째 삭제
2. 루트 `playwright.config.ts` 삭제
3. `package.json`에서 devDep 제거: `@playwright/test`
4. `package.json` scripts에서 `test:e2e*` 3건 제거
5. `package-lock.json` 재생성 (`npm install`)
6. `.gitignore`에 추가했던 `test-results/`, `playwright-report/`, `playwright/.cache/` 라인 제거 (선택)

빌드는 영향 없음 — `tsconfig.app.json` `include: ["src"]`라 tests/는 타입체크 대상이 아니고, vite build는 src/ entry 그래프만 번들.

## 추가 라이브러리 이력

| 패키지 | 버전 범위 | 추가일 | 용도 |
|---|---|---|---|
| `@playwright/test` | latest (devDep) | 2026-05-22 | E2E 테스트 러너 |

브라우저 바이너리(Chromium / WebKit)는 npm 패키지 외 별도 다운로드. 사내 반입 대상 아님.

```bash
npx playwright install chromium webkit   # 외부 환경 최초 1회
```

## 알려진 제약

- Playwright는 카카오톡 인앱브라우저를 *진짜* 띄우지 못함. WebKit/Chromium 엔진 + 모바일 viewport·UA 에뮬레이션까지만. "카카오톡 인앱 한정 버그"는 실기기 수동 QA 필요.
- iCloud Drive 안에 `node_modules`가 있으면 `npm install` 중 ENOTEMPTY 에러 발생 가능 (동기화 race). 발생 시 재실행하면 보통 통과.
