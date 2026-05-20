import { useEffect } from "react";
import Spinner from "./Spinner";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  desc?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmDialog({
  open,
  title,
  desc,
  cancelLabel = "취소",
  confirmLabel = "확인",
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  // ESC 닫기 + body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    document.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fade-in"
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={() => !loading && onCancel()}
        className="absolute inset-0 bg-black/45 cursor-default"
      />

      <div className="relative w-full max-w-[320px] bg-white rounded-[14px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.18)]">
        <div className="pt-[26px] pb-[22px] px-5 text-center">
          <div className="text-[16px] font-bold text-kt-ink leading-[1.5] whitespace-pre-line">
            {title}
          </div>
          {desc && (
            <div className="mt-2 text-[13px] text-kt-gray-500 leading-[1.65] whitespace-pre-line">
              {desc}
            </div>
          )}
        </div>

        <div className="flex border-t border-kt-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-[50px] text-[15px] font-medium text-kt-gray-500 bg-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 h-[50px] text-[15px] font-bold text-white bg-kt-red border-l border-kt-border flex items-center justify-center transition-opacity ${
              loading ? "opacity-70" : "opacity-100"
            }`}
          >
            {loading ? <Spinner /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
