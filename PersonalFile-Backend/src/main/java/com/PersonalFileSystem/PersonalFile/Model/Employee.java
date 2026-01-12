package com.PersonalFileSystem.PersonalFile.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Employees")
public class Employee {

    @Id
    private String id;
    private String email;
    private String name;
    private String phoneNumber;
    private String designation;
    private String nic;
    private String address;
    private String dutyPlace;
    private String grade;
    private String salaryScale;
    private LocalDate dateOfBirth;

    private LocalDate firstAppointmentDate;
    private LocalDate presentStatusDate;
    private LocalDate incrementDate;
    private LocalDate dateOfReceiptGradeI;
    private LocalDate dateOfReceiptGradeII;
    private LocalDate dateOfReceiptGradeIII;
    private LocalDate dateOfCompulsoryRetirement;

    private boolean active = true;
    public Employee(String email) {
        this.email = email;
    }
}