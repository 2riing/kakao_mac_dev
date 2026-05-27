import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type {
  AvailabilityResponse,
  Reservation,
  ReservationConfirmResult,
  ReservationDetailResponse,
  ReservationPatchPayload,
  ReservationPatchResult,
  Technician,
} from "../types";

// wrkFlowSttusCd='4'(당일 방문) 일 때만 조회 가능.
export async function getWorker(wrkRcpNo: string): Promise<Technician> {
  const { data } = await apiClient.get<Envelope<Technician>>(
    `/order/worker/${wrkRcpNo}`,
  );
  return unwrap(data);
}

// 백엔드 풀이름 응답 → 도메인(사내 약어) 변환.
// 응답의 spotWorkTypeCode는 reservation 단위 코드 1개 — 모든 오더에 동일 적용.
// 오더별 종류 분기가 필요하면 백엔드와 spotWorkTypeCode 의미·세분화 합의 필요.
function toReservation(api: ReservationDetailResponse): Reservation {
  return {
    rsrvDate: api.reservationDate.slice(0, 10),
    rsrvTod: `${api.reservationTimeOfDay.slice(0, 2)}:${api.reservationTimeOfDay.slice(2)}`,
    smtCnt: api.sameTimeOrderCount,
    orders: api.orders.map((o) => ({
      wrkRcpNo: o.workReceiptNo,
      spotWrkTypeCd: api.spotWorkTypeCode,
      prodDescNm: o.serviceName,
    })),
  };
}

export async function getReservationByWrkRcpNo(
  wrkRcpNo: string,
): Promise<Reservation> {
  const { data } = await apiClient.get<Envelope<ReservationDetailResponse>>(
    `/reservation/${wrkRcpNo}`,
  );
  return toReservation(unwrap(data));
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
