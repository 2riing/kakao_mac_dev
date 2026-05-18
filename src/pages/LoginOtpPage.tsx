import { useState } from "react";
import { useNavigate } from "react-router";
import { useKakaoEntryParams } from "@shared/hooks/useKakaoEntryParams";
import { useAuthStore, useOtpTimer } from "@entities/auth";
import KTLogo from "@shared/ui/KTLogo";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import { PhoneRequestRow, OtpField } from "@components/auth";

function LoginOtpPage() {
  const navigate = useNavigate();
  const { wrkRcpNo } = useKakaoEntryParams();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const maskedPhone = "010-****-1234";

  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const { timer, start: startTimer } = useOtpTimer(180);

  const canVerify = sent && otp.length >= 4;

  function handleSendOtp() {
    setSendLoading(true);
    setTimeout(() => {
      setSendLoading(false);
      setSent(true);
      startTimer();
      setOtp("");
    }, 1200);
  }

  function handleVerify() {
    if (!canVerify || verifyLoading) return;
    setVerifyLoading(true);
    setTimeout(() => {
      setVerifyLoading(false);
      setAuthenticated(wrkRcpNo ?? "MOCK-WRK-RCP-NO");
      navigate("/reservation");
    }, 1200);
  }

  return (
    <ScreenContainer>
      <div className="h-[72px] bg-white flex flex-col items-center justify-center gap-0.5 px-3.5 border-b border-kt-border shrink-0">
        <KTLogo />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-[96px]">
        <div className="mb-6">
          <div className="text-[21px] font-bold text-kt-ink mb-1.5">본인인증</div>
          <div className="text-[14px] text-kt-gray-500 leading-[1.65]">
            예약 확인을 위해 본인인증이 필요합니다.
          </div>
        </div>

        <PhoneRequestRow
          maskedPhone={maskedPhone}
          sent={sent}
          loading={sendLoading}
          onSend={handleSendOtp}
        />

        {sent && (
          <OtpField value={otp} onChange={setOtp} timer={timer} />
        )}

        <CSNote />
      </div>

      <BottomFixedBar>
        <PrimaryButton
          onClick={handleVerify}
          disabled={!canVerify}
          loading={verifyLoading}
        >
          {verifyLoading ? <Spinner /> : "확인"}
        </PrimaryButton>
      </BottomFixedBar>
    </ScreenContainer>
  );
}

export default LoginOtpPage;
