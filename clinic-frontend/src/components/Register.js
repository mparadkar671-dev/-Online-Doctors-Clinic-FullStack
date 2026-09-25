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
        role: 'ROLE_DOCTOR' 
    });
    const [availableRoles, setAvailableRoles] = useState({ ROLE_DOCTOR: true });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [coldStartNotice, setColdStartNotice] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${BASE_URL}/auth/roles-available`)
            .then(res => {
                const roles = res.data || {};
                setAvailableRoles(roles);
                // If Admin & Manager are limit-reached, auto-select Doctor
                if (!roles.ROLE_ADMIN && !roles.ROLE_MANAGER) {
                    setUser(prev => ({ ...prev, role: 'ROLE_DOCTOR' }));
                } else if (roles.ROLE_ADMIN) {
                    setUser(prev => ({ ...prev, role: prev.role || 'ROLE_ADMIN' }));
                }
            })
            .catch(() => {
                setAvailableRoles({ ROLE_DOCTOR: true, ROLE_ADMIN: false, ROLE_MANAGER: false });
                setUser(prev => ({ ...prev, role: 'ROLE_DOCTOR' }));
            });
    }, []);

    const validate = () => {
        if (!user.username.trim()) {
            toast.warn("Username is required.");
            return false;
        }
        if (user.username.trim().length < 3) {
            toast.warn("Username must be at least 3 characters long.");
            return false;
        }
        if (!user.email.trim() || !user.email.includes("@")) {
            toast.warn("Please enter a valid work email address.");
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
        setColdStartNotice(false);
        const timer = setTimeout(() => {
            setColdStartNotice(true);
        }, 3500);

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
            let errorMsg = "Registration failed. Please check inputs.";
            if (err.code === 'ERR_NETWORK' || !err.response) {
                errorMsg = "Unable to connect to backend server. The cloud server may be spinning up from idle sleep (free tier). Please wait 30 seconds and try again.";
            } else if (err.response?.data?.error) {
                errorMsg = err.response.data.error;
            } else if (err.response?.data?.message) {
                errorMsg = err.response.data.message;
            } else if (typeof err.response?.data === 'string') {
                errorMsg = err.response.data;
            }
            toast.error(errorMsg);
        } finally {
            clearTimeout(timer);
            setIsLoading(false);
            setColdStartNotice(false);
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

                            {coldStartNotice && (
                                <div className="alert alert-info py-2 px-3 small d-flex align-items-center mb-3 animate__animated animate__fadeIn">
                                    <span className="spinner-border spinner-border-sm me-2 text-info" role="status"></span>
                                    <span>Connecting to cloud server... First request may take 30-40 seconds if waking up from idle.</span>
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="med-input-group mb-0">
                                            <label htmlFor="reg-username">Username</label>
                                            <input 
                                                id="reg-username"
                                                type="text" 
                                                className="med-input" 
                                                placeholder="Choose unique username (e.g. dr_sharma)" 
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
                                                    placeholder="Min 8 characters" 
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
                                                <option value="ROLE_ADMIN" disabled={!availableRoles.ROLE_ADMIN}>
                                                    Admin (Clinic Executive) {!availableRoles.ROLE_ADMIN ? "— [Limit Reached: 1 Registered]" : ""}
                                                </option>
                                                <option value="ROLE_MANAGER" disabled={!availableRoles.ROLE_MANAGER}>
                                                    Manager (Reception & Operations) {!availableRoles.ROLE_MANAGER ? "— [Limit Reached: 1 Registered]" : ""}
                                                </option>
                                                <option value="ROLE_DOCTOR">
                                                    Doctor (Medical Practitioner) — [Available]
                                                </option>
                                            </select>
                                            {!availableRoles.ROLE_ADMIN && !availableRoles.ROLE_MANAGER && (
                                                <small className="text-muted d-block mt-1">
                                                    Note: Executive Admin and Practice Manager accounts are already registered for this clinic. New registrations are available for Medical Doctors.
                                                </small>
                                            )}
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
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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