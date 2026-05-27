import axios from "axios";
import { getMockResponse } from "./mock";

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !AUTH_REDIRECT_SKIP.has(window.location.pathname)
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
