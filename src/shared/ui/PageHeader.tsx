import BackArrow from "./BackArrow";

interface PageHeaderProps {
  title: string;
  // 있으면 좌측 BackArrow 표시 + 타이틀 가운데 고정. 없으면 타이틀만 가운데.
  onBack?: () => void;
}

function PageHeader({ title, onBack }: PageHeaderProps) {
  if (onBack) {
    return (
      <div className="h-[52px] bg-white flex items-center px-3.5 border-b border-kt-border shrink-0 relative">
        <button type="button" onClick={onBack} className="cursor-pointer p-1.5">
          <BackArrow />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-kt-ink">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div className="h-[52px] bg-white flex items-center justify-center border-b border-kt-border shrink-0">
      <span className="text-[16px] font-bold text-kt-ink">{title}</span>
    </div>
  );
}

export default PageHeader;
