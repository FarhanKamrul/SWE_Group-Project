import React from 'react';
import '../styles/clinicpage.css'; // Make sure to create a CSS file with this name
import hospitalImage from '../h-image.jpeg';
import { SearchOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons';
import * as ClinicPage from './clinicpage.js';
// Main component for Clinic Profile
const Search = () => {
  return (
      <ClinicPage.TopBar />
  );
};



export default Search;
