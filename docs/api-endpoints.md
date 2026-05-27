# API Endpoints

정본: `docs/api.yaml` (OpenAPI 3.1)

## Base URL

- 개발: `https://api-dev.example.com/api`
- 운영: `https://api.example.com/api`

## 전체 엔드포인트 (실제 백엔드 기준)

### auth — 인증

| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/auth/otp/request` | 인증번호 발송 |
| POST | `/api/auth/otp/verify` | 인증번호 검증 (토큰 발급) |
| GET | `/api/auth/phonenum/{wrkRcpNo}` | 마스킹된 고객 연락처 조회 |

### order — 오더

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/order/status/{wrkRcpNo}?reservationDate=YYYYMMDDHHMM` | 오더 상태 조회 |
| GET | `/api/order/worker/{wrkRcpNo}` | 작업자 정보 조회 (당일방문 시만) |

### reservation — 예약

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/reservation/{workReceiptNo}` | 예약 상세 조회 (토큰 필요) |

응답 필드명은 풀이름 camelCase (`customerName`, `reservationDate`, `reservationTimeOfDay`, `spotWorkTypeCode`, `sameTimeOrderCount`, `orders[{workReceiptNo, serviceName}]`). 자세히는 `docs/api.yaml`의 `ReservationDetail` 스키마 + `docs/naming-conventions.md`의 "백엔드 풀이름 매핑" 참조.

## 풀 URL 예시 (개발 서버, 실제 백엔드 기준)

### auth
```
POST  https://api-dev.example.com/api/auth/otp/request
POST  https://api-dev.example.com/api/auth/otp/verify
GET   https://api-dev.example.com/api/auth/phonenum/{wrkRcpNo}
```

### order
```
GET   https://api-dev.example.com/api/order/status/{wrkRcpNo}?reservationDate=YYYYMMDDHHMM
GET   https://api-dev.example.com/api/order/worker/{wrkRcpNo}
```
- 작업자 사진은 위 worker 응답에 URL 필드로 포함됨 (정적 경로 예: `/order/images/workers/{wrkRcpNo}`)

### reservation
```
GET   https://api-dev.example.com/api/reservation/{workReceiptNo}
```
- 응답: `docs/api.yaml`의 `EnvelopeReservationDetail`
- 토큰 필요 (Authorization: Bearer 또는 Set-Cookie)

## 도메인 → 코드 위치 매핑

| 도메인 | 파일 |
|--------|------|
| auth | `src/entities/auth/api/index.ts` |
| order | `src/entities/order/api/index.ts` (작업자·예약 상세 포함) |

