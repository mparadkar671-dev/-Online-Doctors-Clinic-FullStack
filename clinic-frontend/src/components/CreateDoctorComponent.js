import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DoctorService from '../services/DoctorService';

const CreateDoctorComponent = () => {
    const [doctor, setDoctor] = useState({
        doctorName: '',
        specialization: '',
        email: '', 
        phone: '', 
        experience: '', 
        consultationFee: '', 
        availability: '10:00 AM - 04:00 PM'
    });
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor({ ...doctor, [name]: value });
    };

    const saveDoctor = async (e) => {
        e.preventDefault();
        if (!doctor.doctorName.trim()) {
            toast.warn("Please enter doctor name.");
            return;
        }

        setIsSaving(true);
        try {
            await DoctorService.createDoctor(doctor);
            toast.success(`Dr. ${doctor.doctorName} registered successfully!`);
            navigate('/doctors');
        } catch (err) {
            toast.error("Failed to add doctor record.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="med-card shadow-lg p-4 p-md-5 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-bold mb-1">Add Medical Practitioner</h3>
                                <p className="text-muted small mb-0">Register a new specialist into the clinic directory</p>
                            </div>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate('/doctors')}
                            >
                                ← Back to Doctors
                            </button>
                        </div>

                        <form onSubmit={saveDoctor}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Full Name</label>
                                        <input 
                                            name="doctorName" 
                                            className="med-input" 
                                            placeholder="e.g. Dr. John Smith" 
                                            value={doctor.doctorName}
                                            onChange={handleChange} 
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Specialization</label>
                                        <input 
                                            name="specialization" 
                                            className="med-input" 
                                            placeholder="e.g. Cardiology, Neurology" 
                                            value={doctor.specialization}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Experience (Years)</label>
                                        <input 
                                            type="number" 
                                            name="experience" 
                                            className="med-input" 
                                            placeholder="e.g. 10"
                                            value={doctor.experience}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Consultation Fee (₹)</label>
                                        <input 
                                            type="number" 
                                            name="consultationFee" 
                                            className="med-input" 
                                            placeholder="e.g. 500"
                                            value={doctor.consultationFee}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Availability Hours</label>
                                        <input 
                                            name="availability" 
                                            className="med-input" 
                                            placeholder="10:00 AM - 04:00 PM" 
                                            value={doctor.availability}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Official Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            className="med-input" 
                                            placeholder="doctor@clinic.com"
                                            value={doctor.email}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Contact Phone</label>
                                        <input 
                                            name="phone" 
                                            className="med-input" 
                                            placeholder="10-digit phone"
                                            value={doctor.phone}
                                            onChange={handleChange} 
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-4 pt-2">
                                <button 
                                    type="button" 
                                    className="med-btn-secondary"
                                    onClick={() => navigate('/doctors')}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="med-btn-primary flex-grow-1"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving Doctor..." : "Save Doctor Record →"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDoctorComponent;