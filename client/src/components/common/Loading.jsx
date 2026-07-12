// size maps to the spinner's width/height plus border thickness
const sizes = {
  small: 'w-5 h-5 border-2',
  medium: 'w-8 h-8 border-[3px]',
  large: 'w-12 h-12 border-4'
}

export default function Loading({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false
}) {
  const spinner = (
    <div
      role="status"
      aria-label={text || 'Loading'}
      className={`rounded-full border-stone-200 border-t-plum-500 animate-spin ${sizes[size]}`}
    />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50/90 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          {spinner}
          {text && <p className="text-sm text-stone-500">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {spinner}
      {text && <p className="text-sm text-stone-500">{text}</p>}
    </div>
  )
}