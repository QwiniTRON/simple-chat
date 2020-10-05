import {
  SET_USERDATA,
  SET_USER_LOADING,
  SET_USER_ERROR,
  CLEAR_USER_DATA
} from '../consts'
import {
  userAction
} from '../type'
import mrq from '../../myrequest/Myrequest'
import socket from '../../utils/SocketConnect'

export function setUserLoading(loading: boolean): userAction {
  return {
    type: SET_USER_LOADING,
    loading
  }
}

export function clearUserData(): userAction {
  return {
    type: CLEAR_USER_DATA
  }
}

export function setUserData(user: any): userAction {
  return {
    type: SET_USERDATA,
    user
  }
}

export function setUserError(error: any): userAction {
  return {
    type: SET_USER_ERROR,
    error: error
  }
}

export function login(mail: any, password: any) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setUserLoading(true))

    const loginResponse = await mrq.post('/auth/login', {
      mail,
      password
    })
    if (loginResponse.ok) {
      dispatch(setUserData(loginResponse.data))
    }
    else dispatch(setUserError(loginResponse.message || 'неясная ошибка, попробуйте снова'))

    dispatch(setUserLoading(false))
  }
}

export function INIT() {
  return async function (dispatch: any, currentState: any) {
    dispatch(setUserLoading(true))

    const checkResponse = await mrq.post('/auth/check', {})
    if (checkResponse.ok) dispatch(setUserData(checkResponse.data))

    dispatch(setUserLoading(false))
  }
}

export function logout() {
  return async function (dispatch: any, currentState: any) {
    const logoutResponse = mrq.post('/auth/logout', {})
    socket.current?.close()
    dispatch(clearUserData())
  }
}