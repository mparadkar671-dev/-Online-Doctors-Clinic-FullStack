import axios from 'axios';
const API_URL = "http://localhost:8080/doctors";
class DoctorService {
    getDoctors() { return axios.get(API_URL); }
    createDoctor(doctor) { return axios.post(API_URL, doctor); }
    deleteDoctor(id) { return axios.delete(`${API_URL}/${id}`); } // NEW
}
const doctorServiceInstance = new DoctorService();
export default doctorServiceInstance;