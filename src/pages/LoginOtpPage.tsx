import { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router";
import type { Location } from "react-router";
import {
  useAuthStore,
  useOtpTimer,
  useMaskedCustPhone,
  useRequestOtp,
  useVerifyOtp,
} from "@entities/auth";
import {
  useOrderStatus,
  isEntryAllowed,
  type OrderEntryKind,
} from "@entities/order";
import { getErrorMessage } from "@shared/lib/getErrorMessage";
import { WRK_RCP_NO_PATTERN } from "@shared/lib/regex";
import { INLINE_MESSAGES } from "@shared/config/messages";
import KTLogo from "@shared/ui/KTLogo";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import { PhoneRequestRow, OtpField } from "@components/auth";

// AuthGuard가 박은 state.from URL에서 wrkRcpNo 추출.
// 경로 segment가 아닌 wrkRcpNo 형식으로 찾아 라우트 구조 변경에 안 깨짐.
function extractWrkRcpNoFromPath(pathname: string): string | null {
  return pathname.match(WRK_RCP_NO_PATTERN)?.[0] ?? null;
}

function LoginOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  // 진입 컨텍스트 — AuthGuard 경유 진입만 허용
  const from = (location.state as { from?: Location } | null)?.from ?? null;
  const entryWrkRcpNo = from ? extractWrkRcpNoFromPath(from.pathname) : null;

  // hooks (early return 전 일관 호출)
  const maskedQuery = useMaskedCustPhone(entryWrkRcpNo);
  const statusQuery = useOrderStatus(entryWrkRcpNo);
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [throttleMessage, setThrottleMessage] = useState<string | null>(null);
  const requestMutation = useRequestOtp();
  const verifyMutation = useVerifyOtp();
  const { mutate: requestOtp, isPending: sendLoading } = requestMutation;
  const { mutate: verifyOtp, isPending: verifyLoading } = verifyMutation;
  const { timer, start: startTimer } = useOtpTimer(180);

  // 마스킹 연락처 조회 실패 → 페이지 fallback (본인 확인 정보 자체가 없으면 진행 불가)
  useEffect(() => {
    if (maskedQuery.isError) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [maskedQuery.isError, navigate]);

  // 오더 진입 가능 상태 검증 — 목적지(예약변경 2,3 / 청약상세 2,3,4)별 wrkFlowSttusCd 체크.
  // 조회 실패 또는 허용 외 상태면 OTP 발송 전에 차단.
  useEffect(() => {
    if (statusQuery.isError) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
      return;
    }
    if (!from || !statusQuery.data) return;
    const kind: OrderEntryKind = from.pathname.includes("/order/change")
      ? "change"
      : "detail";
    if (!isEntryAllowed(kind, statusQuery.data.wrkFlowSttusCd)) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [from, statusQuery.isError, statusQuery.data, navigate]);

  // 가드 — 정상 카카오 진입이 아니면 차단
  if (!from || !entryWrkRcpNo) {
    return <Navigate to="/error" state={{ code: "INVALID_ENTRY" }} replace />;
  }

  const maskedPhone = maskedQuery.data ?? "";
  const canVerify = sent && otp.length === 6;
  const sendErrorMessage = throttleMessage
    ?? (requestMutation.isError ? getErrorMessage(requestMutation.error) : null);
  const verifyErrorMessage = verifyMutation.isError
    ? getErrorMessage(verifyMutation.error)
    : undefined;

  function handleSendOtp() {
    // 클라이언트 단 throttle — disabled 버튼을 우회해도 한 번 더 차단
    if (sent && timer > 0) {
      setThrottleMessage(INLINE_MESSAGES.throttleRetry);
      return;
    }
    setThrottleMessage(null);
    requestOtp(
      { wrkRcpNo: entryWrkRcpNo! },
      {
        onSuccess: () => {
          setSent(true);
          startTimer();
          setOtp("");
        },
      },
    );
  }

  function handleVerify() {
    if (!canVerify || verifyLoading) return;
    verifyOtp(
      { wrkRcpNo: entryWrkRcpNo!, otpNo: otp },
      {
        onSuccess: () => {
          setAuthenticated(entryWrkRcpNo!);
          navigate(from!.pathname + from!.search, { replace: true });
        },
        onError: () => {
          // 검증 실패 시 입력 클리어해서 재입력 유도. 메시지는 verifyMutation.error로 표시
          setOtp("");
        },
      },
    );
  }

  return (
    <ScreenContainer>
      <div className="h-[72px] bg-white flex flex-col items-center justify-center gap-0.5 px-3.5 border-b border-kt-border shrink-0">
        <KTLogo />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-4">
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
          cooldownSeconds={sent ? timer : 0}
          onSend={handleSendOtp}
        />

        {sendErrorMessage && (
          <div className="text-xs text-kt-warn-urgent mb-2 -mt-1.5 font-medium">
            {sendErrorMessage}
          </div>
        )}

        {sent && (
          <OtpField
            value={otp}
            onChange={setOtp}
            timer={timer}
            errorMessage={verifyErrorMessage}
          />
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
