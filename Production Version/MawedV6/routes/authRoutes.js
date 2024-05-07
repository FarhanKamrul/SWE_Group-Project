// Filename: routes/authRoutes.js

/*
 * Route Setup Preamble:
 * 
 * The 'authRoutes' are prefixed with '/api/auth/' as configured in the server.js file.
 * To access the routes defined here, prepend '/api/auth/' to the route name.
 * 
 * Patient Routes:
 * - Register: '/api/auth/register/patient'
 * - Login: '/api/auth/login/patient'
 * - Profile: '/api/auth/patient/profile'
 * - Logout: '/api/auth/logout/patient'
 * - Update: '/api/auth/update-patient'
 * - Delete: '/api/auth/delete-patient'
 * 
 * Clinic Routes:
 * - Register: '/api/auth/register/clinic'
 * - Login: '/api/auth/login/clinic'
 * - Dashboard: '/api/auth/dashboard/clinic'
 * - Logout: '/api/auth/logout/clinic'
 * 
 * Note: Ensure proper route setup for successful integration with the front end.
 */





const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Clinic = require('../models/Clinic');
const { generateToken, hashPassword, verifyPassword } = require('../utils/authUtils');
const authClinic = require('../middleware/authClinic');
const authPatient = require('../middleware/authPatient');

const logMiddleware = (req, res, next) => {
    console.log('Authentication route hit:', req.path);
    console.log('Request body:', req.body);
    next(); // Proceed to the next middleware or route handler
};

// Apply the middleware to all routes in authRoutes.js
router.use(logMiddleware);

// Apply the middleware to all routes in authRoutes.js


/*
PATIENT SIDE ROUTES



*/


/**authPatient);
 * Register a new patient.
 */
router.post('/register/patient', async (req, res) => {
    try {
        const { email, name, password, dateOfBirth } = req.body;
        const hashedPassword = await hashPassword(password);
        const newPatient = new Patient({
            email,
            name,
            password: hashedPassword,
            dateOfBirth
        });
        await newPatient.save();
        res.status(201).send({ patient: newPatient });
    } catch (error) {
        res.status(400).send(error);
    }
});

// Patient Login
router.post('/login/patient', async (req, res) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email });
        if (!patient) {
            return res.status(404).send({ message: 'Patient not found' });
        }
        const isMatch = await verifyPassword(password, patient.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }
        const token = generateToken({ id: patient._id });
        patient.tokens = patient.tokens.concat({ token });
        patient.activeToken = token;
        await patient.save();
        res.send({ patient, token });
    } catch (error) {
        res.status(500).send({ message: 'Error during patient login', error: error.message });
    }
});

// Fetch patient information
router.get('/patient/profile', authPatient, async (req, res) => {
    try {
        // `req.patient` is set by the authPatient middleware
        if (!req.patient) {
            return res.status(404).send({ message: 'No patient found' });
        }
        const { name, email, dateOfBirth } = req.patient;
        res.send({ name, email, dateOfBirth });
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).send({ message: 'Unable to retrieve patient profile', error: error.message });
    }
});

// Patient Logout
router.post('/logout/patient', authPatient, async (req, res) => {
    try {
        req.patient.tokens = req.patient.tokens.filter(token => token.token !== req.token);
        await req.patient.save();
        res.send('Logged out successfully');
    } catch (error) {
        res.status(500). send({ error: 'Failed to log out' });
    }
});


const { body, validationResult } = require('express-validator');

// Update a patient's profile
router.patch('/update-patient', authPatient, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('dateOfBirth').optional().isISO8601().withMessage('Must be a valid date')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updates = Object.keys(req.body);
        updates.forEach(update => req.patient[update] = req.body[update]);
        await req.patient.save();
        res.send(req.patient);
    } catch (error) {
        res.status(400).send({ message: 'Failed to update patient', error: error.message });
    }
});

// Remove a patient's profile

router.delete('/delete-patient', authPatient, async (req, res) => {
    try {
        // Assuming `req.patient` is a Mongoose document fetched previously
        const result = await Patient.deleteOne({ _id: req.patient._id });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'No patient found or already deleted' });
        }
        res.send({ message: 'Patient profile deleted successfully' });
    } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).send({ message: 'Failed to delete patient', error: error.message });
    }
});





/* 

CLINIC SIDE CODE

*/



// Clinic Login and Registration

router.post('/login/clinic', async (req, res) => {
    try {
        const { email, password } = req.body;
        const clinic = await Clinic.findOne({ email });
        if (!clinic) {
            return res.status(404).send('Clinic not found');
        }
        if (!clinic._id) {
            console.error('Error: clinic object does not include _id:', clinic);
            return res.status(500).send('Server error');
        }
        const isMatch = await verifyPassword(password, clinic.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        const token = generateToken({ id: clinic._id });
        if (!token) {
            throw new Error('Token generation failed');
        }
        clinic.tokens = clinic.tokens.concat({ token });
        clinic.activeToken = token;
        await clinic.save();
        res.send({ clinic, token });
    } catch (error) {
        console.error('Error during clinic login:', error);
        res.status(500).send(error);
    }
});


/**
 * Register a new clinic.
 */
router.post('/register/clinic', async (req, res) => {
    try {
        const { name, email, password, neighborhood } = req.body;
        const newClinic = new Clinic({ name, email, password, neighborhood });
        await newClinic.save();
        //const token = generateToken(newClinic);
        res.status(201).send({ clinic: newClinic });
    } catch (error) {
        res.status(400).send(error);
    }
});



router.post('/logout/clinic', authClinic, async (req, res) => {
    try {
        const clinic = req.clinic;
        clinic.activeToken = null; // Remove the active token
        await clinic.save();
        res.send('Logged out successfully');
    } catch (error) {
        res.status(500).send({ error: 'Failed to log out' });
    }
});


//fetch clinic profile

router.get('/dashboard/clinic', authClinic, async (req, res) => {
    try {
        const clinicId = req.clinic._id; // Assuming authClinic sets req.clinic
        const clinic = await Clinic.findById(clinicId)
                                   .populate('doctors')
                                   .populate('appointments');
        if (!clinic) {
            return res.status(404).send({ message: 'Clinic not found' });
        }
        const { name, email, neighborhood, doctors, appointments } = clinic;
        res.send({ name, email, neighborhood, doctors, appointments });
    } catch (error) {
        console.error('Error fetching clinic dashboard:', error);
        res.status(500).send({ message: 'Unable to retrieve clinic dashboard', error: error.message });
    }
});



/*

router.get('/dashboard/clinic', authClinic, async (req, res) => {
    try {
        // req.clinic is set by the authClinic middleware
        // add more clinic schema fields to return
        const { name, email } = req.clinic; // You can adjust the fields you want to return based on dashboard needs
        res.send({ name, email });
    } catch (error) {
        console.error('Error fetching clinic dashboard:', error);
        res.status(500).send({ message: 'Unable to retrieve clinic dashboard', error: error.message });
    }
});
*/



module.exports = router;
 