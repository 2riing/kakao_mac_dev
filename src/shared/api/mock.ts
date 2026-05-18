import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import reservationMock from "../../__mocks__/reservation.json";
import workerMock from "../../__mocks__/worker.json";
import orderMock from "../../__mocks__/order.json";
import custphoneMock from "../../__mocks__/custphone.json";
import availabilityMock from "../../__mocks__/availability.json";
import { RESULT_CODE_OK } from "./envelope";

interface MockRule {
  method: string;
  pattern: RegExp;
  data: unknown;
}

const mockRules: MockRule[] = [
  // auth
  { method: "POST", pattern: /\/auth\/otp\/request$/,                 data: null },
  { method: "POST", pattern: /\/auth\/otp\/verify$/,                  data: null },
  // order
  { method: "GET",  pattern: /\/orders\/[^/]+\/custphone$/,           data: custphoneMock },
  { method: "GET",  pattern: /\/orders\/[^/]+\/status$/,              data: orderMock },
  // reservation
  { method: "GET",  pattern: /\/reservations\/[^/]+\/availability/,   data: availabilityMock },
  { method: "GET",  pattern: /\/reservations\/[^/]+\/wroker$/,        data: workerMock },
  { method: "GET",  pattern: /\/reservations\/[^/]+$/,                data: reservationMock },
  { method: "PATCH", pattern: /\/reservations$/,                      data: { ok: true, updatedCnt: 1 } },
  { method: "POST", pattern: /\/reservations\/[^/]+\/confirm$/,       data: { ok: true } },
];

export function getMockResponse(
  config: InternalAxiosRequestConfig,
): AxiosResponse | null {
  const matched = mockRules.find(
    (r) =>
      r.method === (config.method ?? "GET").toUpperCase() &&
      r.pattern.test(config.url ?? ""),
  );
  if (!matched) return null;

  return {
    data: {
      resultCode: RESULT_CODE_OK,
      resultMessage: "success (mock)",
      data: matched.data,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  } as AxiosResponse;
}
