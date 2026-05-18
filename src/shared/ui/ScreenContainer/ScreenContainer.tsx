import type { ReactNode } from "react";

interface ScreenContainerProps {
  children: ReactNode;
}

function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <div className="w-full h-dvh flex flex-col bg-kt-gray-100 font-sans overflow-hidden relative">
      {children}
    </div>
  );
}

export default ScreenContainer;
