type InputProps = {
  label?: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
};

function Input({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  error,
}: InputProps) {
  return (
    <div className={label ? "mb-5" : undefined}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={[
          "block w-full rounded-lg border bg-white px-3 py-2.5",
          "text-sm text-gray-900",
          "placeholder:text-gray-400",
          "transition",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-indigo-500",
        ].join(" ")}
      />

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
