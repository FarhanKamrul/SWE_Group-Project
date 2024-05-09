import React from 'react';
import './clinicpage.css'; // Make sure to create a CSS file with this name
import hospitalImage from './h-image.jpeg';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Card, Avatar, Typography, Rate, DatePicker, Button, Menu, Dropdown } from 'antd';
import * as DoctorPage from "./doctorProfile";
import Reviews from './test';

const { Meta } = Card;
const { Text } = Typography;

export const clinicInfo = {
  name: 'Cleveland Clinic Abu Dhabi',
  address: '59 Hamouda Bin Ali Al Dhaheri St - Al Maryah Island',
  phone: '+971 800 22223',
  bio: 'Cleveland Clinic Abu Dhabi is a leading healthcare facility in the UAE capital, recognized for its exceptional medical services and advanced technologies. As part of the renowned Cleveland Clinic network, it offers top-quality care across various specialties, emphasizing patient-centered excellence and innovation in healthcare.',
  rating: 4.5,
  doctors: 'Dr. Charlotte Lloyd',
  reviews: { User1: 'Great Clinic', User2: 'Excellent service!' }
};

const doctorsContent = (
  <>
    <DoctorPage.ClinicInfo className='test'/>
  </>
);

const ClinicProfile = () => {
  const reviewItems = Object.entries(clinicInfo.reviews).map(([name, comment]) => (
    <Card key={name} style={{ margin: '16px 0' }}>
      <Meta
        avatar={<Avatar icon={<UserOutlined />} />}
        title={name}
        description={<Text>{comment}</Text>}
      />
    </Card>
  ));

  return (
    <div className="clinic-profile-container">
      <TopBar />
      <ClinicInfo />
      <Tabs />
      <ContentSection className ='bio' title="Profile" id='profile' content={clinicInfo.bio} />
      <ContentSection title="Doctors" id='doctors' content={doctorsContent} />
      <ContentSection title="Reviews" id='reviews' content={<Reviews />} />
    </div>
  );
};

// Top navigation bar
const TopBar = () => (
  <div className="top-bar">
    <a href='/'><span className="app-name">Mawid</span></a>
    <div className="user-actions">
      <a className='b2' href='/admin-login'>Are you a practitioner?</a>
      <div className="icon">
        <a href='/login'><UserOutlined />Log in <br/> My Appointments</a>
      </div>
    </div>
  </div>
);

// Clinic information with image, name, address, and phone number
const ClinicInfo = () => (
  <a className="a1" href="./clevelandClinicAbuDhabi">
    <div className="clinic-info">
      <img className='hospitalImage' src={hospitalImage} alt="Cleveland Clinic Abu Dhabi" />
      <div className="clinic-details">
        <h1 className='name' >{clinicInfo.name}</h1>
        <Rate disabled defaultValue={clinicInfo.rating} style={{ color: '#fadb14', fontSize: '16px' }} />
        <p className='info'>{clinicInfo.address}</p>
        <p className='info'>{clinicInfo.phone}</p>
      </div>
    </div>
  </a>
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
const ContentSection = ({ title, id, content }) => (
  <div className="content-section" id={id}>
    <h2>{title}</h2>
    <div className="content-box">{content}</div>
  </div>
);



export { ClinicProfile, TopBar, ClinicInfo };
