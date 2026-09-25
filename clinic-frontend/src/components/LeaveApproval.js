import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const LeaveApproval = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = () => {
        setIsLoading(true);
        axios.get("http://localhost:8080/api/clinic/leaves/pending")
            .then(res => setLeaves(res.data || []))
            .catch(() => toast.error("Failed to load staff leave applications"))
            .finally(() => setIsLoading(false));
    };

    const updateStatus = (id, action, docName) => {
        const title = action === 'approve' ? 'Approve Leave Request?' : 'Reject Leave Request?';
        const color = action === 'approve' ? '#059669' : '#e11d48';

        Swal.fire({
            title: title,
            text: `Are you sure you want to mark this request from Dr. ${docName} as ${action.toUpperCase()}D?`,
            icon: action === 'approve' ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonText: `Yes, ${action}`,
            confirmButtonColor: color,
            cancelButtonColor: '#64748b'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.put(`http://localhost:8080/api/clinic/leaves/${id}/${action}`)
                    .then(() => {
                        toast.success(`Leave request ${action}ed successfully!`);
                        loadLeaves();
                    })
                    .catch(() => {
                        toast.error("Failed to process leave request.");
                    });
            }
        });
    };

    return (
        <div className="container py-4">
            <div className="med-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1">Staff Absence & Leave Desk</h3>
                        <p className="text-muted small mb-0">Review, approve, or decline doctor leave requests and schedules</p>
                    </div>
                    <button className="btn btn-outline-primary btn-sm" onClick={loadLeaves}>
                        🔄 Refresh Queue
                    </button>
                </div>

                <div className="med-table-wrapper">
                    <div className="table-responsive">
                        <table className="med-table">
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Requested Period</th>
                                    <th>Reason for Absence</th>
                                    <th>Current Status</th>
                                    <th className="text-end">Administrative Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p className="text-muted small mt-2 mb-0">Loading leave requests...</p>
                                        </td>
                                    </tr>
                                ) : leaves.length > 0 ? (
                                    leaves.map(l => (
                                        <tr key={l.id}>
                                            <td>
                                                <div className="fw-bold">
                                                    {l.doctorName?.startsWith('Dr.') ? l.doctorName : `Dr. ${l.doctorName}`}
                                                </div>
                                                <span className="small text-muted">ID: LR-{l.id}</span>
                                            </td>
                                            <td>
                                                <span className="small fw-semibold text-slate-800">
                                                    {l.startDate} {l.endDate ? `to ${l.endDate}` : '(Single Day)'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="small text-muted">{l.reason || 'Personal / CME Leave'}</span>
                                            </td>
                                            <td>
                                                <span className={`med-badge ${
                                                    l.status === 'APPROVED' ? 'med-badge-emerald' : 
                                                    l.status === 'REJECTED' ? 'med-badge-rose' : 'med-badge-amber'
                                                }`}>
                                                    {l.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                {l.status === 'PENDING' ? (
                                                    <div className="d-inline-flex gap-2">
                                                        <button 
                                                            className="btn btn-success btn-sm px-3 fw-bold"
                                                            onClick={() => updateStatus(l.id, 'approve', l.doctorName)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm px-3 fw-bold"
                                                            onClick={() => updateStatus(l.id, 'reject', l.doctorName)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="small text-muted">Action Completed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No pending staff leave applications at this time.
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

export default LeaveApproval;