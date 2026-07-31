import { useEffect, useRef, useState } from 'react'
import PixelButton from './PixelButton.jsx'
import PixelHeart from './PixelHeart.jsx'

export default function MusicPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setPlaying(false)
    setError(false)
  }, [src])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio || error) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => setError(true))
    }
    setPlaying((p) => !p)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {src && (
        <audio
          ref={audioRef}
          src={src}
          loop
          onEnded={() => setPlaying(false)}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      )}
      <PixelButton
        onClick={toggle}
        color="gold"
        disabled={!src || error}
        className="flex items-center gap-3"
      >
        <PixelHeart color="#e0526d" size={18} />
        {error ? 'MUSIC: LOAD FAILED' : playing ? 'PAUSE SONG' : 'PLAY SONG'}
      </PixelButton>
      <span className="font-pixel text-[15px] text-cyan">
        {playing ? '♪ NOW PLAYING ♪' : '♪ TAP TO START THE 8-BIT FEELS ♪'}
      </span>
    </div>
  )
}
