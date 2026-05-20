import type { ReactNode } from "react";

interface BottomFixedBarProps {
  children: ReactNode;
}

function BottomFixedBar({ children }: BottomFixedBarProps) {
  return (
    <div className="absolute bottom-0 inset-x-0 bg-white px-4 pt-2.5 pb-[max(env(safe-area-inset-bottom),16px)] border-t border-kt-border">
      {children}
    </div>
  );
}

export default BottomFixedBar;
