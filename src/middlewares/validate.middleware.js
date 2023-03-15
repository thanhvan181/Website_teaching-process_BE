const Joi = require('joi');
const ApiError = require('../helpers/ApiError');
const pick = require('../helpers/pick');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const {value, error} = Joi.compile(validSchema)
    .prefs({errors: {label: 'key'}, abortEarly: false})
    .validate(object);

  if (error) {
    const errorMessage = error.details.map(({message, context}) => {
      const _error = {};
      _error.key = context.key;
      _error.message = message.replace(`"${context.label}" `, '');
      return _error;
    });
    return next(new ApiError(400, JSON.stringify(errorMessage)));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
