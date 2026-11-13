import { useEffect } from "react";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";

const ICONS = { success: CircleCheck, info: Info, warn: TriangleAlert };
const DURATIONS = { success: 2500, info: 2500, warn: 4500 };

export default function StatusMessage({ notice, onDismiss }) {
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(onDismiss, DURATIONS[notice.type] ?? DURATIONS.info);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  // The live region stays mounted so screen readers announce new messages.
  const Icon = notice ? ICONS[notice.type] ?? Info : null;
  return (
    <div className="status-slot" role="status" aria-live="polite">
      {notice && (
        <div className={`status status--${notice.type}`} key={notice.id}>
          <Icon size={18} aria-hidden="true" />
          <p>{notice.message}</p>
          <button type="button" className="icon-button" onClick={onDismiss} aria-label="Dismiss message">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
