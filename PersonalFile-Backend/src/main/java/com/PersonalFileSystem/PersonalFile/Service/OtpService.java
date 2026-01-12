package com.PersonalFileSystem.PersonalFile.Service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private final JavaMailSender mailSender;
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public OtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpCache.put(email, otp);

        sendEmail(email, otp);

        return "OTP sent to your email address.";
    }

    private void sendEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your Employee Login OTP");
        message.setText("Your OTP is: " + otp + ". It will expire in 5 minutes.");
        mailSender.send(message);
    }

    public boolean validateOtp(String email, String otp) {
        if (otpCache.containsKey(email) && otpCache.get(email).equals(otp)) {
            otpCache.remove(email);
            return true;
        }
        return false;
    }
}