import axios from "axios";
import { getMockResponse } from "./mock";
import { AUTH_STORAGE_KEY } from "@shared/constants/storageKeys";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 15_000,
});

// mock 분기 — VITE_USE_MOCK=true일 때 매칭되는 요청은 fixture 응답으로 대체
if (USE_MOCK) {
  apiClient.interceptors.request.use((config) => {
    const mock = getMockResponse(config);
    if (mock) {
      config.adapter = async () => mock;
    }
    return config;
  });
}

// 401 시 로그인 페이지로 리다이렉트 (refresh 미사용 — 액세스 토큰 10분 정책)
// 단, 이미 /login·/error 안에서 401이 떨어지면 무한 리다이렉트 회피 위해 skip
const AUTH_REDIRECT_SKIP = new Set(["/login", "/error"]);

// 동시 다발 401(한 화면에서 여러 query 병렬 호출)이 redirect를 중복 트리거하지 않도록 락.
// location.href 이동 시 페이지가 통째로 리로드되므로 별도 해제 불필요.
let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !AUTH_REDIRECT_SKIP.has(window.location.pathname) &&
      !isRedirecting
    ) {
      isRedirecting = true;
      // 서버 토큰 만료/무효 → 클라이언트 인증 흔적 제거 (좀비 세션 방지)
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
