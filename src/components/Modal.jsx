import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children, footer, triggerRef }) {
  const modalRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement;
    const timer = setTimeout(() => firstFieldRef.current?.focus(), 0);

    function onKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      (triggerRef?.current || prevActive)?.focus?.();
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-[460px] max-w-[calc(100vw-32px)] overflow-hidden rounded-lg bg-white shadow-modal"
      >
        <div className="flex items-center justify-between border-b border-black/[.08] px-5 py-4">
          <span className="text-[15px] font-semibold" id="modal-title">
            {title}
          </span>
          <button className="flex text-ink-muted" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          {typeof children === "function" ? children(firstFieldRef) : children}
        </div>
        <div className="flex justify-end gap-2 border-t border-black/[.08] bg-surface px-5 py-3.5">{footer}</div>
      </div>
    </div>
  );
}
