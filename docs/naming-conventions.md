# 네이밍 컨벤션 (사내 표준 약어 사전)

용도: 사내 시스템·DB에서 통용되는 약어를 그대로 사용.
원칙: 사내 표준 약어를 따른다. 새 약어는 절대 도입하지 않는다. 모르는 약어는 풀네임으로 쓰거나 사전에 등재한 뒤 사용한다.


## 약어 사전

### 확정 (사용자 직접 제공)

| DB 컬럼 (snake)     | JS 변수 (camel)   | 풀네임(영문)              | 의미(한글)         | 비고                |
| ------------------- | ----------------- | ------------------------- | ------------------ | ------------------- |
| wrk_rcp_no          | wrkRcpNo          | work receipt number       | 작업접수번호       | 예: 1O2026042812345 |
| svc_cont_id         | svcContId         | service contract id       | 서비스 계약ID      |                     |
| prod_id             | prodId            | product id                | 상품코드           |                     |
| spot_wrk_user_id    | spotWrkUserId     | spot work user id         | 작업자 사용자 ID   |                     |
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
| spot_wrk_user_nm    | spotWrkUserNm     | spot work user name       | 작업자명           |                     |

### 추정 (백엔드 확정 필요)

| DB 컬럼 (snake) | JS 변수 (camel) | 풀네임(영문)               | 의미(한글)  | 비고          |
| --------------- | --------------- | -------------------------- | ----------- | ------------- |
| svc_lctg_id     | svcLctgId       | service large category id  | 작업종류코드 | 확인 필요     |
| obdng_id        | obdngId         | office building id         | 국사 ID     | 사용 보류     |

### 유추 (확정된 약어 패턴 기반 — 백엔드 확정 필수)

패턴: `_no` 번호 / `_id` ID / `_nm` 이름 / `_dt` 일자 / `_tm` 시간 / `_cd` 코드 / `_addr` 주소 / `_url` URL
도메인: `cust_` 고객 / `prod_` 상품 / `svc_` 서비스 / `wrk_` 작업 / `spot_wrk_` 현장작업 / `obdng_` 국사 / `vist_` 방문 / `rsv_` 예약 / `reg_` 등록

| DB 컬럼 (유추)         | JS 변수             | 의미(한글)       | 근거 패턴               |
| ---------------------- | ------------------- | ---------------- | ----------------------- |
| cust_id                | custId              | 고객 ID          | cust_nm ↔ cust_id       |
| cust_hp_no             | custHpNo            | 고객 휴대폰번호  | _hp_no (handphone)      |
| prod_nm                | prodNm              | 상품명           | prod_id + _nm           |
| spot_wrk_user_hp_no    | spotWrkUserHpNo     | 작업자 휴대폰번호 | 동일 도메인 + _hp_no    |
| spot_wrk_user_pic_url  | spotWrkUserPicUrl   | 작업자 사진 URL  | _pic_url                |
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
