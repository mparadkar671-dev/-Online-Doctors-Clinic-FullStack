import axios from 'axios';
import BASE_URL from '../config/api';

const API_URL = `${BASE_URL}/doctors`;
class DoctorService {
    getDoctors() { return axios.get(API_URL); }
    createDoctor(doctor) { return axios.post(API_URL, doctor); }
    deleteDoctor(id) { return axios.delete(`${API_URL}/${id}`); } // NEW
}
const doctorServiceInstance = new DoctorService();
export default doctorServiceInstance;