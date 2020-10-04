const { body } = require('express-validator')
const User = require('../models/User')

module.exports.loginValidator = [
  body('mail', 'email не по формату')
    .exists()
    .isEmail(),

  body('password', 'пароль должен быть не длинее 56 и не короче 6 символов')
    .isLength({ min: 6, max: 56 })
]

module.exports.registerValidator = [
  body('mail', 'email не по формату')
    .exists()
    .isEmail()
    .custom((value) => {
      return new Promise(async (resolve, reject) => {
        const isExists = await User.findOne({ mail: value }, {_id: 1}).lean()
        if (isExists) reject('такой email уже зарегистроиван')
        else resolve()
      })
    }),

  body('password', 'пароль должен быть не длинее 56 и не короче 6 символов')
    .isLength({ min: 6, max: 56 }),

  body('nickname', 'пароль должен быть не длинее 56 и не короче 3 символов')
    .isLength({ min: 3, max: 56 })
    .custom(async (value) => {
      return new Promise(async (resolve, reject) => {
        const isExists = await User.findOne({ nickname: value }, {_id: 1}).lean()
        if (isExists) reject('такой nickname уже зарегистроиван')
        else resolve()
      })
    })
]