import { useState } from "react";
import ScreenContainer from "@shared/ui/ScreenContainer";
import BottomFixedBar from "@shared/ui/BottomFixedBar";
import PrimaryButton from "@shared/ui/PrimaryButton";
import SecondaryButton from "@shared/ui/SecondaryButton";
import TabStrip from "@shared/ui/TabStrip";
import CheckIcon from "@shared/ui/CheckIcon";
import CSNote from "@shared/ui/CSNote";
import { HELP_DATA, PRODUCT_TABS, type ProductKey, type HelpStep } from "./HelpPage.data";

type Stage = "guide" | "resolved" | "unresolved";

function HelpPage() {
  const [product, setProduct] = useState<ProductKey>("internet");
  const [stage, setStage] = useState<Stage>("guide");

  if (stage === "resolved") {
    return <ResolvedScreen onBack={() => setStage("guide")} />;
  }
  if (stage === "unresolved") {
    return <UnresolvedScreen onBack={() => setStage("guide")} />;
  }

  const current = HELP_DATA[product];

  return (
    <ScreenContainer>
      <TopBar title="조치방법 안내" />

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

        <div className="bg-white border border-kt-border rounded-[12px] px-4 py-1 shadow-[0_2px_10px_rgba(0,0,0,0.05)] mb-3">
          {current.steps.map((s, i) => (
            <StepCard
              key={s.id}
              step={s}
              index={i}
              isLast={i === current.steps.length - 1}
            />
          ))}
        </div>

        <CSNote />
      </div>

      <BottomFixedBar>
        <SecondaryButton onClick={() => setStage("unresolved")}>
          해결이 어려워요
        </SecondaryButton>
      </BottomFixedBar>
    </ScreenContainer>
  );
}

function TopBar({ title }: { title: string }) {
  return (
    <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0">
      <span className="text-[16px] font-bold text-kt-ink">{title}</span>
    </div>
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
      <div className="text-[13px] text-kt-gray-700 leading-[1.65] tracking-[-0.2px] pl-[26px]">
        {step.description}
      </div>
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

function ResolvedScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenContainer>
      <TopBar title="해결 완료" />
      <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
        <CheckIcon />
        <div className="text-[21px] font-extrabold text-kt-ink mt-[18px] mb-2.5 tracking-[-0.5px]">
          도움이 되셨다니 다행이에요
        </div>
        <div className="text-[13.5px] text-kt-gray-500 leading-[1.7] tracking-[-0.2px] mb-[22px]">
          앞으로 같은 문제가 생기시면<br />
          언제든 이 페이지를 다시 찾아주세요.
        </div>

        <div className="w-full bg-white border border-kt-border rounded-[12px] px-4 py-3.5 text-left">
          <div className="text-[12px] text-kt-gray-400 font-bold tracking-[0.5px] mb-2">
            TIP
          </div>
          <div className="text-[13px] text-kt-gray-700 leading-[1.65]">
            모뎀과 공유기는 한 달에 한 번 정도 재부팅해 주시면<br />
            더 안정적으로 이용하실 수 있어요.
          </div>
        </div>

        <div className="mt-[18px] text-[12.5px] text-kt-gray-400 leading-[1.6]">
          잠시 후 카카오톡으로 자동으로 이동됩니다.
        </div>
      </div>

      <BottomFixedBar>
        <PrimaryButton onClick={onBack}>카카오톡으로 돌아가기</PrimaryButton>
      </BottomFixedBar>
    </ScreenContainer>
  );
}

function UnresolvedScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScreenContainer>
      <TopBar title="상담 신청" />
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-5 pb-4">
        <div className="text-center mt-2 mb-[22px]">
          <div className="text-[19px] font-extrabold text-kt-ink mb-2 tracking-[-0.5px]">
            고객센터 전화 상담
          </div>
          <div className="text-[13.5px] text-kt-gray-500 leading-[1.7] tracking-[-0.2px]">
            전문 상담원이 직접 도와드릴게요.<br />
            편하신 방법으로 연락해 주세요.
          </div>
        </div>

        <a
          href="tel:100"
          className="block no-underline bg-kt-red-light border border-kt-red-border rounded-[14px] p-4 mb-2.5 active:opacity-85 transition-opacity"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-kt-red shrink-0 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4c0 1.1-.9 2-2 2A16 16 0 0 1 3 6c0-1.1.9-2 2-2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-kt-red font-bold tracking-[0.5px] mb-0.5">
                전화로 바로 상담하기
              </div>
              <div className="text-[16px] font-extrabold text-kt-ink tracking-[-0.3px]">
                KT 고객센터 <span className="text-kt-red">100</span>
              </div>
              <div className="text-[12px] text-kt-gray-500 mt-0.5">
                평일 09:00 ~ 18:00 · 수신자 부담 없이 통화 가능
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 5l7 7-7 7"
                stroke="#aaaaaa"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </a>

        <div className="bg-white border border-kt-border rounded-[14px] p-4 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-11 h-11 rounded-full bg-kt-gray-100 shrink-0 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"
                  stroke="#444444"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="10"
                  r="2.4"
                  stroke="#444444"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-kt-gray-500 font-bold tracking-[0.5px] mb-0.5">
                전문 기사 방문
              </div>
              <div className="text-[16px] font-extrabold text-kt-ink tracking-[-0.3px]">
                A/S 방문 점검 신청하기
              </div>
              <div className="text-[12px] text-kt-gray-500 mt-0.5">
                KT 서비스/장비와 관계없는 고객님 댁내 사유로 인한 출동인 경우 출동비가 부과될 수 있습니다.
              </div>
            </div>
          </div>
          <PrimaryButton
            onClick={() => {
              window.open(
                "https://help.kt.com/asreq/HomeAsReqStatus.do",
                "_blank",
                "noopener,noreferrer",
              );
            }}
          >
            방문 신청하기
          </PrimaryButton>
        </div>

        <div className="bg-white border border-kt-border rounded-[12px] px-4 py-3.5">
          <div className="text-[13px] font-bold text-kt-ink mb-2.5 tracking-[-0.3px]">
            상담 전 미리 준비해 주시면 좋아요
          </div>
          {[
            "가입자 본인 명의의 휴대폰",
            "문제가 처음 발생한 시점과 증상 (예: 오전 9시부터 인터넷 끊김)",
            "모뎀과 공유기의 LED 표시등 상태",
          ].map((t, i) => (
            <div
              key={i}
              className={`flex gap-2 items-start ${i ? "mt-[7px]" : ""}`}
            >
              <span className="w-[18px] h-[18px] rounded-full bg-kt-gray-100 text-kt-gray-500 text-[11px] font-bold inline-flex items-center justify-center shrink-0 mt-px">
                {i + 1}
              </span>
              <span className="text-[13px] text-kt-gray-700 leading-[1.55] tracking-[-0.2px]">
                {t}
              </span>
            </div>
          ))}
        </div>

        <CSNote />
      </div>

      <BottomFixedBar>
        <SecondaryButton onClick={onBack}>다시 살펴볼게요</SecondaryButton>
      </BottomFixedBar>
    </ScreenContainer>
  );
}

export default HelpPage;
