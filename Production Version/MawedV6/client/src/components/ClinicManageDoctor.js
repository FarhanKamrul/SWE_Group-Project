// Filename: ClinicManageDoctor.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const ManageDoctor = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    useEffect(() => {
        fetchDoctor();
    }, [doctorId]);

    const fetchDoctor = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/doctors/${doctorId}`);
            setDoctor(response.data);
            setImageUrl(response.data.profilePicture);
            setLoading(false);
        } catch (error) {
            message.error('Failed to fetch doctor details');
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            await axios.patch(`/api/doctors/update-doctor/${doctorId}`, formData);
            message.success('Doctor updated successfully');
        } catch (error) {
            message.error('Failed to update doctor');
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this URL from response in real world
            setImageUrl(info.file.response.url);
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <div>
            <h1>Manage Doctor</h1>
            <Form onFinish={onFinish} layout="vertical" initialValues={doctor}>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Specialty" name="specialty">
                    <Input />
                </Form.Item>
                <Form.Item label="Profile Picture">
                    <Upload
                        name="profilePicture"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/api/upload"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Update
                </Button>
            </Form>
        </div>
    );
};

export default ManageDoctor;
