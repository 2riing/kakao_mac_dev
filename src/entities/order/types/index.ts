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
// workerPhotoUrl은 정적 이미지 경로 (예: /images/workers/{wrkRcpNo}). 빈 문자열 가능.
// 백엔드 응답 풀이름 평탄형 — naming-conventions.md "백엔드 응답 정본" 참조.
export interface Technician {
  workerName: string;
  workerPhoneNumber: string;
  workerPhotoUrl: string;
}

/* 예약에 포함된 오더 정보 (도메인 — 컴포넌트에서 사용) */
export interface ReservationOrder {
  wrkRcpNo: string;
  spotWrkTypeCd: string; // 현장작업 종류 코드 (오더 단위 — INSTALL/AS/MOVE 등)
  prodDescNm: string;    // 상품 설명명 (수리는 빈 문자열 가능)
}

/* 예약 정보 (도메인 — 컴포넌트에서 사용) */
export interface Reservation {
  rsrvDate: string;        // 예약일 YYYY-MM-DD
  rsrvTod: string;         // 예약시간 (예: "14:00")
  smtCnt: number;          // 동시건수
  orders: ReservationOrder[];
}

/* 백엔드 응답 — GET /reservation/{workReceiptNo} (2026-05-27 정합)
 * naming-conventions.md "백엔드 풀이름 매핑" 참조.
 * 도메인 타입 Reservation으로 변환 후 컴포넌트에 전달 (api/index.ts의 toReservation).
 */
export interface ReservationDetailResponseOrder {
  workReceiptNo: string;
  serviceName: string;
}

export interface ReservationDetailResponse {
  customerName: string;          // 미사용 (향후 화면 노출 시 도메인 타입에 추가)
  reservationDate: string;       // "YYYY-MM-DD HH:MM:SS" — 시각 부분 의미 없음
  reservationTimeOfDay: string;  // "HHMM" 정시
  spotWorkTypeCode: string;      // "1" 등 정수문자열 — 의미 매핑 미정
  sameTimeOrderCount: number;
  orders: ReservationDetailResponseOrder[];
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
