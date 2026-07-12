export default function Input({
  label,
  name,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...rest
}) {
  // reuse the name as the id so the label stays connected to the field
  const id = name

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-stone-700">
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        className={`
          h-11 rounded-lg border px-3.5 text-sm text-stone-900
          placeholder:text-stone-400 bg-white
          focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-plum-500
          transition
          ${error ? 'border-red-300' : 'border-stone-300'}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      />

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-stone-500">{helperText}</p>
      ) : null}
    </div>
  )
}