import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';
import BASE_URL from '../config/api';

const ListAppointmentComponent = () => {
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const user = AuthService.getCurrentUser();
    const role = user?.role;

    const fetchAppointments = () => {
        setIsLoading(true);
        axios.get(`${BASE_URL}/api/clinic/appointments`)
            .then(res => {
                const all = res.data || [];
                if (role === 'ROLE_DOCTOR') {
                    setAppointments(all.filter(a => a.doctorName === user?.username));
                } else {
                    setAppointments(all);
                }
            })
            .catch(err => {
                console.error("Load Error", err);
                toast.error("Failed to load appointment schedule.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReschedule = (id, currentPatient) => {
        Swal.fire({
            title: 'Reschedule Appointment',
            html: `
                <div class="text-start">
                    <p class="small text-muted mb-2">Patient: <strong>${currentPatient || ''}</strong></p>
                    <label class="fw-bold mb-1 small">Choose New Date & Consultation Time</label>
                    <input type="datetime-local" id="rescheduleTime" class="form-control" />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Schedule',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#64748b',
            preConfirm: () => {
                const time = document.getElementById('rescheduleTime').value;
                if (!time) { 
                    Swal.showValidationMessage('Please select a date and time'); 
                }
                return { newTime: time };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`${BASE_URL}/api/clinic/appointments/${id}/reschedule`, 
                    { newTime: result.value.newTime },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                .then(() => {
                    toast.success("Appointment rescheduled successfully!");
                    fetchAppointments();
                })
                .catch(err => {
                    console.error("Reschedule Error", err);
                    toast.error("Server error while rescheduling appointment.");
                });
            }
        });
    };

    const filteredAppointments = appointments.filter(a => {
        const matchesStatus = statusFilter === "ALL" || (a.status || "CONFIRMED") === statusFilter;
        if (!matchesStatus) return false;
        if (!searchTerm.trim()) return true;

        const patient = (a.patientName || "").toLowerCase();
        const doctor = (a.doctorName || "").toLowerCase();
        const query = searchTerm.toLowerCase();
        return patient.includes(query) || doctor.includes(query);
    });

    return (
        <div className="container py-4">
            <div className="med-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">Appointment Schedule</h3>
                        <p className="text-muted small mb-0">
                            {role === 'ROLE_DOCTOR' 
                                ? 'Consultation appointments assigned to your schedule' 
                                : 'Master clinical appointment desk & patient bookings'}
                        </p>
                    </div>
                    {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                        <button 
                            className="med-btn-primary" 
                            onClick={() => navigate('/book-appointment')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Book New Appointment
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="row g-3 align-items-center mb-4">
                    <div className="col-12 col-md-6 col-lg-5">
                        <div className="position-relative">
                            <input 
                                type="text" 
                                className="med-input ps-5" 
                                placeholder="Search by patient or doctor name..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-7 d-flex justify-content-md-end gap-2">
                        {['ALL', 'CONFIRMED', 'RESCHEDULED'].map(status => (
                            <button
                                key={status}
                                type="button"
                                className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-light'} fw-semibold px-3`}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="med-table-wrapper">
                    <div className="table-responsive">
                        <table className="med-table">
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Scheduled Date & Time</th>
                                    <th>Status</th>
                                    <th>Prescription</th>
                                    {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                                        <th className="text-end">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={role === 'ROLE_DOCTOR' ? 5 : 6} className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p className="text-muted small mt-2 mb-0">Loading appointments...</p>
                                        </td>
                                    </tr>
                                ) : filteredAppointments.length > 0 ? (
                                    filteredAppointments.map(a => (
                                        <tr key={a.id}>
                                            <td>
                                                <div className="fw-bold">{a.patientName}</div>
                                                <span className="small text-muted">ID: APT-{a.id}</span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary fw-bold" 
                                                         style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                                        {(a.doctorName || 'D').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="fw-semibold">
                                                        {a.doctorName?.startsWith('Dr.') ? a.doctorName : `Dr. ${a.doctorName}`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-secondary small fw-medium">
                                                    {a.appointmentTime ? a.appointmentTime.replace('T', ' • ') : 'Pending Schedule'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`med-badge ${
                                                    a.status === 'CONFIRMED' ? 'med-badge-emerald' : 
                                                    a.status === 'RESCHEDULED' ? 'med-badge-amber' : 'med-badge-cyan'
                                                }`}>
                                                    {a.status || 'CONFIRMED'}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn btn-outline-secondary btn-sm px-2 py-1"
                                                    onClick={() => navigate(`/prescription/${a.id}`)}
                                                >
                                                    📄 View RX
                                                </button>
                                            </td>
                                            {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                                                <td className="text-end">
                                                    <button 
                                                        className="btn btn-outline-primary btn-sm px-2 py-1" 
                                                        onClick={() => handleReschedule(a.id, a.patientName)}
                                                    >
                                                        Reschedule
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={role === 'ROLE_DOCTOR' ? 5 : 6} className="text-center py-5 text-muted">
                                            No appointments match your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListAppointmentComponent;