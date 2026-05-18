/**
 * reservation 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 */

/* 예약에 포함된 오더 정보 */
export interface ReservationOrder {
  wrkRcpNo: string;
  prodDescNm: string;    // 상품 설명명 (수리는 빈 문자열 가능)
}

/* 예약 정보 — GET /v1/reservations/{wrkRcpNo} */
export interface Reservation {
  custNm: string;          // 고객명
  rsrvDate: string;        // 예약일 YYYY-MM-DD
  rsrvTod: string;         // 예약시간 (예: "14:00")
  spotWrkTypeCd: string;   // 현장작업 종류 코드
  smtCnt: number;          // 동시건수
  orders: ReservationOrder[];
}

/* 가용수 조회 — GET /v1/reservations/{wrkRcpNo}/availability */
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

/* 예약 변경 — PATCH /v1/reservations (단일 일정 다건 일괄) */
export interface ReservationPatchPayload {
  wrkRcpNoList: string[];
  rsrvDate: string;
  rsrvTod: string;
}

export interface ReservationPatchResult {
  ok: boolean;
  updatedCnt: number;
}

/* 예약 확정 — POST /v1/reservations/{wrkRcpNo}/confirm */
export interface ReservationConfirmResult {
  ok: boolean;
}
