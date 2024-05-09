import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Table, Button } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AdminHome.css';

const { Content, Footer } = Layout;

const Admin = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/doctor/appointments`, {
        params: {
          doctorId: 'Dr. Charlotte Lloyd'
        }
      });
      const filteredAppointments = response.data.appointments.filter(appointment => appointment.status !== 'deleted');
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const clinicName = 'Cleveland Clinic Abu Dhabi';

  const handleDeleteAppointment = async (appointmentToDelete) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
    if (confirmDelete) {
      try {
        await axios.patch(`http://localhost:3001/doctor/appointments/${appointmentToDelete._id}`, {
          status: 'deleted'
        });
        const updatedAppointments = appointments.map(appointment =>
          appointment._id === appointmentToDelete._id ? { ...appointment, status: 'deleted' } : appointment
        ).filter(appointment => appointment.status !== 'deleted');
        setAppointments(updatedAppointments);
        window.alert('The appointment has been successfully deleted.');
      } catch (error) {
        console.error('Failed to delete appointment:', error);
        window.alert('An error occurred while deleting the appointment. Please try again.');
      }
    }
  };

  const handleMarkAsDone = async (appointmentToMarkDone) => {
    try {
      await axios.patch(`http://localhost:3001/doctor/appointments/${appointmentToMarkDone._id}`, {
        status: 'done'
      });
      const updatedAppointments = appointments.map(appointment =>
        appointment._id === appointmentToMarkDone._id ? { ...appointment, status: 'done' } : appointment
      );
      setAppointments(updatedAppointments);
      window.alert('The appointment has been marked as done.');
    } catch (error) {
      console.error('Failed to mark appointment as done:', error);
      window.alert('An error occurred while marking the appointment as done. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Patient Name',
      dataIndex: 'patient',
      key: 'patient'
    },
    {
      title: 'Contact Info',
      dataIndex: 'contactNumber',
      key: 'contactNumber'
    },
    {
      title: 'Insurance ID',
      dataIndex: 'insuranceId',
      key: 'insuranceId'
    },
    {
      title: 'Appointment Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Appointment Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'Doctor',
      dataIndex: 'doctor',
      key: 'doctor'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => {
        if (record.status === 'done') {
          return <CheckCircleOutlined style={{ color: 'green', fontSize: '20px' }} />;
        } else {
          return (
            <>
              <Button type="link" danger onClick={() => handleDeleteAppointment(record)}>Cancel</Button>
              <Button type="link" onClick={() => handleMarkAsDone(record)}>Completed</Button>
            </>
          );
        }
      }
    }
  ];

  return (
    <Layout style={{ backgroundColor: 'white' }}>
      <div className="t-bar-admin topbar-expanded-admin">
        <Link className="namea" to="/admin-home">
          <span className="app-name">Mawid</span>
        </Link>
        <div className="user-actions">
          <div className="icon">
            <Link to="/admin-login">
              <UserOutlined />{clinicName}<br /> Logout
            </Link>
          </div>
        </div>
      </div>
      <Content style={{ backgroundColor: 'white', padding: '0 50px', minHeight: 'calc(100vh - 134px)' }}>
        <h1 className="page-title">Scheduled Appointments</h1>
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

export default Admin;
