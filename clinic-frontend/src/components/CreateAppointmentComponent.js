import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 

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
    
    const navigate = useNavigate();

    // 1. Fetch Patients and Doctors on Page Load
    useEffect(() => {
        axios.get("http://localhost:8080/api/clinic/patients")
            .then(res => setPatients(res.data || []))
            .catch(err => console.error("Error fetching patients", err));

        axios.get("http://localhost:8080/api/clinic/doctors")
            .then(res => setDoctors(res.data || []))
            .catch(err => console.error("Error fetching doctors", err));
    }, []);

    // 2. The Integrated Booking & Notification Logic
    const handleBooking = (e) => {
        e.preventDefault();
        if(!selectedPatient) return Swal.fire("Selection Required", "Please select a patient from the list on the left.", "warning");
        if(!appointment.doctorId) return Swal.fire("Selection Required", "Please assign a doctor to this patient.", "warning");

        const finalData = {
            ...appointment,
            patientId: selectedPatient.id,
            patientName: selectedPatient.patientName,
            mobile: selectedPatient.mobile,
            reason: selectedPatient.sicknessDetails,
            status: 'CONFIRMED'
        };

        // UI SIMULATION: Sending Notification
        Swal.fire({
            title: 'Processing Booking...',
            html: `Linking patient to Dr. ${appointment.doctorName}`,
            timer: 1500,
            timerProgressBar: true,
            didOpen: () => { Swal.showLoading() }
        }).then(() => {
            // CALL BACKEND
            axios.post("http://localhost:8080/api/clinic/appointments", finalData)
                .then(() => {
                    const whatsappMsg = `Hello ${selectedPatient.patientName}, your appointment at the Clinic is confirmed for ${appointment.appointmentTime}.`;
                    const waLink = `https://wa.me/91${selectedPatient.mobile}?text=${encodeURIComponent(whatsappMsg)}`;

                    Swal.fire({
                        icon: 'success',
                        title: 'Appointment Confirmed!',
                        text: 'WhatsApp notification link generated.',
                        showCancelButton: true,
                        confirmButtonColor: '#25D366',
                        confirmButtonText: 'Open WhatsApp Chat',
                        cancelButtonText: 'Back to List'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(waLink, '_blank'); 
                        }
                        navigate("/appointments");
                    });
                })
                .catch(err => Swal.fire("Error", "Internal Server Error during booking.", "error"));
        });
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <h2 className="text-primary fw-bold mb-4 text-center">🏥 Smart Appointment Booking</h2>
            
            <div className="row">
                {/* LEFT SIDE: SEARCH PATIENT */}
                <div className="col-md-5">
                    <div className="card shadow-sm p-3 mb-4 border-0 bg-white">
                        <label className="fw-bold mb-2 text-secondary">Step 1: Find Patient</label>
                        <input type="text" className="form-control mb-3" placeholder="Search by name..." 
                               onChange={(e) => setSearchTerm(e.target.value)} />
                        
                        <div style={{maxHeight: '350px', overflowY: 'auto'}} className="list-group border">
                            {patients.filter(p => p.patientName.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                                <button key={p.id} type="button"
                                    className={`list-group-item list-group-item-action ${selectedPatient?.id === p.id ? 'active bg-primary border-primary' : ''}`}
                                    onClick={() => setSelectedPatient(p)}>
                                    <div className="fw-bold">{p.patientName}</div>
                                    <small className={selectedPatient?.id === p.id ? 'text-white' : 'text-muted'}>
                                        {p.mobile} | {p.gender}
                                    </small>
                                </button>
                            ))}
                        </div>
                        {patients.length === 0 && (
                            <div className="alert alert-warning mt-3 small">
                                No patients found. Please register the patient first.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: ASSIGN DOCTOR & TIME */}
                <div className="col-md-7">
                    <div className="card shadow-lg p-4 border-0 bg-white">
                        <form onSubmit={handleBooking}>
                            <div className="mb-4">
                                <label className="fw-bold text-muted small text-uppercase">Patient Selected</label>
                                <input className="form-control bg-light fw-bold text-primary fs-5" 
                                       value={selectedPatient ? selectedPatient.patientName : "Waiting for selection..."} readOnly />
                            </div>

                            <div className="mb-3">
                                <label className="fw-bold text-secondary">Step 2: Assign Doctor</label>
                                <select className="form-select" required 
                                    onChange={(e) => {
                                        const d = doctors.find(doc => doc.id === parseInt(e.target.value));
                                        setAppointment({...appointment, doctorId: e.target.value, doctorName: d?.doctorName});
                                    }}>
                                    <option value="">-- Click to Select Specialist --</option>
                                    {doctors.map(d => (
                                        <option key={d.id} value={d.id}>Dr. {d.doctorName} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="fw-bold text-secondary">Step 3: Appointment Date & Time</label>
                                <input type="datetime-local" className="form-control" required 
                                    onChange={(e) => setAppointment({...appointment, appointmentTime: e.target.value})}/>
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow">
                                Finalize Booking & Notify Patient
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAppointmentComponent;