
import React from "react";

export default function Card({
  title,
  description,
  children,
  footer,
  className = "",
  ...props
}) {
  return (
    <section className={`rl-card ${className}`} {...props}>
      {(title || description) && (
        <div className="rl-card__header">
          {title && <h2 className="rl-card__title">{title}</h2>}
          {description && (
            <p className="rl-card__description">{description}</p>
          )}
        </div>
      )}

      <div className="rl-card__body">{children}</div>

      {footer && <div className="rl-card__footer">{footer}</div>}
    </section>
  );
}
