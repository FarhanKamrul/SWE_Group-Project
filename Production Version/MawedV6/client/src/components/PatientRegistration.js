// src/components/PatientRegistration.js

import React from 'react';
import { Form, Input, Button, DatePicker, message } from 'antd';
import axios from 'axios';

const PatientRegistration = () => {
  const onFinish = async (values) => {
    try {
      const formattedData = {
        ...values,
        dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD')
      };
      const response = await axios.post('http://localhost:5000/api/auth/register/patient', formattedData);
      if (response.status === 201) {
        message.success('Registration successful!');
      }
    } catch (error) {
      message.error(error.response.data.message || 'Failed to register.');
    }
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true, message: 'Please select your date of birth!' }]}>
        <DatePicker />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PatientRegistration;
