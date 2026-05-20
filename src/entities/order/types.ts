/**
 * order 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 * reservation 관련 타입도 order 도메인으로 통합됨.
 */

/* 오더 상태 조회 — GET /api/order/status/{wrkRcpNo}?reservationDate=YYYYMMDDHHMM */
export interface OrderStatus {
  smtCnt: number;        // 동시건수
  orders: string[];      // 작업접수번호 배열
  progressCd: string;    // 진행상태 코드 (원스톱·진행상태 등 판단)
}

/* 작업자 정보 — GET /api/order/worker/{wrkRcpNo} */
// wrkFlowSttusCd='4'(당일 방문) 일 때만 조회 가능.
// spotWrkUserPic은 정적 이미지 경로 (예: /order/images/workers/{wrkRcpNo}).
export interface Technician {
  spotWrkUserId: string;
  spotWrkUserNm: string;
  spotWrkUserHpNo: string;
  spotWrkUserPic: string;
}

/* 예약에 포함된 오더 정보 */
export interface ReservationOrder {
  wrkRcpNo: string;
  prodDescNm: string;    // 상품 설명명 (수리는 빈 문자열 가능)
}

/* 예약 정보 — GET /api/reservations/{wrkRcpNo} */
export interface Reservation {
  custNm: string;          // 고객명
  rsrvDate: string;        // 예약일 YYYY-MM-DD
  rsrvTod: string;         // 예약시간 (예: "14:00")
  spotWrkTypeCd: string;   // 현장작업 종류 코드
  smtCnt: number;          // 동시건수
  orders: ReservationOrder[];
}

/* 가용수 조회 — GET /api/reservations/{wrkRcpNo}/availability */
export interface AvailabilityTimeSlot {
  rsrvTod: string;       // "09:00"
  available: boolean;
}

export interface AvailabilityDay {
  rsrvDate: string;             // "2026-05-08"
  slots: AvailabilityTimeSlot[];
}

export interface AvailabilityResponse {
  from: string;                       // "2026-05-08"
  to: string;                         // "2026-05-14"
  availability: AvailabilityDay[];
}

/* 예약 변경 — PATCH /api/reservations/{wrkRcpNo}
 * wrkRcpNo 단일로 보내면 백엔드가 동시건 묶음을 자동 일괄 처리.
 */
export interface ReservationPatchPayload {
  rsrvDate: string;
  rsrvTod: string;
}

export interface ReservationPatchResult {
  ok: boolean;
  updatedCnt: number;
}

/* 예약 확정 — POST /api/reservations/{wrkRcpNo}/confirm */
export interface ReservationConfirmResult {
  ok: boolean;
}
