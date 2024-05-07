import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Checkbox, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/RegisterStyles.css";

const ClinicRegistration = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submittedValues, setSubmittedValues] = useState(null);

    const onFinishHandler = async (values) => {
        console.log("Form submitted with values:", values);
        setSubmittedValues(values); // Save the submitted values to state

        try {
            const response = await fetch('http://localhost:5000/api/auth/register/clinic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (response.status === 201) {
                message.success('Clinic registered successfully');
                navigate('/login-clinic');
            } else {
                message.error('Registration failed: ' + data.message);
            }
        } catch (err) {
            message.error('error: ' + err.message);
        }
    };

    return (
        <Row justify="center" className="form-container">
            <Col xs={24} sm={18} md={12} lg={8}>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinishHandler}
                >
                    <Form.Item
                        name="name"
                        label="Clinic Name"
                        rules={[{ required: true, message: 'Please input your clinic name!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Clinic Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, type: 'email', message: 'Please input your email!' }]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email Address" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        name="neighborhood"
                        label="Neighborhood"
                        rules={[{ required: true, message: 'Please select your neighborhood!' }]}
                    >
                        <Select placeholder="Select your neighborhood">
                            {["Al Bateen", "Al Khalidiyah", "Al Maryah Island", "Al Mushrif", "Al Nahyan",
                              "Al Reem Island", "Al Shamkha", "Khalifa City", "Masdar City",
                              "Mohammed Bin Zayed City", "Saadiyat Island", "Yas Island"].map(n => (
                                <Select.Option key={n} value={n}>{n}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item 
                        name="agreement" 
                        valuePropName="checked"
                        rules={[{ 
                            required: true,
                            message: 'You must accept the terms and conditions'
                        }]}
                    >
                        <Checkbox>I agree to the <a href="#">terms and conditions</a></Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>Register</Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'center' }}>
                            Already have an account? <Link to="/login-clinic">Log in</Link>
                        </div>
                    </Form.Item>
                </Form>
            </Col>

            {submittedValues && (
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <h2>Submitted Values</h2>
                    <p><strong>Name:</strong> {submittedValues.name}</p>
                    <p><strong>Email:</strong> {submittedValues.email}</p>
                    <p><strong>Neighborhood:</strong> {submittedValues.neighborhood}</p>
                </div>
            )}
        </Row>
    );
};

export default ClinicRegistration;
