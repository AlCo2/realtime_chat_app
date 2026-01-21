import { useRef, useEffect } from 'react'
import './MessageInput.css'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder: string,
  disabled: boolean
}

export default function MessageInput({ value, onChange, onSend, placeholder, disabled }: MessageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="send-button"
          onClick={onSend}
          disabled={!value.trim() || disabled}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  )
}

