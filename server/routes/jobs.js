const router = require('express').Router()
const auth = require('../middleware/auth')
const Job = require('../models/Job')

// Get all jobs for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(jobs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Add new job
router.post('/', auth, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, userId: req.user.id })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update job
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(job)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete job
router.delete('/:id', auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id)
    res.json({ message: 'Job deleted ✅' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router