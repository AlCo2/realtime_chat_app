export interface Message {
  id: string
  text: string
  sender_id: string
  sender_username: string
  timestamp: Date
}

export interface ChatState {
  userName: string
  groupId: string
  groupName: string
  messages: Message[]
}

