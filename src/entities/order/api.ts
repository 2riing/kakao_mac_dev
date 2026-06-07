import { apiClient } from "@shared/api/client";
import { unwrap } from "@shared/api/unwrap";
import type { Envelope } from "@shared/api/envelope";
import type {
  AvailabilityResponse,
  OrderViewType,
  Reservation,
  ReservationConfirmResult,
  ReservationDetailResponse,
  ReservationPatchPayload,
  ReservationPatchResult,
  Technician,
} from "./types";

// 진입 게이트 — viewType(1=청약상세, 2=예약변경)별 진입 가능 여부를 백엔드가 판단.
// 정상(2000)이면 body 없음, 진입 불가면 에러코드 → ApiError. OTP 인증 전 호출 가능.
export async function getOrderStatus(
  wrkRcpNo: string,
  viewType: OrderViewType,
): Promise<null> {
  const { data } = await apiClient.get<Envelope<null>>(
    `/order/status/${wrkRcpNo}/${viewType}`,
  );
  // unwrap 결과(null) 반환 — TanStack Query는 queryFn의 undefined 반환을 금지하므로 void 불가.
  return unwrap(data);
}

// wrkFlowSttusCd='4'(수령)일 때만 조회 가능.
export async function getWorker(wrkRcpNo: string): Promise<Technician> {
  const { data } = await apiClient.get<Envelope<Technician>>(
    `/order/worker/${wrkRcpNo}`,
  );
  return unwrap(data);
}

function toReservation(api: ReservationDetailResponse): Reservation {
  return {
    rsrvDate: api.reservationDate.slice(0, 10),
    rsrvTod: `${api.reservationTimeOfDay.slice(0, 2)}:${api.reservationTimeOfDay.slice(2)}`,
    smtCnt: api.sameTimeOrderCount,
    orders: api.orders.map((o) => ({
      wrkRcpNo: o.workReceiptNo,
      serviceLctgNm: o.serviceLctgNm,
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

// 단일 wrkRcpNo로 변경 요청 → 백엔드가 동시성 기준으로 자동 처리
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
