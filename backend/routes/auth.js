const router = require('express').Router()
const User = appRequire('/model/v1/User')

router.post('/register', async (req, res) => {
  const user = new User({
    name: req.body.name,
    password: req.body.password
  })

  try {
    const savedUser = await user.save()
    res.send({ message: 'OK', content: savedUser })
  } catch(err) {
    console.error(err)
    res.status(400).json({ message: 'FAIL', content: '', error: err.message })
  }
})

router.post('/login', (req, res) => {
  res.send({ message: 'OK', content: ''})
})

module.exports = router