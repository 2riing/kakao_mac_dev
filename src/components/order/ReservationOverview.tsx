import type { Reservation } from "@entities/order";
import PageHeader from "@shared/ui/PageHeader";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import CSNote from "@shared/ui/CSNote";
import ReservationInfoCard from "./ReservationInfoCard";

interface ReservationOverviewProps {
  reservation: Reservation;
  primaryLabel: string;
  onPrimary: () => void;
}

// 청약 상세(확정)·예약 변경(view) 공통 — 방문 예약 확인 화면. 하단 버튼만 다름.
function ReservationOverview({
  reservation,
  primaryLabel,
  onPrimary,
}: ReservationOverviewProps) {
  return (
    <>
      <PageHeader title="방문 예약 안내" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4">
        <div className="bg-kt-red-light border border-kt-red-border rounded-[12px] px-4 py-3.5 mb-4">
          <div className="text-[13px] text-kt-gray-700 leading-[1.65]">
            예정된 방문 작업을 확인해 주세요.
          </div>
        </div>

        <ReservationInfoCard reservation={reservation} variant="detailed" />

        <CSNote />
      </div>

      <BottomFixedBar>
        <PrimaryButton onClick={onPrimary}>{primaryLabel}</PrimaryButton>
      </BottomFixedBar>
    </>
  );
}

export default ReservationOverview;
