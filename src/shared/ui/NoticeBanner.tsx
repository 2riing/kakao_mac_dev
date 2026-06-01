import type { ReactNode } from "react";

interface NoticeBannerProps {
  children: ReactNode;
  // compact: 좁은 라운드/패딩 (스텝 내 인라인 안내용). 기본: 카드형
  compact?: boolean;
  // 여백·텍스트 톤 등 호출부 조정 (mb-*, text-* 등)
  className?: string;
}

// 빨간 톤 안내 박스 (bg-kt-red-light + border). 여백·내부 텍스트 스타일은 호출부에서.
function NoticeBanner({ children, compact = false, className = "" }: NoticeBannerProps) {
  const size = compact
    ? "rounded-[10px] px-3.5 py-2.5"
    : "rounded-[12px] px-4 py-3.5";
  return (
    <div
      className={`bg-kt-red-light border border-kt-red-border ${size} ${className}`}
    >
      {children}
    </div>
  );
}

export default NoticeBanner;
