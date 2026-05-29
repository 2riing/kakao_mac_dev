import { test, expect } from "@playwright/test";
import { seedAuth } from "../fixtures/auth";

const WRK_RCP_NO = "1O2026051812345";

test.describe("reservation change flow (인증 시드 + /order/change)", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: WRK_RCP_NO });
  });

  test("진입 시 예약 정보(view) 화면 → [예약 변경] → 날짜 선택", async ({ page }) => {
    await page.goto(`/order/change/${WRK_RCP_NO}`);

    // view 단계 — 예약 정보 확인 화면
    await expect(page.getByText("방문 예약 안내")).toBeVisible();
    await page.getByRole("button", { name: "예약 변경" }).click();

    // date 단계
    await expect(page.getByText("변경하실 날짜를 선택해 주세요.")).toBeVisible();
    await expect(page.getByRole("button", { name: "다음" })).toBeDisabled();
  });

  test("view → date → time → done (날짜/시간 선택 후 변경 완료)", async ({
    page,
  }) => {
    await page.goto(`/order/change/${WRK_RCP_NO}`);

    await page.getByRole("button", { name: "예약 변경" }).click();

    const nextBtn = page.getByRole("button", { name: "다음" });

    // availability mock은 오늘 기준 동적 생성 — 현재 월에 선택 가능한 날짜 존재
    const enabledDay = page
      .locator("button:not([disabled])")
      .filter({ hasText: /^\d{1,2}$/ })
      .first();
    await enabledDay.click();

    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText("원하시는 시간대를 선택해 주세요.")).toBeVisible({
      timeout: 5000,
    });

    // 시간 슬롯 라벨은 formatTimeRange 형식("HH:00 ~ HH:00")
    const availableSlot = page
      .getByRole("button", { name: /\d{2}:00 ~ \d{2}:00/ })
      .filter({ hasNotText: "마감" })
      .first();
    await availableSlot.click();

    await page.getByRole("button", { name: "예약 변경하기" }).click();

    await expect(page.getByText("예약이 변경되었습니다")).toBeVisible({
      timeout: 5000,
    });
  });
});
