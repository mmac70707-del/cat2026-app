// Stanford Jarvis 3.0 Voice Engine (Wake-Word, Memory, STT & TTS)
import { getKolkataDateParts } from '@/services/calendarEngine'
import { JarvisMemoryStore } from '@/services/jarvisMemoryService'

export function getCurrentActiveScheduleSlot(): { block: string; detail: string; timeStr: string } {
  const now = new Date()
  const { hours, minutes } = getKolkataDateParts(now)
  const timeNum = hours * 100 + minutes

  if (timeNum >= 500 && timeNum < 515) return { block: 'Morning Reset', detail: 'Water · Stretch · No phone · Read mission', timeStr: '05:00–05:15' }
  if (timeNum >= 515 && timeNum < 600) return { block: 'Daily Dose', detail: 'QA test (10 Q) + RC test (1 passage) · Mark mistakes immediately', timeStr: '05:15–05:55' }
  if (timeNum >= 900 && timeNum < 1030) return { block: 'QA Session', detail: 'Concept 10 min → 15–20 quality Qs · Easy → Moderate · Accuracy first', timeStr: '09:00–10:30' }
  if (timeNum >= 1045 && timeNum < 1200) return { block: 'DILR Session', detail: '1 quality set · 2nd only if 1st fully analysed · 20-25 min per set', timeStr: '10:45–12:00' }
  if (timeNum >= 1215 && timeNum < 1315) return { block: 'VARC Session', detail: '2 RC passages · Main Idea + Inference + Tone · Elimination focus', timeStr: '12:15–13:15' }
  if (timeNum >= 1315 && timeNum < 1700) return { block: 'Library Deep Work', detail: 'Pending QA/DILR/VARC · Wrong Qs · Repair work · No random resources', timeStr: '13:15–17:00' }
  if (timeNum >= 1730 && timeNum < 1900) return { block: 'Coaching', detail: 'Attend coaching · Notes · Mark doubts immediately', timeStr: '17:30–19:00' }
  if (timeNum >= 1920 && timeNum < 2020) return { block: 'Gym / Movement', detail: 'Non-negotiable physical movement · Brain needs blood flow', timeStr: '19:20–20:20' }
  if (timeNum >= 2030 && timeNum < 2100) return { block: 'Dinner', detail: 'Eat well · No screens', timeStr: '20:30–21:00' }
  if (timeNum >= 2100 && timeNum < 2145) return { block: 'Test Analysis + Error Log', detail: 'Every mistake → C1–C5 → Why → Fix → Repair → Retest', timeStr: '21:00–21:45' }
  if (timeNum >= 2145 && timeNum < 2200) return { block: 'Revision', detail: 'Formulas · DILR frameworks · RC strategy · Today\'s error recap', timeStr: '21:45–22:00' }

  return { block: 'Night Rest / Sleep Mode', detail: '8 hours minimum · No screens after 22:00', timeStr: '22:00–05:00' }
}

export function speakJarvisResponse(text: string): void {
  if (!('speechSynthesis' in window)) return

  try {
    window.speechSynthesis.cancel() // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🤖⚡✓🎯📐🧩📖]/g, ''))
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
  } catch (err) {
    console.error('[Jarvis Voice] Speech synthesis error:', err)
  }
}

export function createSpeechRecognizer(
  onResult: (transcript: string, isWakeWordDetected: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void } | null {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) return null

  try {
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (e: any) => {
      let transcript = ''
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        transcript += e.results[i][0].transcript
      }
      const lower = transcript.toLowerCase()
      const isWakeWord = lower.includes('hey jarvis') || lower.includes('jarvis')
      onResult(transcript, isWakeWord)
    }

    recognition.onerror = (e: any) => {
      onError(e.error || 'Speech recognition error')
    }

    recognition.onend = () => {
      onEnd()
    }

    return {
      start: () => recognition.start(),
      stop: () => recognition.stop(),
    }
  } catch {
    return null
  }
}

export { JarvisMemoryStore }
