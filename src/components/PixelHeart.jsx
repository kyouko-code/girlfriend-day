import cn from '../lib/cn.js'

const GRID = [
  '..XX..XX..',
  '.XXXX.XXXX',
  'XXXXXXXXXX',
  '.XXXXXXXX.',
  '..XXXXXX..',
  '...XXXX...',
  '....XX....',
]

export default function PixelHeart({
  color = '#e0526d',
  size = 32,
  className = '',
}) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={cn('pixel-heart', className)}
    >
      {GRID.flatMap((row, y) =>
        row.split('').map((cell, x) =>
          cell === 'X' ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
          ) : null,
        ),
      )}
    </svg>
  )
}
