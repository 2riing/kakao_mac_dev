import { getSpotWrkTypeLabel, type Reservation } from "@entities/order";
import { formatVisitDate, formatTimeRange } from "@shared/lib/formatters";
import InfoRow from "@shared/ui/InfoRow";

interface ReservationInfoCardProps {
  reservation: Reservation;
  variant?: "detailed" | "summary";
}

// 오더별 "작업종류 - 상품명" 멀티라인 렌더링
function OrderTypeList({
  orders,
}: {
  orders: Reservation["orders"];
}) {
  return (
    <div className="flex flex-col gap-[3px]">
      {orders.map((o) => {
        const typeLabel = getSpotWrkTypeLabel(o.spotWrkTypeCd);
        const product = o.prodDescNm?.trim();
        return (
          <div key={o.wrkRcpNo}>
            {typeLabel}
            {product ? ` - ${product}` : ""}
          </div>
        );
      })}
    </div>
  );
}

function ReservationInfoCard({
  reservation,
  variant = "detailed",
}: ReservationInfoCardProps) {
  const dateLabel = formatVisitDate(reservation.rsrvDate);
  const timeLabel = formatTimeRange(reservation.rsrvTod);

  if (variant === "summary") {
    return (
      <div className="w-full bg-kt-gray-100 border border-kt-border rounded-[12px] px-4 pt-4 pb-1">
        <InfoRow label="방문 예정일" value={dateLabel} />
        <InfoRow label="방문 시간대" value={timeLabel} />
        <InfoRow
          label="작업 종류"
          value={<OrderTypeList orders={reservation.orders} />}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] px-4 pt-3.5 pb-1 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="text-[14px] font-bold text-kt-ink mb-3 pb-[11px] border-b border-kt-gray-200">
        방문 예약 정보
      </div>
      <InfoRow label="방문 예정일" value={dateLabel} />
      <InfoRow label="방문 시간대" value={timeLabel} />
      <InfoRow
        label="작업 종류"
        value={<OrderTypeList orders={reservation.orders} />}
      />
    </div>
  );
}

export default ReservationInfoCard;
