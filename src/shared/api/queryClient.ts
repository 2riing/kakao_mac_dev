import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      // 조회 실패는 렌더 중 throw → ErrorBoundary가 일괄 처리 (페이지별 isError 분기 제거).
      // 인라인 처리할 쿼리는 개별 hook에서 throwOnError: false로 끔 (예: useAvailability).
      throwOnError: true,
    },
  },
});
