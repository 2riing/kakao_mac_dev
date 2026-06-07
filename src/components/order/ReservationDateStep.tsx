import { useState } from "react";
import {
  RESERVATION_CHANGE_WINDOW_DAYS,
  useAvailability,
} from "@entities/order";
import { addDaysYmd, formatVisitDate, todayYmd } from "@shared/lib/formatters";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import Calendar from "@shared/ui/Calendar";
import PageHeader from "@shared/ui/PageHeader";
import PrimaryButton from "@shared/ui/PrimaryButton";
import StepBar from "@shared/ui/StepBar";

interface ReservationDateStepProps {
  wrkRcpNo: string;
  onNext: (rsrvDate: string) => void;
  onBack: () => void;
}

function ReservationDateStep({ wrkRcpNo, onNext, onBack }: ReservationDateStepProps) {
  const fromYmd = todayYmd();
  const toYmdStr = addDaysYmd(fromYmd, RESERVATION_CHANGE_WINDOW_DAYS);

  const availabilityQuery = useAvailability(wrkRcpNo, fromYmd, toYmdStr);
  const availability = availabilityQuery.data;

  const [sel, setSel] = useState<string | null>(null);

  // 가용 슬롯이 하나도 없는 날짜는 비활성
  function isDayDisabled(ymd: string): boolean {
    const day = availability?.availability.find((a) => a.rsrvDate === ymd);
    if (!day) return true;
    return !day.slots.some((s) => s.available);
  }

  return (
    <>
      <PageHeader title="예약 변경" onBack={onBack} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-4">
        <StepBar current={1} total={2} />
        <div className="text-[15px] font-semibold text-kt-ink mb-4">
          변경하실 날짜를 선택해 주세요.
        </div>

        <Calendar
          selected={sel}
          onSelect={setSel}
          minDate={fromYmd}
          maxDate={toYmdStr}
          today={fromYmd}
          isDayDisabled={isDayDisabled}
          loading={availabilityQuery.isLoading}
          error={availabilityQuery.isError}
          onRetry={() => availabilityQuery.refetch()}
        />

        {sel && (
          <div className="text-[13px] text-kt-gray-700 text-center mt-1 font-medium">
            {" "}
            <span className="text-kt-red font-bold">{formatVisitDate(sel)}</span>
          </div>
        )}
      </div>

      <BottomFixedBar>
        <PrimaryButton onClick={() => sel && onNext(sel)} disabled={!sel}>
          다음
        </PrimaryButton>
      </BottomFixedBar>
    </>
  );
}

export default ReservationDateStep;
