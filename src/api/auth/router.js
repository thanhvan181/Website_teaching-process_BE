const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const authController = require('./controller');
const {checkUser, checkToken, updatePermisstion, createPermisstion} = require('./validation');

const authRouter = express.Router();

authRouter.post('/check-user-login', validate(checkUser), authController.checkUserLogin);
authRouter.post('/get-user-info', validate(checkToken), authController.getUserLogin);
authRouter.get('/get-list-permisstion', authController.getListPermisstion);
authRouter.get('/get-list-model', authController.getListModel);
authRouter.put(
  '/update-permisstion/:id',
  validate(updatePermisstion),
  authController.updatePermisstion
);
authRouter.post(
  '/create-permisstion',
  validate(createPermisstion),
  authController.createPermisstion
);
authRouter.post('/super-admin-login', authController.superAdminLogin);
authRouter.post('/check-email-google', authController.checkEmailExist);
authRouter.post('/check-email-google-v2', authController.checkEmailExistV2);

module.exports = authRouter;
