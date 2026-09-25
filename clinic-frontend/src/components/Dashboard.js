import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/api';
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    PieChart, 
    Pie, 
    Cell, 
    Legend 
} from 'recharts';
import AuthService from '../services/AuthService';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role;

    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        pendingLeaves: 0
    });

    const [recentAppointments, setRecentAppointments] = useState([]);
    const [specialtyData, setSpecialtyData] = useState([]);
    const weeklyTrend = [
        { day: 'Mon', appointments: 12, checkups: 8 },
        { day: 'Tue', appointments: 19, checkups: 14 },
        { day: 'Wed', appointments: 15, checkups: 10 },
        { day: 'Thu', appointments: 22, checkups: 18 },
        { day: 'Fri', appointments: 25, checkups: 20 },
        { day: 'Sat', appointments: 18, checkups: 15 },
        { day: 'Sun', appointments: 9, checkups: 6 }
    ];

    const COLORS = ['#2563eb', '#059669', '#0891b2', '#d97706', '#8b5cf6', '#e11d48'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docRes, patRes, apptRes, leaveRes] = await Promise.all([
                    axios.get(`${BASE_URL}/api/clinic/doctors`).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/api/clinic/patients`).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/api/clinic/appointments`).catch(() => ({ data: [] })),
                    axios.get(`${BASE_URL}/api/clinic/leaves/pending`).catch(() => ({ data: [] }))
                ]);

                const doctors = docRes.data || [];
                const patients = patRes.data || [];
                const appointments = apptRes.data || [];
                const leaves = leaveRes.data || [];

                setStats({
                    doctors: doctors.length,
                    patients: patients.length,
                    appointments: appointments.length,
                    pendingLeaves: leaves.length
                });

                // Recent appointments
                setRecentAppointments(appointments.slice(-5).reverse());

                // Calculate specialty breakdown from doctors
                const specMap = {};
                doctors.forEach(d => {
                    const sp = d.specialization || 'General';
                    specMap[sp] = (specMap[sp] || 0) + 1;
                });

                const chartData = Object.keys(specMap).map(key => ({
                    name: key,
                    value: specMap[key]
                }));

                setSpecialtyData(chartData.length > 0 ? chartData : [
                    { name: 'General Medicine', value: 4 },
                    { name: 'Cardiology', value: 2 },
                    { name: 'Pediatrics', value: 3 },
                    { name: 'Orthopedics', value: 2 }
                ]);

            } catch (error) {
                console.error("Error loading dashboard data", error);
            }
        };

        fetchData();
    }, []);

    const getRoleName = () => {
        if (role === 'ROLE_ADMIN') return 'Executive Administrator';
        if (role === 'ROLE_MANAGER') return 'Practice Operations Manager';
        if (role === 'ROLE_DOCTOR') return 'Medical Specialist';
        return 'Staff Member';
    };

    return (
        <div className="container py-4">
            {/* HERO BANNER */}
            <div className="med-card p-4 p-md-5 mb-4 position-relative overflow-hidden" 
                 style={{ 
                     background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0369a1 100%)',
                     color: '#ffffff'
                 }}>
                <div className="position-relative z-1">
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-2">
                        <span className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill fw-semibold">
                            🏥 MediPulse Clinical Workspace
                        </span>
                        <span className="small text-white text-opacity-75">
                            Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    <h1 className="fw-bold display-6 mb-2">
                        Welcome back, Dr./Staff {user?.username}!
                    </h1>
                    <p className="text-white text-opacity-80 fs-6 mb-0" style={{ maxWidth: 640 }}>
                        Logged in as <strong className="text-white">{getRoleName()}</strong>. Monitor clinic operations, patient flow, and upcoming consultations in real-time.
                    </p>
                </div>
            </div>

            {/* KPI STATS CARDS */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="med-card p-4 h-100 position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-semibold text-uppercase">Active Doctors</span>
                            <div className="p-2 rounded-3" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.doctors}</h2>
                        <span className="small text-success fw-semibold">● Medical Staff On Duty</span>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="med-card p-4 h-100 position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-semibold text-uppercase">Registered Patients</span>
                            <div className="p-2 rounded-3" style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.patients}</h2>
                        <span className="small text-success fw-semibold">● Clinical Directory</span>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="med-card p-4 h-100 position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-semibold text-uppercase">Appointments</span>
                            <div className="p-2 rounded-3" style={{ background: 'var(--cyan-light)', color: 'var(--cyan)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.appointments}</h2>
                        <span className="small text-primary fw-semibold">● Scheduled Consultations</span>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="med-card p-4 h-100 position-relative overflow-hidden">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-semibold text-uppercase">Staff Requests</span>
                            <div className="p-2 rounded-3" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{stats.pendingLeaves}</h2>
                        <span className="small text-warning fw-semibold">● Leaves Pending Approval</span>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE DATA VISUALIZATIONS (RECHARTS) */}
            <div className="row g-4 mb-4">
                {/* Weekly Trend Chart */}
                <div className="col-12 col-lg-8">
                    <div className="med-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-bold mb-0">Consultation Volume Trends</h5>
                                <span className="text-muted small">Daily appointments vs outpatient checkups</span>
                            </div>
                            <span className="med-badge med-badge-primary">This Week</span>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <AreaChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                                        </linearGradient>
                                        <linearGradient id="colorCheck" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ 
                                            background: '#ffffff', 
                                            borderRadius: 8, 
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                        }} 
                                    />
                                    <Area type="monotone" dataKey="appointments" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAppt)" name="Appointments" />
                                    <Area type="monotone" dataKey="checkups" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorCheck)" name="Completed Checkups" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Specialty Distribution Pie Chart */}
                <div className="col-12 col-lg-4">
                    <div className="med-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h5 className="fw-bold mb-0">Specialty Distribution</h5>
                                <span className="text-muted small">Practitioner disciplines</span>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={specialtyData}
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {specialtyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ 
                                            background: '#ffffff', 
                                            borderRadius: 8, 
                                            border: '1px solid #e2e8f0' 
                                        }} 
                                    />
                                    <Legend 
                                        layout="horizontal" 
                                        verticalAlign="bottom" 
                                        align="center"
                                        wrapperStyle={{ fontSize: '11px', paddingTop: 10 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="mb-4">
                <h5 className="fw-bold mb-3">Practice Quick Actions</h5>
                <div className="row g-3">
                    {/* DOCTOR SPECIFIC ACTIONS */}
                    {role === 'ROLE_DOCTOR' && (
                        <>
                            <div className="col-12 col-md-4">
                                <div className="med-action-card" onClick={() => navigate('/appointments')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                <line x1="16" y1="2" x2="16" y2="6" />
                                                <line x1="8" y1="2" x2="8" y2="6" />
                                                <line x1="3" y1="10" x2="21" y2="10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">My Consultations</h6>
                                            <p className="text-muted small mb-0">View scheduled patient queue for today</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="med-action-card" onClick={() => navigate('/complete-profile')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-success-subtle text-success">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Doctor Profile</h6>
                                            <p className="text-muted small mb-0">Update specialty, fee, & availability</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-4">
                                <div className="med-action-card" onClick={() => navigate('/apply-leave')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-warning-subtle text-warning">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Request Time Off</h6>
                                            <p className="text-muted small mb-0">Submit doctor leave application</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ADMIN / MANAGER SHARED ACTIONS */}
                    {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                        <>
                            <div className="col-12 col-md-3">
                                <div className="med-action-card" onClick={() => navigate('/book-appointment')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-primary-subtle text-primary">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Book Consultation</h6>
                                            <p className="text-muted small mb-0">Schedule patient slot</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="med-action-card" onClick={() => navigate('/add-patient')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-success-subtle text-success">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <line x1="19" y1="8" x2="19" y2="14" />
                                                <line x1="22" y1="11" x2="16" y2="11" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Register Patient</h6>
                                            <p className="text-muted small mb-0">New patient record</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="med-action-card" onClick={() => navigate('/leaves')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-warning-subtle text-warning">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="9 11 12 14 22 4" />
                                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Leave Approvals</h6>
                                            <p className="text-muted small mb-0">Review doctor time off</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-3">
                                <div className="med-action-card" onClick={() => navigate('/doctors')}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 rounded-circle bg-indigo-subtle text-indigo">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="9" cy="7" r="4" />
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Staff Directory</h6>
                                            <p className="text-muted small mb-0">Physicians & roles</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* RECENT APPOINTMENTS PREVIEW */}
            <div className="med-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 className="fw-bold mb-0">Recent Scheduled Consultations</h5>
                        <span className="text-muted small">Latest appointments logged into system</span>
                    </div>
                    <button 
                        className="btn btn-outline-primary btn-sm fw-semibold"
                        onClick={() => navigate('/appointments')}
                    >
                        View Full Schedule →
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="med-table">
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Assigned Doctor</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAppointments.length > 0 ? (
                                recentAppointments.map((appt) => (
                                    <tr key={appt.id}>
                                        <td className="fw-semibold">{appt.patientName}</td>
                                        <td>Dr. {appt.doctorName}</td>
                                        <td className="text-muted small">{appt.appointmentTime}</td>
                                        <td>
                                            <span className={`med-badge ${appt.status === 'CONFIRMED' ? 'med-badge-emerald' : 'med-badge-cyan'}`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button 
                                                className="btn btn-link btn-sm text-primary text-decoration-none p-0"
                                                onClick={() => navigate('/appointments')}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No recent appointments found. Use 'Book Consultation' to schedule one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;