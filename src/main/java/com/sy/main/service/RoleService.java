package com.sy.main.service;

import com.sy.main.Entity.Role;

public interface RoleService {
	
	Role getRoleById(Integer roleId);

    Role getRoleByName(String roleName);


}
