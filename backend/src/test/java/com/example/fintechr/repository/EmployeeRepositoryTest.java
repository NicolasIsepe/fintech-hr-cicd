package com.example.fintechr.repository;

import com.example.fintechr.model.Employee;
import com.example.fintechr.model.enums.Status;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmployeeRepositoryTest {

    private final EmployeeRepository repository = new EmployeeRepository();

    @Test
    void givenMultipleEmployeesSavedWhenFindAllThenReturnAllEmployees() {
        var employee1 = createEmployee("John Doe", "john.email@email.com");
        var employee2 = createEmployee("Bob", "bob.ishere@email.com");
        var employee3 = createEmployee("Alice", "alice.inwonder@email.com");

        repository.save(employee1);
        repository.save(employee2);
        repository.save(employee3);

        var result = repository.findAll();

        assertEquals(List.of(employee1, employee2, employee3), result);
    }

    @Test
    void givenEmployeeWhenSaveThenReturnSavedEmployee() {
        var employee1 = createEmployee("John Doe", "john.email@email.com");

        var result = repository.save(employee1);

        assertEquals(employee1, result);
    }

    @Test
    void givenListOfEmployeesWhenFindByIdOneThenReturnFirstEmployee() {
        var employee1 = createEmployee("John Doe", "john.email@email.com");
        var employee2 = createEmployee("Bob", "bob.ishere@email.com");
        var employee3 = createEmployee("Alice", "alice.inwonder@email.com");

        repository.save(employee1);
        repository.save(employee2);
        repository.save(employee3);

        var result = repository.findById(1L);

        assertEquals(Optional.of(employee1), result);
    }

    @Test
    void givenListOfEmployeesWhenDeleteByIdOneThenReturnListWithoutFirstEmployee() {
        var employee1 = createEmployee("John Doe", "john.email@email.com");
        var employee2 = createEmployee("Bob", "bob.ishere@email.com");
        var employee3 = createEmployee("Alice", "alice.inwonder@email.com");

        repository.save(employee1);
        repository.save(employee2);
        repository.save(employee3);

        repository.deleteById(1L);

        var result = repository.findAll();

        assertEquals(List.of(employee2, employee3), result);
    }

    @Test
    void givenExistingEmployeeWhenReplaceThenReturnUpdatedEmployeeWrappedInOptional() {
        var employee = createEmployee("John Doe", "john.email@email.com");
        repository.save(employee);

        var employeeAtualizado = createEmployee("John Doe Updated", "john.updated@email.com");
        employeeAtualizado.setId(employee.getId());

        var result = repository.replace(employeeAtualizado);

        assertEquals(Optional.of(employeeAtualizado), result);
        assertEquals(List.of(employeeAtualizado), repository.findAll());
    }

    @Test
    void givenNonExistentEmployeeWhenReplaceThenReturnEmptyOptional() {
        var UnexistentEmployee = createEmployee("Ghost", "ghost@email.com");
        UnexistentEmployee.setId(99L);

        var result = repository.replace(UnexistentEmployee);

        assertEquals(Optional.empty(), result);
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