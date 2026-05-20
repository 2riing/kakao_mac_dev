import { Routes, Route, Navigate } from "react-router";
import { AuthGuard } from "@components/auth";
import LoginOtpPage from "@pages/LoginOtpPage";
import ReservationConfirmPage from "@pages/ReservationConfirmPage";
import ReservationChangePage from "@pages/ReservationChangePage";
import OrderDetailViewPage from "@pages/OrderDetailViewPage";
import TodayVisitPage from "@pages/TodayVisitPage";
import ErrorPage from "@pages/ErrorPage";
import HelpPage from "@pages/HelpPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/error" replace />} />
      <Route path="/login" element={<LoginOtpPage />} />
      <Route path="/help" element={<HelpPage/>} />
      <Route path="/order/confirm/:wrkRcpNo/:reservationDate" element={<ReservationConfirmPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/reservation/change" element={<ReservationChangePage />} />
         <Route path="/reservation" element={<OrderDetailViewPage />} />
        <Route path="/visit/today" element={<TodayVisitPage />} />
      </Route>
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
}

export default AppRouter;
