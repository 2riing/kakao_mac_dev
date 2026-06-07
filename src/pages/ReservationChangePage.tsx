import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReservation, useValidatedOrderParams } from "@entities/order";
import {
  ReservationDateStep,
  ReservationDoneStep,
  ReservationOverview,
  ReservationTimeStep,
} from "@components/order";
import ScreenContainer from "@shared/ui/ScreenContainer";
import LoadingView from "@shared/ui/LoadingView";

type Step = "view" | "date" | "time" | "done";

function ReservationChangePage() {
  const navigate = useNavigate();
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  // 진입 시 예약 정보(view) 먼저 → [예약 변경] 버튼으로 날짜 선택 흐름 진입
  const [step, setStep] = useState<Step>("view");
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);

  // 조회 실패는 throwOnError → ErrorBoundary가 처리
  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);

  // useValidatedOrderParams가 invalid 시 /error로 navigate. navigate 처리되는 동안 짧게 null
  if (!isValid) return null;

  return (
    <ScreenContainer>
      {step === "view" &&
        (reservationQuery.isLoading || !reservationQuery.data ? (
          <LoadingView />
        ) : (
          <ReservationOverview
            reservation={reservationQuery.data}
            primaryLabel="예약 변경"
            onPrimary={() => setStep("date")}
          />
        ))}

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
          onError={() =>
            navigate("/error", {
              replace: true,
              state: { code: "CHANGE_FAILED" },
            })
          }
        />
      )}

      {step === "done" && selDate && selTime && (
        <ReservationDoneStep variant="changed" date={selDate} time={selTime} />
      )}
    </ScreenContainer>
  );
}

export default ReservationChangePage;
