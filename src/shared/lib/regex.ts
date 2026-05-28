// 작업접수번호: "1O" + YYYYMMDD(8) + 16진수 일련번호(5, 0-9A-F) = 15자 (예: 1O2026082012345, 1O20260820ABCDE)
export const WRK_RCP_NO_REGEX = /^1O\d{8}[0-9A-F]{5}$/;
// 경로·문자열 내 검색용 (anchor 없음) — 라우트 구조 무관하게 wrkRcpNo 추출
export const WRK_RCP_NO_PATTERN = /1O\d{8}[0-9A-F]{5}/;
