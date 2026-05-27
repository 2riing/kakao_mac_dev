/**
 * 백엔드 응답 표준 envelope 형식.
 * 모든 API 응답이 { resultCode, resultMessage, data } 구조로 옴.
 * data 타입 T는 도메인별 응답 (Reservation, Technician 등).
 *
 * - resultCode === "2000" → 정상, data 사용 가능
 * - 그 외 코드 → 실패, unwrap에서 ApiError throw
 *
 * 정본 정의: docs/api.yaml + 03-spec/02-backend-handoff.md
 */
export interface Envelope<T> {
  resultCode: string;
  resultMessage: string;
  data: T;
}

/** 정상 응답 판정 코드 — unwrap() 에서 이 값과 비교. 사내 표준. */
export const RESULT_CODE_OK = "2000";
