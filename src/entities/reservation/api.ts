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

// 단일 일정으로 여러 wrkRcpNo 일괄 변경 (정본 15번 v0.1).
export async function patchReservations(
  payload: ReservationPatchPayload,
): Promise<ReservationPatchResult> {
  const { data } = await apiClient.patch<Envelope<ReservationPatchResult>>(
    "/reservations",
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
