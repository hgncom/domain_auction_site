import React, { useState } from 'react';

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (newValue: string) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return React.cloneElement(child as React.ReactElement<SelectItemProps>, {
                onClick: () => handleOptionClick(child.props.value),
              });
            }
            return null;
          })}
        </SelectContent>
      )}
    </div>
  );
};

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className = '', ...props }) => (
  <button
    className={`inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const SelectValue: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block truncate">{children}</span>
);

export const SelectContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ${className}`}>
    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
      {children}
    </div>
  </div>
);

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  onClick?: () => void;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value, ...props }) => (
  <button
    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    role="menuitem"
    {...props}
  >
    {children}
  </button>
);