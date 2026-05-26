import { test, expect } from "@playwright/test";

const WRK_RCP_NO = "1O2026051812345";
const RSRV_DATE = "202605281000";

test.describe("reservation confirm flow (public 라우트)", () => {
  test("진입 → 다이얼로그 열기 → 확정 → done 화면", async ({ page }) => {
    await page.goto(`/order/confirm/${WRK_RCP_NO}/${RSRV_DATE}`);

    await expect(page.getByText("방문 예약 안내")).toBeVisible();

    await page.getByRole("button", { name: "예약 확정" }).click();

    await expect(page.getByText("예약을 확정하시겠습니까?")).toBeVisible();

    await page.getByRole("button", { name: "확정", exact: true }).click();

    await expect(page.getByText("예약이 확정되었습니다")).toBeVisible({ timeout: 5000 });
  });

  test("잘못된 wrkRcpNo 포맷은 /error로 리다이렉트", async ({ page }) => {
    await page.goto(`/order/confirm/invalid-format/${RSRV_DATE}`);
    await expect(page).toHaveURL(/\/error$/);
  });
});
