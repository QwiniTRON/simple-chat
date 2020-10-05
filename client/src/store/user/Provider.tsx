import React, { useReducer, useMemo } from 'react'
import { userContext } from './context'
import { initialUserState, userReducer } from './reducer'
import { useDispatchWithThunk } from '../../hooks/hooks'
import {
  setUserData,
  setUserLoading,
  login,
  setUserError,
  INIT,
  logout
} from './actions'
import { createActionMethods } from '../utils'
import { userStore } from './reducer'

export type UserValueContext = {
  state: userStore,
  methods: {
    setUserData: typeof setUserData
    setUserLoading: typeof setUserLoading
    login: typeof login
    setUserError: typeof setUserError
    INIT: typeof INIT
    logout: typeof logout
  }
}

const UserProvider: React.FC = function (props) {
  const [state, dispatch] = useReducer(userReducer, initialUserState)
  const dispatchm = useDispatchWithThunk(state, dispatch)

  const methods: any = useMemo(() => createActionMethods(dispatchm, {
    setUserData,
    setUserLoading,
    login,
    setUserError,
    INIT,
    logout
  }), [])

  return (
    <userContext.Provider value={{
      state,
      methods
    }}>
      {props.children}
    </userContext.Provider>
  );
}

export { UserProvider }