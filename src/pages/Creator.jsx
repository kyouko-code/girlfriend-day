import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PixelButton from '../components/PixelButton.jsx'
import PixelPanel from '../components/PixelPanel.jsx'
import PixelField from '../components/PixelField.jsx'
import PixelHeart from '../components/PixelHeart.jsx'
import Starfield from '../components/Starfield.jsx'
import HeartRain from '../components/HeartRain.jsx'
import RetroMarquee from '../components/RetroMarquee.jsx'
import {
  DEFAULT_GIFT,
  buildShareUrl,
  clearDraft,
  encodeGift,
  exportJson,
  importJson,
  loadDraft,
  saveDraft,
  todayISO,
} from '../lib/giftData.js'

const EMPTY_TIMELINE = { year: '', title: '', text: '' }
const EMPTY_PHOTO = { src: '', caption: '' }

export default function Creator() {
  const navigate = useNavigate()
  const [draft, setDraft] = useState(() => loadDraft() || { ...DEFAULT_GIFT, date: todayISO() })
  const [msg, setMsg] = useState(null)
  const [link, setLink] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    document.title = 'Girlfriend Day — Creator'
  }, [])

  const flash = (text, ok = true) => {
    setMsg({ text, ok })
    window.setTimeout(() => setMsg(null), 3500)
  }

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }))
  const setUnlock = (key) => (e) =>
    setDraft((d) => ({ ...d, unlock: { ...d.unlock, [key]: e.target.value } }))

  const updateTimeline = (i, key, value) =>
    setDraft((d) => ({
      ...d,
      timeline: d.timeline.map((t, idx) => (idx === i ? { ...t, [key]: value } : t)),
    }))
  const updatePhoto = (i, key, value) =>
    setDraft((d) => ({
      ...d,
      photos: d.photos.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)),
    }))

  const stats = useMemo(() => {
    const photos = draft.photos.filter((p) => p.src.trim()).length
    const moments = draft.timeline.filter((t) => t.text.trim()).length
    const hearts = Math.max(1, photos + moments + (draft.letter.trim() ? 3 : 0) + 2)
    return { photos, moments, hearts }
  }, [draft])

  const handleSave = () => {
    if (saveDraft(draft)) flash('DRAFT SAVED! ♥')
    else flash('COULD NOT SAVE DRAFT', false)
  }

  const handleLoad = () => {
    const saved = loadDraft()
    if (saved) {
      setDraft(saved)
      flash('DRAFT RESTORED ♥')
    } else {
      flash('NO DRAFT FOUND YET', false)
    }
  }

  const handleClear = () => {
    clearDraft()
    setDraft({ ...DEFAULT_GIFT, date: todayISO() })
    flash('DRAFT CLEARED')
  }

  const handleExport = () => {
    exportJson(draft)
    flash('BACKUP JSON EXPORTED ♥')
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = await importJson(file)
      setDraft(data)
      flash('BACKUP IMPORTED ♥')
    } catch {
      flash('INVALID BACKUP FILE', false)
    }
    e.target.value = ''
  }

  const handleShare = async () => {
    const url = buildShareUrl(draft)
    setLink(url)
    try {
      await navigator.clipboard.writeText(url)
      flash('LINK COPIED! SEND IT TO HER ♥')
    } catch {
      flash('LINK READY BELOW ♥')
    }
  }

  const handlePreview = () => {
    const url = `/gift?data=${encodeGift(draft)}`
    navigate(url)
  }

  const sectionTitle = (num, text) => (
    <h2 className="mb-4 flex items-center gap-3 font-pixel text-base text-gold">
      <PixelHeart color="#e0526d" size={22} />
      <span>
        {num} · {text}
      </span>
    </h2>
  )

  return (
    <div className="relative z-10 min-h-screen pb-16">
      <Starfield />
      <HeartRain count={14} />

      <RetroMarquee text="PRESS START TO BUILD YOUR LOVE STORY" className="relative z-10" />

      <header className="relative z-10 mx-auto max-w-3xl px-4 pt-10 text-center">
        <div className="mb-4 flex justify-center gap-3">
          <PixelHeart color="#ffcef3" size={40} className="heartbeat" />
          <PixelHeart color="#e0526d" size={40} className="heartbeat" />
          <PixelHeart color="#cabbe9" size={40} className="heartbeat" />
        </div>
        <h1 className="font-pixel text-2xl leading-relaxed text-hot glow-pulse sm:text-3xl">
          GIRLFRIEND DAY
        </h1>
        <p className="mt-3 font-pixel text-[16px] leading-6 text-cyan">
          THE 8-BIT LOVE EXPERIENCE BUILDER
        </p>
        <p className="mt-4 text-lg text-plum/70">
          Fill in the details, hit <span className="text-gold">GENERATE</span>, and surprise her
          with a pixel world that only you two share.
        </p>
      </header>

      <main className="relative z-10 mx-auto mt-8 grid max-w-3xl gap-6 px-4">
        {/* STEP 1 — NAMES */}
        <PixelPanel accent>
          {sectionTitle(1, 'NAMES & DATE')}
          <div className="grid gap-4 sm:grid-cols-2">
            <PixelField label="HER NAME" value={draft.herName} onChange={set('herName')} placeholder="e.g. Miyu" />
            <PixelField label="YOUR NAME" value={draft.yourName} onChange={set('yourName')} placeholder="e.g. Kai" />
            <PixelField label="ANNIVERSARY DATE" type="date" value={draft.date} onChange={set('date')} />
            <PixelField
              label="TITLE TEXT"
              value={draft.title}
              onChange={set('title')}
              placeholder="HAPPY GIRLFRIEND'S DAY!"
            />
          </div>
          <div className="mt-4">
            <PixelField
              label="SUBTITLE"
              value={draft.subtitle}
              onChange={set('subtitle')}
              placeholder="A little pixel world made just for you."
            />
          </div>
        </PixelPanel>

        {/* STEP 2 — LETTER */}
        <PixelPanel accent>
          {sectionTitle(2, 'LOVE LETTER')}
          <textarea
            className="pixel-input min-h-[160px] resize-y leading-relaxed"
            value={draft.letter}
            onChange={set('letter')}
            placeholder="Write from the heart... pixel by pixel."
          />
        </PixelPanel>

        {/* STEP 3 — UNLOCK */}
        <PixelPanel accent>
          {sectionTitle(3, 'SURPRISE UNLOCK')}
          <p className="mb-3 text-sm text-plum/60">
            Choose how she unlocks the surprise when she opens the link.
          </p>
          <label className="block">
            <span className="mb-2 block font-pixel text-[16px] text-hot">UNLOCK MODE</span>
            <select
              className="pixel-input cursor-pointer"
              value={draft.unlock.type}
              onChange={setUnlock('type')}
            >
              <option value="button">PRESS START BUTTON</option>
              <option value="timer">COUNTDOWN TIMER</option>
              <option value="question">ANSWER A QUESTION</option>
            </select>
          </label>

          {draft.unlock.type === 'timer' && (
            <div className="mt-4">
              <PixelField
                label="COUNTDOWN SECONDS"
                type="number"
                min="3"
                max="120"
                value={draft.unlock.seconds}
                onChange={setUnlock('seconds')}
              />
            </div>
          )}

          {draft.unlock.type === 'question' && (
            <div className="mt-4 grid gap-4">
              <PixelField
                label="QUESTION"
                value={draft.unlock.question}
                onChange={setUnlock('question')}
                placeholder="What is our special song?"
              />
              <PixelField
                label="ANSWER (SECRET)"
                value={draft.unlock.answer}
                onChange={setUnlock('answer')}
                placeholder="answer..."
              />
            </div>
          )}
        </PixelPanel>

        {/* STEP 4 — TIMELINE */}
        <PixelPanel accent>
          {sectionTitle(4, 'OUR TIMELINE')}
          {draft.timeline.length === 0 && (
            <p className="mb-3 text-sm text-plum/50">No moments yet. Add your first one!</p>
          )}
          <div className="grid gap-4">
            {draft.timeline.map((t, i) => (
              <div key={i} className="pixel-panel-dark p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-pixel text-[15px] text-cyan">MOMENT #{i + 1}</span>
                  <PixelButton color="hot" className="!px-2 !py-1 text-[15px]" onClick={() => setDraft((d) => ({ ...d, timeline: d.timeline.filter((_, idx) => idx !== i) }))}>
                    ✕
                  </PixelButton>
                </div>
                <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                  <input className="pixel-input" value={t.year} onChange={(e) => updateTimeline(i, 'year', e.target.value)} placeholder="YEAR" />
                  <input className="pixel-input" value={t.title} onChange={(e) => updateTimeline(i, 'title', e.target.value)} placeholder="Title" />
                </div>
                <textarea
                  className="pixel-input mt-3 min-h-[70px] resize-y"
                  value={t.text}
                  onChange={(e) => updateTimeline(i, 'text', e.target.value)}
                  placeholder="What happened here?"
                />
              </div>
            ))}
          </div>
          <PixelButton
            color="lime"
            className="mt-4"
            onClick={() => setDraft((d) => ({ ...d, timeline: [...d.timeline, { ...EMPTY_TIMELINE }] }))}
          >
            + ADD MOMENT
          </PixelButton>
        </PixelPanel>

        {/* STEP 5 — PHOTOS */}
        <PixelPanel accent>
          {sectionTitle(5, 'PHOTO GALLERY')}
          <p className="mb-3 text-sm text-plum/60">
            Paste image URLs (Cloudinary, Imgur, etc.). Photos that are empty or break will be skipped.
          </p>
          {draft.photos.map((p, i) => (
            <div key={i} className="pixel-panel-dark mb-3 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-pixel text-[15px] text-cyan">PHOTO #{i + 1}</span>
                <PixelButton color="hot" className="!px-2 !py-1 text-[15px]" onClick={() => setDraft((d) => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }))}>
                  ✕
                </PixelButton>
              </div>
              <input
                className="pixel-input"
                value={p.src}
                onChange={(e) => updatePhoto(i, 'src', e.target.value)}
                placeholder="https://.../photo.jpg"
              />
              <input
                className="pixel-input mt-3"
                value={p.caption}
                onChange={(e) => updatePhoto(i, 'caption', e.target.value)}
                placeholder="Caption for this memory"
              />
            </div>
          ))}
          <PixelButton color="lime" className="mt-2" onClick={() => setDraft((d) => ({ ...d, photos: [...d.photos, { ...EMPTY_PHOTO }] }))}>
            + ADD PHOTO
          </PixelButton>
        </PixelPanel>

        {/* STEP 6 — MUSIC */}
        <PixelPanel accent>
          {sectionTitle(6, 'BACKGROUND MUSIC')}
          <PixelField
            label="MUSIC URL (MP3 / OGG)"
            value={draft.music}
            onChange={set('music')}
            placeholder="https://.../song.mp3"
            hint="Paste a hosted audio file URL. She can press PLAY on the gift page."
          />
        </PixelPanel>

        {/* STEP 7 — LAUNCH */}
        <PixelPanel accent>
          {sectionTitle(7, 'GENERATE & SHARE')}
          <div className="pixel-panel-dark mb-4 p-4 text-sm">
            <p className="mb-2 font-pixel text-[15px] text-cyan">LIVE STATS</p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-plum/80">
              <span>♥ {stats.hearts} pixel hearts</span>
              <span>♪ {stats.photos ? 'photos + music' : 'no photos yet'}</span>
              <span>⏳ {stats.moments} timeline moments</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <PixelButton color="pink" onClick={handleShare}>
              ♥ GENERATE LINK
            </PixelButton>
            <PixelButton color="cyan" onClick={handlePreview}>
              ▶ PREVIEW
            </PixelButton>
            <PixelButton color="gold" onClick={handleSave}>
              SAVE DRAFT
            </PixelButton>
            <PixelButton color="purple" onClick={handleLoad}>
              LOAD
            </PixelButton>
            <PixelButton color="hot" onClick={handleExport}>
              EXPORT JSON
            </PixelButton>
            <PixelButton color="cyan" onClick={() => fileRef.current?.click()}>
              IMPORT JSON
            </PixelButton>
            <PixelButton color="hot" onClick={handleClear}>
              CLEAR
            </PixelButton>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </div>

          {msg && (
            <p className={`mt-4 font-pixel text-[16px] ${msg.ok ? 'text-plum' : 'text-crimson'}`}>
              {msg.ok ? '♥ ' : '! '}
              {msg.text}
            </p>
          )}

          {link && (
            <div className="mt-4 break-all rounded-none border-3 border-cyan bg-night2 p-3 font-mono text-xs text-cyan">
              {link}
            </div>
          )}
        </PixelPanel>
      </main>

      <footer className="relative z-10 mt-12 px-4 pb-4 text-center">
        <p className="font-pixel text-[15px] leading-6 text-plum/40">
          MADE WITH <PixelHeart color="#e0526d" size={14} /> IN 8-BIT · SHARE THE LINK, NOT THE SECRETS
        </p>
      </footer>
    </div>
  )
}
