import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorProfile from "./pages/doctorProfile";
import Search from "./pages/search";
import logo from './logo.svg';
import './App.css';
import * as ClinicPage from './pages/clinicpage.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/doctorProfile" element={<DoctorProfile />} />
          <Route path="/clinicProfile" element={<ClinicPage.ClinicProfile />} />
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;
