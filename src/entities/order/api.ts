import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type { OrderStatus, Technician } from "./types";

export async function getOrderStatus(
  wrkRcpNo: string,
  reservationDate: string,
): Promise<OrderStatus> {
  const { data } = await apiClient.get<Envelope<OrderStatus>>(
    `/order/status/${wrkRcpNo}`,
    { params: { reservationDate } },
  );
  return unwrap(data);
}

// wrkFlowSttusCd='4'(당일 방문) 일 때만 조회 가능.
export async function getWorker(wrkRcpNo: string): Promise<Technician> {
  const { data } = await apiClient.get<Envelope<Technician>>(
    `/order/worker/${wrkRcpNo}`,
  );
  return unwrap(data);
}
