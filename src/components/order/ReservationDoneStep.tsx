import { DAY_NAMES_KO } from "@shared/lib/calendar";
import CheckIcon from "@shared/ui/CheckIcon";
import CSNote from "@shared/ui/CSNote";

type DoneVariant = "changed" | "confirmed";

interface ReservationDoneStepProps {
  variant: DoneVariant;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
}

interface DoneCopy {
  header: string;
  headline: string;
  footnote: [string, string];
  icon: "red" | "success";
}

const COPY: Record<DoneVariant, DoneCopy> = {
  changed: {
    header: "예약 변경 완료",
    headline: "예약이 변경되었습니다",
    footnote: ["변경된 예약 내용은", "카카오톡으로 다시 안내드립니다."],
    icon: "red",
  },
  confirmed: {
    header: "예약 확정",
    headline: "예약이 확정되었습니다",
    footnote: ["방문 당일 예약 정보를", "별도로 안내드립니다."],
    icon: "success",
  },
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function ReservationDoneStep({ variant, date, time }: ReservationDoneStepProps) {
  const copy = COPY[variant];
  const [y, m, d] = date.split("-").map(Number);
  const dow = DAY_NAMES_KO[new Date(y, m - 1, d).getDay()];
  const [h] = time.split(":").map(Number);
  const timeRange = `${time} ~ ${pad2(h + 1)}:00`;

  return (
    <>
      <div className="h-[52px] bg-white flex items-center px-3.5 border-b border-kt-border shrink-0 relative">
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-kt-ink">
          {copy.header}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <CheckIcon variant={copy.icon} />
        <div className="text-xl font-bold text-kt-ink mt-[18px] mb-5">
          {copy.headline}
        </div>

        <div className="bg-white rounded-xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border w-full text-center">
          <div className="text-[11px] text-kt-red font-bold tracking-[0.5px] mb-[5px]">
            방문 일정
          </div>
          <div className="text-[15px] text-kt-ink font-bold">
            {m}월 {d}일 ({dow}) &nbsp; {timeRange}
          </div>
        </div>

        <div className="text-[13px] text-kt-gray-500 text-center leading-[1.7] mt-4">
          {copy.footnote[0]}
          <br />
          {copy.footnote[1]}
        </div>
        <CSNote />
      </div>
    </>
  );
}

export default ReservationDoneStep;
