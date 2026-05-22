# 테스트 시나리오

수동 검증용 시나리오. dev 서버 띄워두고 브라우저로 한 단계씩 따라가며 동작·디자인 확인.

## 사전 준비

```
npm run dev     # http://localhost:8080
```

- 환경: `VITE_USE_MOCK=true` (`.env.development`) — mock 인터셉터 활성
- 인증 화면 OTP는 4자리 이상이면 통과 (mock)
- 변경 mutation도 mock — 항상 성공 응답
- TanStack Query `staleTime: 30s` — 같은 URL 30초 내 새로고침 시 같은 mock 응답

## 시나리오

| 파일 | 진입점 | 핵심 검증 |
|------|--------|----------|
| [01-reservation-change.md](./01-reservation-change.md) | `/order/reservation/.../change` | OTP → 캘린더 → 시간대 → 변경 완료 |
| [02-reservation-confirm.md](./02-reservation-confirm.md) | `/order/confirm/...` | 예약 정보 → ConfirmDialog → 확정 완료 |
| [03-guards.md](./03-guards.md) | 비정상 진입 | AuthGuard·진입 가드·에러 코드 분기 |

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
