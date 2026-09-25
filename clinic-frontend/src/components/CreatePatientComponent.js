import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from '../config/api';

const CreatePatientComponent = () => {
    const [patient, setPatient] = useState({
        patientName: '',
        age: '',
        gender: '',
        mobile: '', 
        bloodGroup: '',
        sicknessDetails: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault();
        if (!patient.patientName.trim()) {
            toast.warn("Patient name is required.");
            return;
        }
        if (!patient.mobile || patient.mobile.length !== 10) {
            toast.warn("Please enter a valid 10-digit mobile number.");
            return;
        }

        setIsSaving(true);
        try {
            await axios.post(`${BASE_URL}/api/clinic/patients`, patient);
            toast.success(`Patient ${patient.patientName} registered successfully!`);
            navigate("/book-appointment");
        } catch (err) {
            toast.error("Failed to register patient. Please check server connection.");
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
                                <h3 className="fw-bold mb-1">New Patient Registration</h3>
                                <p className="text-muted small mb-0">Record outpatient medical details for appointment scheduling</p>
                            </div>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate('/patients')}
                            >
                                ← Back to Patients
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="med-input-group mb-0">
                                        <label>Patient Full Name</label>
                                        <input 
                                            className="med-input" 
                                            placeholder="e.g. Ramesh Patel" 
                                            value={patient.patientName}
                                            required 
                                            onChange={(e) => setPatient({ ...patient, patientName: e.target.value })}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Age (Years)</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            max="120"
                                            className="med-input" 
                                            placeholder="e.g. 35"
                                            value={patient.age}
                                            required 
                                            onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Gender</label>
                                        <select 
                                            className="med-input form-select" 
                                            value={patient.gender}
                                            required 
                                            onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="med-input-group mb-0">
                                        <label>Blood Group</label>
                                        <select 
                                            className="med-input form-select" 
                                            value={patient.bloodGroup}
                                            onChange={(e) => setPatient({ ...patient, bloodGroup: e.target.value })}
                                        >
                                            <option value="">Optional</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="med-input-group mb-0">
                                        <label>Contact Mobile Number (10 Digits)</label>
                                        <input 
                                            type="tel"
                                            maxLength="10"
                                            className="med-input" 
                                            placeholder="e.g. 9876543210"
                                            value={patient.mobile}
                                            required 
                                            onChange={(e) => setPatient({ ...patient, mobile: e.target.value.replace(/\D/g, '') })}
                                        />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="med-input-group mb-0">
                                        <label>Symptoms / Sickness Details</label>
                                        <textarea 
                                            className="med-input" 
                                            rows="3" 
                                            placeholder="Describe primary symptoms, allergies, or reason for clinic visit..." 
                                            value={patient.sicknessDetails}
                                            required 
                                            onChange={(e) => setPatient({ ...patient, sicknessDetails: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-4 pt-2">
                                <button 
                                    type="button" 
                                    className="med-btn-secondary"
                                    onClick={() => navigate('/patients')}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="med-btn-primary flex-grow-1"
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Registering..." : "Register & Book Appointment →"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePatientComponent;