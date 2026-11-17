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

export async function deleteMedia(ref: string) {
  await tx('readwrite', s => s.delete(ref.replace(/^media:/, '')))
}

const urlCache = new Map<string, string>()

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
export async function exportAllMedia(): Promise<Record<string, string>> {
  const ids = (await tx('readonly', s => s.getAllKeys())) as string[]
  const out: Record<string, string> = {}
  for (const id of ids) {
    const blob = await getMedia(id)
    if (blob) out[id] = await toDataUrl(blob)
  }
  return out
}

export async function importAllMedia(media: Record<string, string>) {
  for (const [id, url] of Object.entries(media)) {
    if (url.startsWith('data:')) await putMedia(await (await fetch(url)).blob(), id)
  }
}
