import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        pendingLeaves: 0
    });

    useEffect(() => {
        // Fetching Real-time statistics for the Dashboard
        const fetchData = async () => {
            try {
                const [docRes, patRes, apptRes, leaveRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/clinic/doctors"),
                    axios.get("http://localhost:8080/api/clinic/patients"),
                    axios.get("http://localhost:8080/api/clinic/appointments"),
                    axios.get("http://localhost:8080/api/clinic/leaves/pending")
                ]);

                setStats({
                    doctors: docRes.data.length,
                    patients: patRes.data.length,
                    appointments: apptRes.data.length,
                    pendingLeaves: leaveRes.data.length
                });
            } catch (error) {
                console.error("Error loading dashboard stats", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            {/* WELCOME BANNER */}
            <div className="p-5 mb-4 bg-white rounded-3 shadow-sm border-start border-primary border-5">
                <div className="container-fluid py-2">
                    <h1 className="display-6 fw-bold text-primary">Hello, {user?.username}!</h1>
                    <p className="fs-5 text-muted">
                        Welcome to your <span className="badge bg-info text-dark">{role?.replace("ROLE_", "")}</span> Dashboard. 
                        Today is {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.
                    </p>
                </div>
            </div>

            {/* STATISTICS ROW (Admin/Manager see all, Doctor sees relevant) */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card bg-primary text-white border-0 shadow-sm p-3">
                        <h6 className="text-uppercase small opacity-75">Total Doctors</h6>
                        <h2 className="fw-bold">{stats.doctors}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-success text-white border-0 shadow-sm p-3">
                        <h6 className="text-uppercase small opacity-75">Total Patients</h6>
                        <h2 className="fw-bold">{stats.patients}</h2>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card bg-info text-white border-0 shadow-sm p-3">
                        <h6 className="text-uppercase small opacity-75">Appointments</h6>
                        <h2 className="fw-bold">{stats.appointments}</h2>
                    </div>
                </div>
                {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                    <div className="col-md-3">
                        <div className="card bg-warning text-dark border-0 shadow-sm p-3">
                            <h6 className="text-uppercase small opacity-75">Pending Leaves</h6>
                            <h2 className="fw-bold">{stats.pendingLeaves}</h2>
                        </div>
                    </div>
                )}
            </div>

            {/* ACTION GRID */}
            <h4 className="fw-bold text-secondary mb-4">Management Quick Actions</h4>
            <div className="row g-4">
                
                {/* DOCTOR SPECIFIC ACTIONS */}
                {role === 'ROLE_DOCTOR' && (
                    <>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/complete-profile')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">🆔</div>
                                    <h5 className="fw-bold">Professional Profile</h5>
                                    <p className="text-muted small">Update your specialization, fees, and availability.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/appointments')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">👨‍⚕️</div>
                                    <h5 className="fw-bold">My Schedule</h5>
                                    <p className="text-muted small">Check your patient appointments for today.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/apply-leave')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">🏖️</div>
                                    <h5 className="fw-bold">Apply for Leave</h5>
                                    <p className="text-muted small">Request time off. Requires Manager approval.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ADMIN & MANAGER SHARED ACTIONS */}
                {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                    <>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/book-appointment')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">📅</div>
                                    <h5 className="fw-bold">Booking Desk</h5>
                                    <p className="text-muted small">Schedule or Reschedule patient appointments.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/add-patient')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">📝</div>
                                    <h5 className="fw-bold">Patient Entry</h5>
                                    <p className="text-muted small">Register new patients into the clinic system.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/leaves')} style={{cursor: 'pointer'}}>
                                <div className="card-body text-center p-4">
                                    <div className="fs-1 mb-2">✅</div>
                                    <h5 className="fw-bold">Approve Leaves</h5>
                                    <p className="text-muted small">Review and approve doctor leave requests.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ADMIN ONLY ACTIONS */}
                {role === 'ROLE_ADMIN' && (
                    <div className="col-md-4">
                        <div className="card h-100 shadow-sm border-0 action-card" onClick={() => navigate('/doctors')} style={{cursor: 'pointer'}}>
                            <div className="card-body text-center p-4 border-top border-primary border-4">
                                <div className="fs-1 mb-2">⚙️</div>
                                <h5 className="fw-bold">Staff Oversight</h5>
                                <p className="text-muted small">Monitor all registered doctors and staff records.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .action-card { transition: all 0.3s; }
                .action-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
            `}</style>
        </div>
    );
};

export default Dashboard;