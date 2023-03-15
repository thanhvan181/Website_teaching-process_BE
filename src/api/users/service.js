const _users = require('./model');
const uuid4 = require('uuid').v4;

const userService = {
  find: (params = {}) => {
    return _users.find(params);
  },
  get: (id) => {
    return _users.findOne({_id: id, is_deleted: {$ne: true}});
  },
  getEmail: (email) => {
    return _users.findOne({email: email});
  },
  getUsername: (username) => {
    return _users.findOne({username: username});
  },
  create: (data) => {
    if (!data.email) {
      data.email = data.username;
    }
    if (!data.username) {
      data.username = data.email;
    }
    return _users.create(data);
  },
  update: (id, data) => {
    return _users.findOneAndUpdate({_id: id}, data, {new: true});
  },
  updatePassword: (id, password) => {
    return _users.findOneAndUpdate({_id: id}, password, {new: true});
  },
  delete: (id) => {
    return _users.findOneAndUpdate({_id: id}, {is_deleted: true}, {new: true});
  },
  permanentlyDelete: (id) => {
    return _users.findByIdAndDelete(id);
  },
};

module.exports = userService;
