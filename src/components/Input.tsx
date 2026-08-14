import "../styles/Input.css";

type InputProps = {
  label: string;
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
    <div className="input-group">
      <label>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      <br />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
}

export default Input;
