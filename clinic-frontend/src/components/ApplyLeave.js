import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ApplyLeave = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [leave, setLeave] = useState({ doctorId: user.id, doctorName: user.username, startDate: '', reason: '' });
    const navigate = useNavigate();

    const handleApply = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/clinic/leaves/apply", leave)
            .then(() => { alert("Leave Request Sent to Manager!"); navigate("/dashboard"); });
    };

    return (
        <div className="card shadow p-4 mt-5 col-md-6 offset-md-3">
            <h3 className="text-danger">Apply for Absence</h3>
            <form onSubmit={handleApply}>
                <label>Leave Date</label>
                <input type="date" className="form-control mb-3" required onChange={(e)=>setLeave({...leave, startDate: e.target.value})}/>
                <label>Reason</label>
                <textarea className="form-control mb-3" required onChange={(e)=>setLeave({...leave, reason: e.target.value})}></textarea>
                <button className="btn btn-danger w-100">Submit Request</button>
            </form>
        </div>
    );
};
export default ApplyLeave;