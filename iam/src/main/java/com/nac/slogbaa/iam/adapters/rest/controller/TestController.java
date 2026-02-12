package com.nac.slogbaa.iam.adapters.rest.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secure")
public class TestController {
	
	@GetMapping("/ping")
	public String secureEndpoint() { return "Authenticated successfully"; }
	
	@PreAuthorize("hasRole('SUPER_ADMIN')")
	@GetMapping("/super-admin")
	public String superAdmin() {
	    return "Super Admin area";
	}
	
	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/admin")
	public String admin() {
	    return "Admin area";
	}
	
	@PreAuthorize("hasRole('TRAINEE')")
	@GetMapping("/trainee")
	public String trainee() {
	    return "Trainee area";
	}

}
