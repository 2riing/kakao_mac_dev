import type { ReactNode } from "react";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`h-[50px] w-full rounded-btn text-btn font-bold tracking-[-0.3px] flex items-center justify-center transition-opacity ${
        disabled
          ? "bg-kt-gray-300 text-white cursor-not-allowed"
          : `bg-kt-red text-white ${loading ? "opacity-70" : "opacity-100"}`
      }`}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
