import { IUser } from '../../Types'
import {
  PEOPLELIST_SET_FRIENDLIST,
  PEOPLELIST_SET_LOADING,
  PEOPLELIST_SET_SEARCHLIST,
  PEOPLELIST_REMOVE_FRIEND,
  PEOPLELIST_ADD_FRIEND,
  PEOPLELIST_SET_USERINFO,
  PEOPLELIST_ADD_INVITE,
  PEOPLELIST_ADD_REQUEST,
  PEOPLELIST_REMOVE_INVITE,
  PEOPLELIST_REMOVE_REQUEST,
  PEOPLELIST_SET_FRENDISONLINE,
  PEOPLELIST_SET_FRENDISMESSAGE
} from '../consts'
import {
  peoplelistAction
} from '../type'

export type peoplelistStore = {
  lodaing: boolean
  searchlist: any[]
  friendslist: any[]
  invites: IUser[]
  requests: IUser[]
}

export const initialPeoplelistState: peoplelistStore = {
  lodaing: false,
  searchlist: [],
  friendslist: [],
  invites: [],
  requests: []
}

export function peoplelistReducer(state: peoplelistStore, action: peoplelistAction): peoplelistStore {
  switch (action.type) {
    case PEOPLELIST_SET_FRIENDLIST:
      return { ...state, friendslist: action.list }

    case PEOPLELIST_SET_LOADING:
      return { ...state, lodaing: action.loading }

    case PEOPLELIST_SET_FRENDISMESSAGE:
      return { ...state, friendslist: state.friendslist.map((f: IUser) => {
        if(action.frendId == f._id) f.isNewMessage = action.ismessage
        return f
      })}

    case PEOPLELIST_SET_FRENDISONLINE:
      return { ...state, friendslist: state.friendslist.map((frend: IUser) => {
        if(frend._id == action.frendId) frend.isOnline = action.isOnline
        return frend
      })}

    case PEOPLELIST_SET_SEARCHLIST:
      return { ...state, searchlist: action.list }

    case PEOPLELIST_REMOVE_FRIEND:
      return { ...state, friendslist: state.friendslist.filter((f: IUser) => f._id != action.friend) }

    case PEOPLELIST_ADD_FRIEND:
      const friendId = action.friend._id
      return {
        ...state,
        friendslist: [...state.friendslist, action.friend],
        requests: state.requests.filter((r: IUser) => r._id != friendId),
        invites: state.invites.filter((r: IUser) => r._id != friendId),
      }

    case PEOPLELIST_SET_USERINFO:
      return {
        ...state,
        friendslist: action.userinfo.friends,
        requests: action.userinfo.requests,
        invites: action.userinfo.invites
      }

    case PEOPLELIST_ADD_INVITE:
      return { ...state, invites: [...state.invites, action.invite] }

    case PEOPLELIST_ADD_REQUEST:
      return { ...state, requests: [...state.requests, action.request] }

    case PEOPLELIST_REMOVE_INVITE:
      return { ...state, invites: state.invites.filter((i: IUser) => i._id !== action.userId) }

    case PEOPLELIST_REMOVE_REQUEST:
      return { ...state, requests: state.requests.filter((i: IUser) => i._id !== action.userId) }

    default:
      return state
  }
}