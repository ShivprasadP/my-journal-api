const express = require('express')
const router = express.Router()
const Journal = require('../models/jour');

// Get journal route
router.route('/journal').get(async (req, res) => {
  const { email } = req.query

  try {
    const journalEntries = await Journal.find({ email })
    res.json(journalEntries)
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err })
  }
})

// Get a single journal entry by ID
router.route('/journal/:id').get(async (req, res) => {
  const { id } = req.params;

  try {
    const journalEntry = await Journal.findById(id);

    if (!journalEntry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(journalEntry);
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err });
  }
});

// Add journal route
router.route('/journal/add').post(async (req, res) => {
  const { title, content, date, email } = req.body

  const [day, month, year] = date.split('/');
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  const newJournal = new Journal({
    title,
    content,
    date: formattedDate,
    email
  })

  try {
    const journal = await newJournal.save()
    res.json(journal)
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err })
  }
})

// Update a journal entry
router.route('/journal/update/:id').put(async (req, res) => {
  const { id } = req.params;
  const { title, content, date } = req.body;

  try {
    const updatedJournal = await Journal.findByIdAndUpdate(
      id,
      { title, content, date },
      { new: true }
    );

    if (!updatedJournal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json(updatedJournal);
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err });
  }
})

// Delete a journal entry
router.route('/journal/remove/:id').delete(async (req, res) => {
  const { id } = req.params;

  try {
    const deletedJournal = await Journal.findByIdAndDelete(id);

    if (!deletedJournal) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    res.json({ message: 'Journal entry deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err });
  }
});



module.exports = router
