import axios from "axios";
import { getMockResponse } from "./mock";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config;

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await apiClient.post("/auth/refresh");
        return apiClient(original);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
