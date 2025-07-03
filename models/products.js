const mongoose = require('mongoose');
const DB_Validate_Messages = require('../utility/constant').DB_Validate_Messages
const productSchema = new mongoose.Schema({
  product_Name: {
    type: String,
    unique: true,
    required: [true, `Product name ${DB_Validate_Messages.REQUIRED}`],
    minlength: [3, `${DB_Validate_Messages.MIN_LENGTH} 3 characters`],
  },
  price: {
    type: Number,
    required: [true, `Price ${DB_Validate_Messages.REQUIRED}`],
    match: [/^\d+(\.\d{1,2})?$/, `${DB_Validate_Messages.VALID_PRICE_FORMAT}`],
  },
  quantity: {
    type: Number,
    required: [true, `Quantity ${DB_Validate_Messages.REQUIRED}`],
    max: [1000, 'Quantity cannot exceed 1000'],
  },
  is_available: {
    type: Boolean,
    default: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true
    }
  ]
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
