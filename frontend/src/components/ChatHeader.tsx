import { getAvatarColor } from '../utils'
import './ChatHeader.css'

interface ChatHeaderProps {
  groupName: string
  groupId: string
  onLeave: () => void
}

export default function ChatHeader({ groupName, groupId, onLeave }: ChatHeaderProps) {
  return (
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
          <button className="icon-button" onClick={onLeave} aria-label="Leave group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

