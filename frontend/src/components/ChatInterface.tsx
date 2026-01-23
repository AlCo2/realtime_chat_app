import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Message } from '../types'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './ChatInterface.css'
import axios from 'axios'
import Cookies from 'js-cookie';

const defaultMessages: Message[] = []

export default function ChatInterface() {
  const [loading, setLoading] = useState(true)
  const userid = Cookies.get("id");

  const { groupId } = useParams<{ groupId: string }>()

  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(defaultMessages)
  const [inputValue, setInputValue] = useState('')
  const [groupName, setGroupName] = useState(`Group ${groupId}`)
  const wsRef = useRef<WebSocket|null>(null)

  const sendMessage = (msg: string) => {
    if (wsRef.current)
      wsRef.current.send(JSON.stringify({ content: msg, chat_id: groupId }));
  };

  useEffect(() => {
    setLoading(true);

    axios.get(`http://localhost:8080/chat?chat_id=${groupId}`, { withCredentials: true })
      .then((response) => {
        const chat_id: string = response.data.id;
        const messages: Message[] = response.data.messages;

        setGroupName(chat_id);
        setMessages(messages);
      })
      .catch(() => {
        navigate("/");
      })
      .finally(() => setLoading(false));


    const ws = new WebSocket(`ws://localhost:8080/ws?chat_id=${groupId}`);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.timestamp) {
        message.timestamp = new Date(0); // fallback
      } else {
        message.timestamp = new Date(message.timestamp.replace(/(\.\d{3})\d+/, "$1"));
      }

      setMessages((prev) => [...prev, message]);  
    };

    ws.onclose = () => {
      console.log("disconnected");
    };

    return () => {
      ws.close()
    }

}, [groupId]);
  const handleSend = () => {

    if (!userid) {
      return;
    }

    if (inputValue.trim()) {

      // const newMessage: Message = {
      //   id: Date.now().toString(),
      //   text: inputValue.trim(),
      //   sender_username: userName,
      //   timestamp: new Date(),
      //   sender_id: userid, 
      // }

      sendMessage(inputValue)
      // setMessages(prev => [...prev, newMessage])
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

