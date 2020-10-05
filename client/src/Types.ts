export type IUser = {
  _id: string
  nickname: string
  isOnline?: boolean
  isNewMessage?: boolean
}

export type IMessage = {
  text: string
  img_path: string
  date: number
  author: IUser
}