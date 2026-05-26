import { test, expect } from "@playwright/test";
import { seedAuth } from "../fixtures/auth";

const WRK_RCP_NO = "1O2026051812345";
const RSRV_DATE = "202605281000";

test.describe("reservation change flow (인증 시드 + /change 직진)", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: WRK_RCP_NO });
  });

  test("/change 진입 시 date step부터 시작", async ({ page }) => {
    await page.goto(`/order/reservation/${WRK_RCP_NO}/${RSRV_DATE}/change`);
    await expect(page.getByText("예약 변경", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("변경하실 날짜를 선택해 주세요.")).toBeVisible();
    await expect(page.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  test("date → time → done 진입 (availability mock에 살아있는 날짜 선택)", async ({
    page,
  }) => {
    await page.goto(`/order/reservation/${WRK_RCP_NO}/${RSRV_DATE}/change`);

    const nextBtn = page.getByRole("button", { name: "다음" });

    const enabledDay = page
      .locator('button:not([disabled])')
      .filter({ hasText: /^\d{1,2}$/ })
      .first();
    await enabledDay.click();

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText("원하시는 시간대를 선택해 주세요.")).toBeVisible({
      timeout: 5000,
    });

    const availableSlot = page
      .getByRole("button", { name: /\d{2}:00 ~ \d{2}:00/ })
      .filter({ hasNotText: "마감" })
      .first();
    await availableSlot.click();

    await page.getByRole("button", { name: "예약 변경하기" }).click();

    await expect(page.getByText("예약이 변경되었습니다")).toBeVisible({ timeout: 5000 });
  });
});
