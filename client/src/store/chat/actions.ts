import {
  CHAT_SET_MESSAGES,
  CHAT_SET_LOADING,
  CHAT_ADD_MESSAGE,
  CHAT_SET_INITSTATUS,
  CHAT_REQUEST_MESSAGE
} from '../consts'
import {
  chatAction
} from '../type'
import mrq from '../../myrequest/Myrequest'
import socket from '../../utils/SocketConnect'
import {chatStore} from './reducer'
import { IMessage } from '../../Types'

export function addChatMessage(message: any): chatAction {
  return {
    type: CHAT_ADD_MESSAGE,
    message
  }
}

export function setChatInitStatus(status: boolean): chatAction {
  return {
    type: CHAT_SET_INITSTATUS,
    status
  }
}

export function setChatRequestMessage(frendId: string): chatAction {
  return {
    type: CHAT_REQUEST_MESSAGE,
    frendId
  }
}

export function setChatMessages(messages: any[], frendId: string): chatAction {
  return {
    type: CHAT_SET_MESSAGES,
    messages,
    frendId
  }
}

export function setChatLoading(loading: boolean): chatAction {
  return {
    type: CHAT_SET_LOADING,
    loading
  }
}


// thunks
export function getMessages(userId: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setChatLoading(true))
    socket.current?.emit('client:getmessages', userId)
  }
}

export function postMessage(userId: string, messageText: string, file?: File) {
  return async function (dispatch: any, currentState: any) {
    // dispatch(setChatLoading(true))
    if(file) {
      socket.current?.emit('client:message', userId, messageText, file, file.name)
    } else {
      socket.current?.emit('client:message', userId, messageText)
    }
  }
}

// Инизиализация
export function INIT_CHAT(socket: SocketIOClient.Socket) {
  return async function (dispatch: any, currentState: {current: chatStore}) {
    // получение сообщения
    socket.on('server:message', async (message: IMessage) => {
      dispatch(addChatMessage(message))
      // dispatch(setChatLoading(false))
    })  
    socket.on('server:message_target', async (message: IMessage, personId: string) => {
      console.log(message, currentState.current, personId);
      
      if(personId == currentState.current.frendId) {
        dispatch(addChatMessage(message))
      } else {
        dispatch(setChatRequestMessage(personId))
      }
    })

    // получение переписки
    socket.on('server:getmessages', async (messages: IMessage[], frendId: string) => {
      dispatch(setChatMessages(messages, frendId))
      dispatch(setChatLoading(false))
    })

    dispatch(setChatInitStatus(true))
  }
}