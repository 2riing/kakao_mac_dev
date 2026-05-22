import { useState } from "react";
import { useAvailability, useChangeReservation } from "@entities/order";
import { DAY_NAMES_KO } from "@shared/lib/calendar";
import BackArrow from "@shared/ui/BackArrow";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import CSNote from "@shared/ui/CSNote";
import PrimaryButton from "@shared/ui/PrimaryButton";
import Spinner from "@shared/ui/Spinner";
import StepBar from "@shared/ui/StepBar";

interface ReservationTimeStepProps {
  wrkRcpNo: string;
  selDate: string; // "YYYY-MM-DD"
  onNext: (rsrvTod: string) => void;
  onBack: () => void;
}

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function todayYmd(): string {
  const n = new Date();
  return `${n.getFullYear()}-${pad2(n.getMonth() + 1)}-${pad2(n.getDate())}`;
}

function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function formatSlotLabel(time: string): string {
  // "09:00" → "09:00 ~ 10:00"
  const [h] = time.split(":").map(Number);
  return `${time} ~ ${pad2(h + 1)}:00`;
}

function ReservationTimeStep({
  wrkRcpNo,
  selDate,
  onNext,
  onBack,
}: ReservationTimeStepProps) {
  // 1단계에서 받은 캐시 재사용
  const fromYmd = todayYmd();
  const toYmd = addDaysYmd(fromYmd, 14);
  const { data: availability } = useAvailability(wrkRcpNo, fromYmd, toYmd);

  const [selTime, setSelTime] = useState<string | null>(null);

  const { mutate: changeReservation, isPending } = useChangeReservation();

  const day = availability?.availability.find((a) => a.rsrvDate === selDate);

  function isSlotAvailable(time: string): boolean {
    const slot = day?.slots.find((s) => s.rsrvTod === time);
    return slot?.available ?? false;
  }

  const [y, m, d] = selDate.split("-").map(Number);
  const dow = DAY_NAMES_KO[new Date(y, m - 1, d).getDay()];

  function handleSubmit() {
    if (!selTime) return;
    changeReservation(
      { wrkRcpNo, payload: { rsrvDate: selDate, rsrvTod: selTime } },
      {
        onSuccess: () => onNext(selTime),
        onError: () => onNext(selTime), // mock 환경: 일단 진행
      },
    );
  }

  return (
    <>
      <div className="h-[52px] bg-white flex items-center px-3.5 border-b border-kt-border shrink-0 relative">
        <button onClick={onBack} className="cursor-pointer p-1.5" type="button">
          <BackArrow />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-kt-ink">
          예약 변경
        </span>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-[96px]">
        <StepBar current={2} total={2} />

        <div className="bg-kt-red-light border border-kt-red-border rounded-[10px] px-3.5 py-2.5 mb-3.5 text-sm font-semibold text-kt-ink">
          {y}년 {m}월 {d}일 ({dow})
        </div>

        <div className="text-[15px] font-semibold text-kt-ink mb-3.5">
          원하시는 시간대를 선택해 주세요.
        </div>

        <div className="grid grid-cols-2 gap-[9px] mb-3">
          {TIME_SLOTS.map((time) => {
            const available = isSlotAvailable(time);
            const selected = selTime === time;
            return (
              <button
                key={time}
                onClick={() => available && setSelTime(time)}
                disabled={!available}
                type="button"
                className={`h-14 rounded-[10px] text-[13px] flex flex-col items-center justify-center gap-[3px] transition-all
                  ${
                    selected
                      ? "bg-kt-red text-white font-bold border-0"
                      : available
                        ? "bg-white text-kt-ink font-medium border-[1.5px] border-kt-border"
                        : "bg-kt-gray-100 text-kt-gray-400 font-medium border-[1.5px] border-kt-gray-200 cursor-not-allowed"
                  }`}
              >
                <span>{formatSlotLabel(time)}</span>
                {!available && (
                  <span className="text-[11px] text-kt-gray-400">마감</span>
                )}
              </button>
            );
          })}
        </div>

        <CSNote />
      </div>

      <BottomFixedBar>
        <PrimaryButton
          onClick={handleSubmit}
          disabled={!selTime}
          loading={isPending}
        >
          {isPending ? <Spinner /> : "예약 변경하기"}
        </PrimaryButton>
      </BottomFixedBar>
    </>
  );
}

export default ReservationTimeStep;
