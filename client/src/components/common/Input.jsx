
import React, { useId } from "react";

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  type = "text",
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`rl-field ${className}`}>
      {label && (
        <label className="rl-field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        className={`rl-input ${error ? "rl-input--error" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error || helperText ? hintId : undefined
        }
        {...props}
      />

      {(error || helperText) && (
        <p
          id={hintId}
          className={`rl-field__hint ${error ? "rl-field__error" : ""}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
