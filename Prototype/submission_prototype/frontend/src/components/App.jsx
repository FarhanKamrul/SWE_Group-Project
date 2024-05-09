import Home from './Home';
import Login from './Login';
import Register from './Register';
import { UserProvider } from './UserContext';
import AdminLogin from './adminlogin';
import Reviews from './test';
import AdminHome from './admin';
import AdminP from './patients';
import * as ClinicPage from './clinicpage';
import * as DoctorPage from "./doctorProfile";
import {BrowserRouter, Routes, Route} from "react-router-dom";


function App() {

  return (
    <div style={{marginTop : '-3.5rem'}}>
      <BrowserRouter >
      <UserProvider>
        <Routes>
          <Route path="/" element ={<Home/>} />
          <Route path="/register" element ={<Register/>} />
          <Route path="/login" element ={<Login/>} />
          <Route path="/admin-login" element ={<AdminLogin/>} />
          <Route path="/admin-home" element ={<AdminHome/>}/>
          <Route path="/patients" element ={<AdminP/>} />
          <Route path="/home" element ={<Home/>} />
          <Route path="/doctorProfile" element={<DoctorPage.DoctorProfile />} />
          <Route path="/clevelandClinicAbuDhabi" element={<ClinicPage.ClinicProfile />} />
          <Route path="/reviews" element={<Reviews/>} />

        </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
