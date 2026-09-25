import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DoctorProfile from './components/DoctorProfile';
import ListDoctorComponent from './components/ListDoctorComponent';
import CreateDoctorComponent from './components/CreateDoctorComponent';
import ListPatientComponent from './components/ListPatientComponent';
import CreatePatientComponent from './components/CreatePatientComponent';
import ListAppointmentComponent from './components/ListAppointmentComponent';
import CreateAppointmentComponent from './components/CreateAppointmentComponent';
import LeaveApproval from './components/LeaveApproval';
import ApplyLeave from './components/ApplyLeave';
import PrescriptionView from './components/PrescriptionView';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MobileBottomNav from './components/MobileBottomNav';

function App() {
  const isAuthenticated = () => localStorage.getItem("user") !== null;

  return (
    <Router>
      <div className="app-layout">
        <PWAInstallPrompt />
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/complete-profile" element={<DoctorProfile />} />
            <Route path="/doctors" element={isAuthenticated() ? <ListDoctorComponent /> : <Navigate to="/login" />} />
            <Route path="/add-doctor" element={isAuthenticated() ? <CreateDoctorComponent /> : <Navigate to="/login" />} />
            
            <Route path="/patients" element={isAuthenticated() ? <ListPatientComponent /> : <Navigate to="/login" />} />
            <Route path="/add-patient" element={isAuthenticated() ? <CreatePatientComponent /> : <Navigate to="/login" />} />
            
            <Route path="/appointments" element={isAuthenticated() ? <ListAppointmentComponent /> : <Navigate to="/login" />} />
            <Route path="/book-appointment" element={isAuthenticated() ? <CreateAppointmentComponent /> : <Navigate to="/login" />} />
            <Route path="/prescription/:id" element={isAuthenticated() ? <PrescriptionView /> : <Navigate to="/login" />} />
            
            <Route path="/leaves" element={isAuthenticated() ? <LeaveApproval /> : <Navigate to="/login" />} />
            <Route path="/apply-leave" element={isAuthenticated() ? <ApplyLeave /> : <Navigate to="/login" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        <footer className="app-footer text-center d-none d-md-block">
          <div className="container">
            <span className="small text-muted">
              MediPulse Clinic Pro © {new Date().getFullYear()} • Enterprise Healthcare Practice Management
            </span>
          </div>
        </footer>
        <MobileBottomNav />
        <ToastContainer 
          position="top-right" 
          autoClose={3500} 
          hideProgressBar={false} 
          newestOnTop 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;