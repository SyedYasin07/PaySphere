package com.sy.main.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.sy.main.Entity.User;

public class SecurityUtil {

    public static User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
            !authentication.isAuthenticated()) {

            throw new RuntimeException("User not authenticated");
        }

        return (User) authentication.getPrincipal();
    }
}