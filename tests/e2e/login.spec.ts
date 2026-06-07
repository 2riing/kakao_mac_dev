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

  test("OTP 검증 실패(틀린 번호) → 에러 메시지 + 입력 초기화", async ({
    page,
  }) => {
    // C0000 = verify(검증)만 실패, 발송은 성공 (mock ERROR_TRIGGER.otpVerify)
    await page.goto(`/order/change/1O20260518C0000`);
    await expect(page).toHaveURL(/\/login$/);

    await page.getByRole("button", { name: "인증번호 받기" }).click();
    const otpInput = page.getByPlaceholder("인증번호 입력 (6자리)");
    await expect(otpInput).toBeVisible();
    await otpInput.fill("123456");
    await page.getByRole("button", { name: "확인" }).click();

    // 검증 실패 → 비즈니스 에러 메시지 + OTP 입력 초기화
    await expect(page.getByText("처리에 실패했습니다 (mock)")).toBeVisible();
    await expect(otpInput).toHaveValue("");
  });

  test("OTP 발송 실패 → 발송 에러 메시지 (OTP 입력 단계 미진입)", async ({
    page,
  }) => {
    // AAAAA = 모든 POST/PATCH 실패 → 발송(request) 단계에서 실패
    await page.goto(`/order/change/1O20260518AAAAA`);
    await expect(page).toHaveURL(/\/login$/);

    await page.getByRole("button", { name: "인증번호 받기" }).click();
    await expect(page.getByText("처리에 실패했습니다 (mock)")).toBeVisible();
  });
});
