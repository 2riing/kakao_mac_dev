import { RESULT_CODE_OK, type Envelope } from "./envelope";

export class ApiError extends Error {
  resultCode: number;

  constructor(resultCode: number, message: string) {
    super(message);
    this.resultCode = resultCode;
    this.name = "ApiError";
  }
}

export function unwrap<T>(envelope: Envelope<T>): T {
  // 형식 검증 — 프록시 에러 HTML·빈 응답·구조 깨진 응답을 일반 Error로 차단.
  // (ApiError가 아니므로 ErrorBoundary가 UNKNOWN으로 처리 → 내부정보 미노출)
  const raw = envelope as unknown;
  if (
    raw == null ||
    typeof raw !== "object" ||
    typeof (raw as { resultCode?: unknown }).resultCode !== "number"
  ) {
    throw new Error("Invalid response envelope");
  }
  if (envelope.resultCode !== RESULT_CODE_OK) {
    throw new ApiError(envelope.resultCode, envelope.resultMessage);
  }
  return envelope.data;
}
