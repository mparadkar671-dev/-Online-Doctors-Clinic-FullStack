import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorService from '../services/DoctorService';
import AuthService from '../services/AuthService';

const ListDoctorComponent = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    // Check if user is Admin
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.role === "ROLE_ADMIN";

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = () => {
        DoctorService.getDoctors().then((res) => {
            setDoctors(res.data || []);
        }).catch(err => console.error("Fetch Error:", err));
    };

    const deleteDoctor = (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            DoctorService.deleteDoctor(id).then(() => {
                loadDoctors();
            });
        }
    };

    return (
        <div className="container mt-3">
            <div className="card shadow p-4">
                <h2 className="text-center text-primary mb-4">Doctor Management</h2>
                
                <div className="d-flex justify-content-between mb-3">
                    <input 
                        type="text" 
                        className="form-control w-50" 
                        placeholder="Search by Name or Specialization..." 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isAdmin && (
                        <button className="btn btn-primary" onClick={() => navigate('/add-doctor')}>
                            + Add Doctor
                        </button>
                    )}
                </div>

                <table className="table table-hover border">
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Email</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.filter((val) => {
                            if (searchTerm === "") return val;
                            // NULL-SAFE CHECK: prevents crash if fields are null
                            const name = (val.doctorName || "").toLowerCase();
                            const spec = (val.specialization || "").toLowerCase();
                            const search = searchTerm.toLowerCase();
                            return name.includes(search) || spec.includes(search);
                        }).map(doctor => (
                            <tr key={doctor.id}>
                                <td>{doctor.doctorName}</td>
                                <td><span className="badge bg-info text-dark">{doctor.specialization}</span></td>
                                <td>{doctor.email}</td>
                                {isAdmin && (
                                    <td>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => deleteDoctor(doctor.id)}>
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListDoctorComponent;