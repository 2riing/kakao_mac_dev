import Spinner from "@shared/ui/Spinner";
import TextInput from "@shared/ui/TextInput";

interface PhoneRequestRowProps {
  maskedPhone: string;
  sent: boolean;
  loading: boolean;
  onSend: () => void;
}

function PhoneRequestRow({
  maskedPhone,
  sent,
  loading,
  onSend,
}: PhoneRequestRowProps) {
  return (
    <div className="mb-3.5">
      <div className="text-xs text-kt-gray-500 mb-[5px] font-medium">
        휴대폰 번호
      </div>
      <div className="flex gap-2">
        <TextInput
          value={maskedPhone}
          readOnly
          className="flex-1"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={loading}
          className={`w-[110px] h-[46px] bg-kt-red text-white rounded-[10px] text-[13px] font-bold tracking-[-0.3px] shrink-0 flex items-center justify-center transition-opacity ${
            loading ? "opacity-70" : "opacity-100"
          }`}
        >
          {loading ? <Spinner /> : sent ? "재발송" : "인증번호 받기"}
        </button>
      </div>
    </div>
  );
}

export default PhoneRequestRow;
