import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorService from '../services/DoctorService';

const CreateDoctorComponent = () => {
    const [doctor, setDoctor] = useState({
        doctorName: '', specialization: '', email: '', 
        phone: '', experience: '', consultationFee: '', availability: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor({ ...doctor, [name]: value });
    };

    const saveDoctor = (e) => {
        e.preventDefault();
        DoctorService.createDoctor(doctor).then(() => {
            navigate('/doctors');
        });
    };

    return (
        <div className="container mt-5">
            <div className="col-md-8 offset-md-2 card shadow p-5 bg-white">
                <h3 className="text-center text-primary fw-bold mb-4">Professional Doctor Registration</h3>
                <form onSubmit={saveDoctor}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Full Name</label>
                            <input name="doctorName" className="form-control" placeholder="e.g. Dr. John Smith" onChange={handleChange} required/>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Specialization</label>
                            <input name="specialization" className="form-control" placeholder="e.g. Cardiology" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Experience (Years)</label>
                            <input type="number" name="experience" className="form-control" onChange={handleChange} required/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Consultation Fee (₹)</label>
                            <input type="number" name="consultationFee" className="form-control" onChange={handleChange} required/>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Availability</label>
                            <input name="availability" className="form-control" placeholder="10AM - 5PM" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Email</label>
                            <input type="email" name="email" className="form-control" onChange={handleChange} required/>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold">Contact No</label>
                            <input name="phone" className="form-control" onChange={handleChange} required/>
                        </div>
                    </div>
                    <div className="mt-4 text-center">
                        <button type="submit" className="btn btn-primary px-5 shadow-sm">Save Records</button>
                        <button type="button" className="btn btn-outline-danger ms-3" onClick={() => navigate('/doctors')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default CreateDoctorComponent;