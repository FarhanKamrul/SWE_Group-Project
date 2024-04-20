const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Patient = require('../models/userModel'); // Ensure this path matches your file structure

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone_number, emirates_id, date_of_birth } = req.body;

        // Check if user already exists
        const existingUser = await Patient.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ success: false, message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new patient
        const patient = new Patient({
            name,
            email,
            password: hashedPassword,
            phone_number,
            emirates_id,
            date_of_birth
        });

        await patient.save();

        res.status(201).send({ success: true, message: 'Patient registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error registering new patient' });
    }
});

module.exports = router;
