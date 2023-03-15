const mongoose = require('mongoose');

module.exports = (using) => {
  const permisstion = {};
  const defaultPermisstion = {
    use: using,
    title: null,
    field: {
      create: using,
      update: using,
      delete: using,
      readonly: using,
    },
    title_field: {
      create: null,
      update: null,
      delete: null,
      readonly: null,
    },
  };
  for (let key of Object.keys(mongoose.models)) {
    permisstion[key] = defaultPermisstion;
  }
  permisstion.saleman = defaultPermisstion;
  permisstion.dashboard = defaultPermisstion;
  return permisstion;
};
