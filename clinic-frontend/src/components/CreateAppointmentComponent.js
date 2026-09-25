import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { toast } from 'react-toastify';
import BASE_URL from '../config/api';

const CreateAppointmentComponent = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [appointment, setAppointment] = useState({ 
        doctorId: '', 
        doctorName: '', 
        appointmentTime: '' 
    });
    const [isBooking, setIsBooking] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BASE_URL}/api/clinic/patients`)
            .then(res => setPatients(res.data || []))
            .catch(() => toast.error("Error fetching patient directory"));

        axios.get(`${BASE_URL}/api/clinic/doctors`)
            .then(res => setDoctors(res.data || []))
            .catch(() => toast.error("Error fetching doctor directory"));
    }, []);

    const handleBooking = (e) => {
        e.preventDefault();
        if (!selectedPatient) {
            Swal.fire("Patient Required", "Please choose a patient from Step 1.", "warning");
            return;
        }
        if (!appointment.doctorId) {
            Swal.fire("Doctor Required", "Please select a medical practitioner in Step 2.", "warning");
            return;
        }
        if (!appointment.appointmentTime) {
            Swal.fire("Time Required", "Please choose consultation date and time.", "warning");
            return;
        }

        const finalData = {
            ...appointment,
            patientId: selectedPatient.id,
            patientName: selectedPatient.patientName,
            mobile: selectedPatient.mobile || selectedPatient.contactNumber,
            reason: selectedPatient.sicknessDetails || 'General Consultation',
            status: 'CONFIRMED'
        };

        setIsBooking(true);
        Swal.fire({
            title: 'Confirming Consultation...',
            html: `Booking <strong>${selectedPatient.patientName}</strong> with <strong>Dr. ${appointment.doctorName}</strong>`,
            timer: 1200,
            timerProgressBar: true,
            didOpen: () => { Swal.showLoading(); }
        }).then(() => {
            axios.post(`${BASE_URL}/api/clinic/appointments`, finalData)
                .then(() => {
                    const mobileNum = selectedPatient.mobile || selectedPatient.contactNumber || '';
                    const whatsappMsg = `Hello ${selectedPatient.patientName}, your clinic appointment with Dr. ${appointment.doctorName} is confirmed for ${appointment.appointmentTime.replace('T', ' at ')}.`;
                    const waLink = `https://wa.me/91${mobileNum}?text=${encodeURIComponent(whatsappMsg)}`;

                    Swal.fire({
                        icon: 'success',
                        title: 'Appointment Scheduled!',
                        text: 'Consultation logged into calendar.',
                        showCancelButton: true,
                        confirmButtonColor: '#25D366',
                        cancelButtonColor: '#2563eb',
                        confirmButtonText: '📲 Send WhatsApp Alert',
                        cancelButtonText: 'View Schedule Desk'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(waLink, '_blank'); 
                        }
                        navigate("/appointments");
                    });
                })
                .catch(() => {
                    Swal.fire("Booking Failed", "Server error while saving appointment.", "error");
                })
                .finally(() => {
                    setIsBooking(false);
                });
        });
    };

    const filteredPatients = patients.filter(p => {
        const name = (p.patientName || "").toLowerCase();
        const phone = (p.mobile || p.contactNumber || "").toLowerCase();
        const query = searchTerm.toLowerCase();
        return name.includes(query) || phone.includes(query);
    });

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">Schedule Consultation</h3>
                    <p className="text-muted small mb-0">Link registered patients with specialist doctors for outpatient visits</p>
                </div>
                <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate('/appointments')}
                >
                    ← Back to Schedule
                </button>
            </div>
            
            <div className="row g-4">
                {/* STEP 1: PATIENT SELECTION */}
                <div className="col-12 col-lg-5">
                    <div className="med-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Step 1: Select Patient</h5>
                            <button 
                                className="btn btn-link btn-sm text-primary p-0 text-decoration-none"
                                onClick={() => navigate('/add-patient')}
                            >
                                + New Patient
                            </button>
                        </div>

                        <div className="position-relative mb-3">
                            <input 
                                type="text" 
                                className="med-input ps-5" 
                                placeholder="Search by name or mobile..." 
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

                        <div className="list-group rounded-3 border" style={{ maxHeight: 380, overflowY: 'auto' }}>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(p => (
                                    <button 
                                        key={p.id} 
                                        type="button"
                                        className={`list-group-item list-group-item-action p-3 border-0 border-bottom ${
                                            selectedPatient?.id === p.id ? 'bg-primary-subtle border-primary text-primary' : ''
                                        }`}
                                        onClick={() => setSelectedPatient(p)}
                                    >
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-bold">{p.patientName}</span>
                                            <span className="badge bg-light text-dark border">
                                                {p.age} yrs • {p.gender}
                                            </span>
                                        </div>
                                        <div className="small text-muted d-flex justify-content-between">
                                            <span>📱 {p.mobile || p.contactNumber || 'No phone'}</span>
                                            {p.bloodGroup && <span className="text-danger fw-semibold">{p.bloodGroup}</span>}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-muted small">
                                    No patients found matching your search.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* STEP 2 & 3: ASSIGN DOCTOR & TIME */}
                <div className="col-12 col-lg-7">
                    <div className="med-card p-4 h-100">
                        <form onSubmit={handleBooking}>
                            <h5 className="fw-bold mb-3">Step 2: Assign Doctor & Time Slot</h5>

                            {/* Selected Patient Banner */}
                            <div className="p-3 rounded-3 mb-4 border" 
                                 style={{ 
                                     background: selectedPatient ? 'var(--primary-light)' : '#f8fafc',
                                     borderColor: selectedPatient ? 'var(--primary)' : 'var(--border-subtle)'
                                 }}>
                                <span className="small text-muted fw-bold text-uppercase d-block mb-1">Selected Patient</span>
                                {selectedPatient ? (
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h5 className="fw-bold text-primary mb-0">{selectedPatient.patientName}</h5>
                                            <span className="small text-muted">Contact: {selectedPatient.mobile || selectedPatient.contactNumber}</span>
                                        </div>
                                        <span className="med-badge med-badge-emerald">Ready to Book</span>
                                    </div>
                                ) : (
                                    <span className="text-muted small">
                                        👈 Please click a patient in Step 1 to attach to this appointment.
                                    </span>
                                )}
                            </div>

                            <div className="med-input-group mb-3">
                                <label>Assign Specialist Doctor</label>
                                <select 
                                    className="med-input form-select" 
                                    required 
                                    value={appointment.doctorId}
                                    onChange={(e) => {
                                        const docId = parseInt(e.target.value);
                                        const d = doctors.find(doc => doc.id === docId);
                                        setAppointment({
                                            ...appointment, 
                                            doctorId: e.target.value, 
                                            doctorName: d?.doctorName || ''
                                        });
                                    }}
                                >
                                    <option value="">-- Choose Specialist Physician --</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>
                                            {d.doctorName?.startsWith('Dr.') ? d.doctorName : `Dr. ${d.doctorName}`} — {d.specialization} (Fee: ₹{d.consultationFee || 400})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="med-input-group mb-4">
                                <label>Appointment Date & Consultation Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="med-input" 
                                    required 
                                    value={appointment.appointmentTime}
                                    onChange={(e) => setAppointment({ ...appointment, appointmentTime: e.target.value })}
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="med-btn-primary w-100 py-3"
                                disabled={isBooking || !selectedPatient || !appointment.doctorId}
                            >
                                {isBooking ? "Confirming Booking..." : "Confirm Appointment & Generate Alert →"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointmentComponent;