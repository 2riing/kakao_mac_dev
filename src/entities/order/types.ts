/**
 * order 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
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
