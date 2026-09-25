import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = AuthService.getCurrentUser();
    const role = user?.role;

    const logout = () => {
        AuthService.logout();
        navigate("/login");
        window.location.reload();
    };

    const getRoleBadge = (r) => {
        switch(r) {
            case 'ROLE_ADMIN':
                return <span className="med-badge med-badge-rose">Admin</span>;
            case 'ROLE_MANAGER':
                return <span className="med-badge med-badge-indigo">Manager</span>;
            case 'ROLE_DOCTOR':
                return <span className="med-badge med-badge-emerald">Doctor</span>;
            default:
                return null;
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky-top bg-white border-bottom shadow-xs" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="container py-2">
                <div className="d-flex align-items-center justify-content-between">
                    {/* Brand */}
                    <Link to={user ? "/dashboard" : "/login"} className="d-flex align-items-center gap-2 text-decoration-none">
                        <div className="d-flex align-items-center justify-content-center rounded-3 text-white" 
                             style={{ width: 38, height: 38, background: 'var(--primary-gradient)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div>
                            <span className="fw-bold fs-5 tracking-tight d-block lh-1 text-slate-900" style={{ color: 'var(--text-main)' }}>
                                MediPulse
                            </span>
                            <span className="small text-muted" style={{ fontSize: '0.7rem' }}>CLINIC MANAGEMENT</span>
                        </div>
                    </Link>

                    {/* Navigation Items */}
                    <div className="d-flex align-items-center gap-1 gap-md-2">
                        {user ? (
                            <>
                                <Link 
                                    to="/dashboard" 
                                    className={`btn btn-sm ${isActive('/dashboard') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                >
                                    Dashboard
                                </Link>

                                <Link 
                                    to="/appointments" 
                                    className={`btn btn-sm ${isActive('/appointments') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                >
                                    Appointments
                                </Link>

                                {(role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER') && (
                                    <>
                                        <Link 
                                            to="/patients" 
                                            className={`btn btn-sm ${isActive('/patients') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                        >
                                            Patients
                                        </Link>
                                        <Link 
                                            to="/doctors" 
                                            className={`btn btn-sm ${isActive('/doctors') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                        >
                                            Doctors
                                        </Link>
                                        <Link 
                                            to="/leaves" 
                                            className={`btn btn-sm ${isActive('/leaves') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                        >
                                            Leaves
                                        </Link>
                                    </>
                                )}

                                {role === 'ROLE_DOCTOR' && (
                                    <>
                                        <Link 
                                            to="/apply-leave" 
                                            className={`btn btn-sm ${isActive('/apply-leave') ? 'btn-primary' : 'btn-light'} fw-semibold px-3 py-1`}
                                        >
                                            Apply Leave
                                        </Link>
                                    </>
                                )}

                                {/* User profile badge & logout */}
                                <div className="d-flex align-items-center gap-2 ms-2 ps-2 border-start">
                                    <div className="d-none d-md-flex flex-column align-items-end lh-1">
                                        <span className="fw-bold small text-truncate" style={{ maxWidth: 120 }}>
                                            {user.username}
                                        </span>
                                        <div className="mt-1">{getRoleBadge(role)}</div>
                                    </div>
                                    <button 
                                        onClick={logout} 
                                        className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2 py-1"
                                        title="Sign out of clinic system"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line x1="21" y1="12" x2="9" y2="12" />
                                        </svg>
                                        <span className="d-none d-sm-inline">Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link 
                                    to="/login" 
                                    className={`btn btn-sm ${isActive('/login') ? 'btn-primary' : 'btn-light'} fw-semibold px-3`}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className={`btn btn-sm ${isActive('/register') ? 'btn-primary' : 'btn-outline-primary'} fw-semibold px-3`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;