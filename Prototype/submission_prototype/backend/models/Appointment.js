const mongoose = require('mongoose');


class AppointmentsSchema extends mongoose.Schema {
    constructor() {
        super({
            clinic: String,
            doctor: String,
            date: String,
            time: String,
            patient: String,
            contactNumber: String,
            insuranceId: String,
            reason: String,
            status: String
        });
    }
}

class AppointmentsModel {
    constructor() {
        this.model = mongoose.model('appointments', new AppointmentsSchema());
    }

    findByContactNumber(contactNumber) {
        return this.model.findOne({ contactNumber });
    }

    createAppointment(data) {
        return this.model.create(data);
    }

    findAppointmentsByDoctorId(doctorId) {
        return this.model.find({ doctor: doctorId });
    }

    updateAppointmentStatus(id, status) {
        return this.model.findByIdAndUpdate(id, { $set: { status } }, { new: true });
    }
}

module.exports = new AppointmentsModel();
