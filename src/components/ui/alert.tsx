import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  variant?: 'default' | 'destructive';
}

export const Alert: React.FC<AlertProps> = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const baseStyle = "rounded-lg p-4";
  const variantStyles = {
    default: "bg-blue-100 text-blue-700",
    destructive: "bg-red-100 text-red-700",
  };

  return (
    <div
      role="alert"
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h5 className={`mb-1 font-medium ${className}`} {...props}>
    {children}
  </h5>
);

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-sm ${className}`} {...props}>
    {children}
  </p>
);