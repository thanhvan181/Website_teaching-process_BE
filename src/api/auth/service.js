const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const permisstion = require('../../helpers/permisstion');
const _users = require('../users/model');
const _permisstions = require('./model');
const uuid4 = require('uuid').v4;

const authService = {
  checkUser: async (req) => {
    const conditions = {
      email: req.body.email,
      is_deleted: {$ne: true},
    };
    const userExist = await mongoose.model(req.body.type).findOne(conditions);
    if (userExist) {
      const accessToken = jwt.sign(
        {_id: userExist._id, model: req.body.type},
        process.env.ONLINE_SYSTEM_SECRET
      );
      return accessToken;
    }
    return null;
  },
  findUser: (accessToken, next) => {
    jwt.verify(accessToken, process.env.ONLINE_SYSTEM_SECRET, async (err, decode) => {
      if (err) return next(null);
      const userExist = await mongoose.model(decode.model).findById(decode._id);
      return next(userExist);
    });
  },
  findListModels: () => {
    let models = [];
    for (let key of Object.keys(mongoose.models)) {
      models.push(key);
    }
    return models;
  },
  findListPermisstions: async () => {
    const lstPers = await _permisstions.find({});
    if (lstPers.length === 0) {
      const pers = permisstion(true);
      Object.keys(pers).forEach(async (key) => {
        await _permisstions.create({
          model: key,
          use: pers[key].use,
          title: pers[key].title,
          field: pers[key].field,
          title_field: pers[key].title_field,
        });
      });
    }
    return lstPers;
  },
  updatePermisstionById: async (id, permisstion) => {
    return _permisstions.findByIdAndUpdate(id, permisstion, {new: true});
  },
  createNewPermisstion: async (permisstion) => {
    return _permisstions.create(permisstion);
  },
  superAdminLogin: async (payload) => {
    const findAllSuperAdmin = await _users.find({super_admin: true});
    if (findAllSuperAdmin.length === 0) {
      await _users.create({
        username: 'admin',
        password: payload.password,
        name: 'Admin',
        email: 'admin',
        super_admin: true,
      });
    }
    const userExist = await _users.findOne({
      $or: [{username: payload.username}, {email: payload.username}],
      super_admin: true,
    });
    if (!userExist) {
      return null;
    }
    if (!userExist.authenticate(payload.password)) {
      return null;
    }
    const accessToken = jwt.sign(
      {_id: userExist._id, model: 'users'},
      process.env.ONLINE_SYSTEM_SECRET
    );
    return {accessToken, user: userExist};
  },
};

module.exports = authService;
