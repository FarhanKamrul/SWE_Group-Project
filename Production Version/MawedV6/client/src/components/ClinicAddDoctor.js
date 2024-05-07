import React from 'react';
import { Form, Input, Button, Select, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';

// Sample lists for specialties and languages
const specialties = [
    'Allergy and Immunology', 'Anesthesiology', 'Dermatology', 'Diagnostic Radiology',
    'Emergency Medicine', 'Family Medicine', 'Internal Medicine', 'Medical Genetics',
    'Neurology', 'Nuclear Medicine', 'Obstetrics and Gynecology', 'Ophthalmology',
    'Pathology', 'Pediatrics', 'Physical Medicine and Rehabilitation', 'Preventive Medicine',
    'Psychiatry', 'Radiation Oncology', 'Surgery', 'Urology'
];

const languages = [
    'English', 'Spanish', 'Mandarin', 'French', 'German', 'Russian', 
    'Arabic', 'Portuguese', 'Bengali', 'Hindi', 'Japanese', 'Punjabi'
];

const AddDoctorPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/api/doctors/add-doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('clinicToken')}`
                },
                body: JSON.stringify(values)
            });
            if (response.ok) {
                message.success('Doctor added successfully!');
                navigate('/clinic/dashboard');
            } else {
                const errorData = await response.json();
                message.error('Failed to add doctor: ' + errorData.message);
            }
        } catch (error) {
            message.error('Network error: Failed to add doctor');
        }
    };

    return (
        <Card title="Add Doctor" bordered={false}>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the doctor’s name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="specialty" label="Specialty" rules={[{ required: true, message: 'Please select at least one specialty!' }]}>
                    <Select mode="multiple" placeholder="Select specialties">
                        {specialties.map(specialty => (
                            <Select.Option key={specialty} value={specialty}>{specialty}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select the doctor’s gender!' }]}>
                    <Select>
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="languagesSpoken" label="Languages Spoken" rules={[{ required: true, message: 'Please select at least one language!' }]}>
                    <Select mode="multiple" placeholder="Select languages">
                        {languages.map(language => (
                            <Select.Option key={language} value={language}>{language}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Doctor
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AddDoctorPage;
