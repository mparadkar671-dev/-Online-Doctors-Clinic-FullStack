import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
    const tempUser = JSON.parse(localStorage.getItem("temp_user"));
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        doctorName: tempUser?.username || '',
        email: tempUser?.email || '',
        specialization: '',
        customSpecialization: '',
        experience: '',
        consultationFee: '',
        availability: '',
        contactNumber: tempUser?.phoneNumber || ''
    });

    const specialties = ["General Physician", "Cardiology", "Neurology", "Pediatrics", "Dermatology", "Orthopedics", "Other"];

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalSpecialization = profile.specialization === "Other" ? profile.customSpecialization : profile.specialization;
        
        const dataToSend = { ...profile, specialization: finalSpecialization };

        axios.post("http://localhost:8080/api/clinic/doctors/profile", dataToSend)
            .then(() => {
                alert("Professional Profile Created Successfully!");
                localStorage.removeItem("temp_user");
                navigate("/login");
            }).catch(err => alert("Error saving profile"));
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg p-4 border-0">
                <h2 className="text-primary text-center fw-bold mb-4">Complete Your Medical Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="fw-bold small">Specialization</label>
                            <select className="form-select" required onChange={(e) => setProfile({...profile, specialization: e.target.value})}>
                                <option value="">-- Select Specialty --</option>
                                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {profile.specialization === "Other" && (
                                <input className="form-control mt-2" placeholder="Type your specialization" required
                                       onChange={(e) => setProfile({...profile, customSpecialization: e.target.value})} />
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold small">Experience (Years)</label>
                            <input type="number" className="form-control" required onChange={(e) => setProfile({...profile, experience: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold small">Consultation Fee (₹)</label>
                            <input type="number" className="form-control" required onChange={(e) => setProfile({...profile, consultationFee: e.target.value})} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold small">Clinic Timings</label>
                            <input className="form-control" placeholder="e.g. 10 AM - 2 PM" required onChange={(e) => setProfile({...profile, availability: e.target.value})} />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-4 fw-bold py-2">Activate Profile</button>
                </form>
            </div>
        </div>
    );
};
export default DoctorProfile;