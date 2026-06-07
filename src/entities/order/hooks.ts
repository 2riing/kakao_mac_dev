import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WRK_RCP_NO_REGEX } from "@shared/lib/formatters";
import {
  confirmReservation,
  getAvailability,
  getOrderStatus,
  getReservationByWrkRcpNo,
  getWorker,
  patchReservation,
} from "./api";
import type { OrderViewType, ReservationPatchPayload } from "./types";

// 라우트 파라미터 검증 + invalid 시 /error(ORDER_INVALID) 자동 리다이렉트.
// 모든 order 도메인 페이지가 동일 가드를 갖도록 통일.
export function useValidatedOrderParams(): {
  wrkRcpNo: string;
  isValid: boolean;
} {
  const navigate = useNavigate();
  const { wrkRcpNo = "" } = useParams<{ wrkRcpNo: string }>();
  const isValid = WRK_RCP_NO_REGEX.test(wrkRcpNo);

  useEffect(() => {
    if (!isValid) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [isValid, navigate]);

  return { wrkRcpNo, isValid };
}

// 진입 게이트 조회 — viewType(1=청약상세, 2=예약변경). 차단 시 ApiError → throwOnError → ErrorBoundary.
export function useOrderStatus(wrkRcpNo: string | null, viewType: OrderViewType) {
  return useQuery({
    queryKey: ["order", "status", wrkRcpNo, viewType],
    queryFn: () => getOrderStatus(wrkRcpNo!, viewType),
    enabled: !!wrkRcpNo,
  });
}

export function useWorker(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["order", "worker", wrkRcpNo],
    queryFn: () => getWorker(wrkRcpNo!),
    enabled: !!wrkRcpNo,
    // worker는 당일방문일 때만 존재 → 없거나 실패해도 ErrorBoundary로 안 보냄.
    // OrderDetailPage가 worker 데이터 유무로 조건부 렌더 (없으면 작업자 카드 숨김).
    throwOnError: false,
  });
}

export function useReservation(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["order", "reservation", wrkRcpNo],
    queryFn: () => getReservationByWrkRcpNo(wrkRcpNo!),
    enabled: !!wrkRcpNo,
  });
}

export function useAvailability(
  wrkRcpNo: string | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["order", "availability", wrkRcpNo, from, to],
    queryFn: () => getAvailability(wrkRcpNo!, from, to),
    enabled: !!wrkRcpNo && !!from && !!to,
    // 날짜/시간 조회 실패는 캘린더 안에서 "다시 시도"로 처리 → ErrorBoundary로 안 보냄
    throwOnError: false,
  });
}

export function useChangeReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      wrkRcpNo,
      payload,
    }: {
      wrkRcpNo: string;
      payload: ReservationPatchPayload;
    }) => patchReservation(wrkRcpNo, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order", "reservation"] });
    },
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (wrkRcpNo: string) => confirmReservation(wrkRcpNo),
    onSuccess: (_, wrkRcpNo) => {
      qc.invalidateQueries({ queryKey: ["order", "reservation", wrkRcpNo] });
    },
  });
}
