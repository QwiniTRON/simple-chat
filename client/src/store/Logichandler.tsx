import React, { useContext, useEffect } from 'react'
import {peopleListContext} from './peoplelist/context'
import {PeoplelistValueContext} from './peoplelist/Provider'
import {chatContext} from './chat/context'
import {ChatValueContext} from './chat/Provider'

type LogichandlerType = {

}

const Logichandler: React.FC<LogichandlerType> = function (props) {
  const listStore: PeoplelistValueContext = useContext(peopleListContext)
  const chatStore: ChatValueContext = useContext(chatContext)

  useEffect(() => {
    if(chatStore.state.requestMessageId) {
      listStore.methods.setPeoplelistFrendIsmessage(chatStore.state.requestMessageId, true)
      chatStore.methods.setChatRequestMessage('')
    }
  })

  return props.children as React.ReactElement
}

export default Logichandler