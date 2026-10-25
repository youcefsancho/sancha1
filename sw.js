// Network-first service worker: anything you have opened once (shell, Quran, hadith JSON) works offline.
const C = 'sancha-v1'
self.addEventListener('install', e => { e.waitUntil(caches.open(C).then(c => c.addAll(['./', './manifest.json', './icon.svg']))); self.skipWaiting() })
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))))
self.addEventListener('fetch', e => {
  const r = e.request
  if (r.method !== 'GET' || r.headers.has('range') || !r.url.startsWith('http') || /\.(mp3|mp4)(\?|$)/.test(r.url)) return
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)) } return res }).catch(() => caches.match(r)))
})
