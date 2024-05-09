import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Table, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { DeleteOutlined } from '@ant-design/icons';
import { useUser } from './UserContext';
import './AdminHome.css'; // Import external CSS file

const { Content, Footer } = Layout;
const appointments = [{patient: 'john doe', date: '7/5/2024', time: '9:30 to 10', doctor: 'charlotte'}, {patient: 'john doe 2', date: '8/5/2024', time: '9:30 to 10:30', doctor: 'charlotte'}]
const TopBarAdmin = () => {
  const {userName} = useUser();
  return (
    <div className="t-bar-admin topbar-expanded-admin">
      <Link className="namea" to="/admin-home">
        <span className="app-name">Mawid</span>
      </Link>
      <div className="user-actions">
        <a className="b2" href="/admin-login">
        My Patients
        </a>
        <a className="b2" href="/admin-login">
        Add Appointment Slots
        </a>
        <div className="icon">
          <Link to="/admin-login">
            <UserOutlined /> {userName} <br /> Logout
          </Link>
        </div>
      </div>

    </div>
  );
};



const AdminP = () => {
  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patient',
      key: 'patient'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Doctor Name',
      dataIndex: 'doctor',
      key: 'doctor'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleDeleteAppointment(record)}>Delete</Button>
      )
    }
  ];
  const handleDeleteAppointment = (appointmentToDelete) => {
    // Implement deletion logic here
    console.log('Deleting appointment:', appointmentToDelete);
  };
  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <TopBarAdmin/>
      <Content style={{ backgroundColor: 'white', padding: '0 50px', minHeight: 'calc(100vh - 134px)' }}>
        <h1 className="page-title">My Appointments</h1>
        <Table dataSource={appointments} columns={columns} pagination={false} />
      </Content>
      <Footer style={{ backgroundColor: 'white', textAlign: 'center', marginTop: '550px' }}>
        <div className="footer-links">
          <a href="#">About Us</a> | <a href="#">Privacy Policy</a>
        </div>
      </Footer>
    </Layout>
  );
};

export default AdminP;
