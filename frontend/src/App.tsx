import { useState, useRef, useEffect } from 'react'
import './App.css'
import { UsergroupAddOutlined } from '@ant-design/icons'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isOwn: boolean
}

function App() {
  const [isInGroup, setIsInGroup] = useState(false)
  const [userName, setUserName] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groupName, setGroupName] = useState('')
  const [joinGroupId, setJoinGroupId] = useState('')
  const [messages, setMessages] = useState<Message[]>([
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
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const userNameInputRef = useRef<HTMLInputElement>(null)
  const groupIdInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!isInGroup) {
      userNameInputRef.current?.focus()
    } else {
      inputRef.current?.focus()
    }
  }, [isInGroup])

  const generateGroupId = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase()
  }

  const handleCreateGroup = () => {
    if (userName.trim()) {
      const newGroupId = generateGroupId()
      setGroupId(newGroupId)
      setGroupName(`Group ${newGroupId}`)
      setIsInGroup(true)
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: `${userName} created this group`,
        sender: 'System',
        timestamp: new Date(),
        isOwn: false,
      }
      setMessages([...messages, welcomeMessage])
    }
  }

  const handleJoinGroup = () => {
    if (userName.trim() && joinGroupId.trim()) {
      setGroupId(joinGroupId.trim().toUpperCase())
      setGroupName(`Group ${joinGroupId.trim().toUpperCase()}`)
      setIsInGroup(true)
      
      // Add join message
      const joinMessage: Message = {
        id: Date.now().toString(),
        text: `${userName} joined the group`,
        sender: 'System',
        timestamp: new Date(),
        isOwn: false,
      }
      setMessages([...messages, joinMessage])
    }
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        sender: userName,
        timestamp: new Date(),
        isOwn: true,
      }
      setMessages([...messages, newMessage])
      setInputValue('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isInGroup) {
        handleSend()
      } else if (userName.trim() && joinGroupId.trim()) {
        handleJoinGroup()
      } else if (userName.trim()) {
        handleCreateGroup()
      }
    }
  }

  const handleLeaveGroup = () => {
    setIsInGroup(false)
    setGroupId('')
    setGroupName('')
    setJoinGroupId('')
    setMessages([
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
    ])
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'linear-gradient(135deg, #6366f1, #818cf8)',
      'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      'linear-gradient(135deg, #ec4899, #f472b6)',
      'linear-gradient(135deg, #f59e0b, #fbbf24)',
      'linear-gradient(135deg, #10b981, #34d399)',
      'linear-gradient(135deg, #06b6d4, #22d3ee)',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Landing Page
  if (!isInGroup) {
    return (
      <div className="landing-page">
        <div className="landing-container">
          <div className="landing-header">
            <h1>💬 Real-Time Chat</h1>
            <p>Create or join a group to start chatting</p>
          </div>

          <div className="landing-content">
            <div className="input-section">
              <label htmlFor="userName">Your Name</label>
              <input
                ref={userNameInputRef}
                id="userName"
                type="text"
                className="landing-input"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="action-cards">
              <div className="action-card">
                <div className="card-icon"><UsergroupAddOutlined /></div>
                <h3>Create Group</h3>
                <p>Start a new group chat</p>
                <button
                  className="action-button primary"
                  onClick={handleCreateGroup}
                  disabled={!userName.trim()}
                >
                  Create Group
                </button>
              </div>

              <div className="action-card">
                <div className="card-icon">🔗</div>
                <h3>Join Group</h3>
                <p>Enter a group ID to join</p>
                <div className="join-input-wrapper">
                  <input
                    ref={groupIdInputRef}
                    type="text"
                    className="landing-input small"
                    placeholder="Group ID"
                    value={joinGroupId}
                    onChange={(e) => setJoinGroupId(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="action-button secondary"
                    onClick={handleJoinGroup}
                    disabled={!userName.trim() || !joinGroupId.trim()}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-app">
      <div className="chat-header">
        <div className="header-content">
          <div className="user-info">
            <div className="avatar" style={{ background: getAvatarColor(groupName) }}>
              {groupName[0]}
            </div>
            <div>
              <div className="user-name">{groupName}</div>
              <div className="user-status">Group ID: {groupId}</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Group members">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </button>
            <button className="icon-button" onClick={handleLeaveGroup} aria-label="Leave group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {messages.map((message, index) => {
            const showAvatar = index === 0 || messages[index - 1].sender !== message.sender
            const showTime = index === messages.length - 1 || 
              new Date(message.timestamp).getTime() - new Date(messages[index + 1].timestamp).getTime() > 300000

            return (
              <div
                key={message.id}
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
                  {!message.isOwn && message.sender !== 'System' && <div className="message-sender">{message.sender}</div>}
                  <div className="message-text">{message.text}</div>
                  {showTime && (
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="message-input"
            placeholder={`Message ${groupName}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="send-button"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
