export type EmployeeStatus =
  | 'IN_ANALYSIS'
  | 'APPROVED'
  | 'REJECTED'
  | 'HIRED';

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  city: string;
  status: EmployeeStatus;
}

export type NewEmployee = Omit<Employee, 'id'>;
export type UpdateEmployee = Partial<NewEmployee>;

export interface EmployeeFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  salary?: string;
  city?: string;
  status?: string;
}
