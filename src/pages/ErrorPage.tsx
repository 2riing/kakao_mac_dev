import { useLocation } from "react-router";
import ScreenContainer from "@shared/ui/ScreenContainer";
import { getErrorPageMessage } from "@shared/config/messages";
import ErrorView from "@shared/ui/ErrorView";

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
      <ErrorView title={title} desc={desc} />
    </ScreenContainer>
  );
}

export default ErrorPage;
