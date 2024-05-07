// src/App.js



import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import PatientRegistration from './components/PatientRegistration';
//import PatientLogin from './components/PatientLogin';
import 'antd'; // Import Ant Design styles
import ClinicLogin from './components/ClinicLogin';
import ClinicRegistration from './components/ClinicRegistration';
import ClinicDashboard from './components/ClinicDashboard';
import AddDoctorPage from './components/ClinicAddDoctor';




//If route is not defined, use the default route

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ClinicRegistration />} />
        <Route path='/clinic/register' element={<ClinicRegistration />} />
        <Route path='/clinic/login' element={<ClinicLogin />} />
        <Route path='/clinic/dashboard' element={<ClinicDashboard />} />
        <Route path='/clinic/dashboard/add-doctor' element={<AddDoctorPage />} />
        
      </Routes>
    </Router>
  );
}



/* 
        <Route path="/patient/register" element={<PatientRegistration />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path='/' element={<ClinicRegistration />} />
        <Route path="/clinic/register" element={<ClinicRegistration />} />
        <Route path="/clinic/login" element={<ClinicLogin />} />


*/

export default App;
