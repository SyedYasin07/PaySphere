package com.sy.main.repository;

import com.sy.main.Entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepo extends JpaRepository<User, Integer> {

	Optional<User> findByEmail(String email);
	@Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.email = :email")
	Optional<User> findByEmailWithRole(@Param("email") String email);
	Optional<User> findByResetToken(String resetToken);
	Optional<User> findByVerificationToken(String verificationToken);
	long countByStatus(String status);
}
