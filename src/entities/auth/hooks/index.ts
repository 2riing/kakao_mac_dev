import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { requestOtp, verifyOtp, getMaskedCustPhone } from "../api";
import { useAuthStore } from "../store";
import type { OtpRequestPayload, OtpVerifyPayload } from "../types";

/* 인증 상태 selector */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

export function useWrkRcpNo(): string | null {
  return useAuthStore((state) => state.wrkRcpNo);
}

/* 마스킹 연락처 조회 */
export function useMaskedCustPhone(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["auth", "custphone", wrkRcpNo],
    queryFn: () => getMaskedCustPhone(wrkRcpNo as string),
    enabled: !!wrkRcpNo,
  });
}

/* OTP mutation */
export function useRequestOtp() {
  return useMutation({
    mutationFn: (payload: OtpRequestPayload) => requestOtp(payload),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: OtpVerifyPayload) => verifyOtp(payload),
  });
}

/* OTP UI 타이머 (LoginOtpPage 전용) */
interface UseOtpTimerReturn {
  timer: number;
  start: () => void;
  reset: () => void;
}

export function useOtpTimer(duration: number = 180): UseOtpTimerReturn {
  const [timer, setTimer] = useState(duration);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (running && timer > 0) {
      timerRef.current = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [running, timer]);

  function start(): void {
    setTimer(duration);
    setRunning(true);
  }

  function reset(): void {
    setTimer(duration);
    setRunning(false);
  }

  return { timer, start, reset };
}
