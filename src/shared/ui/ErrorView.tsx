import { ERROR_PAGE_MESSAGES } from "@shared/config/messages";
import AlertIcon from "./AlertIcon";
import CSNote from "./CSNote";

interface ErrorViewProps {
  title?: string;
  desc?: string;
}

// props 전달 시 ERROR_PAGE_MESSAGES 값으로 표시, 이외 default 값 사용
function ErrorView({
  title = ERROR_PAGE_MESSAGES.UNKNOWN.title,
  desc = "",
}: ErrorViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-7">
      <AlertIcon />
      <div className="mt-[18px] mb-2.5 text-[17px] font-bold text-kt-ink text-center leading-[1.5] whitespace-pre-line">
        {title}
      </div>
      <div className="text-[13px] text-kt-gray-500 text-center leading-[1.75] whitespace-pre-line">
        {desc}
      </div>
      <CSNote />
    </div>
  );
}

export default ErrorView;
