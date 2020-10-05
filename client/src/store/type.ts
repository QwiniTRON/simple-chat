import {
  SET_USERDATA,
  SET_USER_LOADING,
  SET_USER_ERROR,
  CLEAR_USER_DATA,
  PEOPLELIST_SET_FRIENDLIST,
  PEOPLELIST_SET_LOADING,
  PEOPLELIST_SET_SEARCHLIST,
  PEOPLELIST_ADD_FRIEND,
  PEOPLELIST_REMOVE_FRIEND,
  PEOPLELIST_SET_USERINFO,
  PEOPLELIST_ADD_INVITE,
  PEOPLELIST_ADD_REQUEST,
  PEOPLELIST_REMOVE_INVITE,
  PEOPLELIST_REMOVE_REQUEST,
  PEOPLELIST_SET_FRENDISONLINE,
  PEOPLELIST_SET_FRENDISMESSAGE,
  CHAT_SET_MESSAGES,
  CHAT_SET_LOADING,
  CHAT_ADD_MESSAGE,
  CHAT_REQUEST_MESSAGE,
  CHAT_SET_INITSTATUS
} from './consts'
import { IUser } from '../Types'

// USER
export type SET_USER_DATA = {
  type: typeof SET_USERDATA
  user: any
}
export type SET_USER_isLOADING = {
  type: typeof SET_USER_LOADING
  loading: boolean
}
export type USER_SET_ERROR = {
  type: typeof SET_USER_ERROR
  error: string
}
export type USER_DATA_CLEAR = {
  type: typeof CLEAR_USER_DATA
}

export type userAction = SET_USER_DATA |
  SET_USER_isLOADING |
  USER_SET_ERROR |
  USER_DATA_CLEAR

// PEOPLELIST
export type SET_LOADING_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_LOADING
  loading: boolean
}
export type SET_FRIENDLIST_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_FRIENDLIST
  list: IUser[]
}
export type SET_SEARCHLIST_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_SEARCHLIST
  list: IUser[]
}
export type ADD_FRIEND_PEOPLELIST = {
  type: typeof PEOPLELIST_ADD_FRIEND
  friend: IUser
}
export type REMOVE_FRIEND_PEOPLELIST = {
  type: typeof PEOPLELIST_REMOVE_FRIEND
  friend: string
}
export type SET_USERINFO_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_USERINFO
  userinfo: any
}
export type ADD_INVITE_PEOPLELIST = {
  type: typeof PEOPLELIST_ADD_INVITE
  invite: any
}
export type ADD_REQUEST_PEOPLELIST = {
  type: typeof PEOPLELIST_ADD_REQUEST
  request: any
}
export type REMOVE_INVITE_PEOPLELIST = {
  type: typeof PEOPLELIST_REMOVE_INVITE
  userId: string
}
export type REMOVE_REQUEST_PEOPLELIST = {
  type: typeof PEOPLELIST_REMOVE_REQUEST
  userId: string
}
export type SET_FRENDISMESSAGE_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_FRENDISMESSAGE
  frendId: string
  ismessage: boolean
}
export type SET_FRENDISONLINE_PEOPLELIST = {
  type: typeof PEOPLELIST_SET_FRENDISONLINE
  frendId: string
  isOnline: boolean
}

export type peoplelistAction = SET_LOADING_PEOPLELIST |
  SET_FRIENDLIST_PEOPLELIST |
  SET_SEARCHLIST_PEOPLELIST |
  ADD_FRIEND_PEOPLELIST |
  REMOVE_FRIEND_PEOPLELIST |
  SET_USERINFO_PEOPLELIST |
  ADD_INVITE_PEOPLELIST |
  ADD_REQUEST_PEOPLELIST |
  REMOVE_INVITE_PEOPLELIST |
  SET_FRENDISONLINE_PEOPLELIST |
  REMOVE_REQUEST_PEOPLELIST |
  SET_FRENDISMESSAGE_PEOPLELIST


// CHAT 
export type SET_MESSAGES_CHAT = {
  type: typeof CHAT_SET_MESSAGES
  messages: any[]
  frendId: string
}
export type SET_LOADING_CHAT = {
  type: typeof CHAT_SET_LOADING
  loading: boolean
}
export type ADD_MESSAGE_CHAT = {
  type: typeof CHAT_ADD_MESSAGE
  message: any
}
export type SET_INITSTATUS_CHAT = {
  type: typeof CHAT_SET_INITSTATUS
  status: boolean
}
export type REQUEST_MESSAGE_CHAT = {
  type: typeof CHAT_REQUEST_MESSAGE
  frendId: string
}
export type chatAction = SET_MESSAGES_CHAT |
  SET_LOADING_CHAT |
  ADD_MESSAGE_CHAT |
  REQUEST_MESSAGE_CHAT |
  SET_INITSTATUS_CHAT