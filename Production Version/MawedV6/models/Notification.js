const mongoose = require('mongoose');

class Notification extends mongoose.Schema {
    constructor() {
        super({
            recipient: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'onModel',  // This will refer to the type of the recipient (Patient or Clinic)
                required: true
            },
            onModel: {
                type: String,
                required: true,
                enum: ['Patient', 'Clinic']  // Specifies the model on which the recipient is referenced
            },
            type: {
                type: String,
                enum: ['AppointmentBooked', 'AppointmentCancelled', 'AppointmentUpdated', 'AppointmentSlotAdded', 'AppointmentRequested', 'AppointmentConfirmed', 'AppointmentCompleted'],
                required: true
            },
            message: {
                type: String,
                required: true
            },
            read: {
                type: Boolean,
                default: false
            },
            dateCreated: {
                type: Date,
                default: Date.now
            }
        });
    }
}

module.exports = mongoose.model('Notification', new Notification());
