import TextInput from "@shared/ui/TextInput";

interface OtpFieldProps {
  value: string;
  onChange: (value: string) => void;
  timer: number;
}

function OtpField({ value, onChange, timer }: OtpFieldProps) {
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");
  const timerColorClass =
    timer > 30 ? "text-kt-red" : "text-kt-warn-urgent";

  function handleChange(raw: string): void {
    onChange(raw.replace(/\D/g, ""));
  }

  return (
    <div className="mb-3.5 animate-fade-in">
      <div className="text-xs text-kt-gray-500 mb-[5px] font-medium">
        인증번호
      </div>
      <div className="relative">
        <TextInput
          value={value}
          onChange={handleChange}
          inputMode="numeric"
          maxLength={6}
          placeholder="인증번호 입력 (4~6자리)"
          className="w-full pr-[68px]"
        />
        <span
          className={`absolute right-[13px] top-1/2 -translate-y-1/2 text-[14px] font-bold ${timerColorClass}`}
        >
          {mm}:{ss}
        </span>
      </div>
      <div className="text-xs text-kt-gray-400 mt-[5px] leading-[1.5]">
        인증번호가 오지 않으면 재발송 버튼을 눌러주세요.
      </div>
    </div>
  );
}

export default OtpField;
