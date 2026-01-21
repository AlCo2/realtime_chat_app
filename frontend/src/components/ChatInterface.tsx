import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import type { Message } from '../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './ChatInterface.css'
import axios from 'axios'

interface ChatInterfaceProps {
  userName: string
}

const defaultMessages: Message[] = []

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const [loading, setLoading] = useState(true)
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [inputValue, setInputValue] = useState('')
  const [groupName, setGroupName] = useState(`Group ${groupId}`)

  useEffect(() => {
    setLoading(true)
    if (location.state?.groupName) {
      setGroupName(location.state.groupName)
    }


    axios.get(`http://localhost:8080/chat?chat_id=${groupId}`).then((response) => {
      console.log(response.data)
    }).catch(() => {
      console.error("Error: failed to load chat")
      navigate("/");
    });
    // const welcomeMessage: Message = {
    //   id: Date.now().toString(),
    //   text: location.state?.isNewGroup 
    //     ? `${userName} created this group`
    //     : `${userName} joined the group`,
    //   sender: 'System',
    //   timestamp: new Date(),
    //   isOwn: false,
    // }
    // setMessages(prev => [...prev, welcomeMessage])
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
     {loading ? <div>Loading...</div>:<MessageList messages={messages} />}
      <MessageInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        placeholder={`Message ${groupName}...`}
        disabled={loading}
      />
    </div>
  )
}

