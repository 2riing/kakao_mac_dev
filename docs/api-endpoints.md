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

### reservation — 예약 (미정)

백엔드 확정 후 추가 예정.

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

### reservation(미정)
```
```

## 도메인 → 코드 위치 매핑

| 도메인 | 파일 |
|--------|------|
| auth | `src/entities/auth/api.ts` |
| order | `src/entities/order/api.ts` (작업자 포함) |
| reservation | `src/entities/reservation/api.ts` |

