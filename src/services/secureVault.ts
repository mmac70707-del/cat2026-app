import { dbDelete, dbGet, dbPut, openDB } from '@/db'
import { getNativeVaultKeyMaterial } from '@/services/native'


const VAULT_KEY = 'jarvis_secure_vault_v1'
const PBKDF2_ITERATIONS = 600_000

type VaultRecord = {
  keyId: string
  iv: string
  ciphertext: string
  updatedAt: number
}

let vaultKey: CryptoKey | null = null

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

async function derivePinKey(pin: string, salt: Uint8Array, iterations = PBKDF2_ITERATIONS) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: toArrayBuffer(salt), iterations, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

async function importNativeKey(hex: string) {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map(value => parseInt(value, 16)) ?? [])
  if (bytes.length !== 32) throw new Error('Invalid native vault key material')
  return crypto.subtle.importKey('raw', toArrayBuffer(bytes), { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

export async function unlockVaultWithPin(pin: string, saltBase64: string, iterations = PBKDF2_ITERATIONS): Promise<void> {
  vaultKey = await derivePinKey(pin, fromBase64(saltBase64), iterations)
}

export async function unlockVaultWithNative(): Promise<void> {
  const material = await getNativeVaultKeyMaterial()
  if (!material) throw new Error('Native secure vault is unavailable')
  vaultKey = await importNativeKey(material)
}

export function clearVaultKey() {
  vaultKey = null
}

export function isVaultUnlocked() {
  return vaultKey !== null
}

export async function secureVaultSet(keyId: string, value: string): Promise<void> {
  if (!vaultKey) throw new Error('Secure vault is locked')
  await openDB()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const plaintext = new TextEncoder().encode(value)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: toArrayBuffer(iv) }, vaultKey, toArrayBuffer(plaintext))
  await dbPut<VaultRecord>('secureVault', {
    keyId,
    iv: toBase64(iv),
    ciphertext: toBase64(new Uint8Array(ciphertext)),
    updatedAt: Date.now(),
  })
}

export async function secureVaultGet(keyId: string): Promise<string | null> {
  if (!vaultKey) throw new Error('Secure vault is locked')
  const record = await dbGet<VaultRecord>('secureVault', keyId)
  if (!record) return null
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(fromBase64(record.iv)) },
    vaultKey,
    toArrayBuffer(fromBase64(record.ciphertext))
  )
  return new TextDecoder().decode(plaintext)
}

export async function secureVaultDelete(keyId: string): Promise<void> {
  if (!vaultKey) throw new Error('Secure vault is locked')
  await dbDelete('secureVault', keyId)
}

export async function migrateLegacyLocalSecret(
  keyId: string,
  readLegacy: () => string | null,
  clearLegacy: () => void
): Promise<string | null> {
  const existing = await secureVaultGet(keyId)
  if (existing !== null) return existing
  const legacy = readLegacy()
  if (legacy === null) return null
  await secureVaultSet(keyId, legacy)
  clearLegacy()
  return legacy
}
