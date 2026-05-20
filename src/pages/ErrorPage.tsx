import { useLocation } from "react-router";
import ScreenContainer from "@shared/ui/ScreenContainer";
import AlertIcon from "@shared/ui/AlertIcon";
import CSNote from "@shared/ui/CSNote";
import { getErrorPageMessage } from "@shared/config/messages";

interface ErrorLocationState {
  code?: string;
}

function ErrorPage() {
  const location = useLocation();
  const state = location.state as ErrorLocationState | null;
  const { title, desc } = getErrorPageMessage(state?.code ?? null);

  return (
    <ScreenContainer>
      <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0 relative">
        <span className="text-[16px] font-bold text-kt-ink">안내</span>
      </div>

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
