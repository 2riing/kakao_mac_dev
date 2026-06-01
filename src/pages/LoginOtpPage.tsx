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
import { WRK_RCP_NO_PATTERN } from "@shared/lib/formatters";
import { ERROR_MESSAGES } from "@shared/constants/messages";
import Spinner from "@shared/ui/Spinner";
import CSNote from "@shared/ui/CSNote";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import FieldError from "@shared/ui/FieldError";
import { AuthHeader, AuthIntro, PhoneRequestRow, OtpField } from "@components/auth";

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

  // 오더 진입 가능 상태 검증 — 목적지(예약변경 2,3 / 청약상세 2,3,4)별 wrkFlowSttusCd 체크.
  // 조회 실패는 throwOnError → ErrorBoundary. 여기선 데이터 검증(허용 외 상태)만 차단.
  useEffect(() => {
    if (!from || !statusQuery.data) return;
    const kind: OrderEntryKind = from.pathname.includes("/order/change") ? "change" : "detail";
    if (!isEntryAllowed(kind, statusQuery.data.wrkFlowSttusCd)) {
      navigate("/error", {
        replace: true,
        state: { code: "ORDER_INVALID" },
      });
    }
  }, [from, statusQuery.data, navigate]);

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
      setThrottleMessage(ERROR_MESSAGES.RETRY.desc);
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
          setOtp(""); // 검증 실패 시 입력 클리어
        },
      },
    );
  }

  return (
    <ScreenContainer>
      <AuthHeader />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-[18px] pb-4">
        <AuthIntro />

        <PhoneRequestRow
          maskedPhone={maskedPhone}
          sent={sent}
          loading={sendLoading}
          cooldownSeconds={sent ? timer : 0}
          onSend={handleSendOtp}
        />

        {sendErrorMessage && (
          <FieldError message={sendErrorMessage} className="mb-2 -mt-1.5" />
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
