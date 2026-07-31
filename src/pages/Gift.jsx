import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PixelButton from '../components/PixelButton.jsx'
import PixelPanel from '../components/PixelPanel.jsx'
import PixelHeart from '../components/PixelHeart.jsx'
import Starfield from '../components/Starfield.jsx'
import HeartRain from '../components/HeartRain.jsx'
import RetroMarquee from '../components/RetroMarquee.jsx'
import MusicPlayer from '../components/MusicPlayer.jsx'
import { daysSince, decodeGift } from '../lib/giftData.js'

function CountUp({ target }) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target <= 0) {
      setValue(0)
      return
    }
    let raf
    const t0 = performance.now()
    const dur = 1200
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  return <span>{value}</span>
}

function Typewriter({ text, active }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    setCount(0)
    let i = 0
    const iv = window.setInterval(() => {
      i += 1
      setCount(i)
      if (i >= text.length) window.clearInterval(iv)
    }, 18)
    return () => window.clearInterval(iv)
  }, [active, text])
  if (!active) return <span>{text}</span>
  return <span className="caret">{text.slice(0, count)}</span>
}

export default function Gift() {
  const [params] = useSearchParams()
  const gift = useMemo(() => decodeGift(params.get('data')), [params])

  const [unlocked, setUnlocked] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(gift?.unlock.seconds || 10)
  const [answer, setAnswer] = useState('')
  const [answerWrong, setAnswerWrong] = useState(false)
  const [reading, setReading] = useState(false)
  const [brokenPhotos, setBrokenPhotos] = useState(() => new Set())

  useEffect(() => {
    document.title = gift ? gift.title || 'Girlfriend Day' : 'Girlfriend Day'
  }, [gift])

  const days = useMemo(() => (gift ? daysSince(gift.date) : 0), [gift])

  const unlock = () => {
    if (unlocked) return
    setUnlocked(true)
    setShaking(true)
    window.setTimeout(() => setShaking(false), 700)
  }

  const tryAnswer = () => {
    const expected = (gift.unlock.answer || '').trim().toLowerCase()
    if (!expected || answer.trim().toLowerCase() === expected) {
      setAnswerWrong(false)
      unlock()
    } else {
      setAnswerWrong(true)
    }
  }

  useEffect(() => {
    if (!gift || gift.unlock.type !== 'timer' || unlocked) return
    if (secondsLeft <= 0) {
      unlock()
      return
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, gift, unlocked])

  const photos = useMemo(() => (gift?.photos || []).filter((p) => p.src.trim()), [gift])

  if (!gift) {
    return (
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <Starfield />
        <HeartRain count={8} />
        <PixelHeart color="#e0526d" size={72} className="heartbeat mb-6" />
        <h1 className="font-pixel text-xl text-hot">NO GIFT DATA FOUND</h1>
        <p className="mt-4 max-w-md text-lg text-plum/60">
          This link is empty. The surprise needs to be created first.
        </p>
        <div className="mt-8">
          <Link to="/">
            <PixelButton color="cyan">◄ BACK TO CREATOR</PixelButton>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative z-10 min-h-screen pb-16 ${shaking ? 'screen-shake' : ''}`}>
      <Starfield />
      <HeartRain count={22} burst={unlocked} />

      <RetroMarquee
        text={`${gift.title} · ${gift.herName} ♥ ${gift.yourName} · FOREVER`}
        className="relative z-10"
      />

      {!unlocked ? (
        <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-center px-4 text-center">
          <PixelHeart color="#e0526d" size={96} className="heartbeat mb-8" />
          <p className="font-pixel text-[15px] tracking-widest text-cyan">A GIFT IS WAITING</p>
          <h1 className="mt-4 max-w-2xl font-pixel text-2xl leading-relaxed text-hot glow-pulse sm:text-3xl">
            {gift.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-plum/70">
            {gift.subtitle}
          </p>
          <p className="mt-6 font-pixel text-[15px] text-gold">
            INSERT COIN TO CONTINUE...
          </p>

          <div className="mt-8 w-full max-w-md">
            {gift.unlock.type === 'button' && (
              <PixelButton color="pink" onClick={unlock} className="w-full py-5 text-base">
                PRESS START
              </PixelButton>
            )}

            {gift.unlock.type === 'timer' && (
              <div className="pixel-panel-accent p-6 text-center">
                <p className="mb-3 font-pixel text-[15px] text-cyan">UNLOCKING IN</p>
                <div className="font-pixel text-6xl text-gold">
                  {secondsLeft}
                </div>
                <PixelButton color="gold" onClick={unlock} className="mt-6 w-full">
                  CAN'T WAIT? SKIP
                </PixelButton>
              </div>
            )}

            {gift.unlock.type === 'question' && (
              <div className="pixel-panel-accent p-6 text-center">
                <p className="mb-4 font-pixel text-[16px] leading-6 text-plum">
                  {gift.unlock.question}
                </p>
                <input
                  className="pixel-input text-center"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value)
                    setAnswerWrong(false)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && tryAnswer()}
                  placeholder="type the answer..."
                />
                {answerWrong && (
                  <p className="mt-3 font-pixel text-[16px] text-crimson blink">
                    WRONG! TRY AGAIN...
                  </p>
                )}
                <PixelButton color="gold" onClick={tryAnswer} className="mt-4 w-full">
                  CONFIRM
                </PixelButton>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative z-10 mx-auto max-w-3xl px-4">
          {/* Day counter */}
          <div className="mt-10 text-center">
            <p className="font-pixel text-[15px] tracking-widest text-cyan">
              {gift.herName} & {gift.yourName} · {gift.date}
            </p>
            <div className="mt-4 flex items-center justify-center gap-4">
              <PixelHeart color="#ffcef3" size={36} className="heartbeat" />
              <div className="pixel-panel-accent px-8 py-4">
                <span className="font-pixel text-5xl text-hot sm:text-6xl">
                  <CountUp target={days} />
                </span>
                <p className="mt-2 font-pixel text-[15px] text-gold">DAYS OF US</p>
              </div>
              <PixelHeart color="#cabbe9" size={36} className="heartbeat" />
            </div>
          </div>

          {/* Love letter */}
          <PixelPanel accent className="mt-10">
            <h2 className="mb-4 flex items-center gap-3 font-pixel text-base text-gold">
              <PixelHeart color="#e0526d" size={22} /> A LETTER FOR YOU
            </h2>
            <div className="whitespace-pre-wrap text-lg leading-relaxed text-plum/90">
              <Typewriter text={gift.letter} active={reading} />
            </div>
            {!reading && (
              <div className="mt-6 text-center">
                <PixelButton color="pink" onClick={() => setReading(true)}>
                  READ THE LETTER ▼
                </PixelButton>
              </div>
            )}
            {reading && gift.yourName && (
              <p className="mt-4 text-right font-pixel text-[16px] text-hot">— {gift.yourName}</p>
            )}
          </PixelPanel>

          {/* Timeline */}
          {gift.timeline.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-3 font-pixel text-base text-gold">
                <PixelHeart color="#e0526d" size={22} /> OUR STORY
              </h2>
              <div className="grid gap-4">
                {gift.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center border-3 border-black bg-hot font-pixel text-[15px] text-white">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {i < gift.timeline.length - 1 && <div className="w-0 flex-1 border-l-4 border-dashed border-pink/50" />}
                    </div>
                    <PixelPanel className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-3">
                        {t.year && <span className="font-pixel text-[15px] text-cyan">{t.year}</span>}
                        {t.title && <h3 className="font-pixel text-xs text-hot">{t.title}</h3>}
                      </div>
                      {t.text && <p className="mt-2 text-lg text-plum/85">{t.text}</p>}
                    </PixelPanel>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos */}
          {photos.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 flex items-center gap-3 font-pixel text-base text-gold">
                <PixelHeart color="#e0526d" size={22} /> MEMORIES
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {photos
                  .filter((p) => !brokenPhotos.has(p.src))
                  .map((p, i) => (
                    <figure key={i} className="pixel-panel p-3">
                      <img
                        src={p.src}
                        alt={p.caption || `Memory ${i + 1}`}
                        loading="lazy"
                        className="pixel-photo h-52 w-full object-cover"
                        onError={() => setBrokenPhotos((prev) => new Set(prev).add(p.src))}
                      />
                      {p.caption && (
                        <figcaption className="mt-2 text-center font-pixel text-[15px] text-cyan">
                          {p.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
              </div>
            </div>
          )}

          {/* Music */}
          <div className="mt-10">
            <h2 className="mb-4 text-center font-pixel text-base text-gold">OUR SONG</h2>
            <MusicPlayer src={gift.music} />
          </div>

          {/* Footer */}
          <div className="mt-14 border-3 border-dashed border-pink/60 p-6 text-center">
            <p className="font-pixel text-[16px] leading-7 text-plum/80">
              THANKS FOR LEVELING UP WITH ME,
            </p>
            <p className="mt-2 font-pixel text-base leading-7 text-hot glow-pulse">
              {gift.herName} ♥ {gift.yourName}
            </p>
            <p className="mt-4 font-pixel text-[15px] text-plum/40">GAME OVER? NEVER.</p>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="font-pixel text-[15px] text-cyan underline decoration-pink underline-offset-4">
              MAKE YOUR OWN 8-BIT GIFT
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
