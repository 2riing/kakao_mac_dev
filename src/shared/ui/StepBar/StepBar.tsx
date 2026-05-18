interface StepBarProps {
  current: number;
  total: number;
}

function StepBar({ current, total }: StepBarProps) {
  return (
    <div className="flex items-center gap-1.5 mb-[18px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[5px] rounded-[3px] transition-all duration-300 ${
            i < current ? "w-7 bg-kt-red" : "w-[18px] bg-kt-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-kt-gray-500 font-medium">
        {current}/{total} 단계
      </span>
    </div>
  );
}

export default StepBar;
