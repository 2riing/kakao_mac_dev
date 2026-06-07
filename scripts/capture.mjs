// 설계리뷰용 시나리오별 화면 캡쳐 (일회성). iPhone 14 (WebKit).
// dev 서버(VITE_USE_MOCK=true, :8080)가 떠 있어야 함.
// 예약 확정(02 시나리오)은 라우트 주석처리 상태 → 제외.
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://localhost:8080";
const OUT = path.resolve("captures");
const DEVICE = devices["Pixel 7"];
const AUTH_KEY = "kakao-webview-auth";

// pickRandom 인덱스 고정용 Math.random 값 (candidates: 0=단일 1=멀티 3=트리플)
const RAND = { single: 0.1, multi: 0.3, triple: 0.7 };

function seedAuthInit(wrkRcpNo) {
  return [
    (args) => {
      const [key, no] = args;
      sessionStorage.setItem(
        key,
        JSON.stringify({ state: { isAuthenticated: true, wrkRcpNo: no }, version: 0 }),
      );
    },
    [AUTH_KEY, wrkRcpNo],
  ];
}
function fixRandomInit(value) {
  return [(v) => { Math.random = () => v; }, value];
}

let browser;
async function newPage({ auth, rand } = {}) {
  const ctx = await browser.newContext({ ...DEVICE });
  const page = await ctx.newPage();
  // dev 전용 TanStack Query Devtools 플로팅 버튼 숨김 (prod 빌드엔 없음)
  await page.addInitScript(() => {
    const css = ".tsqd-parent-container{display:none !important}";
    const inject = () => {
      const s = document.createElement("style");
      s.textContent = css;
      document.documentElement.appendChild(s);
    };
    if (document.head || document.documentElement) inject();
    else addEventListener("DOMContentLoaded", inject);
  });
  if (rand !== undefined) {
    const [fn, arg] = fixRandomInit(rand);
    await page.addInitScript(fn, arg);
  }
  if (auth) {
    const [fn, arg] = seedAuthInit(auth);
    await page.addInitScript(fn, arg);
  }
  return page;
}

function dir(name) {
  const d = path.join(OUT, name);
  fs.mkdirSync(d, { recursive: true });
  return d;
}
async function shot(page, file) {
  await page.waitForTimeout(350); // 애니메이션/렌더 안정화
  await page.screenshot({ path: file });
  console.log("  ✓", path.relative(OUT, file));
}

const WRK = "1O2026051812345";

async function scenario01() {
  const d = dir("01-예약변경");
  const page = await newPage({ rand: RAND.triple }); // view는 트리플로 풍성하게
  // 미인증 진입 → /login redirect
  await page.goto(`${BASE}/order/change/${WRK}`);
  await page.getByText("본인인증", { exact: true }).waitFor();
  await shot(page, path.join(d, "01-otp-본인인증.png"));

  // OTP 발송
  await page.getByRole("button", { name: "인증번호 받기" }).click();
  await page.getByPlaceholder("인증번호 입력 (6자리)").waitFor();
  await shot(page, path.join(d, "02-otp-발송-타이머.png"));

  // OTP 입력
  await page.getByPlaceholder("인증번호 입력 (6자리)").fill("123456");
  await page.getByRole("button", { name: "확인" }).waitFor();
  await shot(page, path.join(d, "03-otp-입력완료.png"));

  // 인증 통과 → view
  await page.getByRole("button", { name: "확인" }).click();
  await page.getByText("방문 예약 안내").waitFor();
  await shot(page, path.join(d, "04-예약정보-view.png"));

  // view → date
  await page.getByRole("button", { name: "예약 변경" }).click();
  await page.getByText("변경하실 날짜를 선택해 주세요.").waitFor();
  await shot(page, path.join(d, "05-캘린더-date.png"));

  // 날짜 선택
  const enabledDay = page
    .locator("button:not([disabled])")
    .filter({ hasText: /^\d{1,2}$/ })
    .first();
  await enabledDay.click();
  await shot(page, path.join(d, "06-날짜선택.png"));

  // date → time
  await page.getByRole("button", { name: "다음" }).click();
  await page.getByText("원하시는 시간대를 선택해 주세요.").waitFor();
  await shot(page, path.join(d, "07-시간대-time.png"));

  // 시간 선택
  const slot = page
    .getByRole("button", { name: /\d{2}:00 ~ \d{2}:00/ })
    .filter({ hasNotText: "마감" })
    .first();
  await slot.click();
  await shot(page, path.join(d, "08-시간선택.png"));

  // time → done
  await page.getByRole("button", { name: "예약 변경하기" }).click();
  await page.getByText("예약이 변경되었습니다").waitFor();
  await shot(page, path.join(d, "09-변경완료-done.png"));

  await page.context().close();
}

async function scenario02() {
  const d = dir("02-예약정보-데이터케이스");
  const cases = [
    ["single", "01-단일-인터넷.png"],
    ["multi", "02-멀티-인터넷+TV.png"],
    ["triple", "03-트리플-인터넷TV전화.png"],
  ];
  for (const [key, file] of cases) {
    const page = await newPage({ auth: WRK, rand: RAND[key] });
    await page.goto(`${BASE}/order/change/${WRK}`);
    await page.getByText("방문 예약 안내").waitFor();
    await shot(page, path.join(d, file));
    await page.context().close();
  }
}

async function scenario03() {
  const d = dir("03-가드-에러분기");
  const steps = [
    ["01-루트차단.png", `${BASE}/`, null],
    ["02-login직접진입차단.png", `${BASE}/login`, null],
    ["03-error-직접진입-UNKNOWN.png", `${BASE}/error`, null],
    ["04-catch-all-미정의경로.png", `${BASE}/random-path`, null],
    ["05-error-ORDER_INVALID.png", `${BASE}/order/detail/INVALID_FORMAT`, WRK], // 인증시드 필요
  ];
  for (const [file, url, auth] of steps) {
    const page = await newPage(auth ? { auth } : {});
    await page.goto(url);
    await page.waitForLoadState("networkidle").catch(() => {});
    await shot(page, path.join(d, file));
    await page.context().close();
  }
}

async function scenario04() {
  const d = dir("04-청약상세-오늘방문");
  const page = await newPage({ auth: WRK, rand: RAND.triple });
  await page.goto(`${BASE}/order/detail/${WRK}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(500);
  await shot(page, path.join(d, "01-청약상세.png"));
  await page.context().close();
}

async function scenario05() {
  const d = dir("05-도움말");
  const page = await newPage();
  await page.goto(`${BASE}/help`);
  await page.waitForLoadState("networkidle").catch(() => {});
  await shot(page, path.join(d, "01-help.png"));
  await page.context().close();
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  browser = await chromium.launch();
  try {
    console.log("01-예약변경 (전체 플로우)");      await scenario01();
    console.log("02-예약정보 데이터케이스");        await scenario02();
    console.log("03-가드-에러분기");                await scenario03();
    console.log("04-청약상세-오늘방문");            await scenario04();
    console.log("05-도움말");                       await scenario05();
  } finally {
    await browser.close();
  }
  console.log("\n완료 →", OUT);
}
main().catch((e) => { console.error(e); process.exit(1); });
