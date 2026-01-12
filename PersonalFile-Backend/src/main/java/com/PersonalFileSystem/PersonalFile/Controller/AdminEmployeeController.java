package com.PersonalFileSystem.PersonalFile.Controller;

import com.PersonalFileSystem.PersonalFile.Model.Employee;
import com.PersonalFileSystem.PersonalFile.Repository.EmployeeRepository;
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

    @PostMapping("/add")
    public String addEmployee(@RequestBody Employee employee) {
        employeeRepository.findByEmail(employee.getEmail()).ifPresent(e -> {
            throw new RuntimeException("Employee already exists");
        });

        employeeRepository.save(employee);
        return "Employee added successfully";
    }

    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @PutMapping("/update/{id}")
    public Employee updateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

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

        return employeeRepository.save(employee);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteEmployee(@PathVariable String id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("Employee not found");
        }
        employeeRepository.deleteById(id);
        return "Employee deleted successfully";
    }
}
