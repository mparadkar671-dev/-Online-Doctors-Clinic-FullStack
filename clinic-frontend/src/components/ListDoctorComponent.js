import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import DoctorService from '../services/DoctorService';
import AuthService from '../services/AuthService';

const ListDoctorComponent = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser && currentUser.role === "ROLE_ADMIN";

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = () => {
        setIsLoading(true);
        DoctorService.getDoctors().then((res) => {
            setDoctors(res.data || []);
        }).catch(err => {
            console.error("Fetch Error:", err);
            toast.error("Failed to load doctor directory.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const deleteDoctor = (id, name) => {
        Swal.fire({
            title: `Remove Dr. ${name || ''}?`,
            text: "This action will delete this doctor record from the clinic directory.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete doctor'
        }).then((result) => {
            if (result.isConfirmed) {
                DoctorService.deleteDoctor(id).then(() => {
                    toast.success("Doctor record deleted successfully.");
                    loadDoctors();
                }).catch(() => {
                    toast.error("Failed to delete doctor.");
                });
            }
        });
    };

    const filteredDoctors = doctors.filter((val) => {
        if (!searchTerm.trim()) return true;
        const name = (val.doctorName || "").toLowerCase();
        const spec = (val.specialization || "").toLowerCase();
        const query = searchTerm.toLowerCase();
        return name.includes(query) || spec.includes(query);
    });

    return (
        <div className="container py-4">
            <div className="med-card p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">Medical Staff Directory</h3>
                        <span className="text-muted small">Manage licensed practitioners, consultation hours, and specialties</span>
                    </div>
                    {isAdmin && (
                        <button 
                            className="med-btn-primary" 
                            onClick={() => navigate('/add-doctor')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add New Doctor
                        </button>
                    )}
                </div>

                <div className="row g-3 align-items-center mb-4">
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="position-relative">
                            <input 
                                type="text" 
                                className="med-input ps-5" 
                                placeholder="Search by doctor name or specialty..." 
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
                        Showing <strong>{filteredDoctors.length}</strong> of <strong>{doctors.length}</strong> practitioners
                    </div>
                </div>

                <div className="med-table-wrapper">
                    <div className="table-responsive">
                        <table className="med-table">
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Specialization</th>
                                    <th>Experience</th>
                                    <th>Consultation Fee</th>
                                    <th>Availability</th>
                                    {isAdmin && <th className="text-end">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p className="text-muted small mt-2 mb-0">Loading doctor directory...</p>
                                        </td>
                                    </tr>
                                ) : filteredDoctors.length > 0 ? (
                                    filteredDoctors.map(doctor => (
                                        <tr key={doctor.id}>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white" 
                                                         style={{ width: 38, height: 38, background: 'var(--primary-gradient)', fontSize: '0.85rem' }}>
                                                        {(doctor.doctorName || 'Dr').replace('Dr. ', '').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">
                                                            {doctor.doctorName ? (doctor.doctorName.startsWith('Dr.') ? doctor.doctorName : `Dr. ${doctor.doctorName}`) : 'Practitioner'}
                                                        </div>
                                                        <span className="small text-muted">{doctor.email || 'No email registered'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="med-badge med-badge-indigo">
                                                    {doctor.specialization || 'General'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small text-secondary">
                                                    {doctor.experience ? `${doctor.experience} Yrs` : 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-semibold text-slate-800">
                                                    ₹{doctor.consultationFee || 400}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small text-muted">
                                                    {doctor.availability || '10:00 AM - 02:00 PM'}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="text-end">
                                                    <button 
                                                        className="btn btn-outline-danger btn-sm px-2 py-1"
                                                        onClick={() => deleteDoctor(doctor.id, doctor.doctorName)}
                                                        title="Delete doctor"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={isAdmin ? 6 : 5} className="text-center py-5 text-muted">
                                            No practitioners found matching "{searchTerm}".
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

export default ListDoctorComponent;