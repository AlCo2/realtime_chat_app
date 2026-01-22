import type { Message } from '../types'
import { formatTime, getAvatarColor } from '../utils'
import './Message.css'
import Cookies from 'js-cookie';

interface MessageProps {
  message: Message
  showAvatar: boolean
  showTime: boolean
}

export default function MessageUI({ message, showAvatar, showTime }: MessageProps) {
  const currentUser = Cookies.get("id")
  console.log(currentUser)
  const isOwn = currentUser === message.sender_id
  return (
    <div
      className={`message-wrapper ${isOwn? 'own' : ''} ${message.sender_id === '1' ? 'system' : ''}`}
    >
      {!(currentUser === message.sender_id) && showAvatar && (
        <div 
          className="message-avatar" 
          style={{ background: getAvatarColor(message.sender_username) }}
        >
          {message.sender_username[0]}
        </div>
      )}
      <div className={`message ${isOwn ? 'own' : ''} ${message.sender_id === '1' ? 'system' : ''}`}>
        {!isOwn && message.sender_id !== '1' && (
          <div className="message-sender">{message.sender_username}</div>
        )}
        <div className="message-text">{message.text}</div>
        {showTime && (
          <div className="message-time">{formatTime(message.timestamp)}</div>
        )}
      </div>
    </div>
  )
}

