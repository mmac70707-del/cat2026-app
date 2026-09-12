import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'

interface ToastState { message: string; color: string; visible: boolean }

interface ToastContextValue { show: (msg: string, color?: string) => void }

const ToastContext = createContext<ToastContextValue>({ show: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({ message: '', color: '#16A34A', visible: false })
  const timerRef = useRef<number | null>(null)

  const show = useCallback((msg: string, color = '#16A34A') => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setState({ message: msg, color, visible: true })
    timerRef.current = window.setTimeout(() => setState(s => ({ ...s, visible: false })), 2400)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className={`toast ${state.visible ? 'show' : ''}`}
        style={{ background: state.color }}
      >
        {state.message}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
