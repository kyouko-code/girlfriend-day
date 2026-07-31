import { useMemo } from 'react'
import PixelHeart from './PixelHeart.jsx'

export default function HeartRain({ count = 18, burst = false }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        dur: `${(7 + Math.random() * 7).toFixed(2)}s`,
        delay: `${(Math.random() * 8).toFixed(2)}s`,
        drift: `${(Math.random() * 120 - 60).toFixed(0)}px`,
        size: 10 + Math.round(Math.random() * 22),
        color: ['#ffcef3', '#cabbe9', '#e0526d', '#a1eafb'][i % 4],
      })),
    [count],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="float-heart"
          style={
            {
              '--left': h.left,
              '--dur': h.dur,
              '--delay': burst ? '0s' : h.delay,
              '--drift': h.drift,
              bottom: burst ? '-40px' : `${Math.random() * 40 - 60}px`,
            }
          }
        >
          <PixelHeart color={h.color} size={h.size} />
        </span>
      ))}
    </div>
  )
}
