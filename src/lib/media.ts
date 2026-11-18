// Blobs (uploaded audio/images, speaking recordings) live in IndexedDB — too big for localStorage.
const DB_NAME = 'ielts-mock-media'
const STORE = 'blobs'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open()
  return new Promise((resolve, reject) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function putMedia(blob: Blob, id = `m${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`) {
  await tx('readwrite', s => s.put(blob, id))
  return `media:${id}`
}

export async function getMedia(ref: string): Promise<Blob | undefined> {
  return tx('readonly', s => s.get(ref.replace(/^media:/, '')))
}

const urlCache = new Map<string, string>()

export async function deleteMedia(ref: string) {
  const key = `media:${ref.replace(/^media:/, '')}`
  const url = urlCache.get(key)
  if (url) { URL.revokeObjectURL(url); urlCache.delete(key) }
  await tx('readwrite', s => s.delete(ref.replace(/^media:/, '')))
}

/** "media:<id>" → object URL; plain URLs pass through. */
export async function resolveMediaUrl(ref?: string): Promise<string | undefined> {
  if (!ref) return undefined
  if (!ref.startsWith('media:')) return ref
  const cached = urlCache.get(ref)
  if (cached) return cached
  const blob = await getMedia(ref)
  if (!blob) return undefined
  const url = URL.createObjectURL(blob)
  urlCache.set(ref, url)
  return url
}

const toDataUrl = (b: Blob) => new Promise<string>((resolve, reject) => {
  const r = new FileReader()
  r.onload = () => resolve(r.result as string)
  r.onerror = () => reject(r.error)
  r.readAsDataURL(b)
})

/** Every stored blob (recordings, uploaded audio/images) as data URLs, for the backup file. */
export async function exportAllMedia(onlyIds?: Set<string>): Promise<Record<string, string>> {
  const ids = ((await tx('readonly', s => s.getAllKeys())) as string[]).filter(id => !onlyIds || onlyIds.has(id))
  const out: Record<string, string> = {}
  for (const id of ids) {
    const blob = await getMedia(id)
    if (blob) out[id] = await toDataUrl(blob)
  }
  return out
}

export async function importAllMedia(media: Record<string, string>) {
  let failed = 0
  for (const [id, url] of Object.entries(media)) {
    if (typeof url !== 'string' || !url.startsWith('data:')) { failed++; continue }
    try { await putMedia(await (await fetch(url)).blob(), id) } catch { failed++ }
  }
  return failed
}

/** Deletes every stored blob (recordings, uploaded audio/images) — used by "Reset everything". */
export async function clearAllMedia() {
  urlCache.forEach(url => URL.revokeObjectURL(url))
  urlCache.clear()
  await tx('readwrite', s => s.clear())
}

/** Media ids ("media:<id>") mentioned anywhere in some data — what a backup or export actually needs. */
export function referencedMedia(data: unknown): Set<string> {
  return new Set([...JSON.stringify(data).matchAll(/"media:([^"]+)"/g)].map(m => m[1]))
}

/** A copy of the test with its uploaded audio/images inlined as data URLs, so the JSON works in another browser. */
export async function embedTestMedia<T>(test: T): Promise<T> {
  let json = JSON.stringify(test)
  for (const id of referencedMedia(test)) {
    const blob = await getMedia(id).catch(() => undefined)
    if (blob) json = json.split(`"media:${id}"`).join(JSON.stringify(await toDataUrl(blob)))
  }
  return JSON.parse(json) as T
}

/** The reverse of embedTestMedia: inline data URLs go to IndexedDB (localStorage is too small for audio). */
export async function storeEmbeddedMedia<T>(test: T): Promise<T> {
  const urls = new Set([...JSON.stringify(test).matchAll(/"(data:(?:audio|image|video)\/[^"]+)"/g)].map(m => m[1]))
  let json = JSON.stringify(test)
  for (const url of urls) {
    const ref = await putMedia(await (await fetch(url)).blob())
    json = json.split(JSON.stringify(url)).join(JSON.stringify(ref))
  }
  return JSON.parse(json) as T
}
