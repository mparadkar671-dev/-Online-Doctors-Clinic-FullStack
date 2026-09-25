import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading'); // 'loading' | 'valid' | 'invalid' | 'success'
    const [accountInfo, setAccountInfo] = useState({ username: '', maskedEmail: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus('invalid');
            setErrorMessage('Password reset token is missing from the link. Please request a new password reset email.');
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await AuthService.verifyResetToken(token);
                if (res.valid) {
                    setStatus('valid');
                    setAccountInfo({ username: res.username, maskedEmail: res.maskedEmail });
                } else {
                    setStatus('invalid');
                    setErrorMessage(res.error || 'This password reset link is invalid or has expired.');
                }
            } catch (err) {
                const msg = err.response?.data?.error || 'This password reset link has expired or has already been used.';
                setStatus('invalid');
                setErrorMessage(msg);
            }
        };

        verifyToken();
    }, [token]);

    const calculateStrength = (pwd) => {
        if (!pwd) return { score: 0, label: 'Too short', color: '#cbd5e1' };
        let score = 0;
        if (pwd.length >= 8) score += 1;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        switch (score) {
            case 1: return { score: 25, label: 'Weak', color: '#ef4444' };
            case 2: return { score: 50, label: 'Fair', color: '#f59e0b' };
            case 3: return { score: 75, label: 'Good', color: '#3b82f6' };
            case 4: return { score: 100, label: 'Strong', color: '#10b981' };
            default: return { score: 0, label: 'Too short', color: '#cbd5e1' };
        }
    };

    const strength = calculateStrength(passwords.newPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwords.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters long.");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await AuthService.resetPassword(token, passwords.newPassword);
            toast.success(res.message || "Password updated successfully!");
            setStatus('success');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to update password. Please try again or request a new reset link.";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="med-card shadow-xl p-4 p-md-5 bg-white">
                            
                            {/* STATE 1: LOADING */}
                            {status === 'loading' && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <h5 className="fw-bold text-dark">Verifying Security Token</h5>
                                    <p className="text-muted small">Checking validity of your password reset link...</p>
                                </div>
                            )}

                            {/* STATE 2: INVALID / EXPIRED LINK */}
                            {status === 'invalid' && (
                                <div className="text-center py-3">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                         style={{ background: '#fee2e2', color: '#dc2626' }}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    </div>
                                    <h3 className="fw-bold mb-2 text-danger">Reset Link Expired</h3>
                                    <p className="text-muted small mb-4">
                                        {errorMessage}
                                    </p>
                                    <div className="d-grid gap-2">
                                        <Link to="/forgot-password" className="med-btn-primary py-2 text-center text-decoration-none">
                                            Request New Reset Link
                                        </Link>
                                        <Link to="/login" className="btn btn-outline-secondary py-2">
                                            Back to Sign In
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* STATE 3: SUCCESS */}
                            {status === 'success' && (
                                <div className="text-center py-3">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                         style={{ background: '#dcfce7', color: '#16a34a' }}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <h3 className="fw-bold mb-2 text-success">Password Updated!</h3>
                                    <p className="text-muted small mb-4">
                                        Your account password has been successfully reset. You can now access your MediPulse portal with your new credentials.
                                    </p>
                                    <div className="alert alert-info py-2 small mb-4">
                                        Redirecting to sign-in page in a few seconds...
                                    </div>
                                    <Link to="/login" className="med-btn-primary w-100 py-2 d-block text-center text-decoration-none">
                                        Sign In Now
                                    </Link>
                                </div>
                            )}

                            {/* STATE 4: VALID TOKEN - FORM */}
                            {status === 'valid' && (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                             style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        </div>
                                        <h2 className="fw-bold mb-1">Create New Password</h2>
                                        <p className="text-muted small">
                                            Resetting password for <strong className="text-dark">{accountInfo.username}</strong> ({accountInfo.maskedEmail})
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="med-input-group mb-2">
                                            <label htmlFor="rp-new-password">New Password</label>
                                            <div className="position-relative">
                                                <input 
                                                    id="rp-new-password"
                                                    type={showPassword ? "text" : "password"} 
                                                    className="med-input pe-5" 
                                                    placeholder="Enter at least 8 characters"
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    required 
                                                    autoFocus
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="btn position-absolute top-50 end-0 translate-middle-y me-2 text-muted border-0 p-1"
                                                >
                                                    {showPassword ? "Hide" : "Show"}
                                                </button>
                                            </div>

                                            {passwords.newPassword && (
                                                <>
                                                    <div className="strength-track">
                                                        <div 
                                                            className="strength-bar" 
                                                            style={{ 
                                                                width: `${strength.score}%`, 
                                                                backgroundColor: strength.color 
                                                            }} 
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                                            Strength: <strong style={{ color: strength.color }}>{strength.label}</strong>
                                                        </span>
                                                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {passwords.newPassword.length}/8 min chars
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="med-input-group mb-4">
                                            <label htmlFor="rp-confirm-password">Confirm New Password</label>
                                            <input 
                                                id="rp-confirm-password"
                                                type={showPassword ? "text" : "password"} 
                                                className="med-input" 
                                                placeholder="Re-type your new password"
                                                value={passwords.confirmPassword}
                                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                required 
                                            />
                                            {passwords.confirmPassword && passwords.newPassword !== passwords.confirmPassword && (
                                                <span className="small text-danger d-block mt-1">Passwords do not match</span>
                                            )}
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="med-btn-primary w-100 py-2 mb-3"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span>Updating Password...</span>
                                                </>
                                            ) : (
                                                <span>Save New Password & Continue</span>
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <Link to="/login" className="text-muted text-decoration-none small">
                                                ← Cancel & Return to Login
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
