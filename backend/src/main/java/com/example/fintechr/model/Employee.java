package com.example.fintechr.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import com.example.fintechr.model.enums.Status;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String department;
    private BigDecimal salary;
    private String city;
    private Status status;
}
