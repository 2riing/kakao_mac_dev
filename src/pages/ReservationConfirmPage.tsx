import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useConfirmReservation,
  useReservation,
  useValidatedOrderParams,
} from "@entities/order";
import { ReservationDoneStep, ReservationOverview } from "@components/order";
import { formatVisitDate, formatTimeRange } from "@shared/lib/formatters";
import ScreenContainer from "@shared/ui/ScreenContainer";
import LoadingView from "@shared/ui/LoadingView";
import ConfirmDialog from "@shared/ui/ConfirmDialog";

type Stage = "view" | "done";

function ReservationConfirmPage() {
  const navigate = useNavigate();
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  const [stage, setStage] = useState<Stage>("view");
  const [dialogOpen, setDialogOpen] = useState(false);

  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);
  const confirmMutation = useConfirmReservation();

  // 조회 실패는 throwOnError → ErrorBoundary가 처리
  if (reservationQuery.isLoading || !reservationQuery.data) {
    return (
      <ScreenContainer>
        <LoadingView />
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
      <ReservationOverview
        reservation={reservation}
        primaryLabel="예약 확정"
        onPrimary={() => setDialogOpen(true)}
      />

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
