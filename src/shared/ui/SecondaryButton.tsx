import type { ReactNode } from "react";

interface SecondaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function SecondaryButton({
  children,
  onClick,
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`h-[50px] w-full rounded-[10px] text-[15px] font-bold tracking-[-0.3px] flex items-center justify-center bg-white border ${
        disabled
          ? "border-kt-gray-300 text-kt-gray-300 cursor-not-allowed"
          : "border-kt-red text-kt-red"
      }`}
    >
      {children}
    </button>
  );
}

export default SecondaryButton;
