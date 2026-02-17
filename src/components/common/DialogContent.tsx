import "./DialogContent.css";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export interface DialogContentProps {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function DialogContent({
  title,
  subtitle,
  onClose,
  children,
  footer,
  className = "",
}: DialogContentProps) {
  return (
    <div
      className={`DialogContent ${className}`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {(title || onClose) && (
        <div className="DialogContent__header">
          <div className="DialogContent__header-text">
            {title && <h2 className="DialogContent__title">{title}</h2>}
            {subtitle && <p className="DialogContent__subtitle">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="DialogContent__close btn btn--ghost btn--icon"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className="DialogContent__body">{children}</div>

      {footer && <div className="DialogContent__footer">{footer}</div>}
    </div>
  );
}
