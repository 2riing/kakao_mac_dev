/**
 * order 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 */

/* 오더 상태 조회 — GET /v1/orders/{wrkRcpNo}/status */
export interface OrderStatus {
  smtCnt: number;        // 동시건수
  orders: string[];      // 작업접수번호 배열
  progressCd: string;    // 진행상태 코드 (원스톱·진행상태 등 판단)
}
