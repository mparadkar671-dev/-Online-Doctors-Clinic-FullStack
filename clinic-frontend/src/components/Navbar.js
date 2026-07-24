import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold" to={user ? "/dashboard" : "/login"}>
                    🏥 CLINIC PRO
                </Link>
                
                <div className="navbar-nav ms-auto">
                    {user ? (
                        <>
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            <Link className="nav-link" to="/doctors">Doctors</Link>
                            <Link className="nav-link" to="/patients">Patients</Link>
                            <Link className="nav-link" to="/appointments">Appointments</Link>
                            <button className="btn btn-outline-light ms-3 btn-sm" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            {/* SHOW THESE WHEN NOT LOGGED IN */}
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="nav-link" to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;