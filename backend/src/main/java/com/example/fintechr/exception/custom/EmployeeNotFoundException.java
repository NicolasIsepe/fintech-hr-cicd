package com.example.fintechr.exception.custom;

public class EmployeeNotFoundException extends RuntimeException {
    public EmployeeNotFoundException() {
        super("Employee could not be found");
    }

    public EmployeeNotFoundException(Long id) {
        super(String.format("Employee with id '%d' could not be found", id));
    }
}
