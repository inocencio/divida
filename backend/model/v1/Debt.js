const mongoose = require('mongoose')

const debtSchema = new mongoose.Schema({
  userID: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    min: 6,
    max: 1024
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date
  },
})

module.exports = mongoose.model('Debt', debtSchema)