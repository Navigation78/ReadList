
import React, { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  open = false,
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!open || duration <= 0) return;

    const timeout = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timeout);
  }, [open, duration, onClose]);

  if (!open || !message) return null;

  return (
    <div
      className={`rl-toast rl-toast--${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="rl-toast__content">
        <span className="rl-toast__marker" aria-hidden="true" />
        <p>{message}</p>
      </div>

      <button
        type="button"
        className="rl-icon-button"
        aria-label="Dismiss notification"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
