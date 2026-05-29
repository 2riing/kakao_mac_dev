// 오더 진입 가능 wrkFlowSttusCd (작업 흐름 상태 코드)
// 예약 변경: 2,3 / 청약 상세: 2,3,4 (4=당일 방문)
export const ENTRY_ALLOWED_STATUS = {
  change: ["2", "3"],
  detail: ["2", "3", "4"],
} as const;

export type OrderEntryKind = keyof typeof ENTRY_ALLOWED_STATUS;

export function isEntryAllowed(
  kind: OrderEntryKind,
  wrkFlowSttusCd: string,
): boolean {
  return (ENTRY_ALLOWED_STATUS[kind] as readonly string[]).includes(
    wrkFlowSttusCd,
  );
}

// 예약 변경 가능한 미래 윈도우(일 단위). 캘린더 선택 가능 범위 제한에 사용.
export const RESERVATION_CHANGE_WINDOW_DAYS = 14;
