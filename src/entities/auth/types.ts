/**
 * auth 도메인 타입 — 15-backend-handoff.md v0.1 정본 기반.
 */

/* 마스킹된 고객 연락처 — GET /v1/orders/{wrkRcpNo}/custphone */
export interface CustPhoneMask {
  custPhoneMask: string; // 예: "010-****-5678"
}

/* OTP 발송 요청 — POST /v1/auth/otp/request */
export interface OtpRequestPayload {
  wrkRcpNo: string;
}

/* OTP 검증 — POST /v1/auth/otp/verify */
// 응답 헤더로 토큰 전달 (Set-Cookie HttpOnly 또는 Authorization Bearer).
// TODO(backend): wrkRcpNo 함께 보낼지 여부 확정 필요 (현재 정본은 otpNo only).
export interface OtpVerifyPayload {
  otpNo: string;
}

/* 클라이언트 인증 상태 */
export interface AuthState {
  isAuthenticated: boolean;
  wrkRcpNo: string | null;
  setAuthenticated: (wrkRcpNo: string) => void;
  clear: () => void;
}
