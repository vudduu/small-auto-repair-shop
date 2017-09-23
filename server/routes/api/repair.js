const RepairModel = require('../../models/Repair');

module.exports = {
  create(req, res, next) {
    if(!req.isAuthenticated()) { // TODO: create middleware for ask about authentication
      return res.json({
        success: false
      });
    }
    let data = {
      owner: req.body.userId,
      date: req.body.date,
      hours: req.body.hours,
    };
    var repairM = new RepairModel(data);
    repairM.save((err, repair) => {
      if (err) return next(err);
      res.json({
        success: true,
        data: repair.toObject(),
      });
    });
  },

  update(req, res, next) {
    if(!req.isAuthenticated()) { // TODO: create middleware for ask about authentication
      return res.json({
        success: false
      });
    }
    const userId = req.session.auth.id;
    const repairId = req.params.repairId;
    RepairModel.findById(repairId, (err, repairM) => {
      if (err) return next(err);
      if (repairM.owner == userId || req.session.auth.role >= 3) {
        if (req.body.date) repairM.date = req.body.date;
        if (req.body.hours) repairM.hours = req.body.hours;
        if (req.body.complete) repairM.complete = req.body.complete;
        if (req.body.userId) repairM.owner = req.body.userId;
        repairM.save((err) => {
          if (err) return next(err);
          res.json({ success: true });
        });
      } else {
        res.json({
          success: false,
          error: new Error('API ERROR: update action is only for the Repair owner.'),
        });
      }
    });
  },

  deleteRepair(req, res, next) {
    const repairId = req.params.repairId;
    if (!repairId) {
      res.json({
        success: false,
        error: new Error('API ERROR: repairId is required.')
      });
      return;
    }
    let userId = req.session.auth.id;
    RepairModel.findById(repairId, (err, repairM) => {
      if (err) return next(err);
      if (repairM && (repairM.owner == userId || req.session.auth.role >= 3)) {
        repairM.remove(function(err) {
          if (err) return next(err);
          const repairObj = repairM.toObject();
          repairObj.success = true;
          res.json(repairObj);
        });
      } else {
        res.json({
          success: false,
          error: new Error('API ERROR: delete action is only for the Repair owner.')
        });
      }
    });
  },

  getAllFromUser(req, res, next) {
    if(!req.isAuthenticated()) { // TODO: create middleware for ask about authentication
      return res.json({ success: false });
    }
    let userId = req.session.auth.id;
    let page = req.query.page || 0;
    if (req.query.userId && req.session.auth.role >= 3) {
      userId = req.query.userId;
    }
    let perPage = 5;
    RepairModel
      .find({ 'owner': userId })
      .skip(page * perPage)
      .limit(perPage)
      .sort({ date: 'desc' })
      .lean()
      .exec((err, repairs) => {
        if (err) return next(err);
        res.json({
          access: true,
          repairs,
        });
      });
  },

  /**
   * "from" and "to" sample: '06-08-2016'
   */
  getAllFromUserByDate(req, res, next) {
    if(!req.isAuthenticated()) { // TODO: create middleware for ask about authentication
      return res.json({ success: false });
    }
    if(!req.query.from && !req.query.to) {
      return res.json({
        success: false,
        error: 'API ERROR: "from" and "to" are mandatory'
      });
    }
    let userId = req.session.auth.id;
    if (req.query.userId && req.session.auth.role >= 3) {
      userId = req.query.userId;
    }
    let from, to;
    if(req.query.from) from = new Date(req.query.from);
    else from = new Date('01-01-1970');
    if(req.query.to) to = new Date(req.query.to);
    else to = new Date();
    from.setHours(0);
    to.setHours(23);
    RepairModel
      .find({
        owner: userId,
        date: {
          $gte: from,
          $lte: to,
        },
      })
      .sort({ date: 'desc' })
      .lean()
      .exec(function (err, repair) {
        if (err) return next(err);
        res.json({
          access: true,
          repair,
        });
      });
  },

  addCommentOnRepair(req, res, next) {
    if(!req.isAuthenticated()) { // TODO: create middleware for ask about authentication
      return res.json({
        success: false
      });
    }
    const userId = req.session.auth.id;
    const repairId = req.params.repairId;
    RepairModel.findById(repairId, (err, repairM) => {
      if (err) return next(err);
      if (req.body.comment) {
        const commentObj = {
          user: userId,
          text: req.body.comment,
          date: new Date(),
        };
        repairM.comments = [...repairM.comments, commentObj];
      }
      repairM.save((err) => {
        if (err) return next(err);
        res.json({ success: true });
      });
    });
  }
};
