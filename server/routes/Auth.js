const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { loginValidator, registerValidator } = require('../Utils/Validators')
const { validationResult } = require('express-validator')

// login
router.post('/login', loginValidator, async (req, res) => {
  const validationResults = validationResult(req)
  const { mail, password } = req.body

  try {
    if (!validationResults.isEmpty()) {
      return res.status(403).json({
        ok: false,
        message: validationResults.array()[0].msg
      })
    }

    const candidate = await User.findOne({ mail: mail }).lean()
    if (!candidate) return res.status(403).json({
      ok: false,
      message: 'email или пароль не верны'
    })

    const isPasswordSame = candidate.password == password
    if (!isPasswordSame) return res.status(403).json({
      ok: false,
      message: 'email или пароль не верны'
    })

    req.session.user = candidate
    req.session.save((err) => {
      if(err) console.log(err);
      res.json({
        ok: true, data: {
          id: candidate._id,
          nickname: candidate.nickname
        }
      })
    })
  } catch (err) {
    res.json({ ok: false })
  }
})

router.post('/check', async (req, res) => {
  if(req.session.user) res.json({
    ok: true, data: {
      id: req.session.user._id,
      nickname: req.session.user.nickname
    }
  })
  else res.json({ ok: false })
})

// register
router.post('/register', registerValidator, async (req, res) => {
  const validationResults = validationResult(req)
  const { mail, password, nickname } = req.body
  console.log(mail, password, nickname);
  try {
    if (!validationResults.isEmpty()) {
      return res.status(403).json({
        ok: false,
        message: validationResults.array()[0].msg
      })
    }

    const user = new User({
      mail, 
      password, 
      nickname
    })
    await user.save()
    res.json({ ok: true })
  } catch (err) {
    res.json({ ok: false })
  }
})

// logout
router.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  });
});

module.exports = router