package com.example.fintechr.controller;

import com.example.fintechr.exception.custom.EmployeeNotFoundException;
import com.example.fintechr.model.Employee;
import com.example.fintechr.model.enums.Status;
import com.example.fintechr.service.EmployeeService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private EmployeeService service;
    @Autowired
    private tools.jackson.databind.ObjectMapper objectMapper;

    @Test
    void givenEmployeesExistWhenGetAllEmployeesThenReturnAllEmployees() throws Exception {
        var employees = List.of(
                createEmployee("John Doe", "john@email.com"),
                createEmployee("Bob", "bob@email.com")
        );

        when(service.getAll()).thenReturn(employees);

        var employeesJson = objectMapper.writeValueAsString(employees);

        mockMvc.perform(get("/employees"))
                .andExpect(status().isOk())
                .andExpect(content().json(employeesJson));
    }

    @Test
    void givenValidEmployeeWhenCreateEmployeeThenReturnSavedEmployee() throws Exception {
        var employee = createEmployee("John Doe", "john@email.com");

        when(service.createEmployee(employee)).thenReturn(employee);

        var employeeJson = objectMapper.writeValueAsString(employee);

        mockMvc.perform(post("/employees")
                .contentType("application/json")
                .content(employeeJson))
                .andExpect(status().isCreated())
                .andExpect(content().json(employeeJson));
    }

    @Test
    void givenEmployeeIdWhenGetEmployeeThenReturnEmployee() throws Exception {
        var employee = createEmployee("Bob", "bob@email.com");

        when(service.findEmployeeById(1L)).thenReturn(employee);

        var employeeJson = objectMapper.writeValueAsString(employee);

        mockMvc.perform(get("/employees/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(employeeJson));

        verify(service).findEmployeeById(1L);
    }

    @Test
    void givenNonExistentEmployeeIdWhenGetEmployeeThenReturnNotFound() throws Exception {
        when(service.findEmployeeById(99L)).thenThrow(new EmployeeNotFoundException(99L));

        mockMvc.perform(get("/employees/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Employee with id '99' could not be found"))
                .andExpect(jsonPath("$.path").value("/employees/99"))
                .andExpect(jsonPath("$.timestamp").exists());
        
        verify(service).findEmployeeById(99L);
    }

    @Test
    void givenEmployeeIdWhenDeleteEmployeeThenReturnNoContent() throws Exception {
        var employee = createEmployee("John Doe", "john@email.com");
        when(service.findEmployeeById(1L)).thenReturn(employee);

        doNothing().when(service).deleteEmployeeById(1L);
        
        mockMvc.perform(delete("/employees/1"))
                .andExpect(status().isNoContent());

        verify(service).deleteEmployeeById(1L);
    }

    @Test
    void givenFullEmployeeUpdateWhenUpdateEmployeeThenReturnUpdatedEmployee() throws Exception {
        var updatedEmployee = createEmployee("Alice", "alice@email.com");

        when(service.updateEmployeeById(1L, updatedEmployee)).thenReturn(updatedEmployee);

        var updatedEmployeeJson = objectMapper.writeValueAsString(updatedEmployee);

        mockMvc.perform(patch("/employees/1")
                .contentType("application/json")
                .header("id", 1L)
                .content(updatedEmployeeJson))
                .andExpect(status().isOk())
                .andExpect(content().json(updatedEmployeeJson));

        verify(service).updateEmployeeById(1L, updatedEmployee);
    }

    @Test
    void givenHalfEmployeeUpdateWhenUpdateEmployeeThenReturnUpdatedEmployee() throws Exception {
        var updatedEmployee = createUpdateEmployee("Alice", "alice@email.com");

        when(service.updateEmployeeById(1L, updatedEmployee)).thenReturn(updatedEmployee);

        var updatedEmployeeJson = objectMapper.writeValueAsString(updatedEmployee);

        mockMvc.perform(patch("/employees/1")
                        .contentType("application/json")
                        .header("id", 1L)
                        .content(updatedEmployeeJson))
                .andExpect(status().isOk())
                .andExpect(content().json(updatedEmployeeJson));

        verify(service).updateEmployeeById(1L, updatedEmployee);
    }

    @Test
    void givenNonExistentEmployeeIdWhenUpdateEmployeeThenReturnNotFound() throws Exception {
        var updatedEmployee = createEmployee("Alice", "alice@email.com");

        when(service.updateEmployeeById(99L, updatedEmployee)).thenThrow(new EmployeeNotFoundException(99L));

        var updatedEmployeeJson = objectMapper.writeValueAsString(updatedEmployee);

        mockMvc.perform(patch("/employees/99")
                .contentType("application/json")
                .header("id", 1)
                .content(updatedEmployeeJson))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Employee with id '99' could not be found"))
                .andExpect(jsonPath("$.path").value("/employees/99"))
                .andExpect(jsonPath("$.timestamp").exists());

        verify(service).updateEmployeeById(99L, updatedEmployee);
    }

    private Employee createUpdateEmployee(String name, String email) {
        return Employee.builder()
                .name(name)
                .email(email)
                .phone("11999999998")
                .build();
    }

    private Employee createEmployee(String name, String email) {
        return Employee.builder()
                .name(name)
                .email(email)
                .phone("11999999999")
                .role("Software Engineer")
                .department("Technology")
                .salary(new BigDecimal("7500.00"))
                .city("São Paulo")
                .status(Status.HIRED)
                .build();
    }
}
