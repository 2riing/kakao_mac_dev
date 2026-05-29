import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import reservationMock from "../../__mocks__/reservation.json";
import workerMock from "../../__mocks__/worker.json";
import orderMock from "../../__mocks__/order.json";
import custphoneMock from "../../__mocks__/custphone.json";
import { todayYmd, addDaysYmd } from "@shared/lib/formatters";
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

const AVAILABILITY_SLOT_TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;
const AVAILABILITY_DAYS = 20;

// 오늘 기준 상대 날짜로 생성 — 고정 날짜 mock이 시간 경과로 비활성화되는 문제 방지.
// 가용 패턴은 결정적((dayIndex+slotIndex) % 3)이라 일부 슬롯은 "마감"으로 표시됨.
function buildAvailability() {
  const from = todayYmd();
  const availability = Array.from({ length: AVAILABILITY_DAYS }, (_, day) => ({
    rsrvDate: addDaysYmd(from, day),
    slots: AVAILABILITY_SLOT_TIMES.map((rsrvTod, slot) => ({
      rsrvTod,
      available: (day + slot) % 3 !== 0,
    })),
  }));
  return { from, to: addDaysYmd(from, AVAILABILITY_DAYS - 1), availability };
}

const mockRules: MockRule[] = [
  // auth
  { method: "POST", pattern: /\/auth\/otp\/request$/,                 data: null },
  { method: "POST", pattern: /\/auth\/otp\/verify$/,                  data: null },
  { method: "GET",  pattern: /\/auth\/phonenum\/[^/]+$/,              data: () => pickRandom(custphoneMock.candidates) },
  // order
  { method: "GET",  pattern: /\/order\/status\/[^/]+/,                data: orderMock },
  { method: "GET",  pattern: /\/order\/worker\/[^/]+$/,               data: () => pickRandom(workerMock.candidates) },
  { method: "GET",  pattern: /\/reservation\/[^/]+$/,                 data: () => pickRandom(reservationMock.candidates) },
  { method: "GET",  pattern: /\/reservations\/[^/]+\/availability/,   data: () => buildAvailability() },
  { method: "PATCH", pattern: /\/reservations\/[^/]+$/,               data: { ok: true, updatedCnt: 1 } },
  { method: "POST", pattern: /\/reservations\/[^/]+\/confirm$/,       data: { ok: true } },
];

// e2e 에러 케이스 트리거 — 매직 wrkRcpNo가 URL에 있으면 해당 분류 요청을 비즈니스 에러로 응답.
// 백엔드 정합 시 mock 폴더와 함께 삭제.
const ERROR_TRIGGER = {
  query: "1O20260518EEEEE", // 모든 GET 조회 실패
  mutation: "1O20260518AAAAA", // POST/PATCH 실패
  availability: "1O20260518BBBBB", // availability GET만 실패 (throwOnError 예외 검증용)
} as const;

function envelope(
  data: unknown,
  config: InternalAxiosRequestConfig,
): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  } as AxiosResponse;
}

export function getMockResponse(
  config: InternalAxiosRequestConfig,
): AxiosResponse | null {
  const method = (config.method ?? "GET").toUpperCase();
  const url = config.url ?? "";

  const matched = mockRules.find(
    (r) => r.method === method && r.pattern.test(url),
  );
  if (!matched) return null;

  // 에러 트리거 (e2e용) — matched 요청에 한해 분류별 에러 envelope 반환
  const isAvailability = /\/availability/.test(url);
  const triggered =
    (url.includes(ERROR_TRIGGER.availability) && isAvailability) ||
    (url.includes(ERROR_TRIGGER.query) && method === "GET") ||
    (url.includes(ERROR_TRIGGER.mutation) &&
      (method === "POST" || method === "PATCH"));
  if (triggered) {
    return envelope(
      { resultCode: 4000, resultMessage: "처리에 실패했습니다 (mock)", data: null },
      config,
    );
  }

  const resolved =
    typeof matched.data === "function"
      ? (matched.data as () => unknown)()
      : matched.data;

  return envelope(
    {
      resultCode: RESULT_CODE_OK,
      resultMessage: "success (mock)",
      data: resolved,
    },
    config,
  );
}
