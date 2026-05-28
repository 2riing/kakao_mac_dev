import { useLocation } from "react-router";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
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
      <PageHeader title="안내" />
      <ErrorView title={title} desc={desc} />
    </ScreenContainer>
  );
}

export default ErrorPage;
