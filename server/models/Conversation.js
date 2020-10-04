const { model, Schema } = require('mongoose')

const ConversationSchema = new Schema({
  users: {
    type: [
      {
        ref: 'user',
        type: Schema.Types.ObjectId
      }
    ],
    default: []
  },
  messages: {
    type: [
      {
        text: String,
        img_path: String,
        date: Number,
        author: {
          ref: 'user',
          type: Schema.Types.ObjectId
        }
      }
    ],
    default: []
  },
  create_date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('conversation', ConversationSchema)