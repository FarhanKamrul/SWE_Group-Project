import React, { useState } from 'react';
import { Layout, Row, Col, Card, Avatar, Typography, Rate, DatePicker, Button, Menu, Dropdown } from 'antd';
import { UserOutlined, GlobalOutlined } from '@ant-design/icons';
import 'antd';
import '../styles/DoctorProfilePage.css'

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const DoctorProfilePage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const doctorInfo = {
    name: 'Dr. Charlotte Lloyd',
    specialty: 'Dentist, Female',
    qualifications: 'Bachelor Of Dental Surgery (BDS)',
    bio: 'My interest in dentistry began with my desire to listen to people...',
    languages: ['English', 'Arabic'],
    rating: 4.5,
    profilePhoto: "https://source.unsplash.com/featured/?face", // Random photo from Unsplash
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

  // Language Dropdown Menu
  const languageMenu = (
    <Menu>
      <Menu.Item key="en">EN</Menu.Item>
      <Menu.Item key="ar">AR</Menu.Item>
    </Menu>
  );

  return (
    <Layout className="doctor-profile-layout">
      <Header className="header">
        <Dropdown overlay={languageMenu} placement="bottomRight">
          <GlobalOutlined style={{ fontSize: '16px', padding: '0 8px' }} />
        </Dropdown>
        <Avatar icon={<UserOutlined />} />
      </Header>
      <Content className="doctor-profile-content">
        <Row gutter={24}>
          <Col span={8}>
            <Card className="profile-card" bordered={false}>
              <Avatar size={128} src={doctorInfo.profilePhoto} />
              <Title level={3}>{doctorInfo.name}</Title>
              <Text type="secondary">{doctorInfo.specialty}</Text>
              <Rate disabled defaultValue={doctorInfo.rating} style={{ color: '#fadb14', fontSize: '16px' }} />
              <Paragraph>{doctorInfo.bio}</Paragraph>
              <Text>Languages: {doctorInfo.languages.join(', ')}</Text>
            </Card>
          </Col>
          <Col span={16}>
            <Card className="booking-card" title="Book an Appointment" bordered={false}>
              <DatePicker onChange={onDateChange} />
              <div className="time-slots-container">
                {timeSlots.map((time, index) => (
                  <Button key={index} className="time-slot-button" onClick={() => bookAppointment(time)}>
                    {time}
                  </Button>
                ))}
              </div>
            </Card>
            {/* Additional information such as reviews and ratings can be placed here */}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default DoctorProfilePage;
