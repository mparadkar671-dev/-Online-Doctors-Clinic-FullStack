import axios from 'axios';
import BASE_URL from '../config/api';

const API_URL = `${BASE_URL}/auth`;

class AuthService {
    login(username, password) {
        return axios.post(`${API_URL}/login`, { username, password })
            .then(response => {
                if (response.data && response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    register(userData) {
        return axios.post(`${API_URL}/register`, userData)
            .then(response => response.data);
    }

    /**
     * Sends password reset link to user's registered email
     * @param {string} email Registered email address
     */
    sendPasswordResetEmail(email) {
        return axios.post(`${API_URL}/forgot-password`, { email })
            .then(response => response.data);
    }

    /**
     * Backward-compatible forgotPassword handler
     */
    forgotPassword(emailOrUsername, contact, newPassword) {
        if (contact && newPassword) {
            return axios.post(`${API_URL}/forgot-password`, {
                username: emailOrUsername,
                contact,
                newPassword
            }).then(response => response.data);
        }
        return this.sendPasswordResetEmail(emailOrUsername);
    }

    /**
     * Verifies if the reset token in URL is valid and not expired
     * @param {string} token 
     */
    verifyResetToken(token) {
        return axios.get(`${API_URL}/verify-reset-token?token=${encodeURIComponent(token)}`)
            .then(response => response.data);
    }

    /**
     * Confirms the new password using the validated token
     * @param {string} token 
     * @param {string} newPassword 
     */
    resetPassword(token, newPassword) {
        return axios.post(`${API_URL}/reset-password`, {
            token,
            newPassword
        }).then(response => response.data);
    }

    getAvailableRoles() {
        return axios.get(`${API_URL}/roles-available`)
            .then(response => response.data);
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;