interface SpinnerProps {
  color?: "white" | "red";
  size?: "sm" | "md" | "lg";
}

function Spinner({ color = "white", size = "md" }: SpinnerProps) {
  const sizeClass =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const colorClass =
    color === "white"
      ? "border-white/35 border-t-white"
      : "border-black/15 border-t-kt-red";
  return (
    <span
      className={`inline-block align-middle rounded-full border-[2.5px] border-solid animate-spin ${sizeClass} ${colorClass}`}
    />
  );
}

export default Spinner;
