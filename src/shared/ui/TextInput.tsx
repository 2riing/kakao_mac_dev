interface TextInputProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  inputMode?: "text" | "numeric" | "tel";
  maxLength?: number;
  className?: string;
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly = false,
  inputMode = "text",
  maxLength,
  className = "",
}: TextInputProps) {
  const baseClass =
    "h-[46px] border-[1.5px] border-kt-border rounded-[10px] px-3.5 text-[14px] outline-none";
  const variantClass = readOnly
    ? "bg-kt-gray-100 text-kt-gray-500"
    : "bg-white text-kt-ink";

  return (
    <input
      type="text"
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      inputMode={inputMode}
      maxLength={maxLength}
      onChange={
        onChange ? (e) => onChange(e.target.value) : undefined
      }
      className={`${baseClass} ${variantClass} ${className}`}
    />
  );
}

export default TextInput;
