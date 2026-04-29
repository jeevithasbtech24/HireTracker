require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
})
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.log('MongoDB error:', err.message))

app.use('/api/auth', require('./routes/auth'))
app.use('/api/jobs', require('./routes/jobs'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`))