import React from 'react';

const variants = {
  // Soft, clean white with a delicate stone border
  default: 'bg-white border border-stone-200 shadow-sm',
  // Elevated with a soft glow (using design system pink tint)
  elevated: 'bg-white border border-[#f8c8dc]/30 shadow-[0_8px_30px_rgb(248,200,220,0.2)]',
  // Plum: The signature soft pink aesthetic
  plum: 'bg-[#fff0f6] border border-[#f8c8dc] shadow-sm',
  // Sage: The gentle garden green aesthetic
  sage: 'bg-[#f3f9f1] border border-[#d4e9d0] shadow-sm'
};

const paddings = {
  none: 'p-0',
  sm: 'p-4',
  default: 'p-6',
  lg: 'p-8'
};

export default function Card({
  children,
  variant = 'default',
  padding = 'default',
  hoverable = false,
  onClick,
  className = ''
}) {
  const classNames = [
    // Ultra-rounded 2xl for that "pillowy" feel
    'rounded-[2rem] transition-all duration-300 ease-in-out',
    variants[variant],
    paddings[padding],
    // Hover effects: soft lift and stronger pink glow
    hoverable ? 'hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(248,200,220,0.3)] hover:border-[#f8c8dc]' : '',
    // Interactive states
    onClick ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f8c8dc] focus-visible:ring-offset-2 active:scale-[0.98]' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
