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

// API REPAIR
const repair = require('./api/repair');

router.post('/repair/create', repair.create);
router.put('/repair/update/:repairId', repair.update);
router.delete('/repair/delete/:repairId', repair.deleteRepair);
router.get('/repair/get-all-user', repair.getAllFromUser);
router.get('/repair/get-all-user-date', repair.getAllFromUserByDate);
router.post('/repair/:repairId/comment', repair.addCommentOnRepair);

// TEST api home
router.get('/', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    message: 'welcome to react-academy-project API !'
  });
});

module.exports = router;
