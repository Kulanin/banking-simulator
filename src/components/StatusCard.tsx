import type { ReactNode } from "react";

export type StatusVariant = "success" | "info" | "warning" | "error";

export interface StatusDetail {
  label: string;
  value: string;
}

export interface StatusCardProps {
  title: string;
  message: string;
  variant?: StatusVariant;
  icon?: ReactNode;
  details?: StatusDetail[];
  children?: ReactNode;
  onClose?: () => void;
  closeButtonText?: string;
  className?: string;
}

const defaultIcons: Record<StatusVariant, ReactNode> = {
  success: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  info: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

const variantStyles: Record<StatusVariant, { bg: string; text: string; border: string }> = {
  success: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  warning: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-amber-200",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-red-200",
  },
};

export function StatusCard({
  title,
  message,
  variant = "info",
  icon,
  details = [],
  children,
  onClose,
  closeButtonText = "Close",
  className = "",
}: StatusCardProps) {
  const styles = variantStyles[variant];
  const renderedIcon = icon ?? defaultIcons[variant];

  return (
    <div className={`max-w-xl mx-auto mt-16 px-4 ${className}`.trim()}>
      <div
        role="region"
        aria-labelledby="status-card-title"
        className={`bg-white rounded-xl shadow-lg border ${styles.border} overflow-hidden`}
      >
        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full ${styles.bg} flex items-center justify-center ${styles.text} mb-3`}>
            {renderedIcon}
          </div>
          <h3 id="status-card-title" className="text-2xl font-bold text-gray-900">
            {title}
          </h3>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <p className="text-gray-700 text-center">{message}</p>

          {details.length > 0 && (
            <dl className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500 space-y-1 border border-gray-100">
              {details.map((detail) => (
                <div key={detail.label} className="flex justify-between">
                  <dt>{detail.label}:</dt>
                  <dd className="font-mono text-gray-900 font-medium">{detail.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {children}

          {onClose && (
            <button
              type="button"
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
