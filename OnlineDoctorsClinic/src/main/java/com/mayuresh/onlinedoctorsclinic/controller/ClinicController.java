package com.mayuresh.onlinedoctorsclinic.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mayuresh.onlinedoctorsclinic.entity.Appointment;
import com.mayuresh.onlinedoctorsclinic.entity.Doctor;
import com.mayuresh.onlinedoctorsclinic.entity.LeaveRequest;
import com.mayuresh.onlinedoctorsclinic.entity.Patient;
import com.mayuresh.onlinedoctorsclinic.repository.AppointmentRepository;
import com.mayuresh.onlinedoctorsclinic.repository.DoctorRepository;
import com.mayuresh.onlinedoctorsclinic.repository.LeaveRepository;
import com.mayuresh.onlinedoctorsclinic.repository.PatientRepository;

@RestController
@RequestMapping("/api/clinic")
@CrossOrigin(origins = {"http://localhost:3001", "http://localhost:3000"}, allowCredentials = "true")
public class ClinicController {

    @Autowired private DoctorRepository docRepo;
    @Autowired private AppointmentRepository apptRepo;
    @Autowired private PatientRepository patRepo;
    @Autowired private LeaveRepository leaveRepo;

    // --- DOCTOR & PATIENT ---
    @PostMapping("/doctors/profile")
    public ResponseEntity<?> saveDoctorProfile(@RequestBody Doctor d) { return ResponseEntity.ok(docRepo.save(d)); }
    
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() { return docRepo.findAll(); }

    @PostMapping("/patients")
    public Patient addPatient(@RequestBody Patient p) { return patRepo.save(p); }
    
    @GetMapping("/patients")
    public List<Patient> getPatients() { return patRepo.findAll(); }

    // --- APPOINTMENT SYSTEM ---
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() { return apptRepo.findAll(); }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(@RequestBody Appointment appt) {
        appt.setStatus("CONFIRMED");
        return ResponseEntity.ok(apptRepo.save(appt));
    }

    // FINAL FIXED RESCHEDULE LOGIC
    @PutMapping("/appointments/{id}/reschedule")
    public ResponseEntity<?> reschedule(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newTime = request.get("newTime");
        return apptRepo.findById(id).map(a -> {
            a.setAppointmentTime(newTime);
            a.setStatus("RESCHEDULED");
            return ResponseEntity.ok(apptRepo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- LEAVE SYSTEM ---
    @PostMapping("/leaves/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest lr) {
        lr.setStatus("PENDING");
        return ResponseEntity.ok(leaveRepo.save(lr));
    }

    @GetMapping("/leaves/pending")
    public List<LeaveRequest> getLeaves() { return leaveRepo.findAll(); }

    @PutMapping("/leaves/{id}/approve")
    public ResponseEntity<?> approveLeave(@PathVariable Long id) {
        return leaveRepo.findById(id).map(lr -> {
            lr.setStatus("APPROVED");
            return ResponseEntity.ok(leaveRepo.save(lr));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/leaves/{id}/reject")
    public ResponseEntity<?> rejectLeave(@PathVariable Long id) {
        return leaveRepo.findById(id).map(lr -> {
            lr.setStatus("REJECTED");
            return ResponseEntity.ok(leaveRepo.save(lr));
        }).orElse(ResponseEntity.notFound().build());
    }
}