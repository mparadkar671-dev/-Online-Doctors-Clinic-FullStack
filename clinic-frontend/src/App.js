import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import DoctorProfile from './components/DoctorProfile';
import ListDoctorComponent from './components/ListDoctorComponent';
import ListPatientComponent from './components/ListPatientComponent';
import CreatePatientComponent from './components/CreatePatientComponent';
import ListAppointmentComponent from './components/ListAppointmentComponent';
import CreateAppointmentComponent from './components/CreateAppointmentComponent';
import LeaveApproval from './components/LeaveApproval';
import ApplyLeave from './components/ApplyLeave';

function App() {
  const isAuthenticated = () => localStorage.getItem("user") !== null;

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/complete-profile" element={<DoctorProfile />} />
          <Route path="/doctors" element={<ListDoctorComponent />} />
          
          <Route path="/patients" element={<ListPatientComponent />} />
          <Route path="/add-patient" element={<CreatePatientComponent />} />
          
          <Route path="/appointments" element={<ListAppointmentComponent />} />
          <Route path="/book-appointment" element={<CreateAppointmentComponent />} />
          
          <Route path="/leaves" element={<LeaveApproval />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;