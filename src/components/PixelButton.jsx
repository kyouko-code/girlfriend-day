import cn from '../lib/cn.js'

export default function PixelButton({
  color = 'pink',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type="button"
      {...props}
      className={cn('pixel-btn px-4 py-3 text-base', `pixel-btn-${color}`, className)}
    >
      {children}
    </button>
  )
}
