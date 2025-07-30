const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Placeholder for friends routes
router.get('/', auth, async (req, res) => {
  res.json({ success: true, friends: [] });
});

module.exports = router;