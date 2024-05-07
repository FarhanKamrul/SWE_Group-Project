// filename: models/Doctor.js

const mongoose = require('mongoose');

class Doctor extends mongoose.Schema {
    constructor() {
        super({
            name: { type: String, required: true },
            specialty: [{ type: String, required: true }],
            clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
            gender: { 
                type: String, required: true, 
            },
            appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }], // Store references to appointments
            languagesSpoken: [{ type: String }],
            profilePicture: { type: String, default: 'default-profile.jpg' },
            reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
            averageRating: { type: Number, default: 0 }
        });

        // Pre-save hooks could also be defined here if needed, for example:
        this.pre('save', function(next) {
            // This function could handle other pre-save logic if necessary
            next();
        });
    }
}

module.exports = mongoose.model('Doctor', new Doctor());



