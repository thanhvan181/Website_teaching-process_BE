const mongoose = require('mongoose');

const permisstionSchema = mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    use: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    field: {
      type: Object,
      default: {
        create: false,
        update: false,
        delete: false,
        readonly: false,
      },
    },
    title_field: {
      type: Object,
      default: {
        create: null,
        update: null,
        delete: null,
        readonly: null,
      },
    },
  },
  {collection: 'permisstions', timestamps: true}
);

const _permisstions = mongoose.model('permisstions', permisstionSchema);
module.exports = _permisstions;
