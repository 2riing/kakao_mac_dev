import { test, expect } from "@playwright/test";

const WRK_RCP_NO = "1O2026051812345";
const TARGET_PATH = `/order/change/${WRK_RCP_NO}`;

test.describe("login (OTP) flow", () => {
  test("루트 직접 진입은 /error로 리다이렉트", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/error$/);
  });

  test("/login 직접 진입은 INVALID_ENTRY로 차단", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/error$/);
  });

  test("보호 라우트 진입 → /login으로 리다이렉트 → OTP 검증 → 원래 라우트 복귀", async ({
    page,
  }) => {
    await page.goto(TARGET_PATH);
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText("본인인증", { exact: true })).toBeVisible();

    await expect(page.locator('input[readonly]').first()).toHaveValue(/^010-\*{4}-\d{4}$/);

    await page.getByRole("button", { name: "인증번호 받기" }).click();

    const otpInput = page.getByPlaceholder("인증번호 입력 (6자리)");
    await expect(otpInput).toBeVisible();
    await otpInput.fill("123456");

    await page.getByRole("button", { name: "확인" }).click();

    await expect(page).toHaveURL(new RegExp(`${TARGET_PATH}$`));
  });
});
