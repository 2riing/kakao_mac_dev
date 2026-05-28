import { useState } from "react";
import {
  RESERVATION_CHANGE_WINDOW_DAYS,
  useAvailability,
} from "@entities/order";
import { DAY_NAMES_KO } from "@shared/lib/calendar";
import BackArrow from "@shared/ui/BackArrow";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PageHeader from "@shared/ui/PageHeader";
import PrimaryButton from "@shared/ui/PrimaryButton";
import Spinner from "@shared/ui/Spinner";
import StepBar from "@shared/ui/StepBar";

interface ReservationDateStepProps {
  wrkRcpNo: string;
  onNext: (rsrvDate: string) => void;
  onBack: () => void;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toYmd(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function todayLocal(): { y: number; m: number; d: number } {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth() + 1, d: now.getDate() };
}

function addDays(
  ymd: { y: number; m: number; d: number },
  days: number,
): { y: number; m: number; d: number } {
  const dt = new Date(ymd.y, ymd.m - 1, ymd.d);
  dt.setDate(dt.getDate() + days);
  return { y: dt.getFullYear(), m: dt.getMonth() + 1, d: dt.getDate() };
}

function ReservationDateStep({ wrkRcpNo, onNext, onBack }: ReservationDateStepProps) {
  const today = todayLocal();
  const windowEnd = addDays(today, RESERVATION_CHANGE_WINDOW_DAYS);
  const fromYmd = toYmd(today.y, today.m, today.d);
  const toYmdStr = toYmd(windowEnd.y, windowEnd.m, windowEnd.d);

  const availabilityQuery = useAvailability(wrkRcpNo, fromYmd, toYmdStr);
  const availability = availabilityQuery.data;

  const [sel, setSel] = useState<{ y: number; m: number; d: number } | null>(null);
  const [cm, setCm] = useState<{ y: number; m: number }>({ y: today.y, m: today.m });

  const daysInMonth = new Date(cm.y, cm.m, 0).getDate();
  const firstDay = new Date(cm.y, cm.m - 1, 1).getDay();

  // 가용 윈도우 안에서만 월 이동 허용 (year*12+month 인덱스로 비교)
  const cmYM = cm.y * 12 + cm.m;
  const startYM = today.y * 12 + today.m;
  const endYM = windowEnd.y * 12 + windowEnd.m;
  const canPrev = cmYM > startYM;
  const canNext = cmYM < endYM;

  function isDisabled(d: number): boolean {
    // 오늘 이전
    if (cm.y < today.y) return true;
    if (cm.y === today.y && cm.m < today.m) return true;
    if (cm.y === today.y && cm.m === today.m && d < today.d) return true;

    // 윈도우 밖
    if (cm.y > windowEnd.y) return true;
    if (cm.y === windowEnd.y && cm.m > windowEnd.m) return true;
    if (cm.y === windowEnd.y && cm.m === windowEnd.m && d > windowEnd.d) return true;

    // availability 응답 기반 — 가용 슬롯이 하나라도 있는 날짜만 활성
    const ymd = toYmd(cm.y, cm.m, d);
    const day = availability?.availability.find((a) => a.rsrvDate === ymd);
    if (!day) return true;
    return !day.slots.some((s) => s.available);
  }

  function isSelected(d: number): boolean {
    return sel !== null && sel.y === cm.y && sel.m === cm.m && sel.d === d;
  }

  function prevMonth() {
    setCm((m) => (m.m === 1 ? { y: m.y - 1, m: 12 } : { y: m.y, m: m.m - 1 }));
  }

  function nextMonth() {
    setCm((m) => (m.m === 12 ? { y: m.y + 1, m: 1 } : { y: m.y, m: m.m + 1 }));
  }

  function handleNext() {
    if (!sel) return;
    onNext(toYmd(sel.y, sel.m, sel.d));
  }

  const selDow =
    sel !== null ? DAY_NAMES_KO[new Date(sel.y, sel.m - 1, sel.d).getDay()] : "";

  return (
    <>
      <PageHeader title="예약 변경" onBack={onBack} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-4">
        <StepBar current={1} total={2} />
        <div className="text-[15px] font-semibold text-kt-ink mb-4">
          변경하실 날짜를 선택해 주세요.
        </div>

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

          {availabilityQuery.isLoading ? (
            <div className="min-h-[228px] flex items-center justify-center">
              <Spinner color="red" size="lg" />
            </div>
          ) : availabilityQuery.isError ? (
            <div className="min-h-[228px] flex flex-col items-center justify-center text-center px-4 gap-2">
              <div className="text-sm text-kt-warn-urgent font-semibold">
                예약 가능 시간을 불러올 수 없습니다
              </div>
              <button
                type="button"
                onClick={() => availabilityQuery.refetch()}
                className="text-xs text-kt-red font-semibold underline underline-offset-2"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-7 min-h-[228px]">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-[38px]" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1;
                const dis = isDisabled(d);
                const selected = isSelected(d);
                const col = (firstDay + i) % 7;
                const textColorClass = selected
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
                    onClick={() => !dis && setSel({ y: cm.y, m: cm.m, d })}
                    disabled={dis}
                    type="button"
                    className={`h-[38px] flex items-center justify-center rounded-full text-sm ${
                      selected ? "bg-kt-red" : ""
                    } ${dis ? "cursor-not-allowed" : "cursor-pointer"} ${textColorClass}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {sel && (
          <div className="text-[13px] text-kt-gray-700 text-center mt-1 font-medium">
            선택:{" "}
            <span className="text-kt-red font-bold">
              {sel.y}년 {sel.m}월 {sel.d}일 ({selDow})
            </span>
          </div>
        )}
      </div>

      <BottomFixedBar>
        <PrimaryButton onClick={handleNext} disabled={!sel}>
          다음
        </PrimaryButton>
      </BottomFixedBar>
    </>
  );
}

export default ReservationDateStep;
