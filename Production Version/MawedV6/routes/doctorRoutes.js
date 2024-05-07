// Filename: routes/doctorRoutes.js

/*
 * Preamble for Doctor Routes:
 * 
 * Below is the list of available routes for doctor-related operations:
 * 
 * - Add Doctor:
 *   POST /api/doctors/add-doctor
 * 
 * - Delete Doctor:
 *   DELETE /api/doctors/delete-doctor/:id
 *   Note: Replace ':id' with the specific doctor's ID.
 * 
 * - Update Doctor:
 *   PATCH /api/doctors/update-doctor/:id
 *   Note: Replace ':id' with the specific doctor's ID.
*/


const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Doctor = require('../models/Doctor');
const authClinic = require('../middleware/authClinic');
const Clinic = require('../models/Clinic'); //for linking doctors to clinics
const multer = require('multer');
const Appointment = require('../models/Appointment');


// Set up multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/'); // specify the path to save uploaded files
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname); // specify the filename
    }
});

const upload = multer({ storage: storage });

const logMiddleware = (req, res, next) => {
    console.log('Doctor route hit:', req.path);
    console.log('Request body:', req.body);
    next(); // Proceed to the next middleware or route handler
};

// Apply the middleware to all routes
router.use(logMiddleware);

const fs = require('fs');
const path = require('path');

router.post('/add-doctor', [
    authClinic,
    body('name').notEmpty().withMessage('Name is required'),
    body('specialty').isArray().withMessage('Specialty must be an array'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be "male", "female", or "other"'), // Note: Added "other" to align with frontend options
    body('availableSlots').optional().isArray(),
    body('availableSlots.*.date').optional().isISO8601().withMessage('Date must be valid ISO8601'),
    body('availableSlots.*.isBooked').optional().isBoolean().withMessage('isBooked must be a boolean')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let profilePicture;
    try {
        // Attempt to access the directory for profile pictures
        const directoryPath = path.join(__dirname, 'profile_pictures', req.body.gender);
        const files = fs.readdirSync(directoryPath);
        profilePicture = files[Math.floor(Math.random() * files.length)];
    } catch (error) {
        console.error('Failed to read profile pictures:', error);
        return res.status(500).json({ message: 'Failed to access profile pictures.', error: error.toString() });
    }

    try {
        const doctor = new Doctor({
            ...req.body,
            clinic: req.clinic._id,
            profilePicture: path.join('profile_pictures', req.body.gender, profilePicture)
        });
        await doctor.save();

        // Attempt to add this doctor to the clinic's doctors array
        await Clinic.findByIdAndUpdate(req.clinic._id, { $push: { doctors: doctor._id } });

        res.status(201).send(doctor);
    } catch (error) {
        console.error('Error saving doctor:', error);
        res.status(500).json({ message: 'Failed to save doctor.', error: error.toString() });
    }
});

// Remove a doctor
router.delete('/delete-doctor/:id', authClinic, async (req, res) => {
    const result = await Doctor.deleteOne({ _id: req.params.id, clinic: req.clinic._id });
    if (result.deletedCount === 0) {
        return res.status(404).send({ message: 'No doctor found with this ID for the current clinic.' });
    }
    res.send({ message: 'Doctor removed successfully.' });
});

// Update a doctor
router.patch('/update-doctor/:id', authClinic, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const result = await Doctor.findOneAndUpdate({ _id: req.params.id, clinic: req.clinic._id }, req.body, { new: true, runValidators: true });
    if (!result) {
        return res.status(404).send({ message: 'No doctor found with this ID for the current clinic.' });
    }
    res.send(result);
});

// Add an appointment to a doctor's schedule
router.post('/:doctorId/add-appointment', authClinic, async (req, res) => {
    try {
        const { appointmentTime } = req.body;
        const newAppointment = new Appointment({
            doctor: req.params.doctorId,
            patient: null,  // Assume no patient initially (open slot)
            appointmentTime
            //status: 'Pending'  // Default status
        });
        await newAppointment.save();

        await Doctor.findByIdAndUpdate(req.params.doctorId, {
            $push: { appointments: newAppointment._id }
        });

        res.status(201).send(newAppointment);
    } catch (error) {
        res.status(400).send({ message: "Failed to add appointment", error: error.message });
    }
});

// Search Query Handling

router.get('/search-doctors', async (req, res) => {
    const { keyword, neighborhood, rating, specialty, sort } = req.query;

    try {
        // Initial aggregation pipeline to filter by name and specialty if provided
        let pipeline = [
            {
                $match: {
                    ...(keyword && { name: { $regex: keyword, $options: 'i' }}),  // Case-insensitive partial match for name
                    ...(specialty && { specialty: specialty })  // Exact match for specialty
                }
            },
            {
                $lookup: {
                    from: 'clinics',  // Assuming 'clinics' is the name of your clinics collection
                    localField: 'clinic',  // Doctor references clinic by 'clinic' field
                    foreignField: '_id',  // _id field in Clinic
                    as: 'clinicDetails'
                }
            },
            {
                $unwind: '$clinicDetails'
            },
            {
                $match: {
                    ...(neighborhood && { 'clinicDetails.neighborhood': neighborhood })  // Filtering by neighborhood if provided
                }
            }
        ];

        // Add rating filter to the pipeline if rating is provided
        if (rating) {
            pipeline.push({
                $match: {
                    'averageRating': { $gte: parseFloat(rating) }  // Doctors with averageRating greater or equal to the provided value
                }
            });
        }

        // Add sorting to the pipeline if sort parameter is provided
        if (sort) {
            let sortField = sort === 'rating' ? 'averageRating' : null;
            if (sortField) {
                let sortObject = {};
                sortObject[sortField] = -1;  // -1 for descending order, 1 for ascending
                pipeline.push({ $sort: sortObject });
            }
        }

        // Project to shape the output
        pipeline.push({
            $project: {
                _id: 1,
                name: 1,
                specialty: 1,
                averageRating: 1,
                clinic: {
                    _id: '$clinicDetails._id',
                    name: '$clinicDetails.name',
                    neighborhood: '$clinicDetails.neighborhood'
                }
            }
        });

        const results = await Doctor.aggregate(pipeline);

        res.status(200).json(results);
    } catch (error) {
        res.status(500).send({ message: "Error searching for doctors", error: error.message });
    }
});







module.exports = router;
