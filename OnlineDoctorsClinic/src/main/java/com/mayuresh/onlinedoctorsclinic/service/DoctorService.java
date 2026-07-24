package com.mayuresh.onlinedoctorsclinic.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mayuresh.onlinedoctorsclinic.entity.Doctor;
import com.mayuresh.onlinedoctorsclinic.repository.DoctorRepository;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    // 1. Save a doctor (Create)
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // 2. Get all doctors (Read)
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 3. Get doctor by ID (Read)
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    // 4. Update a doctor (Update)
    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor existingDoctor = doctorRepository.findById(id).orElse(null);
        if (existingDoctor != null) {
            existingDoctor.setDoctorName(doctorDetails.getDoctorName());
            existingDoctor.setSpecialization(doctorDetails.getSpecialization());
            existingDoctor.setEmail(doctorDetails.getEmail());
            existingDoctor.setPhone(doctorDetails.getPhone());
            return doctorRepository.save(existingDoctor);
        }
        return null;
    }

    // 5. Delete a doctor (Delete)
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}