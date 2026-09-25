import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from '../config/api';

const DoctorProfile = () => {
    const rawTempUser = localStorage.getItem("temp_user");
    const tempUser = rawTempUser ? JSON.parse(rawTempUser) : null;
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        doctorName: tempUser?.username || '',
        email: tempUser?.email || '',
        specialization: '',
        customSpecialization: '',
        experience: '',
        consultationFee: '',
        availability: '09:00 AM - 02:00 PM',
        contactNumber: tempUser?.phoneNumber || ''
    });

    const [isSaving, setIsSaving] = useState(false);

    const specialties = [
        "General Physician", 
        "Cardiology", 
        "Neurology", 
        "Pediatrics", 
        "Dermatology", 
        "Orthopedics", 
        "Psychiatry", 
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalSpecialization = profile.specialization === "Other" 
            ? profile.customSpecialization 
            : profile.specialization;

        if (!finalSpecialization) {
            toast.warn("Please specify your medical specialization.");
            return;
        }

        const dataToSend = { 
            ...profile, 
            specialization: finalSpecialization 
        };

        setIsSaving(true);
        try {
            await axios.post(`${BASE_URL}/api/clinic/doctors/profile`, dataToSend);
            toast.success("Medical profile activated! Please sign in with your credentials.");
            localStorage.removeItem("temp_user");
            navigate("/login");
        } catch (err) {
            toast.error("Error saving medical profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="med-card shadow-lg p-4 p-md-5 bg-white">
                        <div className="text-center mb-4">
                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-2"
                                 style={{ background: 'var(--emerald-light)', color: 'var(--emerald)' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                                    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                                    <circle cx="20" cy="10" r="2" />
                                </svg>
                            </div>
                            <h2 className="fw-bold mb-1">Doctor Onboarding</h2>
                            <p className="text-muted small">Configure your clinical practice details and patient consultation hours</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Practitioner Full Name</label>
                                        <input 
                                            type="text" 
                                            className="med-input" 
                                            placeholder="Dr. Full Name"
                                            value={profile.doctorName}
                                            onChange={(e) => setProfile({ ...profile, doctorName: e.target.value })}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Primary Specialization</label>
                                        <select 
                                            className="med-input form-select" 
                                            value={profile.specialization}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                        >
                                            <option value="">-- Select Specialty --</option>
                                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {profile.specialization === "Other" && (
                                            <input 
                                                className="med-input mt-2" 
                                                placeholder="Specify exact medical field" 
                                                value={profile.customSpecialization}
                                                required
                                                onChange={(e) => setProfile({ ...profile, customSpecialization: e.target.value })} 
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Experience (Years in Practice)</label>
                                        <input 
                                            type="number" 
                                            className="med-input" 
                                            min="0"
                                            placeholder="e.g. 8"
                                            value={profile.experience}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, experience: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Consultation Fee (₹ INR)</label>
                                        <input 
                                            type="number" 
                                            className="med-input" 
                                            min="0"
                                            placeholder="e.g. 500"
                                            value={profile.consultationFee}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, consultationFee: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Consultation Hours</label>
                                        <input 
                                            type="text" 
                                            className="med-input" 
                                            placeholder="e.g. 10:00 AM - 02:00 PM" 
                                            value={profile.availability}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, availability: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Direct Contact Phone</label>
                                        <input 
                                            type="tel" 
                                            className="med-input" 
                                            placeholder="10-digit mobile" 
                                            value={profile.contactNumber}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, contactNumber: e.target.value })} 
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="med-input-group mb-0">
                                        <label>Official Email</label>
                                        <input 
                                            type="email" 
                                            className="med-input" 
                                            placeholder="doctor@clinic.com" 
                                            value={profile.email}
                                            required 
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="med-btn-primary w-100 py-2 mt-4"
                                disabled={isSaving}
                            >
                                {isSaving ? "Activating Profile..." : "Complete Profile & Proceed →"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;