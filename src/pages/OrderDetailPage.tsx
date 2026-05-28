import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useReservation,
  useValidatedOrderParams,
  useWorker,
} from "@entities/order";
import { ReservationInfoCard, WorkerCard } from "@components/order";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
import CSNote from "@shared/ui/CSNote";
import Spinner from "@shared/ui/Spinner";

function OrderDetailPage() {
  const navigate = useNavigate();
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);
  const workerQuery = useWorker(isValid ? wrkRcpNo : null);

  useEffect(() => {
    if (reservationQuery.isError || workerQuery.isError) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [reservationQuery.isError, workerQuery.isError, navigate]);

  const reservation = reservationQuery.data;
  const worker = workerQuery.data;

  if (!reservation || !worker) {
    return (
      <ScreenContainer>
        <div className="flex-1 flex items-center justify-center">
          <Spinner color="red" size="lg" />
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader title="오늘의 방문 안내" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4">
        <div className="bg-kt-red-light border border-kt-red-border rounded-[12px] px-4 py-3.5 mb-4">
          <div className="text-[15px] font-bold text-kt-ink leading-[1.55]">
            엔지니어가 오늘 방문 예정입니다.
          </div>
        </div>

        <div className="mb-3">
          <WorkerCard worker={worker} />
        </div>

        <div className="mb-3">
          <ReservationInfoCard reservation={reservation} variant="detailed" />
        </div>

        <CSNote />
      </div>
    </ScreenContainer>
  );
}

export default OrderDetailPage;
