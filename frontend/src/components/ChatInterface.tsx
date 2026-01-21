import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import type { Message } from '../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './ChatInterface.css'

interface ChatInterfaceProps {
  userName: string
}

const defaultMessages: Message[] = [
  {
    id: '1',
    text: 'Welcome to the group! 👋',
    sender: 'System',
    timestamp: new Date(Date.now() - 3600000),
    isOwn: false,
  },
  {
    id: '2',
    text: 'Hey everyone! How are you doing?',
    sender: 'Alice',
    timestamp: new Date(Date.now() - 3500000),
    isOwn: false,
  },
  {
    id: '3',
    text: 'I\'m doing great, thanks!',
    sender: 'Bob',
    timestamp: new Date(Date.now() - 3400000),
    isOwn: false,
  },
]

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [inputValue, setInputValue] = useState('')
  const [groupName, setGroupName] = useState(`Group ${groupId}`)

  useEffect(() => {
    if (location.state?.groupName) {
      setGroupName(location.state.groupName)
    }

    // Add welcome/join message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: location.state?.isNewGroup 
        ? `${userName} created this group`
        : `${userName} joined the group`,
      sender: 'System',
      timestamp: new Date(),
      isOwn: false,
    }
    setMessages(prev => [...prev, welcomeMessage])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        sender: userName,
        timestamp: new Date(),
        isOwn: true,
      }
      setMessages(prev => [...prev, newMessage])
      setInputValue('')
    }
  }

  const handleLeaveGroup = () => {
    navigate('/')
  }

  if (!groupId) {
    navigate('/')
    return null
  }

  return (
    <div className="chat-app">
      <ChatHeader
        groupName={groupName}
        groupId={groupId}
        onLeave={handleLeaveGroup}
      />
      <MessageList messages={messages} />
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        placeholder={`Message ${groupName}...`}
      />
    </div>
  )
}

