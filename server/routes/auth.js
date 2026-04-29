const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed })
    res.json({ message: 'User created ✅' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'User not found' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Wrong password' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Change Password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(400).json({ error: 'Current password is wrong!' })
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be 6+ characters!' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ message: 'Password updated ✅' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update Name
router.put('/update-name', auth, async (req, res) => {
  try {
    const { name } = req.body
    if (!name.trim()) return res.status(400).json({ error: "Name can't be empty!" })
    const user = await User.findByIdAndUpdate(req.user.id, { name: name.trim() }, { new: true })
    res.json({ name: user.name })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router