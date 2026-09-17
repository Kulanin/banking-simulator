import type { ReactNode } from "react";

const Icons = {
  check: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  arrowUp: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  arrowDown: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  alert: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

interface SuccessCardProps {
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  children?: ReactNode;
  icon?: keyof typeof Icons | ReactNode;
  variant?: "success" | "info" | "warning" | "error";
  onClose?: () => void;
  closeButtonText?: string;
}

const variants = {
  success: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
    icon: Icons.check,
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    icon: Icons.alert,
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
    icon: Icons.alert,
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
    icon: Icons.alert,
  },
};

export function SuccessCard({
  title,
  message,
  details = [],
  children,
  icon,
  variant = "success",
  onClose,
  closeButtonText = "Close",
}: SuccessCardProps) {
  const variantStyles = variants[variant];

  return (
    <div className="max-w-xl mx-auto mt-16 px-4">
      <div className={`bg-white rounded-xl shadow-lg border ${variantStyles.border} overflow-hidden`}>

        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full ${variantStyles.bg} flex items-center justify-center ${variantStyles.text} mb-3`}>
            {icon || variantStyles.icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>

  
        <div className="px-6 pb-6 space-y-4">
          <p className="text-gray-700 text-center">{message}</p>

          {details.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 space-y-1 border border-gray-100">
              {details.map((detail, index) => (
                <div key={index} className="flex justify-between">
                  <span>{detail.label}:</span>
                  <span className="font-mono text-gray-900 font-medium">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {children}

          {onClose && (
            <button
              onClick={onClose}
              className="w-full mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {closeButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}