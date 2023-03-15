const userService = require('./service');

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await userService.find({
        _id: {$ne: req.auth._id},
        username: {$ne: 'admin'},
        is_deleted: {$ne: true},
      });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  getEmployees: async (req, res, next) => {
    try {
      const users = await userService.find({
        _id: {$ne: req.auth._id},
        super_admin: {$ne: true},
        is_deleted: {$ne: true},
      });
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
  getUserById: async (req, res, next) => {
    try {
      const user = await userService.get(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  createUser: async (req, res, next) => {
    try {
      const existedEmail = await userService.getEmail(req.body.email);
      if (existedEmail) {
        return res.status(404).json({
          status: 404,
          message: 'Email exist',
        });
      }
      if (req.body.username) {
        const existedUsername = await userService.getUsername(req.body.username);
        if (existedUsername) {
          return res.status(404).json({
            status: 404,
            message: 'Username exist',
          });
        }
      }
      await userService.create(req.body);
      return res.status(200).json({
        status: 200,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      await userService.update(req.params.id, req.body);
      return res.status(200).json({
        status: 200,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await userService.delete(req.params.id);
      return res.status(200).json({
        status: 200,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  },
  permanentlyDeleteUser: async (req, res, next) => {
    try {
      await userService.permanentlyDelete(req.params.id);
      return res.status(200).json({
        status: 200,
        message: 'OK',
      });
    } catch (error) {
      next(error);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      if (req.auth.super_admin || req.auth._id === req.params.id) {
        await userService.updatePassword(req.params.id, req.body);
        return res.status(200).json({
          status: 200,
          message: 'OK',
        });
      }
      return res.status(200).json({
        status: 404,
        message: 'Update password failed',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
