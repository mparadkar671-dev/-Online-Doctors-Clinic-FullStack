import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from "jspdf";

const PrescriptionView = () => {
    const { id } = useParams();
    const [presc, setPresc] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/clinic/prescriptions/appointment/${id}`)
             .then(res => setPresc(res.data));
    }, [id]);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("MEDICAL PRESCRIPTION", 20, 20);
        doc.text(`Diagnosis: ${presc.diagnosis}`, 20, 40);
        doc.text(`Medicines: ${presc.medicineDetails}`, 20, 60);
        doc.text(`Doctor Advice: ${presc.advice}`, 20, 80);
        doc.save("Prescription.pdf");
    };

    if(!presc) return <p>No prescription generated yet.</p>;

    return (
        <div className="card p-5 shadow">
            <h3 className="text-danger">Prescription Details</h3>
            <p><strong>Diagnosis:</strong> {presc.diagnosis}</p>
            <p><strong>Medicine:</strong> {presc.medicineDetails}</p>
            <button onClick={downloadPDF} className="btn btn-success">Download PDF</button>
        </div>
    );
};
export default PrescriptionView;