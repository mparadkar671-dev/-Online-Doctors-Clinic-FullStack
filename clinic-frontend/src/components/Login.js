import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Eye Toggle State
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        AuthService.login(username, password).then(() => {
            navigate("/dashboard");
            window.location.reload();
        }).catch(() => alert("Invalid Credentials"));
    };

    return (
        <div className="row justify-content-center mt-5">
            <div className="col-md-4 card p-4 shadow border-0">
                <h2 className="text-center text-primary fw-bold mb-4">Clinic Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input className="form-control" onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control" 
                                onChange={(e) => setPassword(e.target.value)} required 
                            />
                            <button 
                                className="btn btn-outline-secondary" 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2">Sign In</button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/forgot-password" style={{fontSize: '14px'}}>Forgot Password?</Link>
                    <hr />
                    <p className="mb-0 small">Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    );
};
export default Login;