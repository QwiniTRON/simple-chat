import openSocket from 'socket.io-client'

type socketClient = {
  current?: SocketIOClient.Socket,
  refresh: any
}
let socket: socketClient = {
  current: undefined,
  refresh() {
    if (this.current)
      this.current.close()
      
    this.current = openSocket()
  }
}
export default socket