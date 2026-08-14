type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="select-group">
      <label>{label}</label>
      <br />

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select a platform</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
