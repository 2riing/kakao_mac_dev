# 04. LoginOtpPage — OTP 발송·검증 에러 매트릭스

본인인증 화면(`/login`)의 진입·발송·검증·입력 각 단계별 에러 분기 검증.

## 진입 URL

LoginOtpPage는 직접 진입 차단. AuthGuard 경유로만 도달:

```
http://localhost:8080/order/change/1O2026051812345
```
→ AuthGuard 가로채서 `/login`으로 (state.from 보존)

> 직접 `/login` 진입 시나리오는 [03-guards.md](./03-guards.md) 참고.

## A. 진입 단계

### A-1. 정상 진입 (AuthGuard 경유)
- [ ] KT 로고 + "본인인증" 제목 표시
- [ ] 마스킹 번호 자동 표시 (`010-****-XXXX`)
- [ ] [인증번호 받기] 버튼 활성 (회색 X, 빨강)

### A-2. 마스킹 연락처 조회 실패
- mock 환경에선 재현 불가 (항상 성공). 백엔드 정합 시 GET `/auth/phonenum/{wrkRcpNo}` 500/timeout 케이스
- [ ] 페이지 자체가 `/error` (code: ORDER_INVALID)로 자동 fallback
- [ ] "예약 정보를 확인할 수 없습니다" 표시

## B. OTP 발송 단계

### B-1. 정상 발송
- [ ] [인증번호 받기] 클릭 → 버튼이 "재발송" + disabled로 변경
- [ ] OtpField 우측에 mm:ss 타이머 시작 (dev: 18초만에 끝, prod: 180초)
- [ ] 30초 이하 남으면 타이머 색 빨강 → 주황(`kt-warn-urgent`)

### B-2. devtools로 disabled 풀고 재발송 시도 (클라이언트 throttle)
- 검증 방법: 브라우저 devtools → 버튼 elements 패널에서 `disabled` 속성 제거 → 클릭
- [ ] mutate 호출 안 됨 (Network 탭에 새 요청 0)
- [ ] PhoneRequestRow 아래 빨강 안내: "잠시 후 다시 시도해 주세요."

### B-3. 서버 throttle (백엔드 정합 후)
- 백엔드가 `resultCode: "9001"`, `resultMessage: "..."` 응답
- [ ] PhoneRequestRow 아래 빨강 안내로 백엔드 메시지 그대로 표시
- [ ] 추가 정보(`retryAfter`) UI 활용은 백로그

### B-4. 네트워크 끊김
- 검증 방법: devtools → Network → Offline 토글 → [인증번호 받기]
- [ ] "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." 한국어 안내 (axios `Network Error` 원문 X)

### B-5. 발송 일반 실패
- 백엔드 5xx / 알 수 없는 에러 코드
- [ ] envelope `resultMessage` 그대로 표시. 없으면 `INLINE_MESSAGES.unknown`

## C. OTP 검증 단계

### C-1. 정상 검증
- [ ] OTP 6자 입력 → [확인] 활성
- [ ] [확인] 클릭 → 스피너 → 원래 가려던 경로(`/order/change/{wrkRcpNo}` 등)로 자동 복귀

### C-2. OTP 불일치
- mock에선 항상 성공이라 재현 불가. 백엔드 응답 `resultCode: "9011"`
- [ ] OtpField 안내문구 자리에 빨강 메시지 (백엔드 resultMessage 그대로)
- [ ] OTP 입력 자동 클리어 (재입력 유도)

### C-3. OTP 만료
- 백엔드 응답 `resultCode: "9012"`
- [ ] 빨강 메시지 표시 ("인증번호가 만료되었습니다. 재발송해 주세요" 류)

### C-4. 검증 실패 N회 누적 → 잠금
- 백엔드 응답 `resultCode: "9013"`, `lockedUntil`
- [ ] 빨강 메시지 표시 (백엔드 메시지)
- [ ] `lockedUntil` 카운트다운 UI는 백로그

### C-5. 잠금 상태에서 시도
- 백엔드 응답 `resultCode: "9014"`
- [ ] 빨강 메시지 표시

### C-6. 401 (세션 만료 등)
- `shared/api/client.ts` 인터셉터가 자동으로 `/login` 리다이렉트
- [ ] 무한 루프 없이 한 번만 리다이렉트 (OTP 단계라 거의 발생 안 함)

### C-7. 네트워크 끊김 (검증 시)
- B-4와 동일 — "네트워크 오류" 한국어 안내

## D. 입력 검증

### D-1. OTP 6자 미만
- [ ] 1~5자 입력 동안 [확인] 버튼 disabled (회색)
- [ ] 6자 입력 즉시 활성

### D-2. 숫자 외 입력
- [ ] 영문/한글 입력 시 무시 (OtpField `/\D/` 필터). 입력 칸엔 숫자만 박힘

### D-3. 6자 초과 입력
- [ ] 7자 이상 입력 안 됨 (maxLength=6)

## E. 카운트다운 만료 후 재발송

### E-1. 정상 재발송
- [ ] 카운트다운 0 도달 → [재발송] 버튼 다시 활성
- [ ] 클릭 → B-1 흐름 반복 (mm:ss 다시 시작)
- [ ] OTP 입력 클리어됨 (이전 입력 제거)

## 백로그 (백엔드 정합 후 활용)

- 발송 throttle 응답의 `retryAfter`(초) UI 활용 — 정확한 카운트다운 표시
- 검증 실패 잠금의 `failCount` / `lockedUntil` UI 활용 — "X회 남음" / "잠금까지 N분"
- 에러 코드 합의 (9001 throttle / 9011 불일치 / 9012 만료 / 9013 누적잠금 / 9014 잠금시도)
- OTP 발송 일일 한도 정책 (wrkRcpNo·phone 기준)
