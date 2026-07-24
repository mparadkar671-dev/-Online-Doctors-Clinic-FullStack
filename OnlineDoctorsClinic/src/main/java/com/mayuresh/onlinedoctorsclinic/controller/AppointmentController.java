package com.mayuresh.onlinedoctorsclinic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mayuresh.onlinedoctorsclinic.entity.Appointment;
import com.mayuresh.onlinedoctorsclinic.service.AppointmentService;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {
    @Autowired
    private AppointmentService service;

    @PostMapping
    public Appointment save(@RequestBody Appointment app) {
        return service.book(app);
    }

    @GetMapping
    public List<Appointment> getAll() {
        return service.getAll();
    }
}