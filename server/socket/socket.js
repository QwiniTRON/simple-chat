const User = require('../models/User')
const Conversation = require('../models/Conversation')
const { connectedUsers } = require('./connected')
const fs = require('fs/promises')
const path = require('path')

async function noticeFrendsDisconect(personId, io) {
  const person = await User.findOne({ _id: String(personId) }, { password: 0, mail: 0 }).lean()

  for (let friend of person.friends) {
    const frendSocket = connectedUsers.get(String(friend._id))
    if (frendSocket) io.to(frendSocket).emit('server:frenddisconnect', personId)
  }
}

async function noticeFrendsConnect(personId, io) {
  const person = await User.findOne({ _id: String(personId) }, { password: 0, mail: 0 }).lean()

  for (let friend of person.friends) {
    const frendSocket = connectedUsers.get(String(friend._id))
    if (frendSocket) io.to(frendSocket).emit('server:frendconnect', personId)
  }
}


/**
 * @param {import('socket.io').Socket} socket 
 * @param {import('socket.io').Server} io 
 */
module.exports.handleSocketLogic = function handleSocketLogic(socket, io) {
  // добавление в подключённых польлзователей
  if (socket.request.session.user) {
    const personId = String(socket.request.session.user._id)
    connectedUsers.set(personId, socket.id)
    noticeFrendsConnect(personId, io)
  }

  // отключение
  socket.on('disconnect', () => {
    if (socket.request.session.user) {
      const personId = String(socket.request.session.user._id)
      connectedUsers.delete(personId)
      noticeFrendsDisconect(personId, io)
    }
  })

  // подключение к сокету
  socket.on('client:login', () => {
    const personId = String(socket.request.session.user._id)
    connectedUsers.set(personId, socket.id)
    noticeFrendsConnect(personId, io)
  })

  // получение юзеров по нику
  socket.on('client:getusers', async (search) => {
    const regExpNickname = new RegExp(`.*${search}.*`, 'i')
    const users = await User.find({ nickname: regExpNickname }, { password: 0, mail: 0 }).sort({ nickname: 1 }).lean()

    io.to(socket.id).emit('server:getusers', users)
  })

  // добавление в друзья из приглашения
  socket.on('client:addfriends', async (userId) => {
    const personId = socket.request.session.user._id
    const userReq = User.findOne({ _id: personId }, { mail: 0, password: 0 }).populate('friends')
    const userForPushReq = User.findOne({ _id: userId }, { mail: 0, password: 0 }).populate('friends')
    const user = await userReq
    const userForPush = await userForPushReq

    user.friends.push(userForPush._id)
    userForPush.friends.push(user._id)
    const indexInvite = user.invites.indexOf(String(userId))
    const indexRequest = userForPush.requests.indexOf(String(personId))
    user.invites.splice(indexInvite, 1)
    userForPush.requests.splice(indexRequest, 1)

    await Promise.all([user.save(), userForPush.save()])
    const clearedUserForPush = {
      _id: userForPush._id,
      nickname: userForPush.nickname,
      isOnline: connectedUsers.has(String(userForPush._id))
    }
    io.to(socket.id).emit('server:addfriends', clearedUserForPush)

    const frendSocket = connectedUsers.get(userId)
    if (frendSocket) {
      const clearedUser = {
        _id: user._id,
        nickname: user.nickname,
        isOnline: connectedUsers.has(String(user._id))
      }
      io.to(frendSocket).emit('server:addfriends_target', clearedUser)
    }
  })

  // отказ в добавлении в друзья
  socket.on('client:cancelinvite', async (userId) => {
    const personId = socket.request.session.user._id
    const userReq = User.findOne({ _id: personId }, { password: 0, mail: 0 })
    const userForCancelReq = User.findOne({ _id: userId }, { password: 0, mail: 0 })
    const user = await userReq
    const userForCancel = await userForCancelReq

    const indexInvite = user.invites.indexOf(userId)
    const indexRequest = userForCancel.requests.indexOf(personId)
    user.invites.splice(indexInvite, 1)
    userForCancel.requests.splice(indexRequest, 1)

    await Promise.all([user.save(), userForCancel.save()])
    io.to(socket.id).emit('server:cancelinvite', userId)

    const frendSocket = connectedUsers.get(userId)
    if (frendSocket) {
      io.to(frendSocket).emit('server:cancelinvite_target', personId)
    }
  })

  // запрос на добавление в друзья
  socket.on('client:requesttofriend', async (userId) => {
    const personId = socket.request.session.user._id
    const userReq = User.findOne({ _id: personId }).populate('requests')
    const userForAddReq = User.findOne({ _id: userId }).populate('invites')
    const user = await userReq
    const userForAdd = await userForAddReq

    user.requests.push(userId)
    userForAdd.invites.push(personId)

    await Promise.all([user.save(), userForAdd.save()])
    let clearedUserForAdd = {
      _id: userForAdd._id,
      nickname: userForAdd.nickname
    }
    io.to(socket.id).emit('server:requesttofriend', clearedUserForAdd)

    const frendSocket = connectedUsers.get(userId)
    if (frendSocket) {
      const clearedUser = {
        _id: user._id,
        nickname: user.nickname
      }
      io.to(frendSocket).emit('server:requesttofriend_target', clearedUser)
    }
  })

  // удаление из друзей
  socket.on('client:removefriends', async (userId) => {
    const personId = socket.request.session.user._id
    const userReq = User.findOne({ _id: personId }).populate('friends')
    const userForPushReq = User.findOne({ _id: userId }).populate('friends')
    const user = await userReq
    const userForPush = await userForPushReq
    const indexAtUserList = user.friends.indexOf(userForPush._id)
    const indexAtFriendList = userForPush.friends.indexOf(user._id)
    user.friends.splice(indexAtUserList, 1)
    userForPush.friends.splice(indexAtFriendList, 1)

    await Promise.all([user.save(), userForPush.save()])
    io.to(socket.id).emit('server:removefriends', userForPush._id)

    const frendSocket = connectedUsers.get(userId)
    if (frendSocket) {
      io.to(frendSocket).emit('server:cancelinvite_target', personId)
    }
  })

  // получение информации о пользователе(авторизированном)(друзья, запросы, приглашения)
  socket.on('client:getuserinfo', async () => {
    if (!socket.request.session) return []
    const personId = socket.request.session.user._id
    const friendsResponse = await User.findOne(
      { _id: personId }, { friends: 1, _id: 0, invites: 1, requests: 1, newMessages: 1 })
      .populate({
        path: 'friends', select: { _id: 1, nickname: 1 }
      })
      .populate({
        path: 'invites', select: { _id: 1, nickname: 1 }
      })
      .populate({
        path: 'requests', select: { _id: 1, nickname: 1 }
      }).lean()


    friendsResponse.friends.forEach((frend, idx, arr) => {
      arr[idx].isOnline = connectedUsers.has(String(frend._id))
      arr[idx].isNewMessage = friendsResponse.newMessages.find((objId) => String(objId) === String(frend._id))
    })

    io.to(socket.id).emit('server:getuserinfo', friendsResponse)
  })


  // запись сообщения
  socket.on('client:message', async (userId, messageText, bufferFile, filename) => {
    const personId = socket.request.session.user._id
    let fileNameString = ''
    messageText = messageText.trim()

    if (messageText.length > 1000) {
      return
    }

    if (messageText.length == 0 && !filename) {
      return
    }

    if (filename) {
      if (bufferFile.length > 2e6) return

      try {
        fileNameString = Date.now() + filename
        const writeResult = await fs.writeFile(path.join(__dirname, '..', 'media', fileNameString), bufferFile)
      } catch (err) {
        console.log(err);
        fileNameString = ''
      }
    }

    const message = {
      text: messageText,
      img_path: fileNameString,
      date: Date.now(),
      author: {
        _id: personId,
        nickname: socket.request.session.user.nickname
      }
    }
    const usersCouple = [userId, personId].sort()
    const conversation = await Conversation.findOne({ users: usersCouple }).populate({ path: 'messages' })
    conversation.messages.push(message)

    io.to(socket.id).emit('server:message', message)
    const frendSocket = connectedUsers.get(userId)
    if (frendSocket) {
      io.to(frendSocket).emit('server:message_target', message, personId)
    }

    conversation.save()
    const userTarget = await User.findOne({ _id: userId })
    const isNoticeExists = userTarget.newMessages.includes(userId)
    if (!isNoticeExists) {
      userTarget.newMessages.push(personId)
      userTarget.save()
    }
  })

  // получить переписку с человеком
  socket.on('client:getmessages', async (userId) => {
    const personId = socket.request.session.user._id
    const usersCouple = [userId, personId].sort()
    const conversation = await Conversation.findOne({ users: usersCouple }).populate({ path: 'messages.author' }).lean()


    if (!conversation) {
      const newConversation = new Conversation({
        users: usersCouple,
        messages: []
      })
      newConversation.save()
      io.to(socket.id).emit('server:getmessages', [])
    } else {
      io.to(socket.id).emit('server:getmessages', conversation.messages, userId)

      const person = await User.findOne({ _id: personId })
      const messageNoticeIdx = person.newMessages.indexOf(userId)
      if (messageNoticeIdx !== -1) {
        person.newMessages.splice(messageNoticeIdx, 1)
        person.save()
      }
    }
  })
}