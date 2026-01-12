package com.PersonalFileSystem.PersonalFile.Controller;

import com.PersonalFileSystem.PersonalFile.Config.JwtUtil;
import com.PersonalFileSystem.PersonalFile.Exception.EmailNotRegisteredException;
import com.PersonalFileSystem.PersonalFile.Model.Employee;
import com.PersonalFileSystem.PersonalFile.Repository.EmployeeRepository;
import com.PersonalFileSystem.PersonalFile.Service.OtpService;
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

    public EmployeeAuthController(EmployeeRepository employeeRepository, OtpService otpService, JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.otpService = otpService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/request-otp")
    public String requestOtp(@RequestParam String email) {

        employeeRepository.findByEmail(email)
                .orElseThrow(() ->
                        new EmailNotRegisteredException(
                                "Email is not registered. Please contact admin."
                        )
                );
        String otp = otpService.generateOtp(email);
        return "OTP sent to email (simulate): " + otp;
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.validateOtp(email, otp);
        if (!isValid) {
            throw new RuntimeException("Invalid OTP");
        }
        String token = jwtUtil.generateToken(email, "ROLE_EMPLOYEE");
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/profile")
    public Employee getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));
    }

    @PutMapping("/profile/update")
    public Employee updateMyPersonalDetails(Authentication authentication, @RequestBody Employee updatedDetails) {
        String email = authentication.getName();
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        employee.setName(updatedDetails.getName());
        employee.setPhoneNumber(updatedDetails.getPhoneNumber());
        employee.setNic(updatedDetails.getNic());
        employee.setAddress(updatedDetails.getAddress());
        employee.setDateOfBirth(updatedDetails.getDateOfBirth());

        return employeeRepository.save(employee);
    }
}
