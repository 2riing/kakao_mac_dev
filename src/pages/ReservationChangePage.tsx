import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useReservation, useValidatedOrderParams } from "@entities/order";
import {
  ReservationDateStep,
  ReservationDoneStep,
  ReservationInfoCard,
  ReservationTimeStep,
} from "@components/order";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import CSNote from "@shared/ui/CSNote";
import PageHeader from "@shared/ui/PageHeader";
import PrimaryButton from "@shared/ui/PrimaryButton";
import ScreenContainer from "@shared/ui/ScreenContainer";
import Spinner from "@shared/ui/Spinner";

type Step = "view" | "date" | "time" | "done";

function ReservationChangePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  // 카카오 [예약 변경] 알림톡 진입 시 변경 흐름 직진
  const isChangeEntry = location.pathname.endsWith("/change");
  const [step, setStep] = useState<Step>(isChangeEntry ? "date" : "view");
  const [selDate, setSelDate] = useState<string | null>(null);
  const [selTime, setSelTime] = useState<string | null>(null);

  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);

  useEffect(() => {
    if (step === "view" && reservationQuery.isError) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [step, reservationQuery.isError, navigate]);

  // useValidatedOrderParams가 invalid 시 /error로 navigate. navigate 처리되는 동안 짧게 null
  if (!isValid) return null;

  return (
    <ScreenContainer>
      {step === "view" && (
        <>
          <PageHeader title="방문 예약 안내" />

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4">
            <div className="bg-kt-red-light border border-kt-red-border rounded-[12px] px-4 py-3.5 mb-4">
              <div className="text-[13px] text-kt-gray-700 leading-[1.65]">
                예정된 방문 작업을 확인해 주세요.
              </div>
            </div>

            {reservationQuery.isLoading || !reservationQuery.data ? (
              <div className="flex items-center justify-center py-10">
                <Spinner color="red" size="lg" />
              </div>
            ) : (
              <ReservationInfoCard
                reservation={reservationQuery.data}
                variant="detailed"
              />
            )}

            <CSNote />
          </div>

          <BottomFixedBar>
            <PrimaryButton onClick={() => setStep("date")}>
              예약 변경
            </PrimaryButton>
          </BottomFixedBar>
        </>
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
