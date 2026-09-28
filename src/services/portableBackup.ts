const BACKUP_VERSION = 1
const BACKUP_AAD = new TextEncoder().encode('CAT2026-SECURE-BACKUP-V1')
const KDF_ITERATIONS = 600_000

export type EncryptedBackupEnvelope = {
  version: 1
  algorithm: 'PBKDF2-SHA-256/AES-256-GCM'
  iterations: number
  salt: string
  iv: string
  ciphertext: string
  createdAt: string
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(normalized)
  return Uint8Array.from(binary, char => char.charCodeAt(0))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

async function deriveBackupKey(password: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: toArrayBuffer(salt), iterations: KDF_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptBackup(payload: unknown, password: string): Promise<EncryptedBackupEnvelope> {
  if (password.length < 10) throw new Error('Backup password must be at least 10 characters.')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveBackupKey(password, salt)
  const plaintext = new TextEncoder().encode(JSON.stringify(payload))
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv), additionalData: toArrayBuffer(BACKUP_AAD) },
    key,
    toArrayBuffer(plaintext)
  )
  return {
    version: BACKUP_VERSION,
    algorithm: 'PBKDF2-SHA-256/AES-256-GCM',
    iterations: KDF_ITERATIONS,
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(new Uint8Array(encrypted)),
    createdAt: new Date().toISOString(),
  }
}

export async function decryptBackup<T>(envelope: EncryptedBackupEnvelope, password: string): Promise<T> {
  if (password.length < 10) throw new Error('Backup password must be at least 10 characters.')
  if (envelope?.version !== BACKUP_VERSION || envelope?.algorithm !== 'PBKDF2-SHA-256/AES-256-GCM') {
    throw new Error('Unsupported CAT 2026 backup format.')
  }
  const key = await deriveBackupKey(password, fromBase64Url(envelope.salt))
  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(fromBase64Url(envelope.iv)),
      additionalData: toArrayBuffer(BACKUP_AAD)
    },
    key,
    toArrayBuffer(fromBase64Url(envelope.ciphertext))
  )
  return JSON.parse(new TextDecoder().decode(plaintext)) as T
}
