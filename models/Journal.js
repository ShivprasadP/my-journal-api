const mongoose = require('mongoose')

const journalSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true }, // Change to string
})

const journal = mongoose.model('journals', journalSchema)

module.exports = journal
