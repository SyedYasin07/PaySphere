package com.sy.main.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sy.main.dto.AdminDashboardRespDTO;
import com.sy.main.service.AdminDashboardService;

@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {
	@Autowired
	private AdminDashboardService ds;
	
	@GetMapping
	public AdminDashboardRespDTO getDashboard() {
		return ds.getDashboard();
	}
	
	
}
