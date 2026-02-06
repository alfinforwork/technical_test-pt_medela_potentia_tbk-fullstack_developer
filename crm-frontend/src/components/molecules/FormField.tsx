import React from 'react';
import Input from '../atoms/Input';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children?: React.ReactNode;
  inputType?: string;
  inputValue?: string;
  inputOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputName?: string;
  inputPlaceholder?: string;
  inputDisabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  inputType,
  inputValue,
  inputOnChange,
  inputName,
  inputPlaceholder,
  inputDisabled,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <Input
          type={inputType}
          value={inputValue}
          onChange={inputOnChange}
          name={inputName}
          placeholder={inputPlaceholder}
          disabled={inputDisabled}
          required={required}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
