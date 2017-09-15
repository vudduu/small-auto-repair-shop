const express = require('express');
const router = express.Router();

// API ACCOUNT
const account = require('./api/account');

router.post('/login', account.login);
router.get('/logout', account.logout);

router.post('/account/create', account.create);
router.put('/account/update/:accountId', account.update);
router.delete('/account/delete/:accountId', account.deleteAccount);
router.get('/account/get-auth', account.getAuth);
router.get('/account/get-all', account.getAll);

// TEST api home
router.get('/', (req, res) => {
  res.json({
    message: 'welcome to react-academy-project API !'
  });
});

module.exports = router;
