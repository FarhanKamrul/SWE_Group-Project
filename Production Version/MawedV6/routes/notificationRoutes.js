const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authPatient = require('../middleware/authPatient');
const authClinic = require('../middleware/authClinic');

// Fetch notifications for a patient
router.get('/patient-notifications', authPatient, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.patient._id, onModel: 'Patient' }).sort({ dateCreated: -1 });
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch notifications", error: error.message });
    }
});

// Fetch notifications for a clinic
router.get('/clinic-notifications', authClinic, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.clinic._id, onModel: 'Clinic' }).sort({ dateCreated: -1 });
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ message: "Failed to fetch notifications", error: error.message });
    }
});

// Mark a notification as read
router.patch('/read-notification/:notificationId', [authPatient, authClinic], async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.notificationId, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).send({ message: "Notification not found." });
        }
        res.status(200).send(notification);
    } catch (error) {
        res.status(500).send({ message: "Failed to update notification", error: error.message });
    }
});

module.exports = router;
