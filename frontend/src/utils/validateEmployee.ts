import type { EmployeeFormErrors, NewEmployee } from '../types/employee';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmployee(employee: NewEmployee): NewEmployee {
  return {
    ...employee,
    name: employee.name.trim(),
    email: employee.email.trim().toLowerCase(),
    phone: employee.phone.trim(),
    role: employee.role.trim(),
    department: employee.department.trim(),
    city: employee.city.trim(),
  };
}

export function validateEmployee(employee: NewEmployee): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};

  if (!employee.name.trim()) {
    errors.name = 'Enter the full name.';
  } else if (employee.name.trim().length > 100) {
    errors.name = 'Name must be at most 100 characters.';
  }

  if (!employee.email.trim()) {
    errors.email = 'Enter an email address.';
  } else if (!EMAIL_REGEX.test(employee.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!employee.role.trim()) {
    errors.role = 'Enter the role.';
  }

  if (employee.phone.length > 20) {
    errors.phone = 'Phone must be at most 20 characters.';
  }

  if (employee.salary < 0) {
    errors.salary = 'Salary cannot be negative.';
  }

  return errors;
}

export function hasErrors(errors: EmployeeFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
