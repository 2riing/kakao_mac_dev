// 도움말 탭별 풀페이지 캡처 (스크롤 없이 전체 내용 한 장).
// 이 앱은 화면 높이 고정 컨테이너 안쪽(.overflow-y-auto)에서만 스크롤되므로
// fullPage가 안 먹음 → 탭마다 콘텐츠 높이를 재서 뷰포트 높이를 늘린 뒤 캡처.
// dev 서버(:8080)가 떠 있어야 함. 실행: node scripts/capture-help-tabs.mjs
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:8080";
// 출력 하위 폴더를 인자로 받음. 예: node scripts/capture-help-tabs.mjs 원본
const SUB = process.argv[2] ?? "";
const OUT = path.resolve("captures/help-tabs", SUB);
const DEVICE = devices["Pixel 7"];
const W = DEVICE.viewport.width;
const H = DEVICE.viewport.height;
const TABS = [
  { label: "인터넷", file: "help-internet.png" },
  { label: "TV", file: "help-tv.png" },
  { label: "전화", file: "help-phone.png" },
];

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...DEVICE });
const page = await ctx.newPage();
await page.addInitScript(() => {
  const s = document.createElement("style");
  s.textContent = ".tsqd-parent-container{display:none !important}";
  (document.head || document.documentElement).appendChild(s);
});

await page.goto(`${BASE}/help`);
await page.waitForLoadState("networkidle").catch(() => {});

for (const tab of TABS) {
  // 기본 뷰포트로 되돌려 정확한 콘텐츠 높이 측정 (콘텐츠가 넘쳐야 scrollHeight가 실제값)
  await page.setViewportSize({ width: W, height: H });
  await page.getByText(tab.label, { exact: true }).first().click();
  await page.waitForTimeout(250);

  // 스크롤 영역의 (상단오프셋 + 전체 콘텐츠 높이) = 필요한 뷰포트 높이
  const needed = await page.evaluate(() => {
    const el = document.querySelector(".overflow-y-auto");
    if (!el) return null;
    const top = el.getBoundingClientRect().top;
    return Math.ceil(top + el.scrollHeight + 8);
  });

  await page.setViewportSize({ width: W, height: needed ?? H });
  await page.waitForTimeout(100);
  await page.screenshot({ path: path.join(OUT, tab.file) });
  console.log("  ✓", tab.file, `(${W}x${needed})`);
}

await browser.close();
console.log("\n완료 →", OUT);
