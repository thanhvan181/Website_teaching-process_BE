const _orders = require('./model');

const orderService = {
  all: (params = {}) => {
    return _orders
      .find({is_deleted: {$ne: true}}, params)
      .populate('schedule.slots')
      .populate('listApply');
  },
  getById: (id) => {
    return _orders.findById(id).populate('schedule.slots').populate('listApply');
  },
  create: (order) => {
    return new _orders({...order}).save();
  },
  update: (id, order) => {
    return _orders.findByIdAndUpdate(id, order, {new: true}).exec();
  },
  delete: (id) => {
    return _orders.findByIdAndUpdate(id, {is_deleted: true}, {new: true});
  },
};

module.exports = orderService;
