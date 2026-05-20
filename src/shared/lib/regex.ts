// 작업접수번호: "1O" + YYYYMMDD(8) + 16진수 일련번호(5, 0-9A-F) = 15자 (예: 1O2026082012345, 1O20260820ABCDE)
export const WRK_RCP_NO_REGEX = /^1O\d{8}[0-9A-F]{5}$/;
export const OTP_REGEX = /^\d{6}$/;
export const PHONE_REGEX = /^01[016789]\d{7,8}$/;
