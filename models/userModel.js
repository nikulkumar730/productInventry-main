const mongoose = require('mongoose');
const Roles = require('../utility/constant').Roles;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: [Roles.ADMIN, Roles.CUSTOMER],
    default: Roles.CUSTOMER
  }
});

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
