import React from 'react';
import { Form, Input, Button, Row, Col, Checkbox, DatePicker, message } from 'antd';
import axios from 'axios';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import "../styles/RegisterStyles.css";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const onFinishHandler = async (values) => {
    // Flatten values.date_of_birth to send as a string
    values.date_of_birth = values.date_of_birth.format('YYYY-MM-DD');
    try {
      const res = await axios.post('/api/v1/user/register', values);
      if (res.data.success) {
        message.success('Registered successfully');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || 'Registration failed, please try again.');
    }
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={12} md={8}>
        <div className="form-container" style={{ margin: "20px", padding: "25px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
          <Form
            layout="vertical"
            onFinish={onFinishHandler}
            style={{ maxWidth: 300, margin: "auto" }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone_number"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
            </Form.Item>
            <Form.Item
              label="Emirates ID"
              name="emirates_id"
              rules={[{ required: true, message: 'Please input your Emirates ID!' }]}
            >
              <Input prefix={<IdcardOutlined />} placeholder="Emirates ID" />
            </Form.Item>
            <Form.Item
              label="Date of Birth"
              name="date_of_birth"
              rules={[{ required: true, message: 'Please provide your date of birth!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')) },
              ]}
            >
              <Checkbox>
                I agree to the <a href="#">terms and conditions</a>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button className = 'register-button' type="primary" htmlType="submit" block>
                Register
              </Button>
            </Form.Item>
            <div style={{ marginTop: '10px', textAlign: 'center' }}>
              Already have an account? <Link to="/login">Log in</Link>
            </div>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Register;
