// filename: config/database.js

const mongoose = require('mongoose');

/**
 * Connects to the MongoDB database.
 * @param {String} dbURI - The URI of the MongoDB database.
 */
const connectDB = async (dbURI) => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connection successful');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
