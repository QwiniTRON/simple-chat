import React, { useReducer, useMemo } from 'react'
import { peopleListContext } from './context'
import { initialPeoplelistState, peoplelistReducer, peoplelistStore } from './reducer'
import { useDispatchWithThunk } from '../../hooks/hooks'
import {
  INIT_PEOPLELIST,
  searchUsers,
  addFriend,
  removeFriend,
  cancelInvite,
  requestToFriend,
  setPeoplelistFrendIsmessage
} from './actions'
import { createActionMethods } from '../utils'
import { IUser } from '../../Types'

export type PeoplelistValueContext = {
  state: peoplelistStore,
  methods: {
    INIT_PEOPLELIST: typeof INIT_PEOPLELIST
    searchUsers: typeof searchUsers
    addFriend: typeof addFriend
    removeFriend: typeof removeFriend
    requestToFriend: typeof requestToFriend
    cancelInvite: typeof cancelInvite
    setPeoplelistFrendIsmessage: typeof setPeoplelistFrendIsmessage
  }
}

const PeoplelistProvider: React.FC = function (props) {
  const [state, dispatch] = useReducer(peoplelistReducer, initialPeoplelistState)
  const dispatchm = useDispatchWithThunk(state, dispatch)

  // псевдо реселект
  state.friendslist.sort((l: IUser, r: IUser) => (r.isOnline as any) - (l.isOnline as any))

  const methods: any = useMemo(() => createActionMethods(dispatchm, {
    INIT_PEOPLELIST,
    searchUsers,
    addFriend,
    removeFriend,
    cancelInvite,
    requestToFriend,
    setPeoplelistFrendIsmessage
  }), [])

  return (
    <peopleListContext.Provider value={{
      state,
      methods
    }}>
      {props.children}
    </peopleListContext.Provider>
  );
}

export { PeoplelistProvider }