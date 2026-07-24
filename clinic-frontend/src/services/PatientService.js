import axios from 'axios';

const API_URL = "http://localhost:8080/patients";

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