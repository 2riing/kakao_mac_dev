# 네이밍 컨벤션 (사내 약어 ↔ 백엔드 풀이름)

용도: 사내 시스템·DB 약어 + 백엔드 API 응답 풀이름 둘을 함께 관리.
원칙:
1. 새 약어 임의 도입 금지. 모르는 약어는 풀네임.
2. **백엔드 응답은 풀이름 camelCase가 정본** — 2026-05-27 `/reservation/{workReceiptNo}` 응답 수신 후 확정.
3. path 파라미터·내부 변수·DB 컬럼은 사내 약어 유지. 백엔드 응답 ↔ 클라 변환은 entities 레이어에서 처리.
4. 백엔드 풀이름 ↔ 사내 약어 매핑은 아래 "백엔드 풀이름 매핑" 표 참조.


## 약어 사전

### 확정 (사용자 직접 제공)

| DB 컬럼 (snake)     | JS 변수 (camel)   | 풀네임(영문)              | 의미(한글)         | 비고                |
| ------------------- | ----------------- | ------------------------- | ------------------ | ------------------- |
| wrk_rcp_no          | wrkRcpNo          | work receipt number       | 작업접수번호       | 예: 1O2026042812345 |
| svc_cont_id         | svcContId         | service contract id       | 서비스 계약ID      |                     |
| prod_id             | prodId            | product id                | 상품코드           |                     |
| cust_nm             | custNm            | customer name             | 고객명             |                     |
| osc_rcp_no_cnt      | oscRcpNoCnt       | one-stop receipt no count | 원스톱 오더 개수   | 동시성              |
| wrk_flow_sttus_cd   | wrkFlowSttusCd    | work flow status code     | 작업 흐름 상태코드 | '4'=당일방문        |
| cust_phone_no       | custPhoneNo       | customer phone number     | 고객 휴대폰번호    |                     |
| spot_wrk_type_cd    | spotWrkTypeCd     | spot work type code       | 현장작업 종류코드  | 인터넷/TV/수리 등   |
| rsrv_date           | rsrvDate          | reservation date          | 예약일             | YYYY-MM-DD          |
| rsrv_tod            | rsrvTod           | reservation time of day   | 예약시간           | "14:00 ~ 15:00"     |
| prod_desc_nm        | prodDescNm        | product description name  | 상품 설명명        | 수리는 빈 값 가능   |
| addr_info           | addrInfo          | address info              | 주소 정보          |                     |
| nadr_info           | nadrInfo          | new address info          | 신주소·도로명      | 추정                |
| is_div_cd           | isDivCd           | division code             | 분할 여부 코드     | 추정 — 의미 확인    |
| smt_cnt             | smtCnt            | simultaneous count        | 동시건수           | 추정                |
| otp_no              | otpNo             | OTP number                | 인증번호           |                     |
| worker_name         | workerName        | worker name               | 작업자명           | 백엔드 응답 정본    |
| worker_phone_number | workerPhoneNumber | worker phone number       | 작업자 휴대폰번호  | 백엔드 응답 정본    |
| worker_photo_url    | workerPhotoUrl    | worker photo url          | 작업자 사진 URL    | 백엔드 응답 정본    |

### 추정 (백엔드 확정 필요)

| DB 컬럼 (snake) | JS 변수 (camel) | 풀네임(영문)               | 의미(한글)  | 비고          |
| --------------- | --------------- | -------------------------- | ----------- | ------------- |
| svc_lctg_id     | svcLctgId       | service large category id  | 작업종류코드 | 확인 필요     |
| obdng_id        | obdngId         | office building id         | 국사 ID     | 사용 보류     |

### 유추 (확정된 약어 패턴 기반 — 백엔드 확정 필수)

패턴: `_no` 번호 / `_id` ID / `_nm` 이름 / `_dt` 일자 / `_tm` 시간 / `_cd` 코드 / `_addr` 주소 / `_url` URL
도메인: `cust_` 고객 / `prod_` 상품 / `svc_` 서비스 / `wrk_` 작업 / `spot_wrk_` 현장작업 / `worker_` 작업자(평탄형, 백엔드 응답) / `obdng_` 국사 / `vist_` 방문 / `rsv_` 예약 / `reg_` 등록

| DB 컬럼 (유추)         | JS 변수             | 의미(한글)       | 근거 패턴               |
| ---------------------- | ------------------- | ---------------- | ----------------------- |
| cust_id                | custId              | 고객 ID          | cust_nm ↔ cust_id       |
| cust_hp_no             | custHpNo            | 고객 휴대폰번호  | _hp_no (handphone)      |
| prod_nm                | prodNm              | 상품명           | prod_id + _nm           |
| svc_lctg_nm            | svcLctgNm           | 작업종류명       | svc_lctg_id + _nm       |
| vist_pln_dt            | vistPlnDt           | 방문예정일       | vist_pln_*              |
| vist_pln_tm_zn         | vistPlnTmZn         | 방문시간대       | _tm_zn (time zone)      |
| inst_addr              | instAddr            | 설치주소         | inst_ + _addr           |
| inst_dtl_addr          | instDtlAddr         | 설치 상세주소    | _dtl_ + _addr           |
| rsv_st_cd              | rsvStCd             | 예약상태코드     | rsv_ + _st_cd           |
| wrk_req_tm             | wrkReqTm            | 작업소요시간     | wrk_ + req + _tm        |
| reg_dt                 | regDt               | 등록일시         | 표준                    |
| upd_dt                 | updDt               | 수정일시         | 표준                    |

> 유추 항목은 백엔드 인터페이스 협의 시 확정 필수. 다를 가능성 매우 높음.
> 코드에서는 `// TODO: 백엔드 확정 시 wrk_req_tm 검증` 식으로 표시.

### 사용 안 함

- 우편번호 (와이어프레임 불필요)
- 청약번호 (사내 시스템 미존재 — `svc_cont_id` 대체)
- `spot_wrk_user_*` 시리즈 (id/nm/hp_no/pic_url) — 백엔드 응답이 `worker_*` 평탄형으로 정합됨. 신규 작성·참조 금지. 코드 잔재는 백엔드 정합 시점에 일괄 마이그레이션


## 백엔드 풀이름 매핑

`GET /reservation/{workReceiptNo}` 응답 (2026-05-27 수신). 응답 필드는 풀이름 camelCase가 정본.

| 백엔드 응답 (풀이름)    | 사내 약어 매핑       | 의미(한글)         | 비고 |
| ----------------------- | -------------------- | ------------------ | ---- |
| workReceiptNo           | wrkRcpNo             | 작업접수번호       | path 파라미터는 사내 약어 사용 가능, 응답 키는 풀이름 |
| customerName            | custNm               | 고객명             | |
| reservationDate         | rsrvDate (+시각)     | 예약일시           | `"YYYY-MM-DD HH:MM:SS"` datetime. 시각 부분 의미 없음 |
| reservationTimeOfDay    | rsrvTod              | 예약 시간대        | `"HHMM"` 정시 기준. 기존 `"HH:MM"`과 다름 |
| spotWorkTypeCode        | spotWrkTypeCd        | 현장작업 종류코드  | 값이 `"1"` 같은 정수문자열 — 의미 매핑 미정 |
| sameTimeOrderCount      | smtCnt               | 동시건수           | `orders.length`와 동일 추정 |
| serviceName             | prodDescNm (추정)    | 상품(서비스)명     | 풀이름과 사내 약어 의미 살짝 다름 — 백엔드 확인 |
| extraBoolean            | -                    | 미정 부가 플래그   | envelope에 동반. 클라이언트는 무시 |

응답 envelope:
- `resultCode` 타입 **integer** (기존 정본은 문자열 `"2000"`이었으나 2026-05-27자로 정수형 통일)
- 정상 코드: `2000`

### 변환 패턴

```ts
// 백엔드 응답 (정본) → 클라 도메인 타입 (사내 약어 유지)
function toReservation(api: ReservationDetailResponse): Reservation {
  return {
    wrkRcpNo: api.orders[0].workReceiptNo,
    custNm: api.customerName,
    rsrvDate: api.reservationDate.slice(0, 10),
    rsrvTod: `${api.reservationTimeOfDay.slice(0, 2)}:${api.reservationTimeOfDay.slice(2)}`,
    smtCnt: api.sameTimeOrderCount,
    spotWrkTypeCd: api.spotWorkTypeCode,
    orders: api.orders.map((o) => ({
      wrkRcpNo: o.workReceiptNo,
      prodDescNm: o.serviceName,
    })),
  };
}
```

- 변환 위치: `src/entities/order/api/index.ts` (응답 받자마자 변환 → 컴포넌트는 사내 약어만 알면 됨)
- 추후 컨벤션 통일(풀이름 전면 전환) 결정되면 변환 제거하고 도메인 타입 자체를 풀이름으로 재작성


## 케이스 변환 규칙

DB 컬럼만 snake_case. 백엔드 응답·JS 변수·함수는 camelCase 통일.

| 위치                                | 표기                | 예                          |
| ----------------------------------- | ------------------- | --------------------------- |
| DB 컬럼 (snake)                     | wrk_rcp_no          | DB 컬럼명만 snake           |
| 백엔드 응답 / JS 변수·함수 (camel)  | wrkRcpNo            | 응답 JSON 키 camelCase 정본 |
| React 컴포넌트·파일명 (Pascal)      | WrkRcpNo            | WrkRcpNoSearchPage.tsx      |
| URL 쿼리 (camel)                    | wrkRcpNo            | 정본 따라 camelCase         |
| 상수 (UPPER_SNAKE)                  | WRK_RCP_NO_REGEX    | /^\d{15}$/                  |
| 타입 (Pascal)                       | Reservation         | TS interface/type           |


## 적용 예

변수·함수
```ts
const wrkRcpNo = useSearchParams().get('wrkRcpNo')
getReservationByWrkRcpNo(wrkRcpNo)
const currentWrkRcpNo: string
const wrkRcpNoList: string[]
```

파일명
```
pages/ReservationViewPage.tsx
hooks/useWrkRcpNo.ts
```

API 응답 → 클라 변환
- 응답 (camelCase): `{ "wrkRcpNo": "1O2026050712345", ... }`
- 변환 불필요. envelope `{resultCode, resultMessage, data}` 디언랩 후 `data` 사용.

TS 타입
```ts
export interface Reservation {
  custNm: string;          // 고객명
  rsrvDate: string;        // 예약일 YYYY-MM-DD
  rsrvTod: string;         // 예약시간
  spotWrkTypeCd: string;   // 작업종류코드
  smtCnt: number;          // 동시건수
  orders: ReservationOrder[];
}
```


## 금지

- 임의 새 약어 도입 (resv, tech, conf 등). 사내 표준 없으면 풀네임.
- 사내 약어와 풀네임 혼재 (wrkrcpno와 workReceiptNumber 동시 사용 X).
- 한글 발음 혼합 (workNo X, wrkNo X).


## 등재 절차

1. 새 약어 발견 시 풀네임·의미 확인
2. 위 표에 추가 (출처 명시)
3. 코드에서 일관 적용
