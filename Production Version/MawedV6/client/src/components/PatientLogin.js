// src/components/PatientLogin.js

import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const PatientLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const onFinish = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login/patient', formData);
      if (response.data.token) {
        message.success('Login successful!');
      }
    } catch (error) {
      message.error(error.response.data.message || 'Login failed.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={onFinish}>
      <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
        <Input name="email" onChange={handleChange} />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password!' }]}>
        <Input.Password name="password" onChange={handleChange} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PatientLogin;
