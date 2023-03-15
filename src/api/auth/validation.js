const Joi = require('joi');

module.exports = {
  findUser: {
    body: Joi.object().keys({
      email: Joi.string().required(),
      type: Joi.string().required(),
    }),
  },
  checkToken: {
    body: Joi.object().keys({
      accessToken: Joi.string().required(),
    }),
  },
  updatePermisstion: {
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
    body: Joi.object().keys({
      model: Joi.string().required(),
      use: Joi.boolean(),
      title: Joi.string(),
      field: Joi.object().keys({
        create: Joi.boolean(),
        update: Joi.boolean(),
        delete: Joi.boolean(),
        readonly: Joi.boolean(),
      }),
      title_field: Joi.object().keys({
        create: Joi.string(),
        update: Joi.string(),
        delete: Joi.string(),
        readonly: Joi.string(),
      }),
    }),
  },
  createPermisstion: {
    body: Joi.object().keys({
      model: Joi.string().required(),
      use: Joi.boolean(),
      title: Joi.string(),
      field: Joi.object().keys({
        create: Joi.boolean().label('Thêm'),
        update: Joi.boolean(),
        delete: Joi.boolean(),
        readonly: Joi.boolean(),
      }),
      title_field: Joi.object().keys({
        create: Joi.string(),
        update: Joi.string(),
        delete: Joi.string(),
        readonly: Joi.string(),
      }),
    }),
  },
};
