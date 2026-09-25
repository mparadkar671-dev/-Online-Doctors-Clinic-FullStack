import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PatientService from '../services/PatientService';

const ListPatientComponent = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        setIsLoading(true);
        PatientService.getPatients().then((res) => {
            setPatients(res.data || []);
        }).catch(err => {
            console.error("Error loading patients", err);
            toast.error("Failed to load patient records.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const filteredPatients = patients.filter((p) => {
        if (!searchTerm.trim()) return true;
        const name = (p.patientName || "").toLowerCase();
        const contact = (p.contactNumber || p.mobile || "").toLowerCase();
        const query = searchTerm.toLowerCase();
        return name.includes(query) || contact.includes(query);
    });

    return (
        <div className="container py-4">
            <div className="med-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">Patient Directory</h3>
                        <span className="text-muted small">Comprehensive outpatient registry and medical history</span>
                    </div>
                    <button 
                        className="med-btn-primary" 
                        onClick={() => navigate('/add-patient')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Register New Patient
                    </button>
                </div>

                <div className="row g-3 align-items-center mb-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="position-relative">
                            <input 
                                type="text" 
                                className="med-input ps-5" 
                                placeholder="Search by patient name or phone..." 
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
                    </div>
                    <div className="col-12 col-md-6 col-lg-8 text-md-end text-muted small">
                        Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> registered patients
                    </div>
                </div>

                <div className="med-table-wrapper">
                    <div className="table-responsive">
                        <table className="med-table">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Patient Name</th>
                                    <th>Age & Gender</th>
                                    <th>Contact Details</th>
                                    <th>Medical Notes / Symptoms</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p className="text-muted small mt-2 mb-0">Loading patient records...</p>
                                        </td>
                                    </tr>
                                ) : filteredPatients.length > 0 ? (
                                    filteredPatients.map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <span className="med-badge med-badge-primary">
                                                    PT-{p.id.toString().padStart(4, '0')}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-bold">{p.patientName}</div>
                                                {p.bloodGroup && (
                                                    <span className="small text-danger fw-semibold">Blood: {p.bloodGroup}</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span>{p.age} yrs</span>
                                                    <span className={`med-badge ${
                                                        p.gender === 'Female' ? 'med-badge-rose' : 
                                                        p.gender === 'Male' ? 'med-badge-indigo' : 'med-badge-cyan'
                                                    }`}>
                                                        {p.gender || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-slate-800 fw-medium">
                                                    {p.contactNumber || p.mobile || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small text-muted text-truncate d-inline-block" style={{ maxWidth: 220 }}>
                                                    {p.sicknessDetails || 'No complaints noted'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    className="btn btn-outline-primary btn-sm px-2 py-1"
                                                    onClick={() => navigate('/book-appointment')}
                                                    title="Schedule consultation"
                                                >
                                                    Book Visit
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            No patients found matching "{searchTerm}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListPatientComponent;