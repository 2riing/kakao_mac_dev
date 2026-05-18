import { useQuery } from "@tanstack/react-query";
import { getOrderStatus } from "./api";

export function useOrderStatus(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["order", "status", wrkRcpNo],
    queryFn: () => getOrderStatus(wrkRcpNo!),
    enabled: !!wrkRcpNo,
  });
}
