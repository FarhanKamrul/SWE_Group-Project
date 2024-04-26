import React from 'react';
import { Form, Input, Button, Row, Col, Checkbox, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import "../styles/RegisterStyles.css"; // Ensure you have corresponding CSS for custom styles
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values');
    try {
      const response = await axios.post('/api/v1/user/login', values);
      console.log('Login successful:', response.data);
      message.success('Login successful');
      navigate('/'); // Adjust this route to where you want users to go post-login
    } catch (error) {
      console.error('Login failed:', error.response || error);
      message.error(error.response?.data.message || 'Login failed, please try again.');
    }
  };



  const handleRegisterRedirect = () => {
    navigate('/register'); // Make sure this route matches your router configuration
  };

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <div className="login-form-container" style={{padding: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <Form
            name="login_form"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Email!',
                  type: 'email'
                }
              ]}
            >
              <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input your Password!'
                }
              ]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" block>
                Log in
              </Button>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Checkbox>Remember me</Checkbox>
                <a href="#" onClick={() => navigate('/forgot-password')}>Forgot password</a>
              </div>
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                Don’t have an account? <a href="#" onClick={handleRegisterRedirect}>Register now!</a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
