// 페이지 인라인 표시용 짧은 메시지 (페이지 fallback 아닌 form 옆 빨강 안내 등)
export const INLINE_MESSAGES = {
  throttleRetry: "잠시 후 다시 시도해 주세요.",
  network: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  unknown: "알 수 없는 오류가 발생했습니다.",
} as const;

// ErrorPage 진입 시 ?code= 로 전달되는 코드별 표시 문구
// /error?code=ORDER_INVALID 형식
export const ERROR_PAGE_MESSAGES: Record<
  string,
  { title: string; desc: string }
> = {
  ORDER_INVALID: {
    title: "예약 정보를 확인할 수 없습니다",
    desc: "현재 예약 정보를 확인할 수 없습니다.\n자세한 사항은 고객센터로 문의해 주세요.",
  },
  CONFIRM_FAILED: {
    title: "예약 확정에 실패했습니다",
    desc: "잠시 후 다시 시도해 주세요.\n계속 실패하면 고객센터로 문의해 주세요.",
  },
  NETWORK: {
    title: "네트워크 오류",
    desc: "네트워크 상태를 확인하고\n다시 시도해 주세요.",
  },
  UNKNOWN: {
    title: "오류가 발생했습니다",
    desc: "잠시 후 다시 시도해 주세요.",
  },
  INVALID_ENTRY: {
    title: "비정상적인 접근입니다",
    desc: "잘못된 경로로 진입했습니다.\n카카오톡 알림에서 다시 시도해 주세요.",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_PAGE_MESSAGES;

export function getErrorPageMessage(code: string | null) {
  if (code && code in ERROR_PAGE_MESSAGES) {
    return ERROR_PAGE_MESSAGES[code];
  }
  return ERROR_PAGE_MESSAGES.UNKNOWN;
}
