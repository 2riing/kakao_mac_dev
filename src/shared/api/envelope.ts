/**
 * 백엔드 응답 표준 envelope 형식.
 * 모든 API 응답이 { resultCode, resultMessage, data } 구조로 옴.
 * data 타입 T는 도메인별 응답 (Reservation, Technician 등).
 *
 * - resultCode === 2000 → 정상, data 사용 가능. 그 외 코드 unwrap에서 ApiError throw
 * 백엔드가 extraBoolean을 같이 내려주지만 클라이언트는 사용하지 않으므로 envelope에서는 제외
 */
export interface Envelope<T> {
  resultCode: number;
  resultMessage: string;
  data: T;
}

/** 정상 응답 판정 코드 — unwrap() 에서 이 값과 비교 **/
export const RESULT_CODE_OK = 2000;
