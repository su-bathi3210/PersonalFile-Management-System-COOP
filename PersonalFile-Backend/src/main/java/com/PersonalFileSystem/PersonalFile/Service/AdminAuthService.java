package com.PersonalFileSystem.PersonalFile.Service;

import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "Admin@123";

    public boolean authenticate(String username, String password) {
        return ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password);
    }
}
