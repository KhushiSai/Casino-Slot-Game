const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Casino Slot Game API is running');
});

module.exports = router; 