// 진입 가능 여부는 백엔드가 status 게이트(viewType별 resultCode)로 판단.
// (구) wrkFlowSttusCd 기반 ENTRY_ALLOWED_STATUS·isEntryAllowed 로직은 제거됨.

// 예약 변경 가능한 미래 윈도우(일 단위). 캘린더 선택 가능 범위 제한에 사용.
export const RESERVATION_CHANGE_WINDOW_DAYS = 14;
