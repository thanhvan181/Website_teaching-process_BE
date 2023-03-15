const _slot = require('./model');

module.exports = {
  create: (data) => {
    const slot = _slot.create(data);
    return slot;
  },
  getAll: async () => {
    const slots = await _slot.find({is_deleted: {$ne: true}});
    return slots;
  },
  get: (id) => {
    const slot = _slot.findById(id);
    return slot;
  },
  remove: (id) => {
    const slot = _slot.findByIdAndUpdate(id, {is_deleted: true}, {new: true});
    return slot;
  },
  update: (id, data) => {
    const slot = _slot.findByIdAndUpdate(id, data, {new: true});
    return slot;
  },
};
