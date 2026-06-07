import { Routes, Route, Navigate } from "react-router-dom";
import StatusGate from "./StatusGate";
import AuthGuard from "./AuthGuard";
import LoginOtpPage from "@pages/LoginOtpPage";
// import ReservationConfirmPage from "@pages/ReservationConfirmPage";
import ReservationChangePage from "@pages/ReservationChangePage";
import OrderDetailPage from "@pages/OrderDetailPage";
import ErrorPage from "@pages/ErrorPage";
import HelpPage from "@pages/HelpPage";

function AppRouter() {
  return (
    <Routes>
      {/* root → 에러로 (직접 진입 차단) */}
      <Route path="/" element={<Navigate to="/error" replace />} />

      {/* public — 가드 없이 접근 */}
      <Route path="/login" element={<LoginOtpPage />} />
      <Route path="/help" element={<HelpPage />} />
      {/* <Route path="/order/confirm/:wrkRcpNo" element={<ReservationConfirmPage />} /> */}

      {/* protected — StatusGate(진입 게이트) → AuthGuard(인증) 순서 통과해야 진입 */}
      <Route element={<StatusGate />}>
        <Route element={<AuthGuard />}>
          {/* 예약 변경 */}
          <Route path="/order/change/:wrkRcpNo" element={<ReservationChangePage />} />
          {/* 청약 상세 조회 */}
          <Route path="/order/detail/:wrkRcpNo" element={<OrderDetailPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

export default AppRouter;
