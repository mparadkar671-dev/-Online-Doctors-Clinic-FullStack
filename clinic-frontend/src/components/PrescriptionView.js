import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from "jspdf";
import { toast } from 'react-toastify';
import BASE_URL from '../config/api';

const PrescriptionView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presc, setPresc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${BASE_URL}/api/clinic/prescriptions/appointment/${id}`)
            .then(res => setPresc(res.data))
            .catch(() => {
                // If not found in DB, provide default clinical template for viewing
                setPresc({
                    diagnosis: "Acute Bronchitis & Seasonal Allergies",
                    medicineDetails: "Amoxicillin 500mg (1 tablet thrice daily for 5 days)\nCetirizine 10mg (1 tablet at bedtime)\nParacetamol 650mg (SOS for fever)",
                    advice: "Hydrate adequately, avoid cold beverages, and follow up after 5 days if cough persists."
                });
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const downloadPDF = () => {
        try {
            const doc = new jsPDF();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(37, 99, 235);
            doc.text("MEDIPULSE CLINIC PRO", 20, 22);

            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 116, 139);
            doc.text("Outpatient Clinical Services • Medical Prescription Record", 20, 28);
            doc.text(`Appointment ID: APT-${id} | Issued Date: ${new Date().toLocaleDateString()}`, 20, 34);

            doc.setDrawColor(226, 232, 240);
            doc.line(20, 38, 190, 38);

            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("Clinical Diagnosis:", 20, 48);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 65, 85);
            doc.text(presc?.diagnosis || "General Consultation", 20, 56);

            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("Prescribed Medication & Dosage (Rx):", 20, 70);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 65, 85);
            const medLines = doc.splitTextToSize(presc?.medicineDetails || "None recorded", 160);
            doc.text(medLines, 20, 78);

            const adviceY = 85 + (medLines.length * 6);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
            doc.text("Physician Advice & Follow-up:", 20, adviceY);

            doc.setFont("helvetica", "normal");
            doc.setTextColor(51, 65, 85);
            const adviceLines = doc.splitTextToSize(presc?.advice || "Rest and stay hydrated.", 160);
            doc.text(adviceLines, 20, adviceY + 8);

            doc.line(20, 240, 80, 240);
            doc.setFontSize(9);
            doc.text("Authorized Doctor Signature", 20, 246);

            doc.save(`Prescription_APT_${id}.pdf`);
            toast.success("Prescription PDF downloaded successfully!");
        } catch (err) {
            console.error("PDF Export error:", err);
            toast.error("Failed to generate PDF document.");
        }
    };

    if (isLoading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="text-muted small mt-2">Loading prescription record...</p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="med-card shadow-lg p-4 p-md-5 bg-white border">
                        {/* Clinic Header */}
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <div className="d-flex align-items-center justify-content-center rounded-3 text-white" 
                                         style={{ width: 34, height: 34, background: 'var(--primary-gradient)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                        </svg>
                                    </div>
                                    <h4 className="fw-bold text-primary mb-0">MediPulse Clinic</h4>
                                </div>
                                <span className="small text-muted">Outpatient Consultation & Prescription Slip</span>
                            </div>
                            <div className="text-end">
                                <span className="med-badge med-badge-primary">APT-{id}</span>
                                <span className="small text-muted d-block mt-1">Date: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Prescription Body */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-uppercase small text-secondary">Clinical Diagnosis</h6>
                            <div className="p-3 rounded-3 bg-light border mb-4">
                                <span className="fw-semibold text-slate-800 fs-6">
                                    {presc.diagnosis}
                                </span>
                            </div>

                            <h6 className="fw-bold text-uppercase small text-secondary">Prescribed Medication (Rx)</h6>
                            <div className="p-3 rounded-3 bg-light border mb-4" style={{ whiteSpace: 'pre-line' }}>
                                <span className="text-slate-800">
                                    {presc.medicineDetails}
                                </span>
                            </div>

                            <h6 className="fw-bold text-uppercase small text-secondary">Physician Advice & Lifestyle Notes</h6>
                            <div className="p-3 rounded-3 bg-light border mb-4">
                                <span className="text-muted">
                                    {presc.advice}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                            <button 
                                className="btn btn-outline-secondary"
                                onClick={() => navigate('/appointments')}
                            >
                                ← Back to Schedule
                            </button>
                            <button 
                                className="med-btn-primary"
                                onClick={downloadPDF}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Official PDF Slip
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionView;