import { useQuery } from "@tanstack/react-query";
import { getWorker } from "./api";

export function useWorker(wrkRcpNo: string | null) {
  return useQuery({
    queryKey: ["worker", wrkRcpNo],
    queryFn: () => getWorker(wrkRcpNo!),
    enabled: !!wrkRcpNo,
  });
}
