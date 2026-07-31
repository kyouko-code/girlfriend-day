import cn from '../lib/cn.js'

export default function PixelPanel({ accent = false, dark = false, className = '', children, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        'pixel-panel rounded-none p-5',
        accent && 'pixel-panel-accent',
        dark && 'pixel-panel-dark',
        className,
      )}
    >
      {children}
    </div>
  )
}
