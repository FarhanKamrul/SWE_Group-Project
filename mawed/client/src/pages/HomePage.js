import React from 'react';
import { Input, Row, Col, Select, Menu, Dropdown, Layout } from 'antd';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import 'antd';
import "../styles/HomePage.css"; // Make sure your CSS file has appropriate styles

const { Header, Footer, Content } = Layout;
const { Option } = Select;

const languageMenu = (
  <Menu>
    <Menu.Item key="en">EN</Menu.Item>
    <Menu.Item key="ar">AR</Menu.Item>
  </Menu>
);

const Homepage = () => {
  return (
    <Layout className="layout" style={{ minHeight: '100vh', background: '#e6f7ff' }}>
      <Header style={{ background: 'transparent', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
        <Dropdown overlay={languageMenu} trigger={['click']}>
          <a href="#" onClick={e => e.preventDefault()} style={{ marginRight: '20px' }}>
            <GlobalOutlined style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '16px' }} />
          </a>
        </Dropdown>
        <UserOutlined style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: '16px' }} />
      </Header>
      <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Input.Group compact style={{ display: 'flex', justifyContent: 'center' }}>
          <Select defaultValue = "Select Location" style={{ width: '30%' }}>
              <Option value="al_khalidiyah">Al Khalidiyah</Option>
              <Option value="al_maryah_island">Al Maryah Island</Option>
              <Option value="al_reem_island">Al Reem Island</Option>
              <Option value="yas_island">Yas Island</Option>
              <Option value="saadiyat_island">Saadiyat Island</Option>
              <Option value="al_ryiadh">Al Riyiadh</Option>
              <Option value="madinat_zayed">Madinat Zayed</Option>
            </Select>
          <Input
            style={{ width: '60%' }}
            placeholder="Search doctors, clinics, hospitals"
            suffix={<SearchOutlined />}
          />
        </Input.Group>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        <div className="footer-links">
          <a href="#">About Us</a> | <a href="#">Privacy Policy</a>
        </div>
      </Footer>
    </Layout>
  );
};

export default Homepage;
