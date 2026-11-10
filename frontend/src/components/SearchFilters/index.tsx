import { Search } from 'lucide-react';
import type { EmployeeStatus } from '../../types/employee';

interface SearchFiltersProps {
  search: string;
  status: string;
  role: string;
  roles: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}

function SearchFilters({
  search,
  status,
  role,
  roles,
  onSearchChange,
  onStatusChange,
  onRoleChange,
}: SearchFiltersProps) {
  return (
    <div className="search-filters">
      <label className="search-box">
        <span className="sr-only">Search employees</span>
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by name, role, or email"
        />
      </label>

      <label className="select-box">
        <span className="sr-only">Filter by status</span>
        <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="">All statuses</option>
          <option value={'IN_ANALYSIS' satisfies EmployeeStatus}>In analysis</option>
          <option value={'APPROVED' satisfies EmployeeStatus}>Approved</option>
          <option value={'REJECTED' satisfies EmployeeStatus}>Rejected</option>
          <option value={'HIRED' satisfies EmployeeStatus}>Hired</option>
        </select>
      </label>

      <label className="select-box">
        <span className="sr-only">Filter by role</span>
        <select value={role} onChange={(event) => onRoleChange(event.target.value)}>
          <option value="">All roles</option>
          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default SearchFilters;
