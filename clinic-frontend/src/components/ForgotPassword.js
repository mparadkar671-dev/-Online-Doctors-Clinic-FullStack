import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [data, setData] = useState({ username: '', contact: '', newPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleReset = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/auth/forgot-password", data)
            .then(() => {
                alert("Verification Successful! Password Updated.");
                navigate("/login");
            })
            .catch(err => alert("Verification Failed: Info does not match records."));
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-5 card shadow p-4 border-0">
                <h3 className="text-center text-danger fw-bold mb-3">Account Recovery</h3>
                <p className="text-muted small text-center mb-4">Verify your identity to reset password.</p>
                <form onSubmit={handleReset}>
                    <input className="form-control mb-2" placeholder="Registered Username" required 
                           onChange={(e) => setData({ ...data, username: e.target.value })} />
                    <input className="form-control mb-2" placeholder="Registered Email or Mobile" required 
                           onChange={(e) => setData({ ...data, contact: e.target.value })} />
                    
                    <div className="input-group mb-3">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control" 
                            placeholder="Enter New Password" 
                            required 
                            onChange={(e) => setData({ ...data, newPassword: e.target.value })} 
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    
                    <button type="submit" className="btn btn-danger w-100 fw-bold">Reset Password</button>
                    <button className="btn btn-link w-100 mt-2" onClick={() => navigate("/login")}>Cancel</button>
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;