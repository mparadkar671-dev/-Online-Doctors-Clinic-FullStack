import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ListAppointmentComponent = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        axios.get("http://localhost:8080/api/clinic/appointments")
            .then(res => {
                const all = res.data || [];
                // Doctors see their own, Admin/Manager see all
                if (role === 'ROLE_DOCTOR') {
                    setAppointments(all.filter(a => a.doctorName === user.username));
                } else {
                    setAppointments(all);
                }
            })
            .catch(err => console.error("Load Error", err));
    };

    const handleReschedule = (id) => {
        Swal.fire({
            title: 'Reschedule Appointment',
            html: `
                <div class="text-start">
                    <label class="fw-bold mb-1 small">Pick New Date & Time</label>
                    <input type="datetime-local" id="rescheduleTime" class="form-control">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Update Appointment',
            confirmButtonColor: '#0062ff',
            preConfirm: () => {
                const time = document.getElementById('rescheduleTime').value;
                if (!time) { Swal.showValidationMessage('Please select a time'); }
                return { newTime: time };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // EXPLICIT HEADERS AND JSON BODY
                axios.put(`http://localhost:8080/api/clinic/appointments/${id}/reschedule`, 
                    { newTime: result.value.newTime },
                    { headers: { 'Content-Type': 'application/json' } }
                )
                .then(() => {
                    Swal.fire('Success!', 'The appointment time has been updated.', 'success');
                    fetchAppointments();
                })
                .catch(err => {
                    console.error("Reschedule Error", err);
                    Swal.fire('Update Failed', 'Server error during rescheduling', 'error');
                });
            }
        });
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">📋 Appointment Schedule</h4>
                    {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                        <button className="btn btn-light btn-sm fw-bold" onClick={() => navigate('/book-appointment')}>+ Book New</button>
                    )}
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date/Time</th>
                                    <th>Status</th>
                                    {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(a => (
                                    <tr key={a.id}>
                                        <td className="fw-bold">{a.patientName}</td>
                                        <td>Dr. {a.doctorName}</td>
                                        <td>{a.appointmentTime}</td>
                                        <td>
                                            <span className={`badge ${a.status === 'CONFIRMED' ? 'bg-success' : 'bg-info'} rounded-pill`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                                            <td>
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleReschedule(a.id)}>Reschedule</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {appointments.length === 0 && <tr><td colSpan="5" className="text-center p-4 text-muted">No appointments found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListAppointmentComponent;