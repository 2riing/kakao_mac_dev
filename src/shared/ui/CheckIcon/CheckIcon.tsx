interface CheckIconProps {
  variant?: "success" | "red";
}

function CheckIcon({ variant = "success" }: CheckIconProps) {
  const fill =
    variant === "red" ? "var(--color-kt-red)" : "var(--color-kt-success)";
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="36" fill={fill} fillOpacity="0.1" />
      <circle cx="36" cy="36" r="26" fill={fill} fillOpacity="0.18" />
      <circle cx="36" cy="36" r="18" fill={fill} />
      <path
        d="M25 36l8 8 14-16"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CheckIcon;
