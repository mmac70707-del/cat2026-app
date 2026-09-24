// Stanford Jarvis Voice Assistant Engine (Speech-to-Text & Text-to-Speech)

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
  onResult: (transcript: string) => void,
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
      onResult(transcript)
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
