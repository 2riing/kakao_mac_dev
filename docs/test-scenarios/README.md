# 테스트 시나리오

수동 검증용 시나리오. dev 서버 띄워두고 브라우저로 한 단계씩 따라가며 동작·디자인 확인.

## 환경 — 두 가지 선택

### 1. 로컬 dev 서버 (mock 모드)

```
npm run dev     # http://localhost:8080
```

- 환경: `VITE_USE_MOCK=true` (`.env.development`) — mock 인터셉터 활성
- 모든 API 응답이 `src/__mocks__/*.json`에서 즉시 반환
- 인증 화면 OTP는 4자리 이상이면 통과 (mock)
- 변경 mutation도 mock — 항상 성공 응답

### 2. Vercel 배포 (prod 빌드)

```
https://oss-customer-kakao-web.vercel.app   (main 자동 배포, stable URL)
```

대안 URL (필요 시):
- `https://oss-customer-kakao-web-git-main-2riing2-2546s-projects.vercel.app` — git main alias
- `vercel ls` 또는 대시보드에서 deployment-specific URL 확인 가능

⚠️ **주의**: `.env.production`에 `VITE_USE_MOCK`가 명시 안 되어 있어 prod 빌드는 mock 비활성 상태. 실 백엔드(`VITE_BASE_URL=https://api.example.com/api`) 호출하므로 API 의존 화면(예약 정보 로딩, OTP 검증 등)은 동작 안 함. 정적 화면(루트 → /error 리다이렉트, /help, /login 직접 진입 차단 등)만 검증 가능. mock으로 Vercel에서도 풀 플로우 보려면 Vercel 환경변수에 `VITE_USE_MOCK=true` 등록 + 재배포 필요.

## 공통 사항

- TanStack Query `staleTime: 30s` — 같은 URL 30초 내 새로고침 시 같은 mock 응답
- 카카오톡 인앱브라우저 실기 테스트는 별도 (Vercel URL을 카톡 채팅창에 붙여서 인앱으로 열기)

## 시나리오

| 파일 | 진입점 | 핵심 검증 |
|------|--------|----------|
| [01-reservation-change.md](./01-reservation-change.md) | `/order/change/{wrkRcpNo}` | OTP → 예약정보(view) → 캘린더 → 시간대 → 변경 완료 |
| [02-reservation-confirm.md](./02-reservation-confirm.md) | `/order/confirm/...` (보류) | 라우트 주석처리 상태 — 부활 시 갱신 |
| [03-guards.md](./03-guards.md) | 비정상 진입 | AuthGuard·진입 가드·에러 코드 분기 |
| [04-login-otp.md](./04-login-otp.md) | `/login` (AuthGuard 경유) | OTP 발송·검증·throttle·에러 매트릭스 |

## 🔗 전체 테스트 URL 풀 리스트

호스트만 `localhost:8080` ↔ `oss-customer-kakao-web.vercel.app` 바꾸면 양쪽 동일.

### 가드 / 정적 (Vercel에서도 동작)

**루트 → /error**
- 로컬: http://localhost:8080/
- Vercel: https://oss-customer-kakao-web.vercel.app/

**/login 직접 진입 차단**
- 로컬: http://localhost:8080/login
- Vercel: https://oss-customer-kakao-web.vercel.app/login

**/error 직접 진입 (UNKNOWN)**
- 로컬: http://localhost:8080/error
- Vercel: https://oss-customer-kakao-web.vercel.app/error

**catch-all — 정의 안 된 경로**
- 로컬: http://localhost:8080/random-path
- Vercel: https://oss-customer-kakao-web.vercel.app/random-path
- 로컬: http://localhost:8080/order/foo
- Vercel: https://oss-customer-kakao-web.vercel.app/order/foo

**도움말 (HelpPage)**
- 로컬: http://localhost:8080/help
- Vercel: https://oss-customer-kakao-web.vercel.app/help

---

### 예약 확정 (현재 비활성 — 라우트 주석처리)

`/order/confirm/{wrkRcpNo}` 라우트는 `app/router.tsx`에서 주석 처리됨 (청약 확정 흐름 보류).
현재 `/order/confirm/...` 진입은 catch-all로 `/error` 리다이렉트됨. 라우트 부활 시 이 섹션 + `02-reservation-confirm.md` + e2e spec(.skip 해제) 갱신.

---

### 예약 변경 (protected, OTP 필요)

진입 시 예약 정보(view) → [예약 변경] 버튼 → 캘린더 → 시간대 → 완료.
직접 진입하면 AuthGuard가 `/login`으로 보내 OTP 검증 후 복귀.

**1O2026051812345**
- 로컬: http://localhost:8080/order/change/1O2026051812345
- Vercel: https://oss-customer-kakao-web.vercel.app/order/change/1O2026051812345

**1O20260520ABCDE**
- 로컬: http://localhost:8080/order/change/1O20260520ABCDE
- Vercel: https://oss-customer-kakao-web.vercel.app/order/change/1O20260520ABCDE

**1O2026060100A05**
- 로컬: http://localhost:8080/order/change/1O2026060100A05
- Vercel: https://oss-customer-kakao-web.vercel.app/order/change/1O2026060100A05

---

### 청약 상세 / 오늘의 방문 (OrderDetailPage, protected)

직접 진입 시 AuthGuard가 `/login`으로 보내 OTP 검증 후 복귀.

**1O2026051812345**
- 로컬: http://localhost:8080/order/detail/1O2026051812345
- Vercel: https://oss-customer-kakao-web.vercel.app/order/detail/1O2026051812345

**1O20260520ABCDE**
- 로컬: http://localhost:8080/order/detail/1O20260520ABCDE
- Vercel: https://oss-customer-kakao-web.vercel.app/order/detail/1O20260520ABCDE

**1O2026060100A05**
- 로컬: http://localhost:8080/order/detail/1O2026060100A05
- Vercel: https://oss-customer-kakao-web.vercel.app/order/detail/1O2026060100A05

> Vercel에서 mock 의존 화면(예약 변경/상세) 보려면 위 ⚠️ 주의 참고.
> 잘못된 wrkRcpNo 포맷 에러 검증은 `/order/change/INVALID_FORMAT` 또는 `/order/detail/INVALID_FORMAT`로 진입(→ /error).

## 데이터 케이스

`src/__mocks__/reservation.json` candidates 5개 (랜덤 반환):

| wrkRcpNo 예시 | 오더 수 | 특징 |
|---|---|---|
| 1O2026051812345 | 1 | 인터넷 단일 |
| 1O20260520ABCDE | 2 | 인터넷 + TV 멀티 |
| 1O2026053000F01 | 1 | AS 수리 |
| 1O2026060100A05 | 3 | 인터넷 + TV + 전화 트리플 |
| 1O20260605DEAD0 | 1 | 이전설치 MOVE |

> 캐싱 때문에 30초 안에 같은 wrkRcpNo로 들어가면 같은 데이터.
> 다른 데이터 보려면 다른 wrkRcpNo로 진입하거나 30초 대기.

## 결과 기록

각 시나리오 파일 안에 체크박스 형식. 실패하면 해당 줄에 `❌ 사유` 메모.
