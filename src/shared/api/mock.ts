import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import reservationMock from "../../__mocks__/reservation.json";
import workerMock from "../../__mocks__/worker.json";
import orderMock from "../../__mocks__/order.json";
import custphoneMock from "../../__mocks__/custphone.json";
import availabilityMock from "../../__mocks__/availability.json";
import { RESULT_CODE_OK } from "./envelope";

type MockData = unknown | (() => unknown);

interface MockRule {
  method: string;
  pattern: RegExp;
  data: MockData;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const mockRules: MockRule[] = [
  // auth
  { method: "POST", pattern: /\/auth\/otp\/request$/,                 data: null },
  { method: "POST", pattern: /\/auth\/otp\/verify$/,                  data: null },
  { method: "GET",  pattern: /\/auth\/phonenum\/[^/]+$/,              data: () => pickRandom(custphoneMock.candidates) },
  // order
  { method: "GET",  pattern: /\/order\/status\/[^/]+/,                data: orderMock },
  { method: "GET",  pattern: /\/order\/worker\/[^/]+$/,               data: () => pickRandom(workerMock.candidates) },
  // reservation
  { method: "GET",  pattern: /\/reservations\/[^/]+\/availability/,   data: availabilityMock },
  { method: "GET",  pattern: /\/reservations\/[^/]+$/,                data: () => pickRandom(reservationMock.candidates) },
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

  const resolved = typeof matched.data === "function"
    ? (matched.data as () => unknown)()
    : matched.data;

  return {
    data: {
      resultCode: RESULT_CODE_OK,
      resultMessage: "success (mock)",
      data: resolved,
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  } as AxiosResponse;
}
