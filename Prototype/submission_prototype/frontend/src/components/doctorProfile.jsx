import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form, Input, Button, Card, Avatar, Typography, Rate } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns'; // Import from date-fns for date formatting
import './doctorprofile.css'; // Make sure to create a CSS file with this name
import DoctorImage from './doctor-img.png';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import { Layout, Row, Col, Menu, Dropdown } from 'antd';
import * as ClinicPage from './clinicpage.jsx';
import { Link } from "react-router-dom";
import axios from 'axios';
import Reviews from './test';

const { Meta } = Card;
const { Title, Paragraph, Text } = Typography;

// Define your doctorInfo object
const doctorInfo = {
  name: 'Dr. Charlotte Lloyd',
  specialty: 'Cardiology',
  qualifications: 'Bachelor Of Dental Surgery (BDS)',
  bio: 'Dr. Charlotte Lloyd is a seasoned cardiologist committed to delivering exceptional cardiovascular care. She earned her medical degree from Columbia University College of Physicians and Surgeons and completed her residency in Internal Medicine at NewYork-Presbyterian Hospital. Dr. Lloyd went on to pursue specialized fellowship training in Cardiovascular Disease at Mount Sinai Hospital, where she honed her expertise in cardiac diagnostics and treatment.',
  languages: ['English', 'Arabic'],
  rating: 4.5
};

const reviews = { User1: 'Great Doctor', User2: 'Excellent service!' };

const DoctorProfile = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [visible, setVisible] = useState(false); // State for controlling modal visibility
  const [patient, setPatient] = useState();
  const [contactNumber, setNumber] = useState();
  const [insuranceId, setInsurance] = useState();
  const [reason, setReason] = useState();
  const doctor = doctorInfo.name;
  const status = 'Requested';
  const date = selectedDate;
  const time = selectedTime || '';
  const clinic = 'Cleveland Clinic Abu Dhabi';


  const [reviewerName, setReviewerName] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(true);

  const handleReviewSubmit = () => {
    const newReview = {
      name: reviewerName,
      content: reviewContent,
      rating: reviewRating
    };

    axios.post('http://localhost:3001/reviews', newReview)
      .then(response => {
        console.log('Review submitted:', response.data);

        setReviewerName('');
        setReviewContent('');
        setReviewRating(0);
        setShowReviewForm(false);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };


  const reviewForm = (
    <Card key="add-review" style={{ margin: '16px 0' }}>
      <Meta
        title="Leave a Review"
        description={
          <Form layout="vertical">
            <Form.Item label="Your Name">
              <Input value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} />
            </Form.Item>
            <Form.Item label="Your Review">
              <Input.TextArea value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} />
            </Form.Item>
            <Form.Item label="Rating">
              <Rate value={reviewRating} onChange={(value) => setReviewRating(value)} />
            </Form.Item>
            <Button type="primary" onClick={handleReviewSubmit}>
              Leave Review
            </Button>
          </Form>
        }
      />
    </Card>
  );

  const handleDateChange = (date) => {
    //setSelectedDate(date); // Update selectedDate state when date changes
    if (date) {
    const formattedDate = formatDate(date); // Format date here
    setSelectedDate(formattedDate);
    // Now you can use `formattedDate` for further processing or saving
  } else {
    setSelectedDate(null);
  }
  };

  const formatDate = (date) => {
  // Format date as dd-MM-yyyy
  //return `${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}-${date.getFullYear()}`;
  return new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
 day: '2-digit',
 year: 'numeric'
}).format(date);
};

  const showModal = (timeSlot) => {
    setSelectedTime(timeSlot);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);

  };

  const handleFinish = (event) => {
    //console.log('Booking details:', { ...values, date: selectedDate, time: selectedTime });
    //event.preventDefault();

    axios.post( 'http://localhost:3001/booking', {clinic, doctor, date, time, patient, contactNumber, insuranceId, reason, status})
    .then(result => {
        console.log(result);
        if(result.data === 'Max'){
            alert("Only allowed one booking request!");

        }
        else{
            alert('Your appointment is booked successfully!');

        }

    })
    .catch(err => console.log(err));
    setVisible(false);

  };
  const appointmentForm = (
    <Modal
      title="Book Appointment"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Doctor's Name">
          <Input type='doctor' value={doctorInfo.name} disabled />
        </Form.Item>
        <Form.Item label="Date">
          <Input type='selectedDate' value={selectedDate} disabled />
        </Form.Item>
        <Form.Item label="Time">
          <Input type='time' value={selectedTime} disabled />
        </Form.Item>
        <Form.Item type='patient' label="Name" name="name" onChange={(event) => setPatient(event.target.value)} rules={[{ required: true, message: 'Please enter your name' }]}>
          <Input />
        </Form.Item>
        <Form.Item type='contactNumber' label="Contact Number" onChange={(event) => setNumber(event.target.value)} name="contactNumber" rules={[{ required: true, message: 'Please enter your contact number' }]}>
          <Input />
        </Form.Item>
        <Form.Item type='insuranceID' label="Insurance ID" onChange={(event) => setInsurance(event.target.value)} name="insuranceId">
          <Input />
        </Form.Item>
        <Form.Item type='reason' label="Reason for Appointment" onChange={(event) => setReason(event.target.value)} name="reason" rules={[{ required: true, message: 'Please enter the reason for your appointment' }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" >
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const appointmentContent = (
    <>
      <DatePicker type='selectedDate' dateFormat='dd-MM-yyyy' selected={selectedDate}  onChange={handleDateChange}   placeholderText="Select a date" required />
      <div className="time-slots-container">
        {['10:30', '12:30', '13:00', '13:30', '17:00', '17:30', '18:00'].map((time, index) => (
          <Button key={index} className="time-slot-button" onClick={() => showModal(time)}>
            {time}
          </Button>
        ))}
      </div>
      {appointmentForm}
    </>
  );

  return (
    <div className="clinic-profile-container">
      <ClinicPage.TopBar />
      <ClinicInfo />
      <Tabs />
      <ContentSection title="Profile" id="profile" content={<Paragraph className='bio' >{doctorInfo.bio}</Paragraph>} />
      <ContentSection className='cs' title="Schedule Appointment" id="doctors" content={appointmentContent} />
      <ContentSection
        title="Reviews"
        id="reviews"
        content={<Reviews />}
      />
    </div>
   );
   };


const ClinicInfo = () => (
  <a className="a1" href="./doctorProfile">
  <div className="clinic-info">
    <img className="hospitalImage" src={DoctorImage} alt="Image of Doctor" />
    <div className="clinic-details">
      <h1 className="name">{doctorInfo.name}</h1>
      <Rate disabled defaultValue={doctorInfo.rating} style={{ color: '#fadb14', fontSize: '16px' }} />
      <p className="info">{doctorInfo.specialty}</p>
      <p className="info">Languages: {doctorInfo.languages.join(', ')}</p>
    </div>
  </div>
  </a>
);

const Tabs = () => (
  <div className="tabs">
    <a href="#profile" className="tab">Profile</a>
    <a href="#doctors" className="tab">Appointment</a>
    <a href="#reviews" className="tab">Reviews</a>
  </div>
);

const ContentSection = ({ title, id, content }) => (
  <div className="content-section" id={id}>
    <h2>{title}</h2>
    <div  className='content-box' >{content}</div>
  </div>
);


export { DoctorProfile, ClinicInfo};
