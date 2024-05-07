import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/RegisterStyles.css";

const ClinicLogin = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        //console.log("Login attempt with:", values);
        try {
            const response = await fetch('http://localhost:5000/api/auth/login/clinic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.status === 200) {
                message.success('Login successful');
                // Store token in local storage or in memory depending on your security requirements
                localStorage.setItem('clinicToken', data.token);
                localStorage.setItem('clinicId', data.clinic._id);
                navigate('/clinic/dashboard');
            } else {
                message.error('Login failed: ' + data.message);
            }
        } catch (err) {
            message.error('Login failed, please try again.');
        }
    };

    return (
        <Row justify="center" className="form-container">
            <Col xs={24} sm={18} md={12} lg={8}>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please enter your email!' }]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Login</Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            Don't have an account? <Link className="login-link" to="/clinic/register">Register now</Link>
                        </div>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};

export default ClinicLogin;
