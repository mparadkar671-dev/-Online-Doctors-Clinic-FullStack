package com.mayuresh.onlinedoctorsclinic.entity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="doctor")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String doctorName;
    private String specialization;
    private String experience;
    private double consultationFee;
    private String availability; // e.g., 10:00 AM - 04:00 PM
    private String contactNumber;
    private String email;

    public Doctor() {}
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return contactNumber; }
    public void setPhone(String phone) { this.contactNumber = phone; }
}