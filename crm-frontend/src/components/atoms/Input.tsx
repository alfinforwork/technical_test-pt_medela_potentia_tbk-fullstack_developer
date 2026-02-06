import React from 'react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  name = '',
  disabled = false,
  className = '',
  required = false,
}) => {
  const baseStyles =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      disabled={disabled}
      required={required}
      className={`${baseStyles} ${className} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
  );
};

export default Input;
