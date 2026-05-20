import CheckIcon from "@shared/ui/CheckIcon";
import CSNote from "@shared/ui/CSNote";

interface ReservationDoneStepProps {
  prevDateLabel: string; // 예: "4월 28일 (화)"
  prevTimeLabel: string; // 예: "14:00 ~ 15:00"
  newDate: string;       // "YYYY-MM-DD"
  newTime: string;       // "HH:00"
}

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function ReservationDoneStep({
  prevDateLabel,
  prevTimeLabel,
  newDate,
  newTime,
}: ReservationDoneStepProps) {
  const [y, m, d] = newDate.split("-").map(Number);
  const dow = DAY_NAMES[new Date(y, m - 1, d).getDay()];
  const [h] = newTime.split(":").map(Number);
  const newTimeRange = `${newTime} ~ ${pad2(h + 1)}:00`;

  return (
    <>
      <div className="h-[52px] bg-white flex items-center px-3.5 border-b border-kt-border shrink-0 relative">
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-kt-ink">
          예약 변경 완료
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <CheckIcon variant="red" />
        <div className="text-xl font-bold text-kt-ink mt-[18px] mb-5">
          예약이 변경되었습니다
        </div>

        <div className="bg-white rounded-xl p-4 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border w-full">
          <div className="mb-3">
            <div className="text-[11px] text-kt-gray-400 mb-1.5 font-semibold tracking-[0.5px]">
              변경 전
            </div>
            <div className="text-sm text-kt-gray-400 line-through">
              {prevDateLabel} &nbsp; {prevTimeLabel}
            </div>
          </div>
          <div className="h-px bg-kt-gray-200 mb-3" />
          <div>
            <div className="text-[11px] text-kt-red mb-1.5 font-bold tracking-[0.5px]">
              변경 후
            </div>
            <div className="text-[15px] text-kt-ink font-bold">
              {m}월 {d}일 ({dow}) &nbsp; {newTimeRange}
            </div>
          </div>
        </div>

        <div className="text-[13px] text-kt-gray-500 text-center leading-[1.7] mt-1">
          변경된 예약 내용은
          <br />
          카카오톡으로 다시 안내드립니다.
        </div>
        <CSNote />
      </div>
    </>
  );
}

export default ReservationDoneStep;
