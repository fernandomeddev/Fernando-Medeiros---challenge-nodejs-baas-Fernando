const mongoose = require('../database/mongodb');
const bcrypt = require('bcryptjs');

const AccountSchema = new mongoose.Schema({
    accountName: {
        type: String,
        require: true,
    },
    balance: {
        type: Number,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    creatAt:{
        type: Date,
        default:Date.now,
    },

});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;