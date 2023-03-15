const ApiError = require('../../helpers/ApiError');
const orderService = require('./service');

const orderController = {
  getOrders: async (req, res, next) => {
    try {
      const filter = req.query;
      const orders = await orderService.all(filter);
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
  getOrderById: async (req, res, next) => {
    try {
      const order = await orderService.getById(req.params.id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  createOrder: async (req, res, next) => {
    try {
      const order = await orderService.create(req.body);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      const order = await orderService.update(req.params.id, req.body);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      const order = await orderService.delete(req.params.id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
  applyOrder: async (req, res, next) => {
    try {
      const order = await orderService.getById(req.body._id);
      const hasItem = order.listApply.find((item) => (item = req.body.teacher));
      if (hasItem) {
        throw 'Bạn đã ứng tuyển trước đó!';
      }
      await orderService.update(req.body._id, {
        $push: {listApply: req.body.teacher},
      });
      return res.status(200).json({status: 'success'});
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
  cancelApplyOrder: async (req, res, next) => {
    try {
      const order = await orderService.getById(req.body._id);
      const hasItem = order?.listApply.find((item) => (item = req.body.teacher));
      if (!hasItem) {
        throw 'Bạn chưa ứng tuyển !';
      }
      await orderService.update(req.body._id, {
        $pull: {
          listApply: req.body.teacher,
        },
      });
      return res.status(200).json({status: 'success'});
    } catch (error) {
      next(new ApiError(422, error));
    }
  },
};

module.exports = orderController;
