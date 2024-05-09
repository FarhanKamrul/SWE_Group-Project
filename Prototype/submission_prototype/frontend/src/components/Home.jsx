import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { Input, Layout, Select, Dropdown, Menu } from 'antd';
import axios from 'axios';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import './HomePage.css'; // Import external CSS file
import * as ClinicPage from './clinicpage';
import * as DoctorPage from "./doctorProfile";

const { Content, Footer } = Layout;
const { Option } = Select;



const TopBar = () => {

  const [searchClicked, setSearchClicked] = React.useState(false);
  const handleSearchClick = () => {
    // Update state to indicate that search button is clicked
    setSearchClicked(true);
    // Implement your search logic here

  };


  return (
    <div className={`t-bar ${searchClicked ? 'topbar-expanded' : ''}`}>
      <a className='namea' href='/'><span className="app-name">Mawid</span></a>
      <div className="user-actions">
        <a className='b2' href='/admin-login'>Are you a practitioner?</a>
        <div className="icon">
          <a href='./Login'><UserOutlined />Log in <br/> My Appointments</a>
        </div>
      </div>

      <div className="desc" style={{ display: searchClicked ? 'none' : 'block' }}>
         <p>Book your next healthcare appointment in Abu Dhabi</p>
      </div>
      <div className={`search ${searchClicked ? 'search-clicked' : ''}`}>
        <Input.Group compact>
          <Select className='location' defaultValue="Select Location" style={{ width: '30%', height: '36px' }}>
            <Option value="al_khalidiyah">Al Khalidiyah</Option>
            <Option value="al_maryah_island">Al Maryah Island</Option>
            <Option value="al_reem_island">Al Reem Island</Option>
            <Option value="yas_island">Yas Island</Option>
            <Option value="saadiyat_island">Saadiyat Island</Option>
            <Option value="al_ryiadh">Al Riyiadh</Option>
            <Option value="madinat_zayed">Madinat Zayed</Option>
          </Select>
          <Input
            style={{ width: '60%', height: '36px' }}
            className='specific'
            placeholder="Search doctors, clinics, hospitals"
            suffix={<button className='searchb' onClick={handleSearchClick}><SearchOutlined /></button>}
          />
        </Input.Group>
      </div>
    </div>
  );
};






const Home = () => {
  const [searchClicked, setSearchClicked] = React.useState(false);
  const [location, setLocation] = useState();
  const [specific, setSpecific] = useState();
  const ResultsInfo = [['clevelandClinicAbuDhabi'], ['doctorProfile']];
  const handleLocationChange = (value) => {
    setLocation(value); // Update location state with selected value
    //setSearchClicked(false);
  };


  const handleSearchClick = (event) => {
    // Update state to indicate that search button is clicked
    setSearchClicked(true);
    event.preventDefault();
    axios.post( 'http://localhost:3001/searchClinic', {location, specific})
    .then(result => {
        console.log(result);
        if(result.data.message === "Success"){
            //alert('Search successful!' + JSON.stringify(result.data.user));
            const results = result.data.user;
        }
        else{
            
        }
    })
    .catch(err => console.log(err));


  };


  //const isClinicInfoAvailable = (location === "al_maryah_island" || location === undefined) && (searchClicked) && (specific.includes('Cleveland') || specific === undefined);
  const isClinicInfoAvailable = (location === "al_maryah_island" || location === undefined) && (searchClicked);
  const isDoctorInfoAvailable = (location === "al_maryah_island" || location === undefined) && (searchClicked);
  const isClinicInfoAvailablep = (specific === 'Cleveland' || specific === undefined || specific === '');
  const isDoctorInfoAvailablep = (specific === 'Charlotte' || specific === undefined || specific === 'Lloyd' || specific === '');
  let resultlen = 0; // Default to 0

// Check conditions and update resultlen accordingly

   if ((isClinicInfoAvailable && isClinicInfoAvailablep) &&  (isDoctorInfoAvailable  && isDoctorInfoAvailablep)){
  resultlen = 2;
} else if ((isClinicInfoAvailable && isClinicInfoAvailablep) ||  (isDoctorInfoAvailable  && isDoctorInfoAvailablep) ){
  resultlen = 1;
   }

  return (
    <Layout style={{ backgroundColor: 'white' }}>
    <div className={`t-bar ${searchClicked ? 'topbar-expanded' : ''}`}>
      <a className='namea' href='/'><span className="app-name">Mawid</span></a>
      <div className="user-actions">
        <a className='b2' href='/admin-login'>Are you a practitioner?</a>
        <div className="icon">
          <a href='./Login'><UserOutlined />Log in <br/> My Appointments</a>
        </div>
      </div>

      <div className="desc" style={{ display: searchClicked ? 'none' : 'block' }}>
         <p>Book your next healthcare appointment in Abu Dhabi</p>
      </div>
      <div className={`search ${searchClicked ? 'search-clicked' : ''}`}>
        <Input.Group compact>
          <Select onChange={handleLocationChange} className='location' type='location' defaultValue="Select Location" style={{ width: '30%', height: '36px' }}>
            <Option value="al_khalidiyah">Al Khalidiyah</Option>
            <Option value="al_maryah_island">Al Maryah Island</Option>
            <Option value="al_reem_island">Al Reem Island</Option>
            <Option value="yas_island">Yas Island</Option>
            <Option value="saadiyat_island">Saadiyat Island</Option>
            <Option value="al_ryiadh">Al Riyiadh</Option>
            <Option value="madinat_zayed">Madinat Zayed</Option>
          </Select>
          <Input
            style={{ width: '60%', height: '36px' }}
            type='specific'
            className='specific'
            placeholder="Search doctors, clinics, hospitals"
            onChange={(event) => setSpecific(event.target.value)}
            suffix={<button className='searchb' onClick={handleSearchClick}><SearchOutlined /></button>}
          />
        </Input.Group>
      </div>
    </div>
      <Content style={{ marginTop: '230px', backgroundColor: 'white', textAlign: 'center', minHeight: 'calc(100vh - 134px)' }}>
        <div>
          <h2 className="resultslen"> {resultlen} Results</h2>
        </div>
        {isClinicInfoAvailable && isClinicInfoAvailablep && <ClinicPage.ClinicInfo />}
        {isDoctorInfoAvailable && isDoctorInfoAvailablep && <DoctorPage.ClinicInfo/>}

      </Content>
      <Footer style={{ backgroundColor: 'white', textAlign: 'center', marginTop: '550px' }}>
        <div className="footer-links">
          <a href="#">About Us</a> | <a href="#">Privacy Policy</a>
        </div>
      </Footer>
    </Layout>
  );
};

export default Home;
