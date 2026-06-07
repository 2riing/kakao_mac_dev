import { useState } from "react";
import ScreenContainer from "@shared/ui/ScreenContainer";
import PageHeader from "@shared/ui/PageHeader";
import TabStrip from "@shared/ui/TabStrip";
import CSNote from "@shared/ui/CSNote";
import { HELP_FAQ, PRODUCT_TABS, type ProductKey, type HelpStep } from "@entities/help";

function HelpPage() {
  const [product, setProduct] = useState<ProductKey>("internet");

  const current = HELP_FAQ[product];

  return (
    <ScreenContainer>
      <PageHeader title="조치방법 안내" />

      <TabStrip<ProductKey>
        value={product}
        options={PRODUCT_TABS}
        onChange={setProduct}
      />

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4">
        <div className="flex items-center gap-2.5 bg-kt-red-light border border-kt-red-border rounded-[10px] px-[13px] py-[11px] mb-3.5">
          <ProductIcon kind={product} />
          <span className="text-[13px] text-kt-ink font-medium leading-[1.5] tracking-[-0.2px]">
            {current.intro}
          </span>
        </div>

        {current.sections.map((section, si) => (
          <div key={section.title ?? si} className="mb-3">
            {section.title && (
              <div className="text-[13px] font-bold text-kt-gray-700 mb-1.5 px-1">
                {section.title}
              </div>
            )}
            <div className="bg-white border border-kt-border rounded-[12px] px-4 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              {section.items.map((s, i) => (
                <StepCard
                  key={s.id}
                  step={s}
                  index={i}
                  isLast={i === section.items.length - 1}
                />
              ))}
            </div>
          </div>
        ))}

        <CSNote />
      </div>
    </ScreenContainer>
  );
}

function StepCard({
  step,
  index,
  isLast,
}: {
  step: HelpStep;
  index: number;
  isLast: boolean;
}) {
  return (
    <div className={`py-3.5 ${isLast ? "" : "border-b border-kt-gray-200"}`}>
      <div className="flex gap-2 items-start mb-1.5">
        <span className="w-[18px] h-[18px] rounded-full bg-kt-red text-white text-[11px] font-bold inline-flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </span>
        <span className="text-[14px] font-bold text-kt-ink leading-[1.5] tracking-[-0.3px]">
          {step.title}
        </span>
      </div>
      <div className="text-[13px] text-kt-gray-700 leading-[1.65] tracking-[-0.2px] pl-[26px] whitespace-pre-line">
        {step.description}
      </div>
      {step.link && (
        <a
          href={step.link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 ml-[26px] text-[13px] font-semibold text-kt-red tracking-[-0.2px] underline underline-offset-2 active:opacity-70"
        >
          {step.link.label}
        </a>
      )}
    </div>
  );
}

function ProductIcon({ kind }: { kind: ProductKey }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <span className="text-kt-red shrink-0">
      {kind === "internet" && (
        <svg {...common}>
          <path d="M2 9c5.5-5 14.5-5 20 0" />
          <path d="M5 12.5c3.5-3 10.5-3 14 0" />
          <path d="M8.5 16c1.8-1.5 5.2-1.5 7 0" />
          <circle cx="12" cy="19.5" r="1.2" fill="currentColor" />
        </svg>
      )}
      {kind === "tv" && (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )}
      {kind === "phone" && (
        <svg {...common}>
          <path d="M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4c0 1.1-.9 2-2 2A16 16 0 0 1 3 6c0-1.1.9-2 2-2z" />
        </svg>
      )}
    </span>
  );
}

export default HelpPage;
