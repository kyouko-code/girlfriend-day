import cn from '../lib/cn.js'

export default function PixelField({
  label,
  hint,
  className = '',
  inputClass = '',
  ...props
}) {
  return (
    <label className={cn('block', className)}>
      {label && (
        <span className="mb-2 block font-pixel text-[16px] tracking-wide text-hot">
          {label}
        </span>
      )}
      <input className={cn('pixel-input', inputClass)} {...props} />
      {hint && <span className="mt-1 block text-sm text-plum/50">{hint}</span>}
    </label>
  )
}
