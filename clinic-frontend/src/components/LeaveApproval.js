import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = () => {
        axios.get("http://localhost:8080/api/clinic/leaves/pending")
             .then(res => setLeaves(res.data || []));
    };

    const updateStatus = (id, action) => {
        // action will be 'approve' or 'reject'
        axios.put(`http://localhost:8080/api/clinic/leaves/${id}/${action}`)
            .then(() => {
                Swal.fire("Success", `Leave ${action}ed successfully!`, "success");
                loadLeaves();
            })
            .catch(err => {
                console.error(err);
                Swal.fire("Error", "Server failed to process the request", "error");
            });
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="card shadow border-0 p-4">
                <h3 className="text-primary fw-bold mb-4">🩺 Staff Leave Management</h3>
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Doctor Name</th>
                            <th>Duration</th>
                            <th>Reason</th>
                            <th>Current Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length > 0 ? leaves.map(l => (
                            <tr key={l.id}>
                                <td className="fw-bold">Dr. {l.doctorName}</td>
                                <td>{l.startDate} to {l.endDate}</td>
                                <td>{l.reason}</td>
                                <td>
                                    <span className={`badge ${l.status === 'PENDING' ? 'bg-warning text-dark' : l.status === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td>
                                    {l.status === 'PENDING' && (
                                        <>
                                            <button className="btn btn-success btn-sm me-2 fw-bold" onClick={()=>updateStatus(l.id, 'approve')}>Approve</button>
                                            <button className="btn btn-danger btn-sm fw-bold" onClick={()=>updateStatus(l.id, 'reject')}>Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center text-muted">No pending requests.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveApproval;