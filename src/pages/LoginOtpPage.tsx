import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import type { Location } from "react-router";
import { useKakaoEntryParams } from "@shared/hooks/useKakaoEntryParams";
import { useAuthStore, useOtpTimer, useMaskedCustPhone } from "@entities/auth";
import KTLogo from "@shared/ui/KTLogo";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import { PhoneRequestRow, OtpField } from "@components/auth";

function LoginOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wrkRcpNo } = useKakaoEntryParams();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const { data: maskedPhone = "" } = useMaskedCustPhone(wrkRcpNo ?? null);

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

      const from = (location.state as { from?: Location } | null)?.from;

      // mock 인증 — from URL path에서 wrkRcpNo 추출해 store에 저장
      // 진짜 백엔드 정합 시점에 verifyOtp 응답으로 교체 예정
      const fromMatch = from?.pathname.match(
        /^\/order\/(?:reservation|today)\/([^/]+)/,
      );
      const wrkForAuth = fromMatch?.[1] ?? wrkRcpNo ?? "1O2026050712345";
      setAuthenticated(wrkForAuth);

      if (from) {
        navigate(from.pathname + from.search, { replace: true });
      } else {
        navigate("/error", { replace: true });
      }
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
