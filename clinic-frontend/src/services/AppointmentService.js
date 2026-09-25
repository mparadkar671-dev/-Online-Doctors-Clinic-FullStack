import axios from 'axios';
import BASE_URL from '../config/api';

const API_URL = `${BASE_URL}/appointments`;
class AppointmentService {
    getAppointments() { return axios.get(API_URL); }
    saveAppointment(appointment) { return axios.post(API_URL, appointment); }
}
const appointmentServiceInstance = new AppointmentService();
export default appointmentServiceInstance;