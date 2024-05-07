const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class Patient extends mongoose.Schema {
    constructor() {
        super({
            email: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            password: { type: String, required: true },
            dateOfBirth: { type: Date, required: true },
            tokens: [{
                token: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                    expires: 3600 // Token expires in 1 hour
                }
            }],
            activeToken: { type: String },
            notifications: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Notification'
            }],
            appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }]
        });
    }
}

module.exports = mongoose.model('Patient', new Patient());
