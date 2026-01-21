export interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  isOwn: boolean
}

export interface ChatState {
  userName: string
  groupId: string
  groupName: string
  messages: Message[]
}

