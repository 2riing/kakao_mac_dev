import Spinner from "@shared/ui/Spinner";
import TextInput from "@shared/ui/TextInput";

interface PhoneRequestRowProps {
  maskedPhone: string;
  sent: boolean;
  loading: boolean;
  // > 0이면 재발송 쿨다운 — 버튼 disabled + 라벨에 mm:ss 표시
  cooldownSeconds?: number;
  onSend: () => void;
}

function PhoneRequestRow({
  maskedPhone,
  sent,
  loading,
  cooldownSeconds = 0,
  onSend,
}: PhoneRequestRowProps) {
  const cooling = cooldownSeconds > 0;
  const disabled = loading || cooling;

  function renderLabel() {
    if (loading) return <Spinner />;
    if (sent || cooling) return "재발송";
    return "인증번호 받기";
  }

  return (
    <div className="mb-3.5">
      <div className="text-xs text-kt-gray-500 mb-[5px] font-medium">
        휴대폰 번호
      </div>
      <div className="flex gap-2">
        <TextInput value={maskedPhone} readOnly className="flex-1" />
        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className={`w-[110px] h-[46px] bg-kt-red text-white rounded-[10px] text-[13px] font-bold tracking-[-0.3px] shrink-0 flex items-center justify-center transition-opacity ${
            disabled ? "opacity-60 cursor-not-allowed" : "opacity-100"
          }`}
        >
          {renderLabel()}
        </button>
      </div>
    </div>
  );
}

export default PhoneRequestRow;
