const jwt = require('jsonwebtoken');
const {isObjectIdOrHexString} = require('mongoose');
const _users = require('../api/users/model');
const ApiError = require('../helpers/ApiError');

const withAuth = (models, action) => (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization && authorization.includes('Bearer ')) {
    const token = authorization.replace('Bearer ', '');
    return jwt.verify(token, process.env.ONLINE_SYSTEM_SECRET, async (err, decode) => {
      if (err) req.permisstion = null;
      if (!decode) {
        return res.status(401).json({
          message: 'Authorization',
        });
      }
      const userExist = await _users.findById(decode._id);
      const usePer = userExist && userExist.permisstion && userExist.permisstion[models];
      if (userExist.super_admin || (usePer.use && usePer.field[action]) || models === 'any') {
        const authObj = {
          ...userExist._doc,
          _id: userExist._id.valueOf(),
        };
        req.auth = authObj;
        return next();
      } else {
        return res.status(403).json({
          message: 'You are not allowed',
        });
      }
    });
  }
  return res.status(401).json({
    message: 'Authorization',
  });
};

module.exports = withAuth;
