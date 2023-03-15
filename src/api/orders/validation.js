const Joi = require('joi');

module.exports = {
  getOrder: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },

  createOrder: {
    body: Joi.object().keys({
      studentName: Joi.string().required(),
      email: Joi.string().required(),
      studentGrade: Joi.string().required(),
      phone: Joi.string().required().min(10),
      schedule: Joi.object().required(),
    }),
  },

  updateOrder: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      studentName: Joi.string().required(),
      email: Joi.string().required(),
      studentGrade: Joi.string().required(),
      phone: Joi.string().required().min(10),
      schedule: Joi.object().required(),
    }),
  },

  deleteOrder: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },
};
