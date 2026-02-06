import React from 'react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', children, onClose }) => {
  const bgColors = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${bgColors[type]}`}>
      <div className="flex justify-between items-start">
        <div>{children}</div>
        {onClose && (
          <button onClick={onClose} className="text-lg font-semibold opacity-70 hover:opacity-100">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
