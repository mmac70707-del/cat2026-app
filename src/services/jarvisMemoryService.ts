// Jarvis 3.0 Recallable Memory & Context Retention Engine
import { dbGet, dbPut } from '@/db'

export interface JarvisMemoryItem {
  id: string
  key: string
  value: string
  category: 'preference' | 'goal' | 'schedule' | 'conversation'
  timestamp: string
}

export const JarvisMemoryStore = {
  async remember(key: string, value: string, category: JarvisMemoryItem['category'] = 'conversation'): Promise<void> {
    const item: JarvisMemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      key,
      value,
      category,
      timestamp: new Date().toISOString(),
    }
    await dbPut('state', { id: `jarvis_mem_${key}`, item })
  },

  async recall(key: string): Promise<string | null> {
    const res = await dbGet<{ id: string; item: JarvisMemoryItem }>('state', `jarvis_mem_${key}`)
    return res ? res.item.value : null
  },

  async getRecentConversations(limit: number = 5): Promise<string[]> {
    const all = await dbGet<{ id: string; item: JarvisMemoryItem }>('state', 'jarvis_mem_recent_dialogue')
    if (!all) return []
    try {
      return JSON.parse(all.item.value)
    } catch {
      return []
    }
  },

  async appendConversation(userText: string, assistantReply: string): Promise<void> {
    const history = await this.getRecentConversations(10)
    history.push(`User: ${userText} | Jarvis: ${assistantReply}`)
    if (history.length > 10) history.shift()
    await dbPut('state', {
      id: 'jarvis_mem_recent_dialogue',
      item: {
        id: 'recent_dialogue',
        key: 'recent_dialogue',
        value: JSON.stringify(history),
        category: 'conversation',
        timestamp: new Date().toISOString(),
      }
    })
  }
}
