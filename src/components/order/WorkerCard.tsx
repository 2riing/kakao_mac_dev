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

const PHOTO_SIZE = {
  portrait: "w-[88px] h-[112px]",
  landscape: "w-[152px] h-[92px]",
} as const;

function PhotoPlaceholder({ variant }: { variant: Layout }) {
  return (
    <div
      className={`shrink-0 rounded-[10px] border border-kt-gray-200 flex items-center justify-center overflow-hidden bg-stripe-placeholder ${PHOTO_SIZE[variant]}`}
    >
      <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
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
      className={`shrink-0 rounded-[10px] border border-kt-gray-200 object-cover ${PHOTO_SIZE[variant]}`}
    />
  );
}

function WorkerNameBlock({ worker }: { worker: Technician }) {
  return (
    <div className="flex flex-col justify-center min-w-0">
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1.5">
        방문 직원
      </div>
      <div className="text-[20px] font-extrabold text-kt-ink tracking-[-0.3px] leading-[1.2]">
        {worker.workerName}
      </div>
    </div>
  );
}

function PhoneCallRow({ phone }: { phone: string }) {
  const telHref = `tel:${phone.replace(/\D/g, "")}`;
  return (
    <a
      href={telHref}
      className="flex items-center gap-3 bg-kt-red-light border border-kt-red-border rounded-[10px] px-3.5 py-3 active:opacity-85 transition-opacity"
    >
      <span className="w-8 h-8 rounded-full bg-kt-red shrink-0 flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 4h4l2 5-3 2c1 2 3 4 5 5l2-3 5 2v4c0 1.1-.9 2-2 2A16 16 0 0 1 3 6c0-1.1.9-2 2-2z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-kt-red font-bold tracking-[0.5px] mb-0.5">
          전화 걸기
        </div>
        <div className="text-[15px] font-extrabold text-kt-ink tracking-[-0.3px]">
          {phone}
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 5l7 7-7 7"
          stroke="#aaaaaa"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
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
      <div className="flex gap-3.5 animate-pulse mb-3.5">
        <div className="w-[88px] h-[112px] rounded-[10px] bg-kt-gray-100" />
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="h-3 w-12 bg-kt-gray-100 rounded" />
          <div className="h-5 w-20 bg-kt-gray-100 rounded" />
        </div>
      </div>
      <div className="h-[58px] bg-kt-gray-100 rounded-[10px] animate-pulse" />
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
        <div className="flex gap-3.5 mb-3.5">
          {hasPic ? (
            <PhotoFrame
              src={worker.workerPhotoUrl}
              alt={worker.workerName}
              variant="portrait"
            />
          ) : (
            <PhotoPlaceholder variant="portrait" />
          )}
          <WorkerNameBlock worker={worker} />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 mb-3.5">
          <PhotoFrame
            src={worker.workerPhotoUrl}
            alt={worker.workerName}
            variant="landscape"
          />
          <div className="w-full text-center">
            <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1">
              방문 직원
            </div>
            <div className="text-[20px] font-extrabold text-kt-ink tracking-[-0.3px]">
              {worker.workerName}
            </div>
          </div>
        </div>
      )}

      <PhoneCallRow phone={worker.workerPhoneNumber} />
    </CardShell>
  );
}

export default WorkerCard;
