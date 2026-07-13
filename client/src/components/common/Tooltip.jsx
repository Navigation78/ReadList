import { useState } from 'react'

// each position controls where the tooltip sits relative to its trigger
const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

export default function Tooltip({
  children,
  content,
  position = 'top'
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap rounded-full bg-stone-800 px-3 py-1.5 text-xs font-medium text-white pointer-events-none ${positions[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}