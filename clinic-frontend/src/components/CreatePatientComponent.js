import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePatientComponent = () => {
    const [patient, setPatient] = useState({
        patientName: '', age: '', gender: '', mobile: '', 
        bloodGroup: '', sicknessDetails: ''
    });
    const navigate = useNavigate();

    const handleSave = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/clinic/patients", patient)
            .then(() => {
                alert("Patient Registered Successfully!");
                navigate("/book-appointment"); // Go directly to booking
            });
    };

    return (
        <div className="container mt-4">
            <div className="card shadow border-0 p-4 col-md-8 offset-md-2">
                <h3 className="text-primary fw-bold mb-4">New Patient Entry</h3>
                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Full Name</label>
                            <input className="form-control" required onChange={(e)=>setPatient({...patient, patientName: e.target.value})}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Age</label>
                            <input type="number" className="form-control" required onChange={(e)=>setPatient({...patient, age: e.target.value})}/>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Gender</label>
                            <select className="form-select" required onChange={(e)=>setPatient({...patient, gender: e.target.value})}>
                                <option value="">Select</option>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Blood Group</label>
                            <select className="form-select" onChange={(e)=>setPatient({...patient, bloodGroup: e.target.value})}>
                                <option value="">Optional</option>
                                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Mobile Number</label>
                            <input className="form-control" required onChange={(e)=>setPatient({...patient, mobile: e.target.value})}/>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label fw-bold">Symptoms / Sickness Type</label>
                            <textarea className="form-control" rows="3" placeholder="Describe the sickness..." required 
                                onChange={(e)=>setPatient({...patient, sicknessDetails: e.target.value})}></textarea>
                        </div>
                    </div>
                    <button className="btn btn-primary w-100 mt-4 py-2 fw-bold">Register Patient</button>
                </form>
            </div>
        </div>
    );
};
export default CreatePatientComponent;