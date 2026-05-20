import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type {
  AvailabilityResponse,
  Reservation,
  ReservationConfirmResult,
  ReservationPatchPayload,
  ReservationPatchResult,
} from "./types";

export async function getReservationByWrkRcpNo(
  wrkRcpNo: string,
): Promise<Reservation> {
  const { data } = await apiClient.get<Envelope<Reservation>>(
    `/reservations/${wrkRcpNo}`,
  );
  return unwrap(data);
}

export async function getAvailability(
  wrkRcpNo: string,
  from: string,
  to: string,
): Promise<AvailabilityResponse> {
  const { data } = await apiClient.get<Envelope<AvailabilityResponse>>(
    `/reservations/${wrkRcpNo}/availability`,
    { params: { from, to } },
  );
  return unwrap(data);
}

// 단일 wrkRcpNo로 변경 요청 → 백엔드가 동시건 묶음을 자동 일괄 처리.
export async function patchReservation(
  wrkRcpNo: string,
  payload: ReservationPatchPayload,
): Promise<ReservationPatchResult> {
  const { data } = await apiClient.patch<Envelope<ReservationPatchResult>>(
    `/reservations/${wrkRcpNo}`,
    payload,
  );
  return unwrap(data);
}

export async function confirmReservation(
  wrkRcpNo: string,
): Promise<ReservationConfirmResult> {
  const { data } = await apiClient.post<Envelope<ReservationConfirmResult>>(
    `/reservations/${wrkRcpNo}/confirm`,
  );
  return unwrap(data);
}
