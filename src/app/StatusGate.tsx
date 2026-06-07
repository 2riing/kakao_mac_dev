import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { useOrderStatus, type OrderViewType } from "@entities/order";
import { WRK_RCP_NO_REGEX } from "@shared/lib/formatters";
import ScreenContainer from "@shared/ui/ScreenContainer";
import LoadingView from "@shared/ui/LoadingView";

// 진입 게이트 — 인증(AuthGuard)보다 먼저 status를 조회해 진입 가능 여부를 확인.
// viewType: 청약상세=1, 예약변경=2. 백엔드가 판단해 차단 시 에러코드 → ApiError
// → throwOnError → ErrorBoundary(ORDER_INVALID). 통과해야 login/페이지로 넘어감.
function StatusGate() {
  const { wrkRcpNo = "" } = useParams<{ wrkRcpNo: string }>();
  const location = useLocation();
  const isValid = WRK_RCP_NO_REGEX.test(wrkRcpNo);
  const viewType: OrderViewType = location.pathname.includes("/order/change")
    ? "2"
    : "1";

  const statusQuery = useOrderStatus(isValid ? wrkRcpNo : null, viewType);

  if (!isValid) {
    return <Navigate to="/error" state={{ code: "ORDER_INVALID" }} replace />;
  }
  // 차단(에러)은 throwOnError로 ErrorBoundary가 처리 → 여기선 로딩만 대기
  if (!statusQuery.isSuccess) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }
  return <Outlet />;
}

export default StatusGate;
