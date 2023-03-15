const mongoose = require('mongoose');
const uuid4 = require('uuid').v4;
const {createHmac} = require('crypto');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    permisstion: {
      type: Object,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    super_admin: {
      type: Boolean,
      default: false,
    },
    salt: {
      type: String,
      default: null,
    },
  },
  {collection: 'users', timestamps: true}
);

userSchema.methods = {
  authenticate(password) {
    return createHmac('sha256', this.salt).update(password).digest('hex') == this.password;
  },
};

userSchema.pre('save', async function save(next) {
  try {
    if (this.password) {
      this.salt = uuid4();
      this.password = createHmac('sha256', this.salt).update(this.password).digest('hex');
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre('findOneAndUpdate', async function save(next) {
  try {
    const update = this.getUpdate();
    if (update.password) {
      update.salt = uuid4();
      update.password = createHmac('sha256', update.salt).update(update.password).digest('hex');
    }
    this.update(update);
    return next();
  } catch (err) {
    return next(err);
  }
});

const _users = mongoose.model('users', userSchema);
module.exports = _users;
