package com.mayuresh.onlinedoctorsclinic.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mayuresh.onlinedoctorsclinic.entity.Appointment;
import com.mayuresh.onlinedoctorsclinic.repository.AppointmentRepository;

@Service
public class AppointmentService {
    @Autowired
    private AppointmentRepository appointmentRepository;

    public Appointment book(Appointment app) {
        return appointmentRepository.save(app);
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }
}