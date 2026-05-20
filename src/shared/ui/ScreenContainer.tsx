import type { ReactNode } from "react";

interface ScreenContainerProps {
  children: ReactNode;
}

function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto h-dvh flex flex-col bg-kt-gray-100 font-sans overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.08)]">
      {children}
    </div>
  );
}

export default ScreenContainer;
