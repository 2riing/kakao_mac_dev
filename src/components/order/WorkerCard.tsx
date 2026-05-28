import { useEffect, useState } from "react";
import type { Technician } from "@entities/order";

interface WorkerCardProps {
  worker: Technician;
}

type Layout = "portrait" | "landscape";

// 사진 ratio 측정 — 가로(>=1) 명함형 / 세로(<1) 증명사진형
// 측정 전엔 null → skeleton. 사진 없으면 즉시 portrait.
function useImageLayout(src: string): Layout | null {
  const [measured, setMeasured] = useState<{ src: string; ratio: number } | null>(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!cancelled) {
        setMeasured({ src, ratio: img.naturalWidth / img.naturalHeight });
      }
    };
    img.onerror = () => {
      if (!cancelled) setMeasured({ src, ratio: 0.75 });
    };
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return "portrait";
  if (!measured || measured.src !== src) return null;
  return measured.ratio >= 1 ? "landscape" : "portrait";
}

// portrait 118×148 r8(증명사진 ~3:4), landscape 폭제한 4:3 r12 가운데(가로 사진)
const PHOTO_BOX = {
  portrait: "w-[118px] h-[148px] rounded-lg",
  landscape: "block w-full max-w-[220px] mx-auto aspect-[4/3] rounded-xl",
} as const;

function PhotoPlaceholder({ variant }: { variant: Layout }) {
  return (
    <div
      className={`shrink-0 border border-kt-gray-200 flex items-center justify-center overflow-hidden bg-stripe-placeholder ${PHOTO_BOX[variant]}`}
    >
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="13" r="6.5" fill="var(--color-kt-gray-300)" />
        <path
          d="M4 33c0-7.732 6.268-14 14-14s14 6.268 14 14"
          stroke="var(--color-kt-gray-300)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function PhotoFrame({
  src,
  alt,
  variant,
}: {
  src: string;
  alt: string;
  variant: Layout;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 border border-kt-gray-200 object-cover ${PHOTO_BOX[variant]}`}
    />
  );
}

// 라벨 + 이름 한 블록 — portrait/landscape 공용
function NameBlock({ name }: { name: string }) {
  return (
    <>
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1.5">
        방문 직원
      </div>
      <div className="text-[18px] font-bold text-kt-ink tracking-[-0.5px]">
        {name}
      </div>
    </>
  );
}

// 라벨 + tel: 링크 한 블록 — portrait/landscape 공용
function PhoneBlock({ phone }: { phone: string }) {
  const telHref = `tel:${phone.replace(/\D/g, "")}`;
  return (
    <>
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1.5">
        연락처
      </div>
      <a href={telHref} className="text-[18px] font-bold text-kt-ink tracking-[-0.5px]">
        {phone}
      </a>
    </>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[12px] px-4 pt-3.5 pb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="text-[14px] font-bold text-kt-ink mb-3 pb-[11px] border-b border-kt-gray-200">
        방문 작업자 정보
      </div>
      {children}
    </div>
  );
}

function WorkerCardSkeleton() {
  return (
    <CardShell>
      <div className="flex gap-4 items-center animate-pulse px-0.5 py-1">
        <div className="w-[108px] h-[144px] rounded-lg bg-kt-gray-100" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-3 w-12 bg-kt-gray-100 rounded" />
          <div className="h-6 w-24 bg-kt-gray-100 rounded" />
          <div className="h-px bg-kt-gray-100 my-1" />
          <div className="h-3 w-10 bg-kt-gray-100 rounded" />
          <div className="h-4 w-28 bg-kt-gray-100 rounded" />
        </div>
      </div>
    </CardShell>
  );
}

function WorkerCard({ worker }: WorkerCardProps) {
  const layout = useImageLayout(worker.workerPhotoUrl);

  if (layout === null) return <WorkerCardSkeleton />;

  const hasPic = !!worker.workerPhotoUrl;

  return (
    <CardShell>
      {layout === "portrait" ? (
        // 증명사진형: 세로 사진(좌) + 정보(우, 라벨/이름/구분선/라벨/전화)
        <div className="flex gap-4 items-center px-0.5 py-1">
          {hasPic ? (
            <PhotoFrame
              src={worker.workerPhotoUrl}
              alt={worker.workerName}
              variant="portrait"
            />
          ) : (
            <PhotoPlaceholder variant="portrait" />
          )}
          <div className="flex-1 flex flex-col min-w-0">
            <NameBlock name={worker.workerName} />
            <div className="h-px bg-kt-gray-200 my-2.5" />
            <PhoneBlock phone={worker.workerPhoneNumber} />
          </div>
        </div>
      ) : (
        // 명함형: 가로 사진(상단 풀폭) + 정보(하단, 방문직원 | 연락처 좌우 split)
        <div>
          {hasPic ? (
            <PhotoFrame
              src={worker.workerPhotoUrl}
              alt={worker.workerName}
              variant="landscape"
            />
          ) : (
            <PhotoPlaceholder variant="landscape" />
          )}
          <div className="flex justify-between items-end gap-3 mt-4">
            <div className="min-w-0 flex-1">
              <NameBlock name={worker.workerName} />
            </div>
            <div className="text-right">
              <PhoneBlock phone={worker.workerPhoneNumber} />
            </div>
          </div>
        </div>
      )}
    </CardShell>
  );
}

export default WorkerCard;
