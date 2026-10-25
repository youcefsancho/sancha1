// Every network call lives here so pages stay presentational.
const J = async (u: string) => { const r = await fetch(u); if (!r.ok) throw new Error(String(r.status)); return r.json() }
const Q = 'https://api.alquran.cloud/v1'
const HB = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions'

// ---- Quran ----
export const surahs = () => J(`${Q}/surah`).then(r => r.data as any[])
export const reciters = () => J(`${Q}/edition?format=audio&language=ar&type=versebyverse`).then(r => r.data as any[])
/** Returns [arabic, transliteration, translation] editions of one surah. */
export const surah = (n: number, lang: string) => J(`${Q}/surah/${n}/editions/quran-uthmani,en.transliteration,${lang}`).then(r => r.data as any[])
export const searchQuran = (k: string, lang: string) => J(`${Q}/search/${encodeURIComponent(k)}/all/${lang}`).then(r => (r.data?.matches ?? []) as any[])
/** Ibn Kathir (abridged, English) via quran.com v4, resource 169. */
export const tafsir = (n: number, a: number) => J(`https://api.quran.com/api/v4/tafsirs/169/by_ayah/${n}:${a}`).then(r => String(r.tafsir.text).replace(/<[^>]+>/g, ''))
export const audioUrl = (rec: string, ayah: number) => `https://cdn.islamic.network/quran/audio/128/${rec}/${ayah}.mp3`

// ---- Hadith ----
export const COLLECTIONS = { bukhari: { id: 'eng-bukhari', books: 97 }, muslim: { id: 'eng-muslim', books: 56 }, nawawi: { id: 'eng-nawawi', books: 0 } } as const
export const hadith = (c: keyof typeof COLLECTIONS, book = 0) =>
  J(`${HB}/${COLLECTIONS[c].id}${book ? `/sections/${book}` : ''}.json`).then(r => ({ title: book ? (Object.values(r.metadata.section)[0] as string) : 'Forty Hadith', items: r.hadiths as any[] }))
export const hadithOfDay = () => hadith('nawawi').then(({ items }) => items[Math.floor(Date.now() / 864e5) % items.length])

// ---- Prayer times & Qibla (Aladhan) ----
export const prayerTimes = (la: number, lo: number) => J(`https://api.aladhan.com/v1/timings?latitude=${la}&longitude=${lo}&method=2`).then(r => r.data.timings as Record<string, string>)
export const qibla = (la: number, lo: number) => J(`https://api.aladhan.com/v1/qibla/${la}/${lo}`).then(r => r.data.direction as number)

// ---- Podcasts (iTunes search -> RSS2JSON) ----
export const shows = (term: string, n = 8) => J(`https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=podcast&limit=${n}`).then(r => r.results as any[])
export const episodes = (feed: string) => J(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`).then(r => r.items as any[])

// ---- Videos (YouTube Data API v3, key in .env as VITE_YT_KEY) ----
export const YT_KEY = import.meta.env.VITE_YT_KEY as string | undefined
export const videos = (q: string, short = false) =>
  J(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&safeSearch=strict${short ? '&videoDuration=short' : ''}&q=${encodeURIComponent(q)}&key=${YT_KEY}`).then(r => r.items as any[])
