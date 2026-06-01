import { CheckCircle2, X, XCircle } from 'lucide-react';

export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;
  const Icon = type === 'error' ? XCircle : CheckCircle2;

  return (
    <div className={`alert alert-${type}`} role="alert">
      <Icon size={18} aria-hidden="true" />
      <span>{message}</span>
      {onClose && (
        <button className="icon-button ghost" type="button" onClick={onClose} aria-label="Dismiss message">
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
