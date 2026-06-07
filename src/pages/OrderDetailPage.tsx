import {
  useReservation,
  useValidatedOrderParams,
  useWorker,
} from "@entities/order";
import { OrderInfoCard, WorkerCard } from "@components/order";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
import NoticeBanner from "@shared/ui/NoticeBanner";
import CSNote from "@shared/ui/CSNote";
import LoadingView from "@shared/ui/LoadingView";

function OrderDetailPage() {
  const { wrkRcpNo, isValid } = useValidatedOrderParams();

  // 예약 정보(필수) 조회 실패는 throwOnError → ErrorBoundary가 처리
  const reservationQuery = useReservation(isValid ? wrkRcpNo : null);
  // worker는 당일방문일 때만 존재 → 옵셔널 (throwOnError:false, 데이터 유무로 조건부 렌더)
  const workerQuery = useWorker(isValid ? wrkRcpNo : null);

  const reservation = reservationQuery.data;
  const worker = workerQuery.data;

  // 로딩 판정은 필수 데이터(reservation)만. worker 유무에 묶지 않음 (2,3 진입 시 무한로딩 방지)
  if (reservationQuery.isLoading || !reservation) {
    return (
      <ScreenContainer>
        <LoadingView />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <PageHeader title="청약상세" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4">
        {/* 당일방문(worker 존재)일 때만 방문 안내 배너 + 작업자 카드 */}
        {worker && (
          <>
            <NoticeBanner className="mb-4">
              <div className="text-[15px] font-bold text-kt-ink leading-[1.55]">
                엔지니어가 오늘 방문 예정입니다.
              </div>
            </NoticeBanner>

            <div className="mb-3">
              <WorkerCard worker={worker} />
            </div>
          </>
        )}

        <div className="mb-3">
          <OrderInfoCard reservation={reservation} variant="detailed" />
        </div>

        <CSNote />
      </div>
    </ScreenContainer>
  );
}

export default OrderDetailPage;
