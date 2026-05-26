# 03. 진입 가드 · 에러 분기

AuthGuard, LoginOtpPage 진입 가드, ErrorPage 코드 분기.

## A. AuthGuard (protected 라우트 미인증 진입)

### 진입 URL

로컬:
```
http://localhost:8080/order/reservation/1O2026051812345/202605251400
http://localhost:8080/order/today/1O2026051812345/202605251400
```

Vercel:
```
https://oss-customer-kakao-web.vercel.app/order/reservation/1O2026051812345/202605251400
https://oss-customer-kakao-web.vercel.app/order/today/1O2026051812345/202605251400
```

### 체크

- [ ] 인증 없는 상태에서 위 URL 직접 진입 → `/login`으로 redirect
- [ ] redirect 시 `location.state.from`에 원래 경로 보존
- [ ] OTP 인증 후 원래 가려던 경로로 자동 복귀

---

## B. LoginOtpPage 직접 진입 차단

### 진입 URL

로컬: `http://localhost:8080/login`
Vercel: `https://oss-customer-kakao-web.vercel.app/login`

### 체크

- [ ] `/login` 직접 진입 즉시 `/error` 이동 (URL은 `/error` 그대로)
- [ ] "비정상적인 접근입니다" 제목
- [ ] "잘못된 경로로 진입했습니다. 카카오톡 알림에서 다시 시도해 주세요." 설명
- [ ] AlertIcon (회색 경고 아이콘) 표시
- [ ] CSNote 보임

---

## C. ErrorPage 코드별 메시지

URL은 `/error`로 고정. code는 `navigate('/error', { state: { code } })`로 전달.

| 코드 | 발생 시점 | 표시 문구 |
|------|-----------|----------|
| `INVALID_ENTRY` | /login 직접 진입 | "비정상적인 접근입니다" |
| `ORDER_INVALID` | wrkRcpNo 형식 invalid / 오더 조회 실패 | "예약 정보를 확인할 수 없습니다" |
| `CONFIRM_FAILED` | 예약 확정 API 실패 | "예약 확정에 실패했습니다" |
| `NETWORK` | 네트워크 오류 (예약) | "네트워크 오류" |
| (없음 / 알 수 없음) | state 휘발·직접 진입 | "오류가 발생했습니다" (UNKNOWN) |

### 체크 — 코드별 진입 트리거

**ORDER_INVALID — 잘못된 wrkRcpNo 형식**

로컬: `http://localhost:8080/order/confirm/INVALID_FORMAT/202605251400`
Vercel: `https://oss-customer-kakao-web.vercel.app/order/confirm/INVALID_FORMAT/202605251400`

- [ ] `/error` 이동 + "예약 정보를 확인할 수 없습니다" 표시
- [ ] URL은 `/error` (코드 노출 X)

**UNKNOWN — /error 직접 진입**

로컬: `http://localhost:8080/error`
Vercel: `https://oss-customer-kakao-web.vercel.app/error`

- [ ] AlertIcon + "오류가 발생했습니다" + "잠시 후 다시 시도해 주세요"

**CONFIRM_FAILED — 모킹 어려움 (스킵)**
- 백엔드 연결 후 실패 응답 시뮬레이션 가능할 때 검증

---

## D. catch-all (정의 안 된 경로)

### 진입 URL

로컬:
```
http://localhost:8080/random-path
http://localhost:8080/order/foo
```

Vercel:
```
https://oss-customer-kakao-web.vercel.app/random-path
https://oss-customer-kakao-web.vercel.app/order/foo
```

### 체크

- [ ] 즉시 `/error` 이동
- [ ] UNKNOWN 메시지 표시

---

## E. 루트 진입

### 진입 URL

로컬: `http://localhost:8080/`
Vercel: `https://oss-customer-kakao-web.vercel.app/`

### 체크

- [ ] 즉시 `/error` 이동 (의도된 차단)
