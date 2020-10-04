const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  mail: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  friends: {
    type: [
      {
        ref: 'user',
        type: Schema.Types.ObjectId
      }
    ],
    default: []
  },
  invites: {
    type: [
      {
        ref: 'user',
        type: Schema.Types.ObjectId
      }
    ],
    default: []
  },
  requests: {
    type: [
      {
        ref: 'user',
        type: Schema.Types.ObjectId
      }
    ],
    default: []
  },
  newMessages: {
    type: [{
      ref: 'user',
      type: Schema.Types.ObjectId
    }],
    default: []
  }
}, { versionKey: false })

module.exports = model('user', userSchema)