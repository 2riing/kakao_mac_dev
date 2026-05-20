export const MESSAGES = {
  network: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
  authRequired: "다시 로그인해 주세요.",
  otpInvalid: "인증번호가 올바르지 않습니다.",
  otpExpired: "인증번호가 만료되었습니다. 재발송해 주세요.",
  wrkRcpNoInvalid: "작업접수번호 형식이 올바르지 않습니다.",
  phoneInvalid: "휴대폰번호 형식이 올바르지 않습니다.",
  reservationNotFound: "예약 정보를 찾을 수 없습니다.",
  unknownError: "알 수 없는 오류가 발생했습니다.",
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
} as const;

export type ErrorCode = keyof typeof ERROR_PAGE_MESSAGES;

export function getErrorPageMessage(code: string | null) {
  if (code && code in ERROR_PAGE_MESSAGES) {
    return ERROR_PAGE_MESSAGES[code];
  }
  return ERROR_PAGE_MESSAGES.UNKNOWN;
}
