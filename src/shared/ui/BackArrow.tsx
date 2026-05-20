interface BackArrowProps {
  className?: string;
}

function BackArrow({ className = "text-kt-ink" }: BackArrowProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M15 19l-7-7 7-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default BackArrow;
