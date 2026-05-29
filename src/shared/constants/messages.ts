// 에러/안내 표시 메시지 통합.
// desc: 페이지 설명 + 인라인 한 줄 공용 (인라인은 desc만 사용). 인라인 겸용 항목은 \n 없이 한 문장.
// title: 페이지 전용. 인라인만 쓰는 항목(RETRY 등)은 생략.
export const ERROR_MESSAGES: Record<string, { title?: string; desc: string }> = {
  ORDER_INVALID: {
    title: "예약 정보를 확인할 수 없습니다",
    desc: "현재 예약 정보를 확인할 수 없습니다",
  },
  CONFIRM_FAILED: {
    title: "예약 확정에 실패했습니다",
    desc: "잠시 후 다시 시도해 주세요",
  },
  CHANGE_FAILED: {
    title: "예약 변경에 실패했습니다",
    desc: "잠시 후 다시 시도해 주세요",
  },
  INVALID_ENTRY: {
    title: "비정상적인 접근입니다",
    desc: "잘못된 경로로 진입했습니다",
  },
  NETWORK: {
    title: "네트워크 오류",
    desc: "네트워크 상태를 확인하고 다시 시도해 주세요",
  },
  UNKNOWN: {
    title: "오류가 발생했습니다",
    desc: "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요",
  },
  // 인라인 전용 — 재발송 쿨다운 안내 (에러 아님, 페이지로 안 감)
  RETRY: {
    desc: "잠시 후 다시 시도해 주세요",
  },
};

export type ErrorCode = keyof typeof ERROR_MESSAGES;
