import cn from '../lib/cn.js'

export default function RetroMarquee({ text, speed = '26s', className = '' }) {
  const content = `${text}  ♥  `.repeat(3)
  return (
    <div className={cn('overflow-hidden border-y-4 border-black bg-hot py-2', className)}>
      <div className="marquee-track" style={{ '--speed': speed }}>
        <span className="font-pixel text-[16px] tracking-widest text-white">
          {content}
          {content}
        </span>
      </div>
    </div>
  )
}
