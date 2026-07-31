import { useEffect, useRef, useState } from 'react'
import PixelButton from './PixelButton.jsx'
import PixelHeart from './PixelHeart.jsx'

const YT_STATES = {
  PLAYING: 1,
  PAUSED: 2,
  ENDED: 0,
}

function extractYoutubeId(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0]
  } catch {
    /* not a url */
  }
  return null
}

function loadYoutubeApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve()
      return
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev()
      resolve()
    }
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
  })
}

export default function MusicPlayer({ src }) {
  const audioRef = useRef(null)
  const ytHostRef = useRef(null)
  const playerRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)
  const youtubeId = extractYoutubeId(src)

  useEffect(() => {
    setPlaying(false)
    setError(false)
    return () => {
      playerRef.current?.destroy()
      playerRef.current = null
    }
  }, [src])

  const ensureYoutubePlayer = async () => {
    if (playerRef.current) return
    try {
      await loadYoutubeApi()
      if (playerRef.current) return
      playerRef.current = new window.YT.Player(ytHostRef.current, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: () => setError(false),
          onError: () => setError(true),
          onStateChange: (e) => {
            if (e.data === YT_STATES.PLAYING) setPlaying(true)
            if (e.data === YT_STATES.PAUSED || e.data === YT_STATES.ENDED) setPlaying(false)
          },
        },
      })
    } catch {
      setError(true)
    }
  }

  const toggle = () => {
    if (error) return
    if (youtubeId) {
      if (!playerRef.current) {
        ensureYoutubePlayer()
        return
      }
      if (playing) playerRef.current.pauseVideo()
      else playerRef.current.playVideo()
      return
    }
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else audio.play().catch(() => setError(true))
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {youtubeId ? (
        <div
          ref={ytHostRef}
          className="pointer-events-none fixed left-0 top-0 h-px w-px overflow-hidden opacity-0"
          aria-hidden="true"
        />
      ) : (
        src && (
          <audio
            ref={audioRef}
            src={src}
            loop
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
          />
        )
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
