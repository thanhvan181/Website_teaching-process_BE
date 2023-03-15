const Joi = require('joi');

module.exports = {
    getUser: {
        params: Joi.object().keys({
            id: Joi.string().required(),
        }),
    },
};
