import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientService from '../services/PatientService';

const ListPatientComponent = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        PatientService.getPatients().then((res) => {
            setPatients(res.data || []);
        });
    }, []);

    return (
        <div className="card shadow p-4">
            <h2 className="text-center text-primary mb-4">Patient Directory</h2>
            <div className="mb-3 text-end">
                <button className="btn btn-success" onClick={() => navigate('/add-patient')}>
                    + Register New Patient
                </button>
            </div>
            <table className="table table-hover border">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.patientName}</td>
                            <td>{p.age}</td>
                            <td><span className="badge bg-secondary">{p.gender}</span></td>
                            <td>{p.contactNumber}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListPatientComponent;