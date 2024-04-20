const patientModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerController = async (req, res) => {
    try {
        console.log('User saving');
        const existingPatient = await patientModel.findOne({ email: req.body.email });
        if (existingPatient) {
            return res.status(200).send({ message: 'User already exists', success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new patientModel(req.body);
        await newUser.save();
        res.status(201).send({ message: 'User saved', success: true });

    } catch (err) {
        console.log(err);
        res.status(404).send({ success: false, message: `Register Controller ${err.message}` });
    }
}

const loginController = async (req, res) => {
    try {
        console.log("Finding user by email\n");
        const { email, password } = req.body;

        // Find the user by email
        
        const user = await patientModel.findOne({ email });
        if (!user) {
            return res.status(401).send({ success: false, message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ success: false, message: 'Invalid email or password' });
        }

        // User matched, create JWT payload
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign token
        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Make sure to have a JWT_SECRET in your .env
            { expiresIn: 36000 }, // Token expiry
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};

module.exports = { loginController, registerController };


