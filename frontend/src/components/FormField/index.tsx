import type { ChangeEvent, HTMLInputTypeAttribute } from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  error?: string;
  maxLength?: number;
  min?: number;
  step?: number;
}

function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  maxLength,
  min,
  step,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="form-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        min={min}
        step={step}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />

      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default FormField;
