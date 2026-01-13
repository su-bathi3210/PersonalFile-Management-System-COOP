package com.PersonalFileSystem.PersonalFile.Controller;

import com.PersonalFileSystem.PersonalFile.Config.JwtUtil;
import com.PersonalFileSystem.PersonalFile.Exception.EmailNotRegisteredException;
import com.PersonalFileSystem.PersonalFile.Model.Employee;
import com.PersonalFileSystem.PersonalFile.Repository.EmployeeRepository;
import com.PersonalFileSystem.PersonalFile.Service.OtpService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/employee/auth")
public class EmployeeAuthController {

    private final EmployeeRepository employeeRepository;
    private final OtpService otpService;
    private final JwtUtil jwtUtil;

    public EmployeeAuthController(EmployeeRepository employeeRepository,
                                  OtpService otpService,
                                  JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
    }

    // ===================== REQUEST OTP =====================
    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestParam String email) {
        email = email.toLowerCase();

        if (!employeeRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Email is not registered. Please contact admin.");
        }

        otpService.generateOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    // ===================== VERIFY OTP =====================
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email,
                                       @RequestParam String otp) {
        email = email.toLowerCase();

        if (!otpService.validateOtp(email, otp)) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid OTP");
        }

        // Employee MUST exist here
        if (!employeeRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Employee profile not found");
        }

        String token = jwtUtil.generateToken(email, "ROLE_EMPLOYEE");
        return ResponseEntity.ok(Map.of("token", token));
    }

    // ===================== GET PROFILE =====================
    @GetMapping("/profile")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Object> getMyProfile(Authentication authentication) {
        String email = authentication.getName().toLowerCase();

        return employeeRepository.findByEmail(email)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Employee profile not found"));
    }


    // ===================== UPDATE PROFILE =====================
    @PutMapping("/profile/update")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> updateMyPersonalDetails(Authentication authentication,
                                                     @RequestBody Employee updatedDetails) {

        String email = authentication.getName().toLowerCase();

        Employee employee = employeeRepository.findByEmail(email)
                .orElse(null);

        if (employee == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Employee not found");
        }

        employee.setName(updatedDetails.getName());
        employee.setPhoneNumber(updatedDetails.getPhoneNumber());
        employee.setNic(updatedDetails.getNic());
        employee.setAddress(updatedDetails.getAddress());
        employee.setDateOfBirth(updatedDetails.getDateOfBirth());

        return ResponseEntity.ok(employeeRepository.save(employee));
    }
}

