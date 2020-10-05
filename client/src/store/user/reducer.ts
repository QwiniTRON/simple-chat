import {
  SET_USERDATA,
  SET_USER_LOADING,
  SET_USER_ERROR,
  CLEAR_USER_DATA
} from '../consts'
import {
  userAction
} from '../type'

export type userStore = {
  nickname: string
  id: string
  loading: boolean
  error: any
}

export const initialUserState: userStore = {
  nickname: '',
  id: '',
  loading: false,
  error: ''
}

export function userReducer(state: userStore, action: userAction): userStore {
  switch (action.type) {
    case SET_USER_LOADING:
      return { ...state, loading: action.loading }

    case SET_USER_ERROR:
      return { ...state, error: action.error }

    case CLEAR_USER_DATA:
      return { ...initialUserState }
      
    case SET_USERDATA:
      return { ...state, nickname: action.user.nickname, id: action.user.id }

    default:
      return state
  }
}