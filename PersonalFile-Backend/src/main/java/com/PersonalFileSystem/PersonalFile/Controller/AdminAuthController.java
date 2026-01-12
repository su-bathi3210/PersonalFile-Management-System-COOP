package com.PersonalFileSystem.PersonalFile.Controller;

import com.PersonalFileSystem.PersonalFile.Config.JwtUtil;
import com.PersonalFileSystem.PersonalFile.Service.AdminAuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/auth")
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    private final JwtUtil jwtUtil;

    public AdminAuthController(AdminAuthService adminAuthService, JwtUtil jwtUtil) {
        this.adminAuthService = adminAuthService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> req) {
        if (!adminAuthService.authenticate(req.get("username"), req.get("password"))) {
            throw new RuntimeException("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken("ADMIN", "ROLE_ADMIN");
        return Map.of("token", token);
    }
}
