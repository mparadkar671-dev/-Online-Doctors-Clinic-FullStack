import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [user, setUser] = useState({ username: '', password: '', email: '', phoneNumber: '', role: '' });
    const [availableRoles, setAvailableRoles] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/auth/roles-available").then(res => setAvailableRoles(res.data));
    }, []);

    const validate = () => {
        if (user.password.length < 8) {
            alert("Security Alert: Password must be at least 8 characters.");
            return false;
        }
        if (user.phoneNumber.length !== 10) {
            alert("Rule: Mobile number must be 10 digits.");
            return false;
        }
        return true;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!validate()) return;

        axios.post("http://localhost:8080/auth/register", user)
            .then(res => {
                alert("Account created successfully!");
                if (user.role === 'ROLE_DOCTOR') {
                    localStorage.setItem("temp_doctor_name", user.username);
                    navigate("/complete-profile"); // Direct to onboarding
                } else {
                    navigate("/login");
                }
            })
            .catch(err => alert(err.response?.data || "Registration failed"));
    };

    return (
        <div className="container mt-4 animate__animated animate__fadeIn">
            <div className="row justify-content-center">
                <div className="col-md-5 card shadow-lg p-4 border-0">
                    <h2 className="text-center text-primary fw-bold mb-4">Clinic Registration</h2>
                    <form onSubmit={handleRegister}>
                        <input className="form-control mb-2" placeholder="Username" required 
                               onChange={(e) => setUser({ ...user, username: e.target.value })} />
                        <input className="form-control mb-2" type="email" placeholder="Email" required 
                               onChange={(e) => setUser({ ...user, email: e.target.value })} />
                        <input className="form-control mb-2" type="number" placeholder="10-Digit Mobile" required 
                               onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })} />
                        
                        <div className="input-group mb-3">
                            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Password (8+ chars)" required 
                                   onChange={(e) => setUser({ ...user, password: e.target.value })} />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <select className="form-select mb-4" required onChange={(e) => setUser({ ...user, role: e.target.value })}>
                            <option value="">-- Choose Role --</option>
                            {availableRoles.ROLE_ADMIN && <option value="ROLE_ADMIN">Admin (Owner)</option>}
                            {availableRoles.ROLE_MANAGER && <option value="ROLE_MANAGER">Manager (Reception)</option>}
                            <option value="ROLE_DOCTOR">Doctor (Specialist)</option>
                        </select>

                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Create Account</button>
                        <p className="text-center mt-3 small">Already registered? <Link to="/login">Login</Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;