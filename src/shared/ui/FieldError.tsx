interface FieldErrorProps {
  message: string;
  className?: string;
}

// 폼 필드 옆 인라인 에러 텍스트. 여백은 className으로 호출부에서 조정.
function FieldError({ message, className = "" }: FieldErrorProps) {
  return (
    <div className={`text-xs text-kt-warn-urgent font-medium ${className}`}>
      {message}
    </div>
  );
}

export default FieldError;
