const express = require('express');
const router = express.Router();

// TEST api home
router.get('/', (req, res) => {
  res.json({
    message: 'welcome to react-academy-project API !'
  });
});

module.exports = router;
