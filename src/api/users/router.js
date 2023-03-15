const express = require('express');
const withAuth = require('../../middlewares/auth.middleware');
const userController = require('./controller');

const userRouter = express.Router();

userRouter.get('/', withAuth('users', 'readonly'), userController.getEmployees);
userRouter.get('/all', withAuth(), userController.getUsers);
userRouter.get('/:id', withAuth('users', 'readonly'), userController.getUserById);
userRouter.post('/', withAuth('users', 'create'), userController.createUser);
userRouter.put('/:id', withAuth('users', 'update'), userController.updateUser);
userRouter.put('/password/:id', withAuth('any'), userController.updatePassword);
userRouter.delete('/:id', withAuth(), userController.permanentlyDeleteUser);
userRouter.put('/delete/:id', withAuth('users', 'delete'), userController.deleteUser);
module.exports = userRouter;
