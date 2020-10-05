import {
  CHAT_SET_MESSAGES,
  CHAT_ADD_MESSAGE,
  CHAT_SET_LOADING,
  CHAT_REQUEST_MESSAGE,
  CHAT_SET_INITSTATUS
} from '../consts'
import {
  chatAction
} from '../type'

export type chatStore = {
  loading: boolean
  messages: any[]
  frendId: string
  requestMessageId: string
  isINIT: boolean
}

export const initialChatState: chatStore = {
  loading: false,
  messages: [],
  frendId: '',
  requestMessageId: '',
  isINIT: false
}

export function chatReducer(state: chatStore, action: chatAction): chatStore {
  switch (action.type) {
    case CHAT_SET_MESSAGES:
      return { ...state, messages: action.messages, frendId: action.frendId }
      
    case CHAT_ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.message] }
      
    case CHAT_SET_INITSTATUS:
      return { ...state, isINIT: action.status }
      
    case CHAT_REQUEST_MESSAGE:
      return { ...state, requestMessageId: action.frendId}

    case CHAT_SET_LOADING:
      return { ...state, loading: action.loading }

    default:
      return state
  }
}