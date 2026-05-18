import { Routes, Route, Navigate } from "react-router";
import { AuthGuard } from "@components/auth";
import LoginOtpPage from "@pages/LoginOtpPage";
import ReservationViewPage from "@pages/ReservationViewPage";
import ReservationChangePage from "@pages/ReservationChangePage";
import ConfirmPage from "@pages/ConfirmPage";
import TodayVisitPage from "@pages/TodayVisitPage";
import NotFoundPage from "@pages/NotFoundPage";
import ErrorPage from "@pages/ErrorPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginOtpPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/reservation" element={<ReservationViewPage />} />
        <Route path="/reservation/change" element={<ReservationChangePage />} />
        <Route path="/reservation/confirm" element={<ConfirmPage />} />
        <Route path="/visit/today" element={<TodayVisitPage />} />
      </Route>
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
