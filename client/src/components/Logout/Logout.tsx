import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import {userContext} from '../../store/user/context'
import {UserValueContext} from '../../store/user/Provider'

type LogoutProps = {
  [p: string]: any
}

const Logout: React.FC<LogoutProps> = function (props) {
  const userStore: UserValueContext = useContext(userContext)

  useEffect(() => {
    userStore.methods.logout()
  }, [])

  return (
    <Redirect to="/chat" />
  );
}

export default Logout