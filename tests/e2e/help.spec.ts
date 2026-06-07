import { test, expect } from "@playwright/test";

test.describe("help page (public)", () => {
  test("기본 진입 → 인터넷 탭 가이드 노출", async ({ page }) => {
    await page.goto("/help");

    await expect(page.getByText("조치방법 안내")).toBeVisible();
    await expect(page.getByText("인터넷이 평소와 다르신가요?")).toBeVisible();
    await expect(page.getByText("인터넷이 안돼요.")).toBeVisible();
  });

  test("탭 전환 → TV → 전화 intro 텍스트 변경", async ({ page }) => {
    await page.goto("/help");

    await page.getByRole("tab", { name: "TV", exact: true }).click();
    await expect(page.getByText("TV 시청에 어려움이 있으신가요?")).toBeVisible();

    await page.getByRole("tab", { name: "전화", exact: true }).click();
    await expect(page.getByText("전화 연결에 어려움이 있으신가요?")).toBeVisible();
  });

  test("전화 탭 — sections 소제목 구분 노출 (집전화/인터넷전화, 기업인터넷전화)", async ({
    page,
  }) => {
    await page.goto("/help");
    await page.getByRole("tab", { name: "전화", exact: true }).click();

    // 신버전 sections — 소제목 2개로 그룹 구분
    await expect(page.getByText("집전화 / 인터넷전화")).toBeVisible();
    await expect(page.getByText("기업인터넷전화", { exact: true })).toBeVisible();
    // 각 그룹의 대표 항목
    await expect(page.getByText("집전화가 안돼요.")).toBeVisible();
    await expect(
      page.getByText("LCD화면에 '등록이 되지 않습니다.' 라고 나와요."),
    ).toBeVisible();
  });

  test("i6 step에 ▶ 영상 가이드 링크가 외부로 열림 (href + target)", async ({
    page,
  }) => {
    await page.goto("/help");

    const link = page.getByRole("link", { name: "▶ 영상 가이드" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "https://kt.com/he56");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener.*noreferrer|noreferrer.*noopener/);
  });

  test("본문 스크롤 영역에 overscroll-behavior: contain 적용 (바운스 차단)", async ({
    page,
  }) => {
    await page.goto("/help");

    const guideScroll = await page
      .locator(".overflow-y-auto")
      .first()
      .evaluate((el) => getComputedStyle(el).overscrollBehaviorY);
    expect(guideScroll).toBe("contain");
  });
});
