import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type { Technician } from "./types";

// 정본 15번 엔드포인트 그대로: /wroker (백엔드 worker/wroker typo 확정 필요).
// wrkFlowSttusCd='4'(당일 방문) 일 때만 조회 가능.
export async function getWorker(wrkRcpNo: string): Promise<Technician> {
  const { data } = await apiClient.get<Envelope<Technician>>(
    `/reservations/${wrkRcpNo}/wroker`,
  );
  return unwrap(data);
}
