const express = require('express')
const path = require('path')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const mongoose = require('mongoose')
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session)

const userRouter = require('./routes/Auth')
const KEYS = require('./keys/dev')
const { handleSocketLogic } = require('./socket/socket')
const { connectedUsers } = require('./socket/connected')
const User = require('./models/User')

// уловка для запуска мдлеваров с экспресса например.
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);


// настройка
app.use(express.static(path.join(__dirname, 'media')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// mongoose и сессии
const store = new mongoStore({
  collection: 'session',
  uri: KEYS.MONGO_URI
})
const configedSession = session({
  secret: KEYS.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  rolling: true
})
app.use(configedSession)
try {
  mongoose.connect(KEYS.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
} catch (err) { throw err }

// роуты
app.use('/auth', userRouter)

// sockets
io.use((socket, next) => {
  wrap(configedSession)(socket, next)
})
io.on('connection', (socket) => {
  console.log('connected', connectedUsers);
  handleSocketLogic(socket, io)
})

// для разграничения
// io.of('/somepath').on()

// как в express 
// io.use((socket, next) => {
//   next()
// })

// также есть функционал комнат
// для присоединения сокета к комнате нужно вызвать 
// socket.join('some room', callback); - теперь сокет относится(следит) за этой комнатой
// io.to('some room').emit('some event'); - отправка всем сокетам в этой комнате
// io.to('room1').to('room2').to('room3').emit('some event'); - отправка всем сокетам в данных комнатах
// socket.to('some room').emit('some event'); - тогда будет отправка всем кроме этого сокета(отправителя как broadcast)
// socket.leave('some room', callback) - выход из комнаты

// у каждого сокета есть свой уникальный id
// когда сокет подключен он автоматически присоединяется к комнате с названием по своему id
// так что можно сделать так:
// socket.to(socket.id).emit('my message', msg); - все кто какбы подписан на этот сокет будет оповещен

// socket.rooms - комнаты на которые подписан данный socket
// при отключении socket, он автоматически выходит из всех комнат

// io.sockets = io.of('/')

// получить id всех сокетов(клиентов)
// можно и io.of('some').clients
// io.clients((err, clients) => {
//   console.log(clients);
// })

http.listen(4406, () => {
  console.log(`listen on port ${4406}`);
})