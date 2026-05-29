import { Component, type ReactNode } from "react";
import { ApiError } from "@shared/api/unwrap";
import type { ErrorCode } from "@shared/constants/messages";
import ErrorPage from "@pages/ErrorPage";

interface Props {
  children: ReactNode;
}
interface State {
  error: unknown;
}

// 렌더 중 throw된 에러를 잡아 ErrorPage로 대체 (흰 화면 방지).
// - throwOnError로 던져진 조회 실패(ApiError) → ORDER_INVALID
// - 그 외 예상 밖 크래시(TypeError 등) → UNKNOWN
// 이벤트 핸들러·비동기 에러는 못 잡음 — 그쪽은 mutation onError·Query 에러로 처리.
class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error };
  }

  componentDidCatch(error: unknown) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (this.state.error !== null) {
      const code: ErrorCode =
        this.state.error instanceof ApiError ? "ORDER_INVALID" : "UNKNOWN";
      return <ErrorPage code={code} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
