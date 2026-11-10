import { useCallback, useEffect, useMemo, useState } from 'react';
import { listEmployees } from '../services/employeeService';
import type { Employee } from '../types/employee';

interface UseEmployeeListOptions {
  pageSize: number;
}

export function useEmployeeList({ pageSize }: UseEmployeeListOptions) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setEmployees(await listEmployees());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const roles = useMemo(
    () => [...new Set(employees.map((item) => item.role))].sort(),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter(
      (item) =>
        (!term ||
          item.name.toLowerCase().includes(term) ||
          item.role.toLowerCase().includes(term) ||
          item.email.toLowerCase().includes(term)) &&
        (!statusFilter || item.status === statusFilter) &&
        (!roleFilter || item.role === roleFilter),
    );
  }, [employees, search, statusFilter, roleFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const pageItems = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return {
    employees,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    roles,
    filteredEmployees,
    pageItems,
    currentPage,
    setCurrentPage,
    totalPages,
    reload,
  };
}
