import type { Page } from "@playwright/test";

const AUTH_STORAGE_KEY = "kakao-webview-auth";

export interface SeedAuthOptions {
  wrkRcpNo: string;
}

export async function seedAuth(page: Page, opts: SeedAuthOptions): Promise<void> {
  await page.addInitScript(
    ({ key, wrkRcpNo }) => {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          state: { isAuthenticated: true, wrkRcpNo },
          version: 0,
        }),
      );
    },
    { key: AUTH_STORAGE_KEY, wrkRcpNo: opts.wrkRcpNo },
  );
}

export async function clearAuth(page: Page): Promise<void> {
  await page.addInitScript((key) => sessionStorage.removeItem(key), AUTH_STORAGE_KEY);
}
