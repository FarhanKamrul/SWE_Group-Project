// filename: routes/appointmentRoutes.js

/*
Preamble
The routes are defined as /api/appointments/<name>
where <name> is the name of the route.
*/

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Notification = require('../models/Notification');
const Clinic = require('../models/Clinic');
const Patient = require('../models/Patient');
const authClinic = require('../middleware/authClinic');
const authPatient = require('../middleware/authPatient');

// Helper function to create notifications
async function createAndPushNotification(userModel, userId, type, message) {
    console.log("Create notification called")
    const newNotification = new Notification({
        recipient: userId,
        onModel: userModel,
        type: type,
        message: message
    });


    console.log("Notification UserModel: " + userModel); //This is being read correctly
    console.log("Notification is being saved");
    await newNotification.save(); //This is not being invoked if the userModel is 'Patient'
    //So the save function works for clinics not for patients.

    console.log("Notification UserModel: " + userModel); // This is not being read at all, so I assume the save is failing
    if (userModel === 'Clinic') {
        console.log("Clinic is being notified of: " + message);
        await Clinic.findByIdAndUpdate(userId, { $push: { notifications: { $each: [newNotification._id], $position: 0 } } });
    } else if (userModel === 'Patient') {
        console.log("Patient is being notified of: " + message);
        await Patient.findByIdAndUpdate(userId, { $push: { notifications: { $each: [newNotification._id], $position: 0 } } });
    }
    else {
        console.log("userModel not being read correctly")
    }
}

// Clinic Side Code

// Route to add a new appointment slot
router.post('/add-appointment', authClinic, async (req, res) => {
    const { doctorId, appointmentTime } = req.body;
    const appointmentDate = new Date(appointmentTime);
    const startTime = new Date(appointmentDate.getTime() - 30 * 60000); // 30 minutes before
    const endTime = new Date(appointmentDate.getTime() + 30 * 60000); // 30 minutes after

    try {
        const overlappingAppointments = await Appointment.find({
            doctor: doctorId,
            appointmentTime: { $gte: startTime, $lte: endTime }
        });

        const isActiveOverlap = overlappingAppointments.some(app => app.status !== 'Cancelled');
        if (isActiveOverlap) {
            return res.status(409).send({ message: "An active appointment within 30 minutes of this time already exists for this doctor." });
        }

        const newAppointment = new Appointment({
            doctor: doctorId,
            appointmentTime,
            status: 'Free'
        });
        await newAppointment.save();

        // Push the appointment to the doctor's and clinic's appointment arrays

        try{
            await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: newAppointment._id } });
            await Clinic.findByIdAndUpdate(req.clinic._id, { $push: { appointments: newAppointment._id } });
        }
        catch(error){
            console.log("Error in pushing appointments to doctor and clinic");
        }
        //await Doctor.findByIdAndUpdate(doctorId, { $push: { appointments: newAppointment._id } });
        //await Clinic.findByIdAndUpdate(req.clinic._id, { $push: { appointments: newAppointment._id } });

        const doctor = await Doctor.findById(doctorId);
        if (doctor && doctor.clinic) {
            console.log("FOUND doctor")
            await createAndPushNotification('Clinic', doctor.clinic, 'AppointmentSlotAdded', 'A new appointment slot has been added.');
        }
        else{
            console.log("NOT FOUND doctor")
        }

        res.status(201).send(newAppointment);
    } catch (error) {
        console.error("Error adding new appointment:", error);
        res.status(500).send({ message: "Failed to add appointment", error: error.message });
    }
});



// Route to confirm an appointment
router.patch('/confirm-appointment/:appointmentId', authClinic, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || appointment.status !== 'Requested') {
            return res.status(404).send({ message: "Appointment not found or not in 'Requested' state." });
        }

        appointment.status = 'Confirmed';
        await appointment.save();

        await createAndPushNotification('Patient', appointment.patient, 'AppointmentConfirmed', 'Your appointment has been confirmed.');

        res.status(200).send({ message: "Appointment confirmed successfully.", appointment });
    } catch (error) {
        res.status(500).send({ message: "Failed to confirm appointment", error: error.message });
    }
});

// Route for clinics to cancel an appointment
router.patch('/cancel-appointment/clinic/:appointmentId', authClinic, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || appointment.status === 'Completed' || appointment.status === 'Cancelled') {
            return res.status(404).send({ message: "Appointment not found or cannot be cancelled." });
        }

        appointment.status = 'Cancelled';
        appointment.cancelledBy = 'Clinic';
        await appointment.save();

        if (appointment.patient != null) {
            await createAndPushNotification('Patient', appointment.patient, 'AppointmentCancelled', 'Your appointment has been cancelled by the clinic.');
        }
        

        res.status(200).send({ message: "Appointment cancelled successfully.", appointment });
    } catch (error) {
        res.status(500).send({ message: "Failed to cancel appointment", error: error.message });
    }
});

// Route for clinics to mark appointment as 'Completed'
router.patch('/complete-appointment/clinic/:appointmentId', authClinic, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || appointment.status !== 'Confirmed') {
            return res.status(404).send({ message: "Appointment not found or not in 'Confirmed' state." });
        }

        appointment.status = 'Completed';
        await appointment.save();

        await createAndPushNotification('Patient', appointment.patient, 'AppointmentCompleted', 'Your appointment has been marked as completed, Please provide a review of your experience');

        res.status(200).send({ message: "Appointment completed successfully, you can now review the appointment.", appointment });
    } catch (error) {
        res.status(500).send({ message: "Failed to complete appointment", error: error.message });
    }
});



router.get('/clinic-confirmed-appointments', authClinic, async (req, res) => {
    try {
        const clinicWithAppointments = await Clinic.findById(req.clinic._id)
            .populate({
                path: 'appointments',
                match: { appointmentTime: { $gte: new Date() }, status: 'Confirmed' },
                populate: { path: 'doctor patient' }
            });

        const bookedAppointments = clinicWithAppointments.appointments.filter(app => app !== null);
        res.json(bookedAppointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching confirmed appointments", error: error.message });
    }
});


router.get('/clinic-free-appointments', authClinic, async (req, res) => {
    try {
        const clinicWithAppointments = await Clinic.findById(req.clinic._id)
            .populate({
                path: 'appointments',
                match: { appointmentTime: { $gte: new Date() }, status: 'Free' },
                populate: { path: 'doctor patient' }
            });

        const requestedAppointments = clinicWithAppointments.appointments.filter(app => app !== null);
        res.json(requestedAppointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching free appointments", error: error.message });
    }
});


router.get('/clinic-requested-appointments', authClinic, async (req, res) => {
    try {
        const clinicWithAppointments = await Clinic.findById(req.clinic._id)
            .populate({
                path: 'appointments',
                match: { appointmentTime: { $gte: new Date() }, status: 'Requested' },
                populate: { path: 'doctor patient' }
            });

        const requestedAppointments = clinicWithAppointments.appointments.filter(app => app !== null);
        res.json(requestedAppointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching requested appointments", error: error.message });
    }
});

router.get('/clinic-confirmed-requested-appointments', authClinic, async (req, res) => {
    try {
        const clinicWithAppointments = await Clinic.findById(req.clinic._id)
            .populate({
                path: 'appointments',
                match: { appointmentTime: { $gte: new Date() }, status: { $in: ['Confirmed', 'Requested'] } },
                populate: { path: 'doctor patient' }
            });

        const mixedAppointments = clinicWithAppointments.appointments.filter(app => app !== null);
        res.json(mixedAppointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching confirmed and requested appointments", error: error.message });
    }
});




// Fetch upcoming appointments for a specific doctor
router.get('/doctor-upcoming-appointments/:doctorId', authClinic, async (req, res) => {
    try {
        const now = new Date();
        const appointments = await Appointment.find({ doctor: req.params.doctorId, appointmentTime: { $gte: now } })
            .populate('patient')
            .sort('appointmentTime');
        res.json(appointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching appointments", error: error.message });
    }
});



// Patient Side Code

// Route for patients to browse available appointments within clinics
router.get('/available-appointments/clinic/:clinicId', authPatient, async (req, res) => {
    try {
        const { clinicId } = req.params;
        const clinic = await Clinic.findById(clinicId).populate({
            path: 'appointments',
            match: { status: 'Free', appointmentTime: { $gte: new Date() } }, // Ensure the appointment is free and upcoming
            populate: { path: 'doctor', select: 'name specialty' } // Populate related doctor data
        });

        if (!clinic) {
            return res.status(404).send({ message: "Clinic not found" });
        }

        // Filter to get only valid appointments; sometimes needed if match doesn't work as expected
        const validAppointments = clinic.appointments.filter(app => app.status === 'Free' && new Date(app.appointmentTime) > new Date());

        res.status(200).json(validAppointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching available appointments for the clinic", error: error.message });
    }
});

// Route for patients to browse available appointments within doctors
router.get('/available-appointments/doctor/:doctorId', authPatient, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const appointments = await Appointment.find({
            doctor: doctorId,
            status: 'Free',
            appointmentTime: { $gte: new Date() }
        }).populate('doctor', 'name specialty');

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching available appointments for the doctor", error: error.message });
    }
});



// Route for patients to request an appointment
router.patch('/request-appointment/:appointmentId', authPatient, async (req, res) => {
    console.log('Request received to book appointment:', req.params.appointmentId);
    try {
        console.log('Searching for appointment...');
        const appointment = await Appointment.findOne({ 
            _id: req.params.appointmentId,
            status: 'Free'  // Ensure the appointment is currently free
        });

        if (!appointment) {
            console.log('Appointment not found or not available for booking.');
            return res.status(404).send({ message: "Appointment not found or not available for booking." });
        }

        console.log('Appointment found, updating status...');
        appointment.status = 'Requested';
        appointment.patient = req.patient._id;
        await appointment.save();
        console.log('Appointment status updated and saved.');

        console.log('Updating patient appointments...');
        await Patient.findByIdAndUpdate(req.patient._id, { $push: { appointments: appointment._id } });
        console.log('Patient appointments updated.');

        console.log('Searching for doctor...');
        const doctor = await Doctor.findById(appointment.doctor);
        if (doctor && doctor.clinic) {
            console.log('Doctor found, creating notification...');
            await createAndPushNotification('Clinic', doctor.clinic, 'AppointmentRequested', 'An appointment has been requested.');
            console.log('Notification created.');
        }

        console.log('Sending response...');
        res.status(200).send({ message: "Appointment requested successfully.", appointment });
    } catch (error) {
        console.log('Error:', error.message);
        res.status(500).send({ message: "Failed to request appointment", error: error.message });
    }
});
// Route for patients to cancel an appointment
router.patch('/cancel-appointment/patient/:appointmentId', authPatient, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.appointmentId);
        if (!appointment || appointment.status === 'Completed' || appointment.status === 'Cancelled') {
            return res.status(404).send({ message: "Appointment not found or cannot be cancelled." });
        }

        appointment.status = 'Cancelled';
        appointment.cancelledBy = 'Patient';
        await appointment.save();

        const doctor = await Doctor.findById(appointment.doctor);
        if (doctor && doctor.clinic) {
            await createAndPushNotification('Clinic', doctor.clinic, 'AppointmentCancelled', 'An appointment has been cancelled by the patient.');
        }

        res.status(200).send({ message: "Appointment cancelled successfully.", appointment });
    } catch (error) {
        res.status(500).send({ message: "Failed to cancel appointment by patient", error: error.message });
    }
});

// Fetch upcoming appointments for a specific patient
router.get('/patient-upcoming-appointments', authPatient, async (req, res) => {
    try {
        const now = new Date();
        const appointments = await Appointment.find({ patient: req.patient._id, appointmentTime: { $gte: now } })
            .populate('doctor')
            .sort('appointmentTime');
        res.json(appointments);
    } catch (error) {
        res.status(500).send({ message: "Error fetching appointments", error: error.message });
    }
});


module.exports = router;
