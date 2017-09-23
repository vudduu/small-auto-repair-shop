const AccountModel = require('../../models/Account');

module.exports = {

  create(req, res, next) {
    const data = {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const accountM = new AccountModel(data);
    accountM.save((err, accountR) => {
      if (err) return next(err);
      const accountObj = accountR.toObject();
      delete accountObj.password;
      res.json({
        success: true,
        data: accountObj,
      });
    });
  },

  update(req, res, next) {
    let userId = req.session.auth.id;
    var accountId = req.params.accountId;
    AccountModel
      .findById(accountId, function (err, accountM) {
        if (err) return next(err);
        if (accountM._id == userId || req.session.auth.role >= 3) {
          if (accountM._id == userId) {
            accountM.password = req.body.password || accountM.password;
          }
          accountM.name = req.body.name;
          accountM.email = req.body.email;
          accountM.role = req.body.role;
          accountM.enabled = req.body.enabled;
          accountM.save(function (err) {
            if (err) return next(err);
            res.json({
              success: true
            });
          });
        } else {
          res.json({
            success: false,
            error: new Error('API ERROR: update action is only for account owner.')
          });
        }
      });
  },

  deleteAccount(req, res, next) {
    var accountId = req.params.accountId;
    if(!accountId) {
      res.json({
        success: false,
        error: new Error('API ERROR: accountId is required.')
      });
      return;
    }
    let userId = req.session.auth.id;
    AccountModel.findById(accountId, function (err, accountM) {
      if (err) return next(err);
      if (accountM && req.session.auth.role >= 3) {
        accountM.remove(function(err) {
          if (err) return next(err);
          var accountObj = accountM.toObject();
          accountObj.success = true;
          res.json(accountObj);
        });
      } else {
        res.json({
          success: false,
          error: new Error('API ERROR: delete action is only for Managers and Admins.')
        });
      }
    });
  },

  login(req, res, next) {
    AccountModel.findOne({
      username: req.body.username
    })
      .exec(function (err, account) {
        if(err) return next(err);
        const resp = {
          success: true,
          username: !!account,
        };
        if(resp.username) {
          resp.password = account.password === req.body.password;
          if(resp.password) {
            const accountObj = account.toObject();
            req.session.auth.logged = true;
            req.session.auth.username = req.body.username;
            req.session.auth.id = accountObj._id;
            req.session.auth.role = accountObj.role;
            req.session.save((err) => {
              if (err) {
                res.json(resp);
                return next(err);
              }
              delete accountObj.password;
              resp.data = accountObj;
              res.json(resp);
            });
          } else {
            res.json(resp);
          }
        } else {
          res.json(resp);
        }
      });
  },

  logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  },

  getAuth(req, res, next) {
    if (req.session.auth && req.session.auth.username) {
      AccountModel.findOne({
        username: req.session.auth.username,
      })
        .exec((err, account) => {
          if (err) return next(err);
          if (account) {
            const accountObj = account.toObject();
            delete accountObj.password;
            res.json({
              success: true,
              data: accountObj,
            });
          } else {
            res.json({ success: false });
          }
        });
    } else {
      res.json({ success: false });
    }
  },

  /**
   * ROLE >= 3 (manager, admin, super user)
   * @param req
   * @param res
   * @param next
   */
  getAll(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.json({ success: false });
    }
    const role = req.session.auth.role;
    if (role < 3) {
      return res.json({ success: false });
    }
    const page = req.query.page || 0;
    const perPage = 5;
    AccountModel
      .find({
        // $or:[{"role": 2},{"role": 3}]
        "role": { $lt: 6 }
      }) // regular users only
      .skip(page * perPage)
      .limit(perPage)
      .select('_id username name email role enabled')
      .sort({ name: 'asc' })
      .lean()
      .exec((err, accounts) => {
        if (err) return next(err);
        res.json({
          success: true,
          accounts: accounts,
        });
      });
  }
};
