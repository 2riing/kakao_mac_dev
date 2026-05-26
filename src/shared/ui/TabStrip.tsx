interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface TabStripProps<T extends string> {
  value: T;
  options: ReadonlyArray<TabOption<T>>;
  onChange: (value: T) => void;
}

function TabStrip<T extends string>({ value, options, onChange }: TabStripProps<T>) {
  return (
    <div
      role="tablist"
      className="flex bg-white border-b border-kt-border shrink-0"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`flex-1 h-[46px] text-[14px] font-medium tracking-[-0.3px] relative ${
              active ? "text-kt-red font-bold" : "text-kt-gray-500"
            }`}
          >
            {opt.label}
            {active && (
              <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-kt-red" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default TabStrip;
