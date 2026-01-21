import type { Message } from '../types'
import { formatTime, getAvatarColor } from '../utils'
import './Message.css'

interface MessageProps {
  message: Message
  showAvatar: boolean
  showTime: boolean
}

export default function MessageUI({ message, showAvatar, showTime }: MessageProps) {
  return (
    <div
      className={`message-wrapper ${message.isOwn ? 'own' : ''} ${message.sender === 'System' ? 'system' : ''}`}
    >
      {!message.isOwn && showAvatar && message.sender !== 'System' && (
        <div 
          className="message-avatar" 
          style={{ background: getAvatarColor(message.sender) }}
        >
          {message.sender[0]}
        </div>
      )}
      <div className={`message ${message.isOwn ? 'own' : ''} ${message.sender === 'System' ? 'system' : ''}`}>
        {!message.isOwn && message.sender !== 'System' && (
          <div className="message-sender">{message.sender}</div>
        )}
        <div className="message-text">{message.text}</div>
        {showTime && (
          <div className="message-time">{formatTime(message.timestamp)}</div>
        )}
      </div>
    </div>
  )
}

