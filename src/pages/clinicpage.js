import React from 'react';
import '../styles/clinicpage.css'; // Make sure to create a CSS file with this name
import hospitalImage from '../h-image.jpeg';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
// Main component for Clinic Profile
const ClinicProfile = () => {
  return (
    <div className="clinic-profile-container">
      <TopBar />
      <ClinicInfo />
      <Tabs />
      <ContentSection title="Profile" id='profile'/>
      <ContentSection title="Doctors" id='doctors' />
      <ContentSection title="Reviews" id='reviews'/>
    </div>
  );
};

// Top navigation bar
const TopBar = () => (
  <div className="top-bar">
    <a href='/'><span className="app-name">Mawid</span></a>
    <div className="user-actions">
      <a className='b2' href='/login'>Are you a practitioner?</a>
      <div className="icon">
        <a href='/login'><UserOutlined />Log in <br/> My Appointments</a>
      </div>
    </div>
  </div>
);


// Clinic information with image, name, address, and phone number
const ClinicInfo = () => (
  <div className="clinic-info">
    <img className='hospitalImage' src={hospitalImage} alt="Cleveland Clinic Abu Dhabi" />
    <div className="clinic-details">
      <h1 className='name' >Cleveland Clinic Abu Dhabi</h1>
      <p className='info'>59 Hamouda Bin Ali Al Dhaheri St - Al Maryah Island</p>
      <p className='info'>+971 800 22223</p>
    </div>
  </div>
);

// Tabs for profile sections
const Tabs = () => (
  <div className="tabs">
  <a href="#profile" className="tab">Profile</a>
  <a href="#doctors" className="tab">Doctors</a>
  <a href="#reviews" className="tab">Reviews</a>
  </div>
);

// Content sections for Profile, Doctors, and Reviews
const ContentSection = ({ title, id }) => (
  <div className="content-section" id={id}>
    <h2>{title}</h2>
    <div className="content-box"></div>
  </div>
);

export { ClinicProfile, TopBar };
