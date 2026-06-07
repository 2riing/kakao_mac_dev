import { useLocation } from "react-router-dom";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
import AlertIcon from "@shared/ui/AlertIcon";
import CSNote from "@shared/ui/CSNote";
import { ERROR_MESSAGES, type ErrorCode } from "@shared/constants/messages";

interface ErrorLocationState {
  code?: ErrorCode;
}

interface ErrorPageProps {
  code?: ErrorCode; // ErrorBoundary가 직접 렌더 시 전달. 라우트 진입은 location.state 사용.
}

// 라우트(/error)와 ErrorBoundary fallback 공용. code 없으면 UNKNOWN.
function ErrorPage({ code: codeProp }: ErrorPageProps = {}) {
  const location = useLocation();
  const state = location.state as ErrorLocationState | null;
  const code = codeProp ?? state?.code ?? "UNKNOWN";
  const { title, desc } = ERROR_MESSAGES[code] ?? ERROR_MESSAGES.UNKNOWN;

  return (
    <ScreenContainer>
      <PageHeader title="안내" />
      <div className="flex-1 flex flex-col items-center justify-center px-7">
        <AlertIcon />
        <div className="mt-[18px] mb-2.5 text-[17px] font-bold text-kt-ink text-center leading-[1.5] whitespace-pre-line">
          {title}
        </div>
        <div className="text-[13px] text-kt-gray-500 text-center leading-[1.75] whitespace-pre-line">
          {desc}
        </div>
        <CSNote />
      </div>
    </ScreenContainer>
  );
}

export default ErrorPage;
