package com.mayuresh.onlinedoctorsclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    // Custom query to find prescription by appointment ID
    Prescription findByAppointmentId(Long appointmentId);
}