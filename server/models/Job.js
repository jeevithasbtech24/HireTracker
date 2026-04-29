const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  company:  { type: String, required: true },
  location: String,
  salary:   String,
  status:   { type: String, enum: ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'], default: 'Saved' },
  notes:    String,
  appliedAt:{ type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)