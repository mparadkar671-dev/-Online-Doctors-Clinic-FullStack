import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import BASE_URL from '../config/api';

const Register = () => {
    const [user, setUser] = useState({ 
        username: '', 
        password: '', 
        confirmPassword: '',
        email: '', 
        phoneNumber: '', 
        role: '' 
    });
    const [availableRoles, setAvailableRoles] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BASE_URL}/auth/roles-available`)
            .then(res => setAvailableRoles(res.data || {}))
            .catch(() => setAvailableRoles({ ROLE_DOCTOR: true }));
    }, []);

    const validate = () => {
        if (!user.username.trim()) {
            toast.warn("Username is required.");
            return false;
        }
        if (!user.email.trim() || !user.email.includes("@")) {
            toast.warn("Please enter a valid email address.");
            return false;
        }
        if (user.phoneNumber.length !== 10) {
            toast.warn("Mobile number must be exactly 10 digits.");
            return false;
        }
        if (user.password.length < 8) {
            toast.warn("Password must be at least 8 characters long.");
            return false;
        }
        if (user.password !== user.confirmPassword) {
            toast.warn("Password and confirmation password do not match.");
            return false;
        }
        if (!user.role) {
            toast.warn("Please select a role for this account.");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        try {
            const payload = {
                username: user.username.trim(),
                password: user.password,
                email: user.email.trim(),
                phoneNumber: user.phoneNumber.trim(),
                role: user.role
            };

            await axios.post(`${BASE_URL}/auth/register`, payload);
            toast.success("Account created successfully!");

            if (user.role === 'ROLE_DOCTOR') {
                // Save temp_user object so DoctorProfile has prefilled values
                localStorage.setItem("temp_user", JSON.stringify({
                    username: user.username.trim(),
                    email: user.email.trim(),
                    phoneNumber: user.phoneNumber.trim()
                }));
                navigate("/complete-profile");
            } else {
                navigate("/login");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data || "Registration failed. Please check inputs.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-7 col-xl-6">
                        <div className="med-card shadow-xl p-4 p-md-5 bg-white">
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-2"
                                     style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <line x1="19" y1="8" x2="19" y2="14" />
                                        <line x1="22" y1="11" x2="16" y2="11" />
                                    </svg>
                                </div>
                                <h2 className="fw-bold mb-1">Create Staff Account</h2>
                                <p className="text-muted small">Register as an Administrator, Practice Manager, or Specialist Doctor</p>
                            </div>

                            <form onSubmit={handleRegister}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-username">Username</label>
                                            <input 
                                                id="reg-username"
                                                type="text" 
                                                className="med-input" 
                                                placeholder="Choose unique username" 
                                                value={user.username}
                                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-email">Work Email</label>
                                            <input 
                                                id="reg-email"
                                                type="email" 
                                                className="med-input" 
                                                placeholder="name@clinic.com" 
                                                value={user.email}
                                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-phone">10-Digit Mobile</label>
                                            <input 
                                                id="reg-phone"
                                                type="tel" 
                                                maxLength="10"
                                                className="med-input" 
                                                placeholder="e.g. 9876543210" 
                                                value={user.phoneNumber}
                                                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value.replace(/\D/g, '') })}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-password">Password (8+ chars)</label>
                                            <div className="position-relative">
                                                <input 
                                                    id="reg-password"
                                                    type={showPassword ? "text" : "password"} 
                                                    className="med-input pe-5" 
                                                    placeholder="Create strong password" 
                                                    value={user.password}
                                                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                                                    required 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 p-1"
                                                >
                                                    {showPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-confirm">Confirm Password</label>
                                            <input 
                                                id="reg-confirm"
                                                type={showPassword ? "text" : "password"} 
                                                className="med-input" 
                                                placeholder="Re-enter password" 
                                                value={user.confirmPassword}
                                                onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-role">Designated Role</label>
                                            <select 
                                                id="reg-role"
                                                className="med-input form-select" 
                                                value={user.role}
                                                onChange={(e) => setUser({ ...user, role: e.target.value })}
                                                required
                                            >
                                                <option value="">-- Choose Access Level --</option>
                                                {availableRoles.ROLE_ADMIN && <option value="ROLE_ADMIN">Admin (Clinic Executive)</option>}
                                                {availableRoles.ROLE_MANAGER && <option value="ROLE_MANAGER">Manager (Reception & Operations)</option>}
                                                <option value="ROLE_DOCTOR">Doctor (Medical Practitioner)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="med-btn-primary w-100 py-2 mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <span>Complete Registration</span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-4 pt-3 border-top text-center">
                                <p className="small text-muted mb-0">
                                    Already registered?{' '}
                                    <Link to="/login" className="text-primary fw-bold text-decoration-none">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;