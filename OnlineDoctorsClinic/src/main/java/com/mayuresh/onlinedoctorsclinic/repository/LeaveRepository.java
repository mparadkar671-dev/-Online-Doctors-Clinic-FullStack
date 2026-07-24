package com.mayuresh.onlinedoctorsclinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.LeaveRequest;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
}