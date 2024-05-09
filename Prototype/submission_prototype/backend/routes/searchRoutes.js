const express = require('express');
const router = express.Router();
const DoctorModel = require('../models/Doctor');
const ClinicModel = require('../models/Clinic');

// Search endpoint for doctors/clinics
router.get('/search', async (req, res) => {
  const { term } = req.query;
  
  // Log the full URL being accessed, including the query string
  console.log(`Requested URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);

  try {
    const doctorResults = await DoctorModel.find({
      $or: [
        { name: new RegExp(term, 'i') },
        { specialty: new RegExp(term, 'i') }
      ]
    }).populate('clinic'); // Populating clinic data in the search result

    const clinicResults = await ClinicModel.find({
      name: new RegExp(term, 'i')
    });

    res.json({
      doctors: doctorResults,
      clinics: clinicResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
