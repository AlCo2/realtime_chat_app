import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UsergroupAddOutlined } from '@ant-design/icons'
import './LandingPage.css'
import axios from 'axios'
import Cookies from 'js-cookie'

interface LandingPageProps {
  userName: string
  setUserName: (name: string) => void
}

export default function LandingPage({ userName, setUserName }: LandingPageProps) {
  const [joinGroupId, setJoinGroupId] = useState('')
  const navigate = useNavigate()
  const userNameInputRef = useRef<HTMLInputElement>(null)
  const groupIdInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [nameChanged, setNameChanged] = useState(false);
  useEffect(() => {
    userNameInputRef.current?.focus()
  }, [])

  const handleCreateGroup = () => {
    setLoading(true)
    
    axios.post("http://localhost:8080/chat", {}, {withCredentials:true}).then((response)=> {
      const chat_id = response.data.chat_id
      navigate(`/chat/${chat_id}`);
    }).finally(()=> {
      setLoading(false)
    })

    // navigate(`/chat/${newGroupId}`, { state: { groupName: `Group ${newGroupId}`, isNewGroup: true } })
  
  }

  const handleJoinGroup = () => {
    if (userName.trim() && joinGroupId.trim()) {
      const normalizedGroupId = joinGroupId.trim().toUpperCase()
      navigate(`/chat/${normalizedGroupId}`, { state: { groupName: `Group ${normalizedGroupId}` } })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userName.trim() && joinGroupId.trim()) {
        handleJoinGroup()
      } else if (userName.trim()) {
        handleCreateGroup()
      }
    }
  }

  const handleNameUpdate = () => {
    if (!userName.trim())
      return;

    Cookies.set("username", userName);
    axios.post("http://localhost:8080/session", {}, {withCredentials:true}).then(()=>{
      setNameChanged(false);
    });
  }

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
              <div className='username-section'>
                <input
                  ref={userNameInputRef}
                  id="userName"
                  type="text"
                  className="landing-input"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => {setUserName(e.target.value); setNameChanged(true)}}
                  onKeyPress={handleKeyPress}
                />
                {nameChanged &&
                <button
                  className="action-button primary"
                  onClick={handleNameUpdate}
                  disabled={!userName.trim()}
                >
                  Save
                </button>}
              </div>
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
                disabled={!userName.trim() || loading}
              >
                {loading ? "Loading...": "Create Group"}
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

