import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MobileBottomNav = () => {
    const location = useLocation();
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    })();

    if (!user) return null;

    // Do not show on auth pages
    if (['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="mobile-bottom-nav d-md-none" aria-label="Mobile Navigation">
            <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span>Dashboard</span>
            </NavLink>

            <NavLink to="/appointments" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Appts</span>
            </NavLink>

            <NavLink to="/doctors" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                    <circle cx="20" cy="10" r="2" />
                </svg>
                <span>Doctors</span>
            </NavLink>

            <NavLink to="/patients" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Patients</span>
            </NavLink>

            <NavLink to="/leaves" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span>Leaves</span>
            </NavLink>
        </nav>
    );
};

export default MobileBottomNav;
