import React, { useReducer, useMemo } from 'react'
import { chatContext } from './context'
import { initialChatState, chatReducer, chatStore } from './reducer'
import { useDispatchWithThunk } from '../../hooks/hooks'
import {
  INIT_CHAT,
  postMessage,
  getMessages,
  setChatRequestMessage
} from './actions'
import { createActionMethods } from '../utils'
import { IMessage } from '../../Types'

export type ChatValueContext = {
  state: chatStore,
  methods: {
    INIT_CHAT: typeof INIT_CHAT
    postMessage: typeof postMessage
    getMessages: typeof getMessages
    setChatRequestMessage: typeof setChatRequestMessage
  }
}

const ChatProvider: React.FC = function (props) {
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const dispatchm = useDispatchWithThunk(state, dispatch)

  // сортировка по дате сообщений
  state.messages.sort((l: IMessage, r: IMessage) => {
    return l.date - r.date
  })

  const methods: any = useMemo(() => createActionMethods(dispatchm, {
    INIT_CHAT,
    postMessage,
    getMessages,
    setChatRequestMessage
  }), [])

  return (
    <chatContext.Provider value={{
      state,
      methods
    }}>
      {props.children}
    </chatContext.Provider>
  );
}

export { ChatProvider }