package com.sy.main.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sy.main.Entity.Role;


public interface RoleRepo  extends JpaRepository<Role, Integer>{

	
	Optional<Role> findByRoleName(String roleName);
}
