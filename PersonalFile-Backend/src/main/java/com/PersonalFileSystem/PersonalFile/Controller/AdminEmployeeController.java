package com.PersonalFileSystem.PersonalFile.Controller;

import com.PersonalFileSystem.PersonalFile.Model.Employee;
import com.PersonalFileSystem.PersonalFile.Repository.EmployeeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin/employees")
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployeeController {

    private final EmployeeRepository employeeRepository;

    public AdminEmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // ===================== ADD EMPLOYEE =====================
    @PostMapping("/add")
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {

        employee.setEmail(employee.getEmail().toLowerCase());

        if (employeeRepository.existsByEmail(employee.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Employee already exists");
        }

        employeeRepository.save(employee);
        return ResponseEntity.ok("Employee added successfully");
    }

    // ===================== GET ALL =====================
    @GetMapping("/all")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }

    // ===================== GET BY ID =====================
    @GetMapping("/{id}")
    public ResponseEntity<Object> getEmployeeById(@PathVariable String id) {

        return employeeRepository.findById(id)
                .<ResponseEntity<Object>>map(ResponseEntity::ok)
                .orElse(ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Employee not found"));
    }

    // ===================== UPDATE =====================
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id,
                                            @RequestBody Employee employeeDetails) {

        Employee employee = employeeRepository.findById(id).orElse(null);

        if (employee == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Employee not found");
        }

        employee.setName(employeeDetails.getName());
        employee.setPhoneNumber(employeeDetails.getPhoneNumber());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setNic(employeeDetails.getNic());
        employee.setAddress(employeeDetails.getAddress());
        employee.setDutyPlace(employeeDetails.getDutyPlace());
        employee.setGrade(employeeDetails.getGrade());
        employee.setSalaryScale(employeeDetails.getSalaryScale());

        employee.setDateOfBirth(employeeDetails.getDateOfBirth());
        employee.setFirstAppointmentDate(employeeDetails.getFirstAppointmentDate());
        employee.setPresentStatusDate(employeeDetails.getPresentStatusDate());
        employee.setIncrementDate(employeeDetails.getIncrementDate());
        employee.setDateOfReceiptGradeI(employeeDetails.getDateOfReceiptGradeI());
        employee.setDateOfReceiptGradeII(employeeDetails.getDateOfReceiptGradeII());
        employee.setDateOfReceiptGradeIII(employeeDetails.getDateOfReceiptGradeIII());
        employee.setDateOfCompulsoryRetirement(employeeDetails.getDateOfCompulsoryRetirement());

        return ResponseEntity.ok(employeeRepository.save(employee));
    }

    // ===================== DELETE =====================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {

        if (!employeeRepository.existsById(id)) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Employee not found");
        }

        employeeRepository.deleteById(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }
}

