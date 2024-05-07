Here are the API calls defined in the `authRoutes.js` file:

1. **POST /api/auth/register/patient**

   - Registers a new patient.
   - Expects parameters: `email`, `name`, `password`, `dateOfBirth`.
   - Hashes the password before saving it to the database.
   - Returns the newly registered patient.

2. **POST /api/auth/login/patient**

   - Logs in a patient.
   - Expects parameters: `email`, `password`.
   - Finds the patient by email.
   - Compares the provided password with the hashed password stored in the database.
   - Generates a JWT token upon successful login.
   - Updates the patient's token array and sets the active token.
   - Returns the logged-in patient along with the token.

3. **GET /api/auth/patient/profile**

   - Fetches the profile information of the logged-in patient.
   - Requires authentication via `authPatient` middleware.
   - Returns the name, email, and date of birth of the patient.

4. **POST /api/auth/logout/patient**

   - Logs out a patient.
   - Requires authentication via `authPatient` middleware.
   - Removes the token used for authentication from the patient's token array.
   - Returns a success message upon logout.

5. **PATCH /api/auth/update-patient**

   - Updates a patient's profile.
   - Requires authentication via `authPatient` middleware.
   - Validates the request body fields (`name`, `email`, `dateOfBirth`).
   - Updates the patient's profile with the provided data.
   - Returns the updated patient's profile.

6. **DELETE /api/auth/delete-patient**

   - Deletes a patient's profile.
   - Requires authentication via `authPatient` middleware.
   - Deletes the patient's profile from the database.
   - Returns a success message upon successful deletion.

7. **POST /api/auth/login/clinic**

   - Logs in a clinic.
   - Expects parameters: `email`, `password`.
   - Finds the clinic by email.
   - Compares the provided password with the hashed password stored in the database.
   - Generates a JWT token upon successful login.
   - Updates the clinic's token array and sets the active token.
   - Returns the logged-in clinic along with the token.

8. **POST /api/auth/register/clinic**

   - Registers a new clinic.
   - Expects parameters: `name`, `email`, `password`, `neighborhood`.
   - Saves the new clinic to the database.
   - Returns the newly registered clinic.

9. **POST /api/auth/logout/clinic**

   - Logs out a clinic.
   - Requires authentication via `authClinic` middleware.
   - Removes the token used for authentication from the clinic's token array.
   - Returns a success message upon logout.

10. **GET /api/auth/dashboard/clinic**
    - Fetches the dashboard information of the logged-in clinic.
    - Requires authentication via `authClinic` middleware.
    - Returns the name and email of the clinic.

---

Here are the API calls defined in the `appointmentRoutes.js` file:

1. **POST /api/appointments/add-appointment**

   - Route to add a new appointment slot.
   - Parameters: `doctorId`, `appointmentTime`.
   - Checks for overlapping appointments within 30 minutes.
   - If no overlaps, creates a new appointment and saves it.
   - Pushes the appointment to the doctor's and clinic's appointment arrays.
   - Sends a notification to the clinic that the appointment slot has been added.

2. **PATCH /api/appointments/confirm-appointment/:appointmentId**

   - Route to confirm an appointment.
   - Parameter: `appointmentId`.
   - Finds the appointment by ID.
   - Changes the appointment status to 'Confirmed'.
   - Sends a notification to the patient that their appointment has been confirmed.

3. **PATCH /api/appointments/cancel-appointment/clinic/:appointmentId**

   - Route for clinics to cancel an appointment.
   - Parameter: `appointmentId`.
   - Finds the appointment by ID.
   - Changes the appointment status to 'Cancelled'.
   - Sends a notification to the patient that their appointment has been cancelled by the clinic.

4. **PATCH /api/appointments/complete-appointment/clinic/:appointmentId**

   - Route for clinics to mark appointment as 'Completed'.
   - Parameter: `appointmentId`.
   - Finds the appointment by ID.
   - Changes the appointment status to 'Completed'.
   - Sends a notification to the patient that their appointment has been marked as completed.

5. **GET /api/appointments/clinic-confirmed-appointments**

   - Fetches confirmed appointments for a clinic.
   - Returns appointments with status 'Confirmed' and appointment time greater than or equal to the current time.

6. **GET /api/appointments/clinic-free-appointments**

   - Fetches free appointments for a clinic.
   - Returns appointments with status 'Free' and appointment time greater than or equal to the current time.

7. **GET /api/appointments/clinic-requested-appointments**

   - Fetches requested appointments for a clinic.
   - Returns appointments with status 'Requested' and appointment time greater than or equal to the current time.

8. **GET /api/appointments/clinic-confirmed-requested-appointments**

   - Fetches confirmed and requested appointments for a clinic.
   - Returns appointments with status either 'Confirmed' or 'Requested' and appointment time greater than or equal to the current time.

9. **GET /api/appointments/doctor-upcoming-appointments/:doctorId**

   - Fetches upcoming appointments for a specific doctor.
   - Parameter: `doctorId`.
   - Returns appointments with appointment time greater than or equal to the current time, sorted by appointment time.

10. **GET /api/appointments/available-appointments/clinic/:clinicId**

    - Fetches available appointments within clinics for patients.
    - Parameter: `clinicId`.
    - Returns appointments with status 'Free' and appointment time greater than or equal to the current time for the specified clinic.

11. **GET /api/appointments/available-appointments/doctor/:doctorId**

    - Fetches available appointments within doctors for patients.
    - Parameter: `doctorId`.
    - Returns appointments with status 'Free' and appointment time greater than or equal to the current time for the specified doctor.

12. **PATCH /api/appointments/request-appointment/:appointmentId**

    - Route for patients to request an appointment.
    - Parameter: `appointmentId`.
    - Finds the appointment by ID and checks if it's free.
    - Changes the appointment status to 'Requested' and assigns the patient.
    - Sends a notification to the clinic that an appointment has been requested.

13. **PATCH /api/appointments/cancel-appointment/patient/:appointmentId**

    - Route for patients to cancel an appointment.
    - Parameter: `appointmentId`.
    - Finds the appointment by ID.
    - Changes the appointment status to 'Cancelled' and records the cancellation by the patient.

14. **GET /api/appointments/patient-upcoming-appointments**
    - Fetches upcoming appointments for a specific patient.
    - Returns appointments with appointment time greater than or equal to the current time, sorted by appointment time.

## These are for managing appointments and timeslots.

Here are the API calls defined in the `doctorRoutes.js` file:

1. **POST /api/doctors/add-doctor**

   - Adds a new doctor.
   - Requires authentication via `authClinic` middleware.
   - Validates request body fields (`name`, `specialty`, `gender`, `availableSlots`).
   - Generates a random profile picture for the doctor.
   - Saves the new doctor to the database.
   - Adds the doctor to the clinic's doctors array.
   - Returns the newly added doctor.

2. **DELETE /api/doctors/delete-doctor/:id**

   - Deletes a doctor.
   - Requires authentication via `authClinic` middleware.
   - Deletes the doctor with the specified ID associated with the current clinic.
   - Returns a success message upon successful deletion.

3. **PATCH /api/doctors/update-doctor/:id**

   - Updates a doctor's information.
   - Requires authentication via `authClinic` middleware.
   - Validates request body fields.
   - Updates the doctor with the specified ID associated with the current clinic.
   - Returns the updated doctor.

4. **POST /api/doctors/:doctorId/add-appointment**
   - Adds an appointment to a doctor's schedule.
   - Requires authentication via `authClinic` middleware.
   - Expects parameters: `appointmentTime`.
   - Creates a new appointment associated with the specified doctor ID.
   - Saves the new appointment to the database.
   - Adds the appointment to the doctor's appointments array.
   - Returns the newly added appointment.
5. **POST /api/doctors/search-doctors**
   - Allows you to search doctors with keywords + location
   - Displays doctors matching query, also clinics that match the queries
   - Filter by rating and specialty

## These routes handle various operations related to doctors, including adding, deleting, updating doctors, and managing their appointments.

Here are the API calls defined in the `notificationsRoutes.js` file:

1. **GET /api/notifications/patient-notifications**

   - Fetches notifications for a patient.
   - Requires authentication via `authPatient` middleware.
   - Retrieves notifications where the recipient is the current patient.
   - Sorts notifications by date created in descending order.
   - Returns the fetched notifications.

2. **GET /api/notifications/clinic-notifications**

   - Fetches notifications for a clinic.
   - Requires authentication via `authClinic` middleware.
   - Retrieves notifications where the recipient is the current clinic.
   - Sorts notifications by date created in descending order.
   - Returns the fetched notifications.

3. **PATCH /api/notifications/read-notification/:notificationId**
   - Marks a notification as read.
   - Requires authentication via either `authPatient` or `authClinic` middleware.
   - Expects parameter `notificationId` for the notification to mark as read.
   - Updates the notification's `read` field to `true`.
   - Returns the updated notification.

## These routes handle fetching notifications for patients and clinics, as well as marking notifications as read.

Here are the API calls defined in the `reviewRoutes.js` file:

1. **POST /api/reviews/post/:doctorId**
   - Posts a review for a specific doctor.
   - Requires authentication via `authPatient` middleware.
   - Expects parameters:
     - `doctorId`: The ID of the doctor for whom the review is being posted.
   - Expects request body containing:
     - `rating`: The rating given to the doctor.
     - `text`: The review text (optional, limited to 500 characters).
     - `appointmentId`: The ID of the appointment associated with the review.
   - Checks if the review text exceeds the maximum character limit.
   - Checks if a review already exists for the appointment.
   - Creates a new review and saves it to the database.
   - Updates the doctor's rating based on the new review.
   - Updates the average rating for the doctor's clinic.
   - Returns the created review.

This route handles posting reviews for doctors and updating their ratings accordingly.
