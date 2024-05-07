// filename: middleware/authClinic.js

const jwt = require('jsonwebtoken');
const Clinic = require('../models/Clinic');

const authClinic = async (req, res, next) => {
    let token;
    try {
        //console.log('Authorization Header:', req.header('Authorization'));
        token = req.header('Authorization').replace('Bearer ', '');
        //console.log('Decoded Token:', token);
    } catch (error) {
        console.log('Error during token extraction:', error);
        return res.status(401).send({ error: 'Error during token extraction for clinic.' });
    }

    //Implemented an active token attribute so we can skip the jwt extraction
    /*
    let decoded;
    try {
        
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log('Decoded ID:', decoded.id);
    } catch (error) {
        console.log("Using JWT_SECRET:", process.env.JWT_SECRET);
        console.log('Error during token verification:', error);
        return res.status(401).send({ error: 'Error during token verification.' });
    }
    */

    try {
        const clinic = await Clinic.findOne({ activeToken: token });
        if (!clinic) {
            console.log('No clinic found with this token: ', token);
            throw new Error('No clinic found with this token');
        }
        req.clinic = clinic;
        req.token = token;
        next();
    } catch (error) {
        console.log('Error during clinic retrieval:', error);
        return res.status(401).send({ error: 'Clinic was not retrieved.' });
    }
};

module.exports = authClinic;
