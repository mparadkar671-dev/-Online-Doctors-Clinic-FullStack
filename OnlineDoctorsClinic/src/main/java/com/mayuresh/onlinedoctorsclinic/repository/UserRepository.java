package com.mayuresh.onlinedoctorsclinic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mayuresh.onlinedoctorsclinic.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByRole(String role); 
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
}