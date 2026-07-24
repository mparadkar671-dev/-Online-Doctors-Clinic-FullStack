import axios from 'axios';
const API_URL = "http://localhost:8080/appointments";
class AppointmentService {
    getAppointments() { return axios.get(API_URL); }
    saveAppointment(appointment) { return axios.post(API_URL, appointment); }
}
const appointmentServiceInstance = new AppointmentService();
export default appointmentServiceInstance;