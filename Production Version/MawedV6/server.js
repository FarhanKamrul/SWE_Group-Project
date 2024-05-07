// filename: server.js

require('dotenv').config(); // This loads the environment variables from the .env file
const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');


const app = express();
app.use(cors());


// Use environment variables
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

connectDB(dbURI);

app.use(express.json()); // Middleware for parsing JSON bodies

// Define routes
//For user authentication (patient and clinic)
app.use('/api/auth', require('./routes/authRoutes'));

//For doctors
const doctorRoutes = require('./routes/doctorRoutes');  // Check the path and filename are correct
app.use('/api/doctors', doctorRoutes);

//For appointments
const appointmentRoutes = require('./routes/appointmentRoutes');  // Check the path and filename are correct
app.use('/api/appointments', appointmentRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
