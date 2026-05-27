import { ApiError } from "@shared/api/unwrap";
import { INLINE_MESSAGES } from "@shared/config/messages";

// mutation/query 에러 → 화면 표시용 한국어 메시지
// - ApiError (envelope resultCode != OK): 백엔드 resultMessage 그대로
// - 네트워크/timeout: 한국어 fallback
// - 그 외: 메시지 있으면 그대로, 없으면 unknown
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) {
    const msg = err.message ?? "";
    if (!msg || /network|timeout/i.test(msg)) return INLINE_MESSAGES.network;
    return msg;
  }
  return INLINE_MESSAGES.unknown;
}
