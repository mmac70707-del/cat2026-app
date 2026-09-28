// Jarvis 3.1 — encrypted recallable memory.
// Private memory is stored through the session-unlocked secure vault,
// never as plaintext localStorage/IndexedDB records.
import { secureVaultDelete, secureVaultGet, secureVaultSet } from '@/services/secureVault'

export interface JarvisMemoryItem {
  id: string
  key: string
  value: string
  category: 'preference' | 'goal' | 'schedule' | 'conversation'
  timestamp: string
}

const memoryKey = (key: string) => `jarvis-memory:${key}`

export const JarvisMemoryStore = {
  async remember(key: string, value: string, category: JarvisMemoryItem['category'] = 'conversation'): Promise<void> {
    const item: JarvisMemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      key,
      value,
      category,
      timestamp: new Date().toISOString(),
    }
    await secureVaultSet(memoryKey(key), JSON.stringify(item))
  },

  async recall(key: string): Promise<string | null> {
    const raw = await secureVaultGet(memoryKey(key))
    if (raw == null) return null
    try {
      return (JSON.parse(raw) as JarvisMemoryItem).value
    } catch {
      return raw
    }
  },

  async remove(key: string): Promise<void> {
    await secureVaultDelete(memoryKey(key))
  },

  async getRecentConversations(limit = 5): Promise<string[]> {
    const raw = await secureVaultGet(memoryKey('recent_dialogue'))
    if (raw == null) return []
    try {
      const item = JSON.parse(raw) as JarvisMemoryItem
      const history = JSON.parse(item.value)
      return Array.isArray(history) ? history.slice(-Math.max(1, limit)) : []
    } catch {
      return []
    }
  },

  async appendConversation(userText: string, assistantReply: string): Promise<void> {
    const history = await this.getRecentConversations(10)
    history.push(`User: ${userText} | Jarvis: ${assistantReply}`)
    if (history.length > 10) history.splice(0, history.length - 10)
    await this.remember('recent_dialogue', JSON.stringify(history), 'conversation')
  }
}
