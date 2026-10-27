
import React from "react";

export default function Loading({
  label = "Loading...",
  size = "md",
  fullPage = false,
}) {
  return (
    <div
      className={`rl-loading ${fullPage ? "rl-loading--page" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`rl-spinner rl-spinner--${size}`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
