// filename: models/Appointment.js

const mongoose = require('mongoose');

class Appointment extends mongoose.Schema {
    constructor() {
        super({
            doctor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Doctor',
                required: true
            },
            patient: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Patient',
                required: false
            },
            appointmentTime: {
                type: Date,
                required: true
            },
            status: {
                type: String,
                required: true,
                enum: ['Free', 'Requested', 'Confirmed', 'Completed', 'Cancelled'],
                default: 'Free'
            },
            cancelledBy: {
                type: String,
                enum: ['Patient', 'Clinic'],
                required: function() { return this.status === 'Cancelled'; }  // Required only if status is 'Cancelled'
            }
        });
    }
}

module.exports = mongoose.model('Appointment', new Appointment());
