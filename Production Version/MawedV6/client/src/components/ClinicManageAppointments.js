import React, { useEffect, useState } from 'react';
import { Form, Button, DatePicker, TimePicker, Table, message, Modal, Tag } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ManageAppointments = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`/api/appointments/doctor-upcoming-appointments/${doctorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('clinicToken')}` }
      });
      setAppointments(response.data);
    } catch (error) {
      message.error('Failed to fetch appointments');
    }
  };

  const addAppointment = async (values) => {
    const { date, time } = values;
    const appointmentTime = moment(date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm:ss'));

    try {
      await axios.post('/api/appointments/add-appointment', {
        doctorId,
        appointmentTime: appointmentTime.toISOString(),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('clinicToken')}` }
      });
      message.success('Appointment slot added successfully!');
      fetchAppointments(); // Refresh the list after adding
    } catch (error) {
      message.error(`Failed to add appointment: ${error.response?.data?.message || error.message}`);
    }
  };

  const updateAppointmentStatus = (appointmentId, status) => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined />,
      content: `This will ${status} the appointment.`,
      onOk() {
        return new Promise((resolve, reject) => {
          axios.patch(`/api/appointments/${status}-appointment/${appointmentId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('clinicToken')}` }
          }).then(response => {
            message.success(`Appointment ${status} successfully!`);
            fetchAppointments();
            resolve();
          }).catch(error => {
            message.error('Failed to update appointment status');
            reject();
          });
        });
      }
    });
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'appointmentTime',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        let color = status === 'Confirmed' ? 'green' : 'volcano';
        if (status === 'Requested') color = 'geekblue';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => updateAppointmentStatus(record._id, 'confirm')} disabled={record.status !== 'Requested'}>Confirm</Button>
          <Button onClick={() => updateAppointmentStatus(record._id, 'cancel')} disabled={record.status === 'Cancelled'} style={{ margin: '0 8px' }}>Cancel</Button>
          <Button onClick={() => updateAppointmentStatus(record._id, 'complete')} disabled={record.status !== 'Confirmed'}>Complete</Button>
        </>
      )
    }
  ];

  return (
    <div>
      <Form form={form} onFinish={addAppointment} layout="inline">
        <Form.Item name="date" rules={[{ required: true, message: 'Please select date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="time" rules={[{ required: true, message: 'Please select time!' }]}>
          <TimePicker format="HH:mm" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add Appointment Slot</Button>
        </Form.Item>
      </Form>
      <Table dataSource={appointments} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
};

export default ManageAppointments;
