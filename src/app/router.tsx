import { Routes, Route, Navigate } from "react-router";
import AuthGuard from "./AuthGuard";
import LoginOtpPage from "@pages/LoginOtpPage";
import ReservationConfirmPage from "@pages/ReservationConfirmPage";
import ReservationChangePage from "@pages/ReservationChangePage";
import TodayVisitPage from "@pages/TodayVisitPage";
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
      <Route path="/order/confirm/:wrkRcpNo/:reservationDate" element={<ReservationConfirmPage />} />

      {/* protected — AuthGuard 통과해야 진입 */}
      <Route element={<AuthGuard />}>
        {/* 상세 조회 (View 진입) */}
        <Route path="/order/reservation/:wrkRcpNo/:reservationDate" element={<ReservationChangePage />} />
        {/* 변경 직진 (카카오 [예약 변경] 버튼) — 같은 컴포넌트, 초기 step만 다름 */}
        <Route path="/order/reservation/:wrkRcpNo/:reservationDate/change" element={<ReservationChangePage />} />
        {/* 당일 작업자 정보 */}
        <Route path="/order/today/:wrkRcpNo/:reservationDate" element={<TodayVisitPage />} />
      </Route>

      {/* fallback */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

export default AppRouter;
