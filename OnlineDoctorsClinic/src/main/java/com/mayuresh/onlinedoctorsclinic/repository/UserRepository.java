package com.mayuresh.onlinedoctorsclinic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    // NEW: Needed for the 1 Admin / 1 Manager limit logic
    Boolean existsByRole(String role); 
}