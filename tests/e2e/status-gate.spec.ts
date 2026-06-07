import { test, expect } from "@playwright/test";
import { seedAuth } from "../fixtures/auth";

// mock status 게이트 트리거 (src/shared/api/mock.ts ERROR_TRIGGER와 동기화)
const STATUS_BLOCK = "1O20260518D0000"; // status 진입 차단 (viewType 무관)
const NO_WORKER = "1O20260518F0000"; // 당일 아님 — worker 조회만 실패
const NORMAL = "1O2026060100000"; // 정상 (status OK, worker OK)

const ORDER_INVALID = "예약 정보를 확인할 수 없습니다";

test.describe("status gate — 진입 게이트(인증보다 먼저 status 판단)", () => {
  test("청약상세: status 차단 → ORDER_INVALID (인증 시드 있어도 차단)", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: STATUS_BLOCK });
    await page.goto(`/order/detail/${STATUS_BLOCK}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
  });

  test("예약변경: status 차단 → ORDER_INVALID", async ({ page }) => {
    await seedAuth(page, { wrkRcpNo: STATUS_BLOCK });
    await page.goto(`/order/change/${STATUS_BLOCK}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
  });

  test("status 차단 + 미인증 → login으로 안 보내고 ORDER_INVALID (게이트가 인증보다 먼저)", async ({
    page,
  }) => {
    await page.goto(`/order/detail/${STATUS_BLOCK}`);
    await expect(page.getByText(ORDER_INVALID, { exact: true })).toBeVisible();
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test("status 통과 + 미인증 → login으로 리다이렉트", async ({ page }) => {
    await page.goto(`/order/change/${NORMAL}`);
    await expect(page).toHaveURL(/\/login$/);
  });

  test("청약상세 정상 + 당일 아님(worker 없음) → 진입은 되고 작업자 카드만 미노출", async ({
    page,
  }) => {
    await seedAuth(page, { wrkRcpNo: NO_WORKER });
    await page.goto(`/order/detail/${NO_WORKER}`);

    // status/1 통과 → 청약상세 진입 성공
    await expect(page.getByText("청약상세")).toBeVisible();
    // worker 조회 실패 → 작업자 카드 + 당일방문 배너 미노출
    await expect(page.getByText("방문 작업자 정보")).toHaveCount(0);
    await expect(
      page.getByText("엔지니어가 오늘 방문 예정입니다."),
    ).toHaveCount(0);
  });
});
