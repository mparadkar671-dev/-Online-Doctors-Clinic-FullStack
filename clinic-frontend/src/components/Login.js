import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Modal state for in-page Forgot/Reset Password
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [resetSentInfo, setResetSentInfo] = useState({ maskedEmail: '', resetLink: '', emailSent: false });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username.trim() || !password) {
            toast.warn("Please enter both username and password.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await AuthService.login(username.trim(), password);
            toast.success(`Welcome back, ${data.username || username}!`);
            navigate("/dashboard");
            window.location.reload();
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data || "Invalid credentials. Please verify your username and password.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordResetRequest = async (e) => {
        e.preventDefault();
        if (!resetEmail.trim()) {
            toast.warn("Please enter your registered email address.");
            return;
        }

        setIsResetting(true);
        try {
            const response = await AuthService.sendPasswordResetEmail(resetEmail.trim());
            setResetSentInfo({
                maskedEmail: response.maskedEmail || resetEmail.trim(),
                resetLink: response.resetLink || '',
                emailSent: response.emailSent
            });
            setResetSent(true);
            toast.success(response.message || "Password reset link sent to your email!");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data || "Verification failed: Could not find an account with that email.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Verification failed.");
        } finally {
            setIsResetting(false);
        }
    };

    const fillDemoCredentials = (role) => {
        if (role === 'admin') {
            setUsername('admin');
            setPassword('123');
            toast.info("Filled Admin demo credentials.");
        } else if (role === 'manager') {
            setUsername('manager');
            setPassword('root123');
            toast.info("Filled Manager demo credentials.");
        } else if (role === 'doctor') {
            setUsername('dr_smith');
            setPassword('root123');
            toast.info("Filled Doctor demo credentials.");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                        <div className="med-card shadow-xl overflow-hidden">
                            <div className="row g-0">
                                {/* Left Brand Accent Panel */}
                                <div className="col-lg-5 p-4 p-md-5 d-flex flex-column justify-content-between text-white" 
                                     style={{ background: 'var(--hero-gradient)' }}>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-3">
                                            <div className="d-flex align-items-center justify-content-center rounded-3 bg-white bg-opacity-25" 
                                                 style={{ width: 44, height: 44 }}>
                                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                </svg>
                                            </div>
                                            <span className="fs-5 fw-bold tracking-tight">MediPulse</span>
                                        </div>
                                        <h3 className="fw-bold mb-2">Clinic Practice Management</h3>
                                        <p className="text-white text-opacity-75 small mb-4">
                                            Streamline doctor schedules, outpatient records, prescriptions, and leave approvals in one unified workspace.
                                        </p>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            <span className="small text-white text-opacity-75 fw-semibold d-block mb-2">QUICK DEMO ACCESS</span>
                                            <div className="d-flex flex-wrap gap-1">
                                                <button type="button" 
                                                        className="btn btn-sm btn-light bg-opacity-25 text-white border-0 py-1 px-2"
                                                        onClick={() => fillDemoCredentials('admin')}>
                                                    Admin
                                                </button>
                                                <button type="button" 
                                                        className="btn btn-sm btn-light bg-opacity-25 text-white border-0 py-1 px-2"
                                                        onClick={() => fillDemoCredentials('manager')}>
                                                    Manager
                                                </button>
                                                <button type="button" 
                                                        className="btn btn-sm btn-light bg-opacity-25 text-white border-0 py-1 px-2"
                                                        onClick={() => fillDemoCredentials('doctor')}>
                                                    Doctor
                                                </button>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 text-white text-opacity-75 small">
                                            <span className="badge bg-success bg-opacity-25 text-white border border-success border-opacity-50">✓ Encrypted</span>
                                            <span>HIPAA Compliant</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Form Panel */}
                                <div className="col-lg-7 p-4 p-md-5 bg-white">
                                    <div className="mb-4">
                                        <h2 className="fw-bold text-slate-900 mb-1" style={{ color: 'var(--text-main)' }}>Sign In</h2>
                                        <p className="text-muted small">Enter your clinic credentials to access your dashboard</p>
                                    </div>

                                    <form onSubmit={handleLogin}>
                                        <div className="med-input-group mb-3">
                                            <label htmlFor="username">Username</label>
                                            <div className="position-relative">
                                                <input 
                                                    id="username"
                                                    type="text" 
                                                    className="med-input"
                                                    placeholder="Enter your username (e.g. admin)" 
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)} 
                                                    required 
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <div className="med-input-group mb-2">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <label htmlFor="password" className="mb-0">Password</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowResetModal(true)}
                                                    className="btn btn-link p-0 text-decoration-none small text-primary fw-semibold"
                                                    style={{ fontSize: '0.825rem' }}
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="position-relative">
                                                <input 
                                                    id="password"
                                                    type={showPassword ? "text" : "password"} 
                                                    className="med-input pe-5" 
                                                    placeholder="Enter your account password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)} 
                                                    required 
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 p-1"
                                                    title={showPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showPassword ? (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                            <line x1="1" y1="1" x2="23" y2="23" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                                                <label className="form-check-label small text-muted" htmlFor="rememberMe">
                                                    Keep me signed in
                                                </label>
                                            </div>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="med-btn-primary w-100 py-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span>Authenticating...</span>
                                                </>
                                            ) : (
                                                <span>Sign In to Dashboard →</span>
                                            )}
                                        </button>
                                    </form>

                                    <div className="mt-4 pt-3 border-top text-center">
                                        <p className="small text-muted mb-0">
                                            New staff member?{' '}
                                            <Link to="/register" className="text-primary fw-bold text-decoration-none">
                                                Create Staff Account
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* IN-PLACE FORGOT PASSWORD & EMAIL VERIFICATION MODAL */}
            {showResetModal && (
                <div className="med-modal-backdrop" onClick={() => setShowResetModal(false)}>
                    <div className="med-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 p-md-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="rounded-circle p-2 bg-primary-subtle text-primary">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                        </svg>
                                    </div>
                                    <h4 className="fw-bold mb-0">Password Recovery</h4>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowResetModal(false)}
                                    aria-label="Close"
                                />
                            </div>

                            {!resetSent ? (
                                <>
                                    <p className="text-muted small mb-4">
                                        Enter your registered email address to verify your account and receive a secure password reset link.
                                    </p>

                                    <form onSubmit={handlePasswordResetRequest}>
                                        <div className="med-input-group mb-4">
                                            <label htmlFor="reset-email-input">Registered Email Address</label>
                                            <input 
                                                id="reset-email-input"
                                                type="email" 
                                                className="med-input" 
                                                placeholder="e.g. doctor@clinic.com or admin@clinic.com"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                required 
                                                autoFocus
                                            />
                                            <span className="small text-muted mt-1 d-block" style={{ fontSize: '0.8rem' }}>
                                                We'll verify your email against clinic records and generate a one-time link.
                                            </span>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button 
                                                type="button" 
                                                className="med-btn-secondary flex-grow-1"
                                                onClick={() => setShowResetModal(false)}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="med-btn-primary flex-grow-1"
                                                disabled={isResetting}
                                            >
                                                {isResetting ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        <span>Verifying & Sending...</span>
                                                    </>
                                                ) : (
                                                    <span>Send Reset Link</span>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-2">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                         style={{ background: '#dbeafe', color: '#0284c7' }}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                                        </svg>
                                    </div>
                                    <h5 className="fw-bold mb-2">Check Your Email</h5>
                                    <p className="text-muted small mb-3">
                                        We sent a password reset link to:
                                    </p>
                                    <div className="p-2 mb-3 rounded bg-light border fw-semibold text-primary small">
                                        {resetSentInfo.maskedEmail}
                                    </div>
                                    <p className="text-muted small mb-4" style={{ fontSize: '0.8rem' }}>
                                        The link is valid for 30 minutes. Please check your inbox and spam folder.
                                    </p>

                                    {resetSentInfo.resetLink && (
                                        <div className="alert alert-light border border-info-subtle text-start p-3 mb-3 rounded-3">
                                            <div className="fw-semibold small text-info-emphasis mb-1">
                                                Direct Test Link:
                                            </div>
                                            <a 
                                                href={resetSentInfo.resetLink} 
                                                className="btn btn-sm btn-outline-primary w-100 fw-semibold"
                                                onClick={() => setShowResetModal(false)}
                                            >
                                                Open Password Reset Page →
                                            </a>
                                        </div>
                                    )}

                                    <button 
                                        type="button" 
                                        className="btn btn-secondary w-100 py-2"
                                        onClick={() => {
                                            setShowResetModal(false);
                                            setResetSent(false);
                                            setResetEmail('');
                                        }}
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;