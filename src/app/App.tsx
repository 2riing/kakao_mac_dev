import AppProviders from "./providers";
import AppRouter from "./router";
import ErrorBoundary from "./ErrorBoundary";

function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </AppProviders>
  );
}

export default App;
