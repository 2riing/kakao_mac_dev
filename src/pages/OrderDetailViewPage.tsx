import { useState } from "react";
import { useLocation, useParams } from "react-router";
import {
  ReservationDateStep,
  ReservationDoneStep,
  ReservationTimeStep,
} from "@components/order";
import { DAY_NAMES_KO } from "@shared/lib/calendar";
import ScreenContainer from "@shared/ui/ScreenContainer";

type Step = "view" | "date" | "time" | "done";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// 진입 시점 reservationDate(YYYYMMDDHHMM) → 변경 완료 화면의 "이전 일정" 표시용
function parseReservationDate(raw: string): {
  dateLabel: string;
  timeLabel: string;
} {
  if (raw.length < 12) return { dateLabel: raw, timeLabel: "" };
  const y = Number(raw.slice(0, 4));
  const m = Number(raw.slice(4, 6));
  const d = Number(raw.slice(6, 8));
  const hh = raw.slice(8, 10);
  const h = Number(hh);
  const dow = DAY_NAMES_KO[new Date(y, m - 1, d).getDay()];
  return {
    dateLabel: `${m}월 ${d}일 (${dow})`,
    timeLabel: `${hh}:00 ~ ${pad2(h + 1)}:00`,
  };
}

function OrderDetailViewPage() {
  const { wrkRcpNo, reservationDate } = useParams<{
    wrkRcpNo: string;
    reservationDate: string;
  }>();
  const location = useLocation();

  // 카카오 [예약 변경] 알림톡 진입 시 변경 흐름 직진
  const isChangeEntry = location.pathname.endsWith("/change");
  const [step, setStep] = useState<Step>(isChangeEntry ? "date" : "view");
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);

  if (!wrkRcpNo || !reservationDate) {
    return (
      <ScreenContainer>
        <main className="p-4">
          <h1 className="text-xl font-bold mb-4">잘못된 진입</h1>
          <p className="text-kt-gray-500">필수 파라미터가 누락되었습니다.</p>
        </main>
      </ScreenContainer>
    );
  }

  const prevInfo = parseReservationDate(reservationDate);

  return (
    <ScreenContainer>
      {step === "view" && (
        <main className="p-4 flex-1">
          <h1 className="text-xl font-bold mb-4">
            예약 확인 (Screen 2 placeholder)
          </h1>
          <p className="text-kt-gray-500 mb-1">wrkRcpNo: {wrkRcpNo}</p>
          <p className="text-kt-gray-500 mb-4">
            reservationDate: {reservationDate}
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-kt-red text-white rounded"
            onClick={() => setStep("date")}
          >
            예약 변경
          </button>
        </main>
      )}

      {step === "date" && (
        <ReservationDateStep
          wrkRcpNo={wrkRcpNo}
          onNext={(d) => {
            setSelDate(d);
            setStep("time");
          }}
          onBack={() => setStep("view")}
        />
      )}

      {step === "time" && selDate && (
        <ReservationTimeStep
          wrkRcpNo={wrkRcpNo}
          selDate={selDate}
          onNext={(t) => {
            setSelTime(t);
            setStep("done");
          }}
          onBack={() => setStep("date")}
        />
      )}

      {step === "done" && selDate && selTime && (
        <ReservationDoneStep
          prevDateLabel={prevInfo.dateLabel}
          prevTimeLabel={prevInfo.timeLabel}
          newDate={selDate}
          newTime={selTime}
        />
      )}
    </ScreenContainer>
  );
}

export default OrderDetailViewPage;
