const express = require('express');
const validate = require('../../middlewares/validate.middleware');
const orderController = require('./controller');
const {getOrder, createOrder, updateOrder, deleteOrder} = require('./validation');

const orderRouter = express.Router();

orderRouter.get('/', orderController.getOrders);
orderRouter.get('/:id', validate(getOrder), orderController.getOrderById);
orderRouter.post('/', validate(createOrder), orderController.createOrder);
orderRouter.patch('/:id', orderController.updateOrder);
orderRouter.post('/apply', orderController.applyOrder);
orderRouter.post('/cancel-apply', orderController.cancelApplyOrder);
orderRouter.delete('/:id', validate(deleteOrder), orderController.deleteOrder);

module.exports = orderRouter;
