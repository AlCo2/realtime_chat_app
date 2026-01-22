import { useRef, useEffect } from 'react'
import type { Message } from '../types'
import './MessageList.css'
import MessageUI from './Message'

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="messages-container">
      <div className="messages-list">
        {messages.map((message, index) => {
          const showAvatar = index === 0 || messages[index - 1].sender_username !== message.sender_username
          const showTime = index === messages.length - 1 || 
            new Date(message.timestamp).getTime() - new Date(messages[index + 1].timestamp).getTime() > 300000

          return (
            <MessageUI
              key={message.id}
              message={message}
              showAvatar={showAvatar}
              showTime={showTime}
            />
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

