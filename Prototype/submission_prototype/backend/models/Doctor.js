// filename: models/Doctor.js

const mongoose = require('mongoose');

class Doctor extends mongoose.Schema {
    constructor() {
        super({
            name: { type: String, required: true },
            specialty: [{ type: String, required: true }],
            clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
            availableSlots: [{
                date: { type: Date, required: true },
                isBooked: { type: Boolean, required: true, default: false }
            }],
            gender: {
                type: String, required: true,
                enum: ['Male', 'Female', 'Other'],
                set: function(value) {
                    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                }
            },
            appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }], // Store references to appointments
            languagesSpoken: [{ type: String }],
            profilePicture: { type: String, default: 'default-profile.jpg' },
            reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
            averageRating: { type: Number, default: 0 }
        });

        this.pre('save', function(next) {
            next();
        });
    }
}

module.exports = mongoose.model('Doctor', new Doctor());
