import { ApiError } from "@shared/api/unwrap";
import { ERROR_MESSAGES } from "@shared/constants/messages";

// mutation/query 에러 → 화면 표시용 한국어 메시지
// - ApiError (envelope resultCode != OK): 백엔드 resultMessage 그대로 (사용자 노출용 비즈니스 메시지)
// - 네트워크/timeout: 한국어 fallback
// - 그 외(axios raw, 5xx 등): 내부 정보 노출 방지 위해 unknown으로 가림
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) {
    const msg = err.message ?? "";
    if (!msg || /network|timeout/i.test(msg)) return ERROR_MESSAGES.NETWORK.desc;
    return ERROR_MESSAGES.UNKNOWN.desc;
  }
  return ERROR_MESSAGES.UNKNOWN.desc;
}
