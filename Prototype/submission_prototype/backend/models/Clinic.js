const mongoose = require('mongoose');
//const bcrypt = require('bcryptjs');

const VALID_NEIGHBORHOODS = [
    "Al Bateen", "Al Khalidiyah", "Al Maryah Island", "Al Mushrif", "Al Nahyan",
    "Al Reem Island", "Al Shamkha", "Khalifa City", "Masdar City",
    "Mohammed Bin Zayed City", "Saadiyat Island", "Yas Island"
];

class Clinic extends mongoose.Schema {
    constructor() {
        super({
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            neighborhood: {
                type: String,
                required: true,
                validate: {
                    validator: function(v) {
                        return VALID_NEIGHBORHOODS.includes(v);
                    },
                    message: props => `${props.value} is not a valid neighborhood in Abu Dhabi`
                }
            },
            doctors: [{ type: String }],
            appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
            tokens: [{
                token: {
                    type: String,
                    required: true
                }
            }],
            activeToken: { type: String },
            notifications: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Notification'
            }]
        });
    }
}

const ClinicModel = mongoose.model('Clinic', new Clinic());
module.exports = ClinicModel;
