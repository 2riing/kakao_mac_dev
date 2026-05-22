import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useReservation, useConfirmReservation } from "@entities/order";
import { ReservationInfoCard } from "@components/order";
import { formatVisitDate, formatTimeRange } from "@shared/lib/formatters";
import { isValidWrkRcpNo } from "@shared/lib/validators";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import CheckIcon from "@shared/ui/CheckIcon";
import ConfirmDialog from "@shared/ui/ConfirmDialog";

type Stage = "view" | "done";

function ReservationConfirmPage() {
  const navigate = useNavigate();
  const { wrkRcpNo = "" } = useParams<{
    wrkRcpNo: string;
    reservationDate: string;
  }>();

  const [stage, setStage] = useState<Stage>("view");
  const [dialogOpen, setDialogOpen] = useState(false);

  const isFormatValid = isValidWrkRcpNo(wrkRcpNo);
  const reservationQuery = useReservation(isFormatValid ? wrkRcpNo : null);
  const confirmMutation = useConfirmReservation();

  useEffect(() => {
    if (!isFormatValid) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [isFormatValid, navigate]);

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
        <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0">
          <span className="text-[16px] font-bold text-kt-ink">예약 확정</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CheckIcon />
          <div className="mt-[18px] mb-2 text-[20px] font-bold text-kt-ink">
            예약이 확정되었습니다
          </div>
          <div className="mb-6 text-[13px] text-kt-gray-500 text-center leading-[1.7]">
            방문 당일 예약 정보를
            <br />
            별도로 안내드립니다.
          </div>

          <ReservationInfoCard reservation={reservation} variant="summary" />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0">
        <span className="text-[16px] font-bold text-kt-ink">방문 예약 안내</span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-[100px]">
        <div className="bg-kt-red-light border border-kt-red-border rounded-[12px] px-4 py-3.5 mb-4">
          <div className="text-[13px] text-kt-gray-700 leading-[1.65]">
            예정된 방문 작업을 확인해 주세요.
          </div>
        </div>

        <ReservationInfoCard reservation={reservation} variant="detailed" />

        <div className="text-[12px] text-kt-gray-500 text-center mt-4 mb-1">
          ⚠ 방문 1일 전까지 변경 가능합니다.
        </div>
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
