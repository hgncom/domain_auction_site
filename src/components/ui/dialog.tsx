import React, { useState, useRef, useEffect } from 'react';

interface DialogProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((props: { onClose: () => void }) => React.ReactNode);
}

export const Dialog: React.FC<DialogProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement, { onClick: () => setIsOpen(true) })}
      {isOpen && (
        <DialogContent onClose={onClose}>
          {typeof children === 'function' ? children({ onClose }) : children}
        </DialogContent>
      )}
    </>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  onClose: () => void;
}

export const DialogContent: React.FC<DialogContentProps> = ({ children, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        {children}
      </div>
    </div>
  );
};

export const DialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 border-b ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h3>
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`mt-2 text-sm text-gray-500 ${className}`} {...props}>
    {children}
  </p>
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`px-6 py-4 bg-gray-50 flex justify-end space-x-2 ${className}`} {...props}>
    {children}
  </div>
);