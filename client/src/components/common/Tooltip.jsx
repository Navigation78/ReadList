
import React, { useId } from "react";

export default function Tooltip({
  text,
  children,
  position = "top",
}) {
  const tooltipId = useId();

  return (
    <span className={`rl-tooltip rl-tooltip--${position}`}>
      <span
        className="rl-tooltip__trigger"
        tabIndex={0}
        aria-describedby={tooltipId}
      >
        {children}
      </span>

      <span
        id={tooltipId}
        className="rl-tooltip__content"
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
