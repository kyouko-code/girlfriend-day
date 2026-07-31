import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'

export const DEFAULT_GIFT = {
  v: 1,
  herName: 'Miyu',
  yourName: 'Kai',
  date: '2024-02-14',
  title: "HAPPY GIRLFRIEND'S DAY!",
  subtitle: 'A little pixel world made just for you.',
  letter:
    "My love,\n\nEvery pixel of this page was made with you in mind. You walked into my life and suddenly everything had color, sound, and meaning.\n\nThank you for every laugh, every late-night call, and every tiny moment that turned ordinary days into memories I never want to forget.\n\nHappy Girlfriend's Day. Here's to us — and to every level we clear together.\n\nForever yours,\n",
  unlock: {
    type: 'button',
    seconds: 10,
    question: 'What is the secret word I always call you?',
    answer: '',
  },
  timeline: [
    { year: '2024', title: 'The Day We Met', text: 'Two strangers, one awkward wave, and a heart that never stopped beating faster.' },
    { year: '2024', title: 'Our First Date', text: 'You laughed at my terrible joke and suddenly I knew. It was never a question.' },
    { year: '2025', title: 'Today', text: 'Still you. Still me. Still hopelessly yours.' },
  ],
  photos: [],
  music: '',
}

const DRAFT_KEY = 'girlfriend-day-draft-v1'

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function daysSince(date) {
  if (!date) return null
  const target = new Date(`${date}T00:00:00`)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.floor((now - target) / 86400000)
  return diff >= 0 ? diff : 0
}

export function sanitizeGift(data) {
  const src = data && typeof data === 'object' ? data : {}
  return {
    ...DEFAULT_GIFT,
    ...src,
    unlock: { ...DEFAULT_GIFT.unlock, ...(src.unlock || {}) },
    timeline: Array.isArray(src.timeline) ? src.timeline : DEFAULT_GIFT.timeline,
    photos: Array.isArray(src.photos) ? src.photos : DEFAULT_GIFT.photos,
  }
}

export function encodeGift(data) {
  return compressToEncodedURIComponent(JSON.stringify(sanitizeGift(data)))
}

export function decodeGift(raw) {
  try {
    const json = decompressFromEncodedURIComponent(raw)
    if (!json) return null
    return sanitizeGift(JSON.parse(json))
  } catch {
    return null
  }
}

export function buildShareUrl(data, origin = window.location.origin) {
  return `${origin}/gift?data=${encodeGift(data)}`
}

export function saveDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitizeGift(data)))
    return true
  } catch {
    return false
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? sanitizeGift(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
}

export function exportJson(data) {
  const blob = new Blob([JSON.stringify(sanitizeGift(data), null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'girlfriend-day-backup.json'
  a.click()
  URL.revokeObjectURL(url)
}

export async function importJson(file) {
  const text = await file.text()
  return sanitizeGift(JSON.parse(text))
}
