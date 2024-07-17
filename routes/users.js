const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Signup route
router.post('/signup', async (req, res) => {
  const { fullname, email, password, backupQuestion, backupQuestionAns } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // Hash password before saving to the database
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ fullname, email, password: hashedPassword, backupQuestion, backupQuestionAns });
    await newUser.save();
    res.json({ message: 'User registered!' });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    res.json({ message: 'Login successful!', fullname: user.fullname });
  } catch (err) {
    res.status(500).json({ message: 'Error: ' + err.message });
  }
});

// Recovery route
router.post('/verify-recovery', async (req, res) => {
  const { email, backupQuestion, backupQuestionAns } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.backupQuestion !== backupQuestion || user.backupQuestionAns !== backupQuestionAns) {
      return res.status(401).json({ success: false, message: 'Invalid recovery question or answer.' });
    }

    res.json({ success: true, message: 'Authentication successful!', email: user.email });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error: ' + err.message });
  }
});

// Password reset route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error: ' + err.message });
  }
});

module.exports = router;
