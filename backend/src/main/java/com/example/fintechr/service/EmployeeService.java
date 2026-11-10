package com.example.fintechr.service;

import com.example.fintechr.exception.custom.EmployeeNotFoundException;
import com.example.fintechr.model.Employee;
import com.example.fintechr.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee findEmployeeById(Long id) {
        var employee = employeeRepository.findById(id);
        return employee.orElseThrow(EmployeeNotFoundException::new);
    }

    public Employee updateEmployeeById(Long id, Employee updatedEmployee) {
        var originalEmployee = findEmployeeById(id);

        updatedEmployee = Employee.builder()
                .id(originalEmployee.getId())
                .name(orDefault(updatedEmployee.getName(), originalEmployee.getName()))
                .email(orDefault(updatedEmployee.getEmail(), originalEmployee.getEmail()))
                .phone(orDefault(updatedEmployee.getPhone(), originalEmployee.getPhone()))
                .role(orDefault(updatedEmployee.getRole(), originalEmployee.getRole()))
                .department(orDefault(updatedEmployee.getDepartment(), originalEmployee.getDepartment()))
                .salary(orDefault(updatedEmployee.getSalary(), originalEmployee.getSalary()))
                .city(orDefault(updatedEmployee.getCity(), originalEmployee.getCity()))
                .status(orDefault(updatedEmployee.getStatus(), originalEmployee.getStatus()))
                .build();

        return employeeRepository.replace(updatedEmployee).orElseThrow(() -> new EmployeeNotFoundException(id));
    }

    private <T> T orDefault(T newValue, T fallback) {
        return newValue == null ? fallback : newValue;
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public void deleteEmployeeById(Long id) {
        findEmployeeById(id);
        employeeRepository.deleteById(id);
    }
        
    public Employee replaceEmployee(Employee employee) {
        return employeeRepository.replace(employee)
                .orElseThrow(() -> new EmployeeNotFoundException(employee.getId()));
    }
}
