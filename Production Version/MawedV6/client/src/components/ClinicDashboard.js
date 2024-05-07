import React, { useEffect, useState } from 'react';
import { message, Button, Table, Input, Space, Card } from 'antd';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ClinicDashboard = () => {
    const [clinicData, setClinicData] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]);

    useEffect(() => {
        const fetchClinicData = async () => {
            const token = localStorage.getItem('clinicToken');
            console.log("Token: ", token);

            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/dashboard/clinic', {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        setClinicData(data);
                        setFilteredDoctors(data.doctors || []);
                    } else {
                        message.error('Failed to fetch clinic data: ' + data.message);
                    }
                } catch (err) {
                    message.error('Failed to fetch clinic data');
                }
            }
        };

        fetchClinicData();
    }, []);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        const filtered = clinicData.doctors.filter(doctor =>
            doctor.name.toLowerCase().includes(value) ||
            doctor.specialty.toLowerCase().includes(value)
        );
        setFilteredDoctors(filtered);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Specialty',
            dataIndex: 'specialty',
            key: 'specialty'
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link">
                    <Link to={`/manage-doctor/${record._id}`}>Manage Doctor <SettingOutlined /></Link>
                </Button>
            )
        }
    ];

    if (!clinicData) return <div>Loading profile...</div>;

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Input placeholder="Search doctors..." onChange={handleSearch} />
                <Button type="primary" icon={<PlusOutlined />}>
                    <Link to="/clinic/dashboard/add-doctor" style={{ color: 'white' }}>Add Doctor</Link>
                </Button>
                <Table dataSource={filteredDoctors} columns={columns} rowKey="_id" />
            </Space>
            <div>
                <h1>Clinic Profile</h1>
                <p><strong>Name:</strong> {clinicData.name}</p>
                <p><strong>Email:</strong> {clinicData.email}</p>
                <p><strong>Neighborhood:</strong> {clinicData.neighborhood}</p>
            </div>
        </Card>
    );
};

export default ClinicDashboard;
