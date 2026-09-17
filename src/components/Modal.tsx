// components/Modal.tsx
import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeButtonLabel?: string;
  onCloseButtonClick?: () => void;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-full",
};

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "md",
  showCloseButton = true,
  closeButtonLabel = "Close",
  onCloseButtonClick,
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`
            bg-white rounded-xl shadow-2xl 
            ${maxWidthClasses[maxWidth]} 
            w-full 
            border border-gray-200 
            overflow-hidden
            animate-in fade-in zoom-in duration-200
          `}
        >
          {children}
        </div>
      </div>
    </>
  );
}