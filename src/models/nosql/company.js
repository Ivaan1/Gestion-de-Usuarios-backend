const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },
  address: {
    street: String,
    number: Number,
    postal: Number,
    city: String,
    province: String
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'users',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);