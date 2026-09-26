// ═══════════════════════════════════════════════════
//  CAT 2026 — IndexedDB Layer
//  Thin promise-based wrapper. UI never touches this.
//  All access goes through Repository layer.
// ═══════════════════════════════════════════════════

const DB_NAME = 'cat2026_db'
// Bumped 4 → 5 to add `weeklySummaries` (persistent weekly execution analysis records).
// onupgradeneeded only ADDS new stores — every existing store and data is preserved intact.
const DB_VERSION = 6

let _db: IDBDatabase | null = null

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return }
    const req = indexedDB.open(DB_NAME, DB_VERSION)

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result

      const stores: { name: string; key: string; indexes: [string, string][] }[] = [
        { name: 'tasks',          key: 'id',      indexes: [['byDate','date'],['byStatus','status'],['bySubject','subject']] },
        { name: 'errors',         key: 'id',      indexes: [['byType','errorType'],['bySubject','subject'],['byRepair','repairStatus']] },
        { name: 'masteryTopics',  key: 'id',      indexes: [] },
        { name: 'mocks',          key: 'id',      indexes: [['byDate','date']] },
        { name: 'dailyScores',    key: 'date',    indexes: [] },
        { name: 'settings',       key: 'key',     indexes: [] },
        { name: 'formulaReviews', key: 'cardId',  indexes: [] },
        { name: 'roadmap44',      key: 'dayNum',  indexes: [] },
        { name: 'dilrSets',       key: 'id',      indexes: [['byDate','date']] },
        { name: 'varcLogs',       key: 'id',      indexes: [['byDate','date']] },
        { name: 'artifacts',      key: 'id',      indexes: [['byType','type'],['byDateKey','dateKey'],['byWeekKey','weekKey'],['byMonthKey','monthKey'],['byYearKey','yearKey']] },
        { name: 'plans',          key: 'id',      indexes: [['byType','type'],['byDateKey','dateKey']] },
        { name: 'weeklySummaries',key: 'weekKey', indexes: [] },
        { name: 'auditEvents',    key: 'id',      indexes: [['byType','type'],['byTs','ts']] },
      ]

      stores.forEach(({ name, key, indexes }) => {
        if (!db.objectStoreNames.contains(name)) {
          const store = db.createObjectStore(name, { keyPath: key })
          indexes.forEach(([iName, iKey]) =>
            store.createIndex(iName, iKey, { unique: false })
          )
        }
      })
    }

    req.onsuccess = (e) => {
      _db = (e.target as IDBOpenDBRequest).result
      resolve(_db)
    }
    req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error)
  })
}

function getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
  if (!_db) throw new Error('DB not open')
  return _db.transaction(storeName, mode).objectStore(storeName)
}

function promisify<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result)
    req.onerror   = () => rej(req.error)
  })
}

export async function dbGet<T>(store: string, key: IDBValidKey): Promise<T | null> {
  await openDB()
  const result = await promisify<T>(getStore(store).get(key))
  return result ?? null
}

export async function dbGetAll<T>(store: string): Promise<T[]> {
  await openDB()
  return promisify<T[]>(getStore(store).getAll())
}

export async function dbPut<T>(store: string, value: T): Promise<void> {
  await openDB()
  await promisify(getStore(store, 'readwrite').put(value as object))
}

export async function dbDelete(store: string, key: IDBValidKey): Promise<void> {
  await openDB()
  await promisify(getStore(store, 'readwrite').delete(key))
}

export async function dbClear(store: string): Promise<void> {
  await openDB()
  await promisify(getStore(store, 'readwrite').clear())
}

export async function dbGetByIndex<T>(
  store: string,
  indexName: string,
  value: IDBValidKey
): Promise<T[]> {
  await openDB()
  const range = IDBKeyRange.only(value)
  return promisify<T[]>(getStore(store).index(indexName).getAll(range))
}
