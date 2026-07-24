package com.mayuresh.onlinedoctorsclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}