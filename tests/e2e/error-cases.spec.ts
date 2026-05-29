import { test, expect } from "@playwright/test";
import { seedAuth } from "../fixtures/auth";

// mock 에러 트리거 wrkRcpNo (src/shared/api/mock.ts ERROR_TRIGGER와 동기화)
const ERR_QUERY = "1O20260518EEEEE"; // 모든 GET 조회 실패
const ERR_MUTATION = "1O20260518AAAAA"; // POST/PATCH 실패
const ERR_AVAIL = "1O20260518BBBBB"; // availability만 실패

// ORDER_INVALID 페이지 제목 / CHANGE_FAILED 제목 (constants/messages.ts와 동기화)
const ORDER_INVALID = "예약 정보를 확인할 수 없습니다";
const CHANGE_FAILED = "예약 변경에 실패했습니다";
const AVAIL_ERROR = "예약 가능 시간을 불러올 수 없습니다";

test.describe("error cases — throwOnError → ErrorBoundary", () => {
  test("청약 상세: 조회 실패 → ErrorBoundary가 ORDER_INVALID 화면 렌더", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: ERR_QUERY });
    await page.goto(`/order/detail/${ERR_QUERY}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
  });

  test("예약 변경: 조회 실패 → ORDER_INVALID 화면", async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: ERR_QUERY });
    await page.goto(`/order/change/${ERR_QUERY}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
  });

  test("로그인: 마스킹/상태 조회 실패 → ORDER_INVALID 화면 (OTP 화면 진입 차단)", async ({
    page,
  }) => {
    // 비인증 진입 → /login 리다이렉트 → phone/status 조회 실패 → ErrorBoundary
    await page.goto(`/order/detail/${ERR_QUERY}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
  });

  test("ErrorBoundary는 navigate가 아니라 화면만 교체 — URL은 유지", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: ERR_QUERY });
    await page.goto(`/order/detail/${ERR_QUERY}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
    // ErrorBoundary fallback이라 /error로 이동하지 않고 원래 경로 유지
    await expect(page).toHaveURL(new RegExp(`/order/detail/${ERR_QUERY}$`));
  });
});

test.describe("error cases — throwOnError 예외 (availability 인라인)", () => {
  test("날짜 조회 실패 → 에러페이지 안 가고 캘린더 인라인 에러 + 다시 시도", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: ERR_AVAIL });
    await page.goto(`/order/change/${ERR_AVAIL}`);

    // 예약 조회는 정상 → view 진입
    await page.getByRole("button", { name: "예약 변경" }).click();

    // 날짜 조회(availability)만 실패 → 캘린더 안에서 인라인 처리 (ErrorBoundary 우회)
    await expect(page.getByText(AVAIL_ERROR)).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();

    // ErrorBoundary로 안 끌려갔는지 확인 (ORDER_INVALID 화면 아님)
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toHaveCount(0);
  });
});

test.describe("error cases — mutation onError (throwOnError 미적용)", () => {
  test("예약 변경 mutation 실패 → CHANGE_FAILED 에러페이지로 navigate", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: ERR_MUTATION });
    await page.goto(`/order/change/${ERR_MUTATION}`);

    // 조회는 정상 → view → date → time 진행
    await page.getByRole("button", { name: "예약 변경" }).click();

    const enabledDay = page
      .locator("button:not([disabled])")
      .filter({ hasText: /^\d{1,2}$/ })
      .first();
    await enabledDay.click();
    await page.getByRole("button", { name: "다음" }).click();

    const slot = page
      .getByRole("button", { name: /\d{2}:00 ~ \d{2}:00/ })
      .filter({ hasNotText: "마감" })
      .first();
    await slot.click();

    await page.getByRole("button", { name: "예약 변경하기" }).click();

    // PATCH 실패 → onError → navigate("/error", CHANGE_FAILED)
    await expect(page).toHaveURL(/\/error$/);
    await expect(page.getByText(CHANGE_FAILED)).toBeVisible();
  });
});
