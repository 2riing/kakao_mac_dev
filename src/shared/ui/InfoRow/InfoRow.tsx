interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
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
