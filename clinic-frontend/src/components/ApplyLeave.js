import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

const ApplyLeave = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    const [leave, setLeave] = useState({ 
        doctorId: user?.id || null, 
        doctorName: user?.username || '', 
        startDate: '', 
        endDate: '',
        reason: '' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!leave.startDate) {
            toast.warn("Please select the leave start date.");
            return;
        }
        if (!leave.reason.trim()) {
            toast.warn("Please provide a reason for your absence.");
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:8080/api/clinic/leaves/apply", leave);
            toast.success("Leave application submitted for Practice Manager approval!");
            navigate("/dashboard");
        } catch (err) {
            toast.error("Failed to submit leave application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="med-card shadow-lg p-4 p-md-5 bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-bold mb-1">Request Time Off</h3>
                                <p className="text-muted small mb-0">Submit doctor leave for administrative approval</p>
                            </div>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => navigate('/dashboard')}
                            >
                                ← Dashboard
                            </button>
                        </div>

                        <form onSubmit={handleApply}>
                            <div className="med-input-group mb-3">
                                <label>Requesting Doctor</label>
                                <input 
                                    className="med-input bg-light" 
                                    value={user?.username ? `Dr. ${user.username}` : 'Doctor Account'}
                                    disabled 
                                />
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Leave From Date</label>
                                        <input 
                                            type="date" 
                                            className="med-input" 
                                            required 
                                            value={leave.startDate}
                                            onChange={(e) => setLeave({ ...leave, startDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="med-input-group mb-0">
                                        <label>Leave To Date (Optional)</label>
                                        <input 
                                            type="date" 
                                            className="med-input" 
                                            value={leave.endDate}
                                            onChange={(e) => setLeave({ ...leave, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="med-input-group mb-4">
                                <label>Reason for Absence / Clinical Coverage Notes</label>
                                <textarea 
                                    className="med-input" 
                                    rows="4" 
                                    placeholder="e.g. Attending Annual Cardiology Conference or Personal Time Off..." 
                                    required 
                                    value={leave.reason}
                                    onChange={(e) => setLeave({ ...leave, reason: e.target.value })}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    type="button" 
                                    className="med-btn-secondary"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="med-btn-primary flex-grow-1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Leave Application →"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;