// Offline support: the app shell is cached, so tests open and run without internet.
// Pages are network-first (a new deploy shows at once); hashed assets are cache-first.
// Audio is not cached (range requests) — offline, Listening falls back to the read-aloud script.
const CACHE = 'bandready-v1' // lookups ignore Vary: module scripts send an Origin header the precache request didn't
const ROOT = new URL('./', self.location).href

const assetsIn = html => [...html.matchAll(/(?:src|href)="(\.?\/?[^"]*assets\/[^"]+)"/g)].map(m => new URL(m[1], ROOT).href)

// Caches index.html (takes its own copy of the response) and the files it links to.
async function refreshShell(res) {
  const html = await res.clone().text()
  const keep = new Set([ROOT, new URL('favicon.svg', ROOT).href, new URL('manifest.webmanifest', ROOT).href, ...assetsIn(html)])
  const cache = await caches.open(CACHE)
  await cache.put(ROOT, res)
  await Promise.all([...keep].filter(u => u !== ROOT).map(u => cache.match(u, { ignoreVary: true }).then(hit => hit || cache.add(u).catch(() => {}))))
  for (const req of await cache.keys()) if (req.url.includes('/assets/') && !keep.has(req.url)) cache.delete(req) // old deploys
}

self.addEventListener('install', e => {
  e.waitUntil(fetch(ROOT, { cache: 'no-cache' }).then(refreshShell).catch(() => {}))
  self.skipWaiting()
})
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('fetch', e => {
  const req = e.request
  const url = new URL(req.url)
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.endsWith('.mp3')) return
  if (req.mode === 'navigate') {
    // Only HTML refreshes the app shell — not an image or the manifest opened in a tab.
    e.respondWith(fetch(req).then(res => { if (res.ok && res.headers.get('content-type')?.includes('text/html')) e.waitUntil(refreshShell(res.clone())); return res }).catch(() => caches.match(ROOT, { ignoreVary: true })))
    return
  }
  e.respondWith(caches.match(req, { ignoreVary: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy))) }
    return res
  })))
})
