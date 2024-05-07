// filename: middleware/authPatient.js
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

//define a logMiddleWare function
const logMiddleware = (req, res, next) => {
    console.log('Authentication route hit:', req.path);
    console.log('Request body:', req.body);
    next(); // Proceed to the next middleware or route handler
};

// Apply the middleware to all routes in authRoutes.js
router.use(logMiddleware);

const authPatient = async (req, res, next) => {
    let token;
    try {
        console.log('Authorization Req for Patient: \n', req.header('Authorization'));
        token = req.header('Authorization').replace('Bearer ', '');
        console.log('Decoded Token:', token);
    } catch (error) {
        console.log('Error during token extraction:', error);
        return res.status(401).send({ error: 'Error during token extraction for patient.' });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded ID:', decoded.id);
    } catch (error) {
        console.log("Using JWT_SECRET:", process.env.JWT_SECRET);
        console.log('Error during token verification:', error);
        return res.status(401).send({ error: 'Error during token verification.' });
    }

    try {
        const patient = await Patient.findOne({ activeToken: token });
        if (!Patient) {
            console.log('No Patient found with this token');
            throw new Error('No Patient found with this token');
        }
        req.patient = patient;
        req.token = token;
        next();
    } catch (error) {
        console.log('Error during Patient retrieval:', error);
        return res.status(401).send({ error: 'Patient was not retrieved.' });
    }
};

module.exports = authPatient;
