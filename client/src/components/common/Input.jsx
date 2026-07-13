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
        <label htmlFor={id} className="text-sm font-medium text-stone-800 dark:text-stone-300 ml-1">
          {label}
        </label>
      )}

      <input
        id={id}
        name={name}
        className={`
          h-11 rounded-lg border-none px-5 text-sm text-stone-900 dark:text-stone-100
          placeholder:text-stone-500 dark:placeholder:text-stone-500 bg-white dark:bg-stone-800 shadow-sm
          focus:outline-none focus:ring-2 focus:ring-rose-300
          transition
          ${error ? 'ring-2 ring-red-300' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...rest}
      />

      {error ? (
        <p className="text-xs text-red-600 ml-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-stone-700 dark:text-stone-400 ml-1">{helperText}</p>
      ) : null}
    </div>
  )
}