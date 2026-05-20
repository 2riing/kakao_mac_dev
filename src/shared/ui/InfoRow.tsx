import type { ReactNode } from "react";

interface InfoRowProps {
  label: string;
  value: ReactNode;
  layout?: "row" | "stack";
}

function InfoRow({ label, value, layout = "row" }: InfoRowProps) {
  if (layout === "stack") {
    return (
      <div className="mb-[11px]">
        <div className="text-[13px] text-kt-gray-500 mb-[3px]">{label}</div>
        <div className="text-[14px] text-kt-ink font-medium leading-[1.4]">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start mb-[11px]">
      <span className="text-[13px] text-kt-gray-500 min-w-[76px] shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-kt-ink font-medium text-right leading-[1.4]">
        {value}
      </span>
    </div>
  );
}

export default InfoRow;
