import {
  useReservation,
  useValidatedOrderParams,
  useWorker,
} from "@entities/order";
import { ReservationInfoCard, WorkerCard } from "@components/order";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
import CSNote from "@shared/ui/CSNote";
import LoadingView from "@shared/ui/LoadingView";

function OrderDetailPage() {
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  // 조회 실패는 throwOnError → ErrorBoundary가 처리
  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);
  const workerQuery = useWorker(isValid ? wrkRcpNo : null);

  const reservation = reservationQuery.data;
  const worker = workerQuery.data;

  if (!reservation || !worker) {
    return (
      <ScreenContainer>
        <LoadingView />
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
