import axios from 'axios';
import BASE_URL from '../config/api';

const API_URL = `${BASE_URL}/patients`;

class PatientService {
    getPatients() {
        return axios.get(API_URL);
    }
    createPatient(patient) {
        return axios.post(API_URL, patient);
    }
}

const patientServiceInstance = new PatientService();
export default patientServiceInstance;