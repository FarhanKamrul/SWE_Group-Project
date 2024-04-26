// HomePage.js
import React from 'react';
import { Input, Layout, Select, Dropdown, Menu } from 'antd';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import '../styles/HomePage.css'; // Import external CSS file


const { Content, Footer } = Layout;
const { Option } = Select;

const languageMenu = (
  <Menu>
    <Menu.Item key="en">EN</Menu.Item>
    <Menu.Item key="ar">AR</Menu.Item>
  </Menu>
);

const TopBar = () => (
  <div className="t-bar">
    <a href='/'><span className="app-name">Mawid</span></a>
    <div className="user-actions">
      <a className='b2' href='./loginpage.js'>Are you a practitioner?</a>
      <div className="icon">
        <a href='./Login'><UserOutlined />Log in <br/> My Appointments</a>
      </div>
      </div>
      <Dropdown overlay={languageMenu} trigger={['click']}>
        <a href="#" onClick={e => e.preventDefault()} className="language-link">
          <GlobalOutlined />
        </a>
      </Dropdown>
    <div className="desc">
       <p>Book your next healthcare appointment in Abu Dhabi</p>
    </div>
    <div className="search">
      <Input.Group compact>
        <Select defaultValue="Select Location" style={{ width: '30%' }}>
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
          suffix={<a href='./Search'><SearchOutlined /></a>}
        />
      </Input.Group>
    </div>
  </div>
);

const Header = () => {
  return (
    <div className="header">
      <TopBar />
    </div>
  );
};



const FooterComponent = () => {
  return (
    <Footer style={{ backgroundColor: 'white' , textAlign: 'center', marginTop: '550px' }}>
      <div className="footer-links">
        <a href="#">About Us</a> | <a href="#">Privacy Policy</a>
      </div>
    </Footer>
  );
};

const HomePage = () => {
  return (
    <Layout style={{ backgroundColor: 'white'}}>
      <Header />
      <Content style={{ backgroundColor: 'white', textAlign: 'center' }}>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default HomePage;
