import React, { useState } from 'react';
import '../styles/doctorprofile.css'; // Make sure to create a CSS file with this name
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Card, Avatar, Typography, Rate, DatePicker, Button, Menu, Dropdown } from 'antd';
import * as ClinicPage from './clinicpage.js';
import DoctorImage from '../doctor-img.png';

const { Title, Paragraph, Text } = Typography;
// Main component for Clinic Profile
const DoctorProfile = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const doctorInfo = {
    name: 'Dr. Charlotte Lloyd',
    specialty: 'Dentist, Female',
    qualifications: 'Bachelor Of Dental Surgery (BDS)',
    bio: 'My interest in dentistry began with my desire to listen to people...',
    languages: ['English', 'Arabic'],
    rating: 4.5
  };

  // Placeholder function to simulate fetching available time slots
  const fetchTimeSlots = (date) => {
    // Simulate fetching time slots
    setTimeSlots(['10:30', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00']);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    fetchTimeSlots(date);
  };

  const bookAppointment = (timeSlot) => {
    // Handle the booking logic here
    console.log(`Booked an appointment on ${selectedDate.format('YYYY-MM-DD')} at ${timeSlot}`);
  };

  const profileContent = (
    <>
      <Paragraph>{doctorInfo.bio}</Paragraph>
    </>
  );

  const appointmentContent = (
   <>
   <DatePicker onChange={onDateChange} />
   <div className="time-slots-container">
     {timeSlots.map((time, index) => (
       <Button key={index} className="time-slot-button" onClick={() => bookAppointment(time)}>
         {time}
       </Button>
     ))}
   </div>
   </>
 );

  const reviewsContent = (
    <>
      {/* Your reviews content here */}
    </>
  );
  return (
    <div className="clinic-profile-container">
      <ClinicPage.TopBar />
      <ClinicInfo doctorInfo={doctorInfo} />
      <Tabs />
      <ContentSection title="Profile" id='profile' content={profileContent}/>
      <ContentSection title="Schedule Appointment" id='doctors' content={appointmentContent}/>
      <ContentSection title="Reviews" id='reviews'/>
    </div>
  );
};




// Clinic information with image, name, address, and phone number
const ClinicInfo = ({ doctorInfo }) => (
  <div className="clinic-info">
    <img className='hospitalImage' src={DoctorImage} alt="Image of Doctor" />
    <div className="clinic-details">
      <h1 className='name' >{doctorInfo.name}</h1>
      <Rate disabled defaultValue={doctorInfo.rating} style={{ color: '#fadb14', fontSize: '16px' }} />
      <p className='info'>{doctorInfo.specialty}</p>
      <p className='info'>Languages: {doctorInfo.languages.join(', ')}</p>
    </div>
  </div>
);

// Tabs for profile sections
const Tabs = () => (
  <div className="tabs">
  <a href="#profile" className="tab">Profile</a>
  <a href="#doctors" className="tab">Appointment</a>
  <a href="#reviews" className="tab">Reviews</a>
  </div>
);

// Content sections for Profile, Doctors, and Reviews
const ContentSection = ({ title, id, content }) => (
  <div className="content-section" id={id}>
    <h2>{title}</h2>
    <div className="content-box">{content}</div>
  </div>
);

export default DoctorProfile;
