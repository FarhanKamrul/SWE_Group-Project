// filename: utils/clinicUtils.js or wherever you manage clinic-related operations

const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

async function updateClinicAverageRating(clinicId) {
    try {
        const doctors = await Doctor.find({ clinic: clinicId });
        if (doctors.length === 0) {
            console.log("No doctors found for this clinic.");
            return;
        }

        let totalRating = 0;
        let ratedDoctorsCount = 0;

        doctors.forEach(doctor => {
            if (doctor.averageRating && doctor.averageRating > 0) {
                totalRating += doctor.averageRating;
                ratedDoctorsCount++;
            }
        });

        const clinicAverageRating = ratedDoctorsCount > 0 ? totalRating / ratedDoctorsCount : 0;

        // Update the clinic with the new average rating
        await Clinic.findByIdAndUpdate(clinicId, { averageRating: clinicAverageRating });

        console.log(`Updated clinic average rating to: ${clinicAverageRating}`);
    } catch (error) {
        console.error("Error updating clinic average rating:", error);
    }
}
