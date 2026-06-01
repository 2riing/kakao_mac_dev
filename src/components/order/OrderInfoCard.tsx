import { type Reservation } from "@entities/order";
import { formatVisitDate, formatTimeRange } from "@shared/lib/formatters";
import InfoRow from "@shared/ui/InfoRow";

interface OrderInfoCardProps {
  reservation: Reservation;
  variant?: "detailed" | "summary";
}

type Category = "INTERNET" | "TV" | "PHONE";

// serviceLctgNm(카테고리명) → 아이콘 카테고리. 인터넷전화/일반전화는 PHONE 아이콘 공용.
// 라벨은 serviceLctgNm 원문을 그대로 표시(5종 구분 유지). 아이콘만 현재 3종 매핑.
function getCategory(lctgNm: string): Category {
  if (lctgNm === "TV") return "TV";
  if (lctgNm.includes("전화")) return "PHONE";
  return "INTERNET";
}

function CategoryIcon({ category }: { category: Category }) {
  if (category === "TV") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 21h6M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (category === "PHONE") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="17.5" r="0.9" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2 9c5.5-5 14.5-5 20 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5.5 12.5c3.5-3 9.5-3 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 16c1.5-1.3 4.5-1.3 6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1.1" fill="currentColor" />
    </svg>
  );
}

// 방문 일시 한 줄 — "M월 D일"(검정 강조) "요일"(회색) "HH:00 ~ HH:00"(검정)
function VisitDateTimeRow({
  rsrvDate,
  rsrvTod,
}: {
  rsrvDate: string;
  rsrvTod: string;
}) {
  const [, m, d] = rsrvDate.split("-").map(Number);
  const dow = formatVisitDate(rsrvDate).match(/\(([가-힣])\)/)?.[1] ?? "";
  return (
    <div className="text-[18px] font-bold text-kt-ink">
      {m}월 {d}일 {dow}요일 {formatTimeRange(rsrvTod)}
    </div>
  );
}

function OrderItem({
  serviceLctgNm,
  prodDescNm,
}: {
  serviceLctgNm: string;
  prodDescNm: string;
}) {
  const category = getCategory(serviceLctgNm);
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-10 h-10 rounded-lg bg-kt-gray-100 flex items-center justify-center text-kt-gray-700 shrink-0">
        <CategoryIcon category={category} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-bold text-kt-ink truncate">
          {prodDescNm || serviceLctgNm}
        </div>
        <div className="text-[12px] text-kt-gray-500 mt-px">
          {serviceLctgNm}
        </div>
      </div>
    </div>
  );
}

function OrderInfoCard({
  reservation,
  variant = "detailed",
}: OrderInfoCardProps) {
  const dateLabel = formatVisitDate(reservation.rsrvDate);
  const timeLabel = formatTimeRange(reservation.rsrvTod);

  if (variant === "summary") {
    return (
      <div className="w-full bg-white border border-kt-border rounded-[12px] px-4 pt-4 pb-1 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        <InfoRow label="방문 예정일" value={dateLabel} />
        <InfoRow label="방문 시간대" value={timeLabel} />
        <InfoRow
          label="작업 종류"
          value={
            <div className="flex flex-col gap-[3px]">
              {reservation.orders.map((o) => (
                <div key={o.wrkRcpNo}>
                  {o.prodDescNm ? ` - ${o.prodDescNm}` : ""}
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[12px] px-4 pt-5 pb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      {/* 방문 예정일 강조 */}
      <div className="mb-1">
        <div className="text-[12px] text-kt-gray-500 mb-1.5 font-medium">
          방문 예정일
        </div>
        <VisitDateTimeRow
          rsrvDate={reservation.rsrvDate}
          rsrvTod={reservation.rsrvTod}
        />
      </div>

      {/* 작업 종류 섹션 */}
      <div className="mt-5 pt-4 border-t border-kt-gray-200">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[12px] text-kt-gray-500 font-medium">
            작업 종류
          </span>
          <span className="text-[12px] text-kt-gray-500">
            {reservation.orders.length}건
          </span>
        </div>
        <div className="divide-y divide-kt-gray-200">
          {reservation.orders.map((o) => (
            <OrderItem
              key={o.wrkRcpNo}
              serviceLctgNm={o.serviceLctgNm}
              prodDescNm={o.prodDescNm}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderInfoCard;
