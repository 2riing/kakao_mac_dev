import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type { OrderStatus } from "./types";

export async function getOrderStatus(wrkRcpNo: string): Promise<OrderStatus> {
  const { data } = await apiClient.get<Envelope<OrderStatus>>(
    `/orders/${wrkRcpNo}/status`,
  );
  return unwrap(data);
}
