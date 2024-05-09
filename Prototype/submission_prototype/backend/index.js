const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const UserModel = require ('./models/FormData');
const AdminsModel = require ('./models/Admins');
const ClinicModel = require ('./models/Clinic');
const AppointmentsModel = require ('./models/Appointment');
const ReviewsModel = require ('./models/Reviews');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/practice_mern');

app.post('/register', (req, res) => {
    const { email, password } = req.body;

    UserModel.findByEmail(email)
        .then(existingUser => {
            if (existingUser) {
                res.json("Already registered");
            } else {
                UserModel.createPatient(req.body)
                    .then(newPatient => res.json(newPatient))
                    .catch(err => res.json(err));
            }
        });
});

// POST route for patient login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    UserModel.findByEmail(email)
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});



app.post('/adminlogin', (req, res) => {
    const { email, password } = req.body;

    AdminsModel.findByEmail(email)
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.status(200).json({
                        message: 'Success',
                        user: user.name
                    });
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        })
        .catch(err => {
            console.error('Error finding admin:', err);
            res.status(500).json("Internal Server Error");
        });
});

app.post('/searchClinic', (req, res)=>{
    // To find record from the database
    const {location, specific} = req.body;
    ClinicModel.findOne({neighborhood: location})
    .then(user => {
        if(user){
            if(user.name.includes(specific) || typeof specific === 'undefined' || typeof specific === none){
              res.status(200).json({
                message: 'Success',
                user: [[user.name], user.doctors]
               });
            }

        }
        // If user not found then
        else{
            res.json("No clinics! ");
    }

  })
})



app.post('/booking', (req, res) => {
    const { clinic, doctor, date, time, patient, contactNumber, insuranceId, reason, status } = req.body;

    AppointmentsModel.findByContactNumber(contactNumber)
        .then(existingAppointment => {
            if (existingAppointment) {
                res.json("Max");
            } else {
                AppointmentsModel.createAppointment({ clinic, doctor, date, time, patient, contactNumber, insuranceId, reason, status })
                    .then(newAppointment => res.json(newAppointment))
                    .catch(err => res.json(err));
            }
        });
});

// GET route to fetch appointments by doctorId
app.get('/doctor/appointments', async (req, res) => {
    const { doctorId } = req.query;

    try {
        const appointments = await AppointmentsModel.findAppointmentsByDoctorId(doctorId);

        res.status(200).json({ appointments });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
    }
});

// PATCH route to update appointment status by ID
app.patch('/doctor/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const appointment = await AppointmentsModel.updateAppointmentStatus(id, status);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.error('Failed to update appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});


app.post('/reviews', async (req, res) => {
    try {
        const { name, content, rating } = req.body;

        const newReview = await ReviewsModel.saveReview({ name, content, rating });

        console.log('Review saved:', newReview);

        res.status(201).json({ message: 'Review saved successfully', review: newReview });
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Failed to save review' });
    }
});

// GET route to fetch all reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await ReviewsModel.getAllReviews();
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

app.listen(3001, () => {
    console.log("Server listining on http://127.0.0.1:3001");

});
