interface KakaoWebviewHeaderProps {
  title?: string;
  url?: string;
  onClose?: () => void;
}

function KakaoWebviewHeader({
  title = "KT 고객서비스",
  url = "kt-care.kt.com",
  onClose,
}: KakaoWebviewHeaderProps) {
  return (
    <div className="shrink-0 bg-white border-b border-kt-gray-200 relative">
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-9 h-1 rounded-[2px] bg-black/10" />

      <div className="flex items-center h-[60px] px-3.5 gap-1.5">
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
          aria-label="닫기"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 3l12 12M15 3L3 15"
              stroke="#1a1a1a"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
          aria-label="뒤로"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="rgba(0,0,0,0.28)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-1">
          <div className="text-[13px] font-semibold text-kt-ink whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {title}
          </div>
          <div className="text-[10.5px] text-black/40 whitespace-nowrap overflow-hidden text-ellipsis max-w-full mt-px">
            {url}
          </div>
        </div>

        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer p-0"
          aria-label="앞으로"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2l5 5-5 5"
              stroke="rgba(0,0,0,0.28)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-kakao-yellow border-0 cursor-pointer shrink-0 p-0"
          aria-label="카카오톡"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 3C5.13 3 2 5.46 2 8.5c0 1.86 1.18 3.5 2.97 4.45L4.3 15.4c-.06.22.18.4.37.27L7.3 13.9c.55.07 1.12.1 1.7.1 3.87 0 7-2.46 7-5.5S12.87 3 9 3z"
              fill="#1a1a1a"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default KakaoWebviewHeader;
