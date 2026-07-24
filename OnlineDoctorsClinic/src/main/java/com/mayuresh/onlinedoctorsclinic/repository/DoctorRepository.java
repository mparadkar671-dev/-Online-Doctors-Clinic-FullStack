package com.mayuresh.onlinedoctorsclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}