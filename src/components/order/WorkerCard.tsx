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

function PhotoPlaceholder({ variant }: { variant: Layout }) {
  const isPortrait = variant === "portrait";
  return (
    <div
      className={`shrink-0 rounded-lg border border-kt-gray-200 flex flex-col items-center justify-center gap-1.5 overflow-hidden ${
        isPortrait ? "w-[96px] h-[124px]" : "w-[168px] h-[100px]"
      }`}
      style={{
        background:
          "repeating-linear-gradient(135deg, var(--color-kt-gray-100), var(--color-kt-gray-100) 8px, white 8px, white 16px)",
      }}
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
  const isPortrait = variant === "portrait";
  return (
    <img
      src={src}
      alt={alt}
      className={`shrink-0 rounded-lg border border-kt-gray-200 object-cover ${
        isPortrait ? "w-[96px] h-[124px]" : "w-[168px] h-[100px]"
      }`}
    />
  );
}

function WorkerInfo({ worker }: { worker: Technician }) {
  return (
    <div className="flex flex-col justify-center min-w-0">
      <div className="text-[11px] text-kt-gray-400 font-semibold tracking-[0.5px] mb-1">
        방문 직원
      </div>
      <div className="text-[18px] font-bold text-kt-ink mb-1.5">
        {worker.spotWrkUserNm}
      </div>
      <div className="text-[13px] text-kt-gray-700 font-medium">
        {worker.spotWrkUserHpNo}
      </div>
    </div>
  );
}

function WorkerCardSkeleton() {
  return (
    <div className="bg-white rounded-[12px] px-4 pt-3.5 pb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="text-[14px] font-bold text-kt-ink mb-3 pb-[11px] border-b border-kt-gray-200">
        방문 작업자 정보
      </div>
      <div className="flex gap-3.5 animate-pulse">
        <div className="w-[96px] h-[124px] rounded-lg bg-kt-gray-100" />
        <div className="flex-1 flex flex-col justify-center gap-2">
          <div className="h-3 w-12 bg-kt-gray-100 rounded" />
          <div className="h-5 w-20 bg-kt-gray-100 rounded" />
          <div className="h-4 w-28 bg-kt-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

function WorkerCard({ worker }: WorkerCardProps) {
  const layout = useImageLayout(worker.spotWrkUserPic);

  if (layout === null) return <WorkerCardSkeleton />;

  const hasPic = !!worker.spotWrkUserPic;

  return (
    <div className="bg-white rounded-[12px] px-4 pt-3.5 pb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-kt-border">
      <div className="text-[14px] font-bold text-kt-ink mb-3 pb-[11px] border-b border-kt-gray-200">
        방문 작업자 정보
      </div>

      {layout === "portrait" ? (
        // 증명사진형: 세로 사진 좌측 + 정보 우측
        <div className="flex gap-3.5">
          {hasPic ? (
            <PhotoFrame
              src={worker.spotWrkUserPic}
              alt={worker.spotWrkUserNm}
              variant="portrait"
            />
          ) : (
            <PhotoPlaceholder variant="portrait" />
          )}
          <WorkerInfo worker={worker} />
        </div>
      ) : (
        // 명함형: 가로 사진 상단 + 정보 하단 (회색 박스로 묶음)
        <div className="bg-kt-gray-100 border border-kt-gray-200 rounded-[12px] p-3.5 flex flex-col gap-3">
          <div className="flex justify-center">
            <PhotoFrame
              src={worker.spotWrkUserPic}
              alt={worker.spotWrkUserNm}
              variant="landscape"
            />
          </div>
          <div className="pt-2.5 border-t border-kt-gray-200">
            <WorkerInfo worker={worker} />
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerCard;
