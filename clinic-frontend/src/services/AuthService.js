import axios from 'axios';

const API_URL = "http://localhost:8080/auth";

class AuthService {
    login(username, password) {
        return axios.post(`${API_URL}/login`, { username, password })
            .then(response => {
                // response.data contains the JwtResponse from Java
                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

const authServiceInstance = new AuthService();
export default authServiceInstance;