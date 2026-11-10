import axios from 'axios';
import { api } from './api';
import type { Employee, NewEmployee, UpdateEmployee } from '../types/employee';

interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
}

function handleApiError(error: unknown, defaultMessage: string): Error {
  if (axios.isAxiosError<ApiErrorResponse | string>(error)) {
    const responseData = error.response?.data;

    if (typeof responseData === 'string' && responseData.trim()) {
      return new Error(responseData);
    }

    if (responseData && typeof responseData === 'object') {
      return new Error(responseData.message || responseData.error || defaultMessage);
    }

    if (!error.response) {
      return new Error(
        'Error! Bad Connection...',
      )
    }
  }

  return new Error(defaultMessage);
}

export async function listEmployees(): Promise<Employee[]> {
  try {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Could not load employees.');
  }
}

export async function getEmployeeById(id: number): Promise<Employee> {
  try {
    const response = await api.get<Employee>(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Could not find the employee.');
  }
}

export async function createEmployee(employee: NewEmployee): Promise<Employee> {
  try {
    const response = await api.post<Employee>('/employees', employee);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Could not create the employee.');
  }
}

export async function updateEmployee(
  id: number,
  employee: NewEmployee,
): Promise<Employee> {
  try {
    const response = await api.put<Employee>(`/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Could not save the changes.');
  }
}

export async function patchEmployee(
  id: number,
  data: UpdateEmployee,
): Promise<Employee> {
  try {
    const response = await api.patch<Employee>(`/employees/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Could not update the employee.');
  }
}

export async function deleteEmployee(id: number): Promise<void> {
  try {
    await api.delete(`/employees/${id}`);
  } catch (error) {
    throw handleApiError(error, 'Could not delete the employee.');
  }
}
