package com.sy.main.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sy.main.Entity.User;
import com.sy.main.repository.UserRepo;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter  extends OncePerRequestFilter{

	
	@Autowired
	private JwtUtil jwt;
	
	@Autowired
	private UserRepo usr;
	
	protected void doFilterInternal(
			HttpServletRequest req,
			HttpServletResponse resp,
			FilterChain fc
			) throws ServletException, IOException{
		
		String ah=req.getHeader("Authorization");
		if(ah==null|| !ah.startsWith("Bearer ")) {
			fc.doFilter(req, resp);
			return;
		}
		String token=ah.substring(7);
		try {
			 String email = jwt.extractEmail(token);

	            if (email != null &&
	                SecurityContextHolder.getContext().getAuthentication() == null) {

	            	User user = usr.findByEmailWithRole(email)
	            	        .orElse(null);
	            	System.out.println("========== JWT CHECK ==========");
	            	System.out.println("Email from token: " + email);
	            	System.out.println("User found: " + (user != null));

	                if (user != null && jwt.isTokenValid(token, email)) {

	                	String role = user.getRole().getRoleName();

	                	System.out.println("========== JWT DEBUG ==========");
	                	System.out.println("Email: " + user.getEmail());
	                	System.out.println("Role from DB: " + role);

	                	var authority =
	                	        new org.springframework.security.core.authority.SimpleGrantedAuthority(
	                	                "ROLE_" + role
	                	        );

	                	System.out.println("Authority: " + authority.getAuthority());

	                	UsernamePasswordAuthenticationToken authentication =
	                	        new UsernamePasswordAuthenticationToken(
	                	                user,
	                	                null,
	                	                java.util.Collections.singletonList(authority)
	                	        );

	                	System.out.println("Authenticated: " + authentication.isAuthenticated());
	                	System.out.println("Authorities: " + authentication.getAuthorities());
	                	System.out.println("================================");

	                    authentication.setDetails(
	                            new WebAuthenticationDetailsSource()
	                                    .buildDetails(req)
	                    );

	                    SecurityContextHolder.getContext()
	                            .setAuthentication(authentication);
	                }
	            }

	        } catch (Exception e) {
	            // Invalid token
	            System.out.println("Invalid JWT: " + e.getMessage());
	        }

	        fc.doFilter(req, resp);
		}
	}
	

