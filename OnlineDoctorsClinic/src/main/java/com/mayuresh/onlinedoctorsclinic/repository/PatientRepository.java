package com.mayuresh.onlinedoctorsclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}