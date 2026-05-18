/**
 * worker 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 */

/* 작업자 정보 — GET /v1/reservations/{wrkRcpNo}/wroker */
// wrkFlowSttusCd='4'(당일 방문) 일 때만 조회 가능.
// TODO(backend): /wroker 엔드포인트 typo (worker?) — 백엔드 정본 확정 필요.
// TODO(backend): spotWrkUserPic 형식 협의 필요 (URL? base64?).
export interface Technician {
  spotWrkUserId: string;
  spotWrkUserNm: string;
  spotWrkUserHpNo: string;
  spotWrkUserPic: string;
}
