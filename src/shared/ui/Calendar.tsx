import { useState } from "react";
import { DAY_NAMES_KO, toTwoDigits, toYmd } from "@shared/lib/formatters";
import BackArrow from "./BackArrow";
import Spinner from "./Spinner";

interface CalendarProps {
  selected: string | null; // "YYYY-MM-DD"
  onSelect: (ymd: string) => void;
  minDate: string; // 선택 가능 시작 "YYYY-MM-DD"
  maxDate: string; // 선택 가능 끝 "YYYY-MM-DD"
  // 추가 비활성 조건 (예: availability 슬롯 없음). min/max 범위와 별개로 AND 적용.
  isDayDisabled?: (ymd: string) => boolean;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
}

// "YYYY-MM" 비교는 사전순 = 시간순이라 경계 판정에 그대로 사용.
function ym(y: number, m: number): string {
  return `${y}-${toTwoDigits(m)}`;
}

function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  isDayDisabled,
  loading = false,
  error = false,
  onRetry,
}: CalendarProps) {
  // 표시 월 — minDate 월로 초기화
  const [cm, setCm] = useState(() => {
    const [y, m] = minDate.split("-").map(Number);
    return { y, m };
  });

  const daysInMonth = new Date(cm.y, cm.m, 0).getDate();
  const firstDay = new Date(cm.y, cm.m - 1, 1).getDay();

  const cmYM = ym(cm.y, cm.m);
  const canPrev = cmYM > minDate.slice(0, 7);
  const canNext = cmYM < maxDate.slice(0, 7);

  function isDisabled(d: number): boolean {
    const ymd = toYmd(cm.y, cm.m, d);
    if (ymd < minDate || ymd > maxDate) return true;
    return isDayDisabled?.(ymd) ?? false;
  }

  function prevMonth() {
    setCm((c) => (c.m === 1 ? { y: c.y - 1, m: 12 } : { y: c.y, m: c.m - 1 }));
  }

  function nextMonth() {
    setCm((c) => (c.m === 12 ? { y: c.y + 1, m: 1 } : { y: c.y, m: c.m + 1 }));
  }

  return (
    <div className="bg-white rounded-xl p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="flex items-center justify-between mb-[14px]">
        <button
          onClick={prevMonth}
          disabled={!canPrev}
          className={`p-1.5 rounded-lg ${canPrev ? "" : "opacity-30 cursor-not-allowed"}`}
          type="button"
        >
          <BackArrow />
        </button>
        <span className="text-base font-bold text-kt-ink">
          {cm.y}년 {cm.m}월
        </span>
        <button
          onClick={nextMonth}
          disabled={!canNext}
          className={`p-1.5 rounded-lg -scale-x-100 ${canNext ? "" : "opacity-30 cursor-not-allowed"}`}
          type="button"
        >
          <BackArrow />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1.5">
        {DAY_NAMES_KO.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-1 ${
              i === 0
                ? "text-kt-red"
                : i === 6
                  ? "text-[#2060CC]"
                  : "text-kt-gray-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="min-h-[228px] flex items-center justify-center">
          <Spinner color="red" size="lg" />
        </div>
      ) : error ? (
        <div className="min-h-[228px] flex flex-col items-center justify-center text-center px-4 gap-2">
          <div className="text-sm text-kt-warn-urgent font-semibold">
            예약 가능 시간을 불러올 수 없습니다
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs text-kt-red font-semibold underline underline-offset-2"
            >
              다시 시도
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-7 min-h-[228px]">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-[38px]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d = i + 1;
            const ymd = toYmd(cm.y, cm.m, d);
            const dis = isDisabled(d);
            const isSel = selected === ymd;
            const col = (firstDay + i) % 7;
            const textColorClass = isSel
              ? "text-white font-bold"
              : dis
                ? "text-kt-gray-300"
                : col === 0
                  ? "text-kt-red"
                  : col === 6
                    ? "text-[#2060CC]"
                    : "text-kt-ink";
            return (
              <button
                key={d}
                onClick={() => !dis && onSelect(ymd)}
                disabled={dis}
                type="button"
                className={`h-[38px] flex items-center justify-center rounded-full text-sm ${
                  isSel ? "bg-kt-red" : ""
                } ${dis ? "cursor-not-allowed" : "cursor-pointer"} ${textColorClass}`}
              >
                {d}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Calendar;
