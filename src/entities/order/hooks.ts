import { useQuery } from "@tanstack/react-query";
import { getOrderStatus, getWorker } from "./api";

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
