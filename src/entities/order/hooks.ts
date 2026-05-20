import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  confirmReservation,
  getAvailability,
  getOrderStatus,
  getReservationByWrkRcpNo,
  getWorker,
  patchReservation,
} from "./api";
import type { ReservationPatchPayload } from "./types";

export function useOrderStatus(
  wrkRcpNo: string | null,
  reservationDate: string | null,
) {
  return useQuery({
    queryKey: ["order", "status", wrkRcpNo, reservationDate],
    queryFn: () => getOrderStatus(wrkRcpNo!, reservationDate!),
    enabled: !!wrkRcpNo && !!reservationDate,
  });
}

export function useWorker(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["order", "worker", wrkRcpNo],
    queryFn: () => getWorker(wrkRcpNo!),
    enabled: !!wrkRcpNo,
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
