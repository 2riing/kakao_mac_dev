import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  useConfirmReservation,
  useReservation,
  useValidatedOrderParams,
} from "@entities/order";
import { ReservationDoneStep, ReservationInfoCard } from "@components/order";
import { formatVisitDate, formatTimeRange } from "@shared/lib/formatters";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import ConfirmDialog from "@shared/ui/ConfirmDialog";

type Stage = "view" | "done";

function ReservationConfirmPage() {
  const navigate = useNavigate();
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  const [stage, setStage] = useState<Stage>("view");
  const [dialogOpen, setDialogOpen] = useState(false);

  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);
  const confirmMutation = useConfirmReservation();

  useEffect(() => {
    if (reservationQuery.isError) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [reservationQuery.isError, navigate]);

  if (reservationQuery.isLoading || !reservationQuery.data) {
    return (
      <ScreenContainer>
        <div className="flex-1 flex items-center justify-center">
          <Spinner color="red" size="lg" />
        </div>
      </ScreenContainer>
    );
  }

  const reservation = reservationQuery.data;

  function handleConfirm() {
    confirmMutation.mutate(wrkRcpNo, {
      onSuccess: () => {
        setDialogOpen(false);
        setStage("done");
      },
      onError: () => {
        setDialogOpen(false);
        navigate("/error", {
          replace: true,
          state: { code: "CONFIRM_FAILED" },
        });
      },
    });
  }

  if (stage === "done") {
    return (
      <ScreenContainer>
        <ReservationDoneStep
          variant="confirmed"
          date={reservation.rsrvDate}
          time={reservation.rsrvTod}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0">
        <span className="text-[16px] font-bold text-kt-ink">방문 예약 안내</span>
      </div>

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
        <PrimaryButton onClick={() => setDialogOpen(true)}>
          예약 확정
        </PrimaryButton>
      </BottomFixedBar>

      <ConfirmDialog
        open={dialogOpen}
        title="예약을 확정하시겠습니까?"
        desc={`${formatVisitDate(reservation.rsrvDate)}\n${formatTimeRange(reservation.rsrvTod)}`}
        cancelLabel="취소"
        confirmLabel="확정"
        loading={confirmMutation.isPending}
        onCancel={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </ScreenContainer>
  );
}

export default ReservationConfirmPage;
