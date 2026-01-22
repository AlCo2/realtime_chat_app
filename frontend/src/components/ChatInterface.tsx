import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Message } from '../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './ChatInterface.css'
import axios from 'axios'
import Cookies from 'js-cookie';
import { io } from 'socket.io-client'

interface ChatInterfaceProps {
  userName: string
}

const defaultMessages: Message[] = []

export default function ChatInterface({ userName }: ChatInterfaceProps) {
  const [loading, setLoading] = useState(true)
  const userid = Cookies.get("id");

  const { groupId } = useParams<{ groupId: string }>()

  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [inputValue, setInputValue] = useState('')
  const [groupName, setGroupName] = useState(`Group ${groupId}`)


  useEffect(() => {
    setLoading(true)

    axios.get(`http://localhost:8080/chat?chat_id=${groupId}`, {withCredentials:true}).then((response) => {
      const chat_id: string = response.data.id
      const messages: Message[] = response.data.messages
      setGroupName(chat_id)
      messages.forEach((message)=> {
        setMessages(prev => [...prev, message])
      })
    }).catch(() => {
      navigate("/");
    }).finally(()=> {
      setLoading(false)
    });

    const socket = io(`http://localhost:8080/socket.io?chat_id=${groupId}`, {
      reconnectionAttempts: 5,
      transports: ["websocket"]
    });

    socket.on('connect', () => {
      console.log("connected to server")
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
    };
    
  }, [])

  const handleSend = () => {

    if (!userid) {
      return;
    }

    if (inputValue.trim()) {

      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        sender_username: userName,
        timestamp: new Date(),
        sender_id: userid, 
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

