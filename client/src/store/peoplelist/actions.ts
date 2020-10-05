import {
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
  PEOPLELIST_SET_FRENDISMESSAGE
} from '../consts'
import {
  peoplelistAction
} from '../type'
import mrq from '../../myrequest/Myrequest'
import socket from '../../utils/SocketConnect'
import { IUser } from '../../Types'

export function setIsonlinetoFrendPeoplelist(frendId: string, isOnline: boolean): peoplelistAction {
  return {
    type: PEOPLELIST_SET_FRENDISONLINE,
    frendId,
    isOnline
  }
}

export function addInvitePeoplelist(invite: any): peoplelistAction {
  return {
    type: PEOPLELIST_ADD_INVITE,
    invite
  }
}

export function addRequestPeoplelist(request: any): peoplelistAction {
  return {
    type: PEOPLELIST_ADD_REQUEST,
    request
  }
}

export function removeInvitePeoplelist(userId: string): peoplelistAction {
  return {
    type: PEOPLELIST_REMOVE_INVITE,
    userId
  }
}

export function removeRequestPeoplelist(userId: string): peoplelistAction {
  return {
    type: PEOPLELIST_REMOVE_REQUEST,
    userId
  }
}

export function setPeoplelistFriends(list: any[]): peoplelistAction {
  return {
    type: PEOPLELIST_SET_FRIENDLIST,
    list
  }
}

export function setPeoplelistLoading(loading: boolean): peoplelistAction {
  return {
    type: PEOPLELIST_SET_LOADING,
    loading
  }
}

export function setPeoplelistSearchlist(list: any[]): peoplelistAction {
  return {
    type: PEOPLELIST_SET_SEARCHLIST,
    list
  }
}

export function addPeoplelistFriend(friend: IUser): peoplelistAction {
  return {
    type: PEOPLELIST_ADD_FRIEND,
    friend
  }
}

export function removePeoplelistFriend(friendId: string): peoplelistAction {
  return {
    type: PEOPLELIST_REMOVE_FRIEND,
    friend: friendId
  }
}

export function setPeoplelistUserinfo(userinfo: any): peoplelistAction {
  return {
    type: PEOPLELIST_SET_USERINFO,
    userinfo
  }
}

export function setPeoplelistFrendIsmessage(frendId: string, ismessage: boolean): peoplelistAction {
  return {
    type: PEOPLELIST_SET_FRENDISMESSAGE,
    frendId,
    ismessage
  }
}


// THUNKS
// поиск пользователей по нику
export function searchUsers(search: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setPeoplelistLoading(true))
    socket.current!.emit('client:getusers', search)
    dispatch(setPeoplelistLoading(false))
  }
}

// принятие приглашения в друзья
export function addFriend(friendId: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setPeoplelistLoading(true))
    socket.current!.emit('client:addfriends', friendId)
  }
}

// удаление из списка друзей
export function removeFriend(friendId: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setPeoplelistLoading(true))
    socket.current!.emit('client:removefriends', friendId)
  }
}

// отказ в добавлении в друзья
export function cancelInvite(userId: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setPeoplelistLoading(true))
    socket.current!.emit('client:cancelinvite', userId)
  }
}

// запрос на дружбу
export function requestToFriend(userId: string) {
  return async function (dispatch: any, currentState: any) {
    dispatch(setPeoplelistLoading(true))
    socket.current!.emit('client:requesttofriend', userId)
  }
}

// Инизиализация
export function INIT_PEOPLELIST(isAuth: boolean, socket: SocketIOClient.Socket) {
  return async function (dispatch: any, currentState: any) {
    // ответ на запрос по поиску пользователей
    socket.on('server:getusers', async (list: any[]) => {

      dispatch(setPeoplelistSearchlist(list))
      dispatch(setPeoplelistLoading(false))
    })

    // добавление друга
    socket.on('server:addfriends', async (resultUser: IUser) => {
      dispatch(addPeoplelistFriend(resultUser))
      dispatch(setPeoplelistLoading(false))
    })
    socket.on('server:addfriends_target', async (newFriend: IUser) => {
      dispatch(addPeoplelistFriend(newFriend))
    })

    // получение информации о пользователе
    socket.on('server:getuserinfo', async (userinfo: any) => {
      dispatch(setPeoplelistUserinfo(userinfo))
    })

    // удалении из списка друзей
    socket.on('server:removefriends', async (friendsId: string) => {
      dispatch(removePeoplelistFriend(friendsId))
      dispatch(setPeoplelistLoading(false))
    })
    socket.on('server:cancelinvite_target', async (friendsId: string) => {
      dispatch(removePeoplelistFriend(friendsId))
    })

    // отказ в добавлении в друзья
    socket.on('server:cancelinvite', async (userId: string) => {
      dispatch(removeInvitePeoplelist(userId))
      dispatch(setPeoplelistLoading(false))
    })
    socket.on('server:cancelinvite_target', async (userId: string) => {
      dispatch(removeRequestPeoplelist(userId))
    })

    // оповещение о выходе друга 
    socket.on('server:frenddisconnect', async (frendId: string) => {
      dispatch(setIsonlinetoFrendPeoplelist(frendId, false))
    })

    // оповещение о присоединении друга
    socket.on('server:frendconnect', async (frendId: string) => {
      dispatch(setIsonlinetoFrendPeoplelist(frendId, true))
    })

    // запрос на добавление в друзья
    socket.on('server:requesttofriend', async (request: any) => {
      dispatch(addRequestPeoplelist(request))
      dispatch(setPeoplelistLoading(false))
    })
    socket.on('server:requesttofriend_target', async (Invite: any) => {
      dispatch(addInvitePeoplelist(Invite))
    })
    
    // если пользователь авторизован, то мы сразу получаем о нём информацию
    if (isAuth) {
      socket.emit('client:getuserinfo')
      socket.emit('client:login')
      socket.emit('server:getuserinfo')
    }
  }
}

