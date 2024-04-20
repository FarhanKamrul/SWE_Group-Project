const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
    phone_number: {
        type: String,
        required: [true, 'Please add a phone number'],
    },
    emirates_id: {
        type: String,
        required: [true, 'Please add an Emirates ID'],
    },
    date_of_birth: {
        type: Date,
        required: [true, 'Please add a date of birth'],
    },
});

module.exports = mongoose.model('Patient', userSchema);
