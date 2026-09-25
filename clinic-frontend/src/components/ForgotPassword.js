import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthService from '../services/AuthService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [sentInfo, setSentInfo] = useState({ maskedEmail: '', resetLink: '', emailSent: false });

    const handleSendLink = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            toast.warn("Please enter your registered email address.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await AuthService.sendPasswordResetEmail(trimmedEmail);
            setSentInfo({
                maskedEmail: response.maskedEmail || trimmedEmail,
                resetLink: response.resetLink || '',
                emailSent: response.emailSent
            });
            setIsSent(true);
            toast.success(response.message || "Password reset link has been dispatched to your email!");
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data || "Unable to send reset link. Please verify your email address.";
            toast.error(typeof errorMsg === 'string' ? errorMsg : "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div className="med-card shadow-xl p-4 p-md-5 bg-white">
                            
                            {!isSent ? (
                                <>
                                    <div className="text-center mb-4">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                             style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                            </svg>
                                        </div>
                                        <h2 className="fw-bold mb-1">Forgot Password?</h2>
                                        <p className="text-muted small">
                                            Enter your verified email address and we'll send you a secure link to reset your account password.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSendLink}>
                                        <div className="med-input-group mb-4">
                                            <label htmlFor="fp-email">Registered Email Address</label>
                                            <input 
                                                id="fp-email"
                                                type="email" 
                                                className="med-input" 
                                                placeholder="e.g. doctor@clinic.com or admin@clinic.com" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                                autoFocus
                                            />
                                            <span className="small text-muted mt-1 d-block" style={{ fontSize: '0.8rem' }}>
                                                An email verification check will confirm your registered account.
                                            </span>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="med-btn-primary w-100 py-2 mb-3"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span>Verifying & Sending Link...</span>
                                                </>
                                            ) : (
                                                <span>Send Password Reset Link</span>
                                            )}
                                        </button>

                                        <div className="text-center">
                                            <Link to="/login" className="text-muted text-decoration-none small">
                                                ← Back to Sign In
                                            </Link>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                /* SENT CONFIRMATION STATE */
                                <div className="text-center py-2">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3"
                                         style={{ background: '#dbeafe', color: '#0284c7' }}>
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                                            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                                        </svg>
                                    </div>
                                    <h3 className="fw-bold mb-2">Check Your Email</h3>
                                    <p className="text-muted small mb-3">
                                        We've dispatched a password reset link to:
                                    </p>
                                    <div className="p-2 mb-3 rounded bg-light border fw-semibold text-primary">
                                        {sentInfo.maskedEmail}
                                    </div>
                                    <p className="text-muted small mb-4" style={{ fontSize: '0.85rem' }}>
                                        Please check your inbox (and spam folder). The link will remain active for <strong>30 minutes</strong>.
                                    </p>

                                    {/* SMTP Diagnostic Alert if failed */}
                                    {sentInfo.emailError && (
                                        <div className="alert alert-warning text-start p-3 mb-3 rounded-3 small">
                                            <div className="fw-bold mb-1 text-warning-emphasis">⚠️ Gmail Authentication Notice</div>
                                            <p className="mb-2 text-dark" style={{ fontSize: '0.82rem' }}>
                                                {sentInfo.emailError}
                                            </p>
                                        </div>
                                    )}

                                    {/* Local Dev / Immediate Testing Box */}
                                    {sentInfo.resetLink && (
                                        <div className="alert alert-light border border-info-subtle text-start p-3 mb-4 rounded-3">
                                            <div className="d-flex align-items-center gap-2 mb-2 text-info-emphasis fw-semibold small">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="16" x2="12" y2="12" />
                                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                                </svg>
                                                <span>Direct Reset Link Preview</span>
                                            </div>
                                            <p className="small text-muted mb-2" style={{ fontSize: '0.78rem' }}>
                                                {sentInfo.emailSent 
                                                    ? "Real email delivered via SMTP! You can also click below directly:" 
                                                    : "Click below to open and complete your password reset:"}
                                            </p>
                                            <a 
                                                href={sentInfo.resetLink} 
                                                className="btn btn-sm btn-outline-primary w-100 fw-semibold"
                                                target="_self"
                                            >
                                                Open Password Reset Screen →
                                            </a>
                                        </div>
                                    )}

                                    <div className="d-flex flex-column gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-link text-muted text-decoration-none small"
                                            onClick={() => setIsSent(false)}
                                        >
                                            Didn't receive the email? Try another address
                                        </button>
                                        <Link to="/login" className="btn btn-outline-secondary py-2">
                                            Return to Sign In
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;