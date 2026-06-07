import { test, expect } from "@playwright/test";
import { seedAuth } from "../fixtures/auth";

const WRK_RCP_NO = "1O2026051812345";

test.describe("order detail flow (protected /order/detail)", () => {
  test("비인증 진입 → /login으로 리다이렉트 (AuthGuard 동작)", async ({ page }) => {
    await page.goto(`/order/detail/${WRK_RCP_NO}`);
    await expect(page).toHaveURL(/\/login$/);
  });

  test("인증 시드 + 정상 진입 → 작업자/예약 카드 노출", async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: WRK_RCP_NO });
    await page.goto(`/order/detail/${WRK_RCP_NO}`);

    await expect(page.getByText("청약상세")).toBeVisible();
    await expect(page.getByText("엔지니어가 오늘 방문 예정입니다.")).toBeVisible();

    await expect(page.getByText("방문 작업자 정보")).toBeVisible();
    await expect(page.getByText("방문 직원")).toBeVisible();

    const phoneLink = page.locator('a[href^="tel:"]').first();
    await expect(phoneLink).toBeVisible({ timeout: 5000 });
    await expect(phoneLink).toHaveText(/01\d-\d{3,4}-\d{4}/);
    await expect(phoneLink).toHaveAttribute("href", /^tel:01\d{8,9}$/);
  });

  test("잘못된 wrkRcpNo 포맷은 /error로 리다이렉트", async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: "invalid-format" });
    await page.goto(`/order/detail/invalid-format`);
    await expect(page).toHaveURL(/\/error$/);
  });
});
