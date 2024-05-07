// filename: routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const authPatient = require('../middleware/authPatient');


// Post a review
router.post('/post/:doctorId', authPatient, async (req, res) => {
    const { rating, text, appointmentId } = req.body;

    // Check if review text exceeds the maximum character limit
    if (text && text.length > 500) {
        return res.status(400).send({ message: "Review text cannot exceed 500 characters." });
    }

    try {
        // Check if a review already exists for this appointment
        const existingReview = await Review.findOne({ appointment: appointmentId, patient: req.patient._id });
        if (existingReview) {
            return res.status(400).send({ message: "Review already submitted for this appointment." });
        }

        // Create a new review
        const review = new Review({
            doctor: req.params.doctorId,
            patient: req.patient._id,
            appointment: appointmentId,
            rating,
            text
        });
        await review.save();

        // Update doctor's rating
        const doctor = await Doctor.findById(req.params.doctorId);
        doctor.reviews.push(review._id);
        const ratings = await Review.find({ doctor: req.params.doctorId }).select('rating');
        doctor.averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
        await doctor.save();
        updateClinicAverageRating(doctor.clinic);
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send({ message: "Failed to post review", error: error.message });
    }
});

module.exports = router;
