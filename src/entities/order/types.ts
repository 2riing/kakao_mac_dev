/**
 * order 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 * reservation 관련 타입도 order 도메인으로 통합됨.
 */

/* 진입 게이트 화면 구분 — GET /api/order/status/{wrkRcpNo}/{viewType}
 * 1 = 청약 상세, 2 = 예약 변경. 백엔드가 진입 가능 여부를 판단해 resultCode로 응답
 * (2000=진입 가능·body 없음 / 그 외=차단). */
export type OrderViewType = "1" | "2";

/* 작업자 정보 — GET /api/order/worker/{wrkRcpNo} */
// 당일 방문일 때만 조회 성공 (그 외 에러) → OrderDetailPage가 조회 성공 여부로 작업자 카드 노출.
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
  serviceLctgNm: string; // 서비스 대분류명 (카테고리) — 아이콘/라벨 분기
  prodDescNm: string;    // 서비스명
}

/* 예약 정보 (도메인 — 컴포넌트에서 사용) */
export interface Reservation {
  rsrvDate: string;        // 예약일 YYYY-MM-DD
  rsrvTod: string;         // 예약시간 (예: "14:00")
  smtCnt: number;          // 동시건수
  orders: ReservationOrder[];
}

/* 백엔드 응답 — GET /reservation/{workReceiptNo} 
 * naming-conventions.md "백엔드 풀이름 매핑" 참조.
 * 도메인 타입 Reservation으로 변환 후 컴포넌트에 전달 (api/index.ts의 toReservation).
 */
export interface ReservationDetailResponseOrder {
  workReceiptNo: string; // 작업접수번호
  serviceLctgNm: string; // 서비스 대분류명 (예: "인터넷")
  serviceName: string; // 서비스명 (예: "인터넷 설치")
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
