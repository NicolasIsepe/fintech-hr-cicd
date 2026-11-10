import { Eye, MoreVertical, Pencil, Trash2, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { getInitials } from '../../utils/getInitials';
import type { Employee } from '../../types/employee';
import StatusBadge from '../StatusBadge';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

function EmployeeTable({ employees, onEdit, onDelete }: EmployeeTableProps) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasRowActions = Boolean(onEdit || onDelete);

  useEffect(() => {
    if (openMenuId === null) return;

    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  if (employees.length === 0) {
    return (
      <div className="empty-state" role="status">
        <UserRound size={30} aria-hidden="true" />
        <strong>No employees found</strong>
        <span>Try changing the search or filters.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th scope="col">Employee</th>
            <th scope="col">Role</th>
            <th scope="col">City</th>
            <th scope="col">Status</th>
            <th scope="col">Salary</th>
            <th scope="col" className="actions-column"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <button
                  type="button"
                  className="employee-cell-button"
                  onClick={() => navigate(`/employees/${employee.id}`)}
                >
                  <span className="employee-avatar" aria-hidden="true">
                    {getInitials(employee.name)}
                  </span>
                  <span className="employee-cell-text">
                    <strong>{employee.name}</strong>
                    <small>{employee.email}</small>
                  </span>
                </button>
              </td>
              <td>{employee.role}</td>
              <td>{employee.city || '—'}</td>
              <td><StatusBadge status={employee.status} /></td>
              <td>{formatCurrency(employee.salary)}</td>
              <td className="actions-cell">
                {hasRowActions ? (
                  <div
                    className="row-menu-wrapper"
                    ref={openMenuId === employee.id ? wrapperRef : undefined}
                    onKeyDown={(event) => {
                      if (event.key === 'Escape') setOpenMenuId(null);
                    }}
                  >
                    <button
                      type="button"
                      className="icon-button"
                      aria-haspopup="menu"
                      aria-expanded={openMenuId === employee.id}
                      aria-label={`Actions for ${employee.name}`}
                      title="Actions"
                      onClick={() =>
                        setOpenMenuId((current) => (current === employee.id ? null : employee.id))
                      }
                    >
                      <MoreVertical size={18} aria-hidden="true" />
                    </button>

                    {openMenuId === employee.id && (
                      <div className="row-menu" role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setOpenMenuId(null);
                            navigate(`/employees/${employee.id}`);
                          }}
                        >
                          <Eye size={15} aria-hidden="true" /> View details
                        </button>
                        {onEdit && (
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                              setOpenMenuId(null);
                              onEdit(employee);
                            }}
                          >
                            <Pencil size={15} aria-hidden="true" /> Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            role="menuitem"
                            className="danger-menu-item"
                            onClick={() => {
                              setOpenMenuId(null);
                              onDelete(employee);
                            }}
                          >
                            <Trash2 size={15} aria-hidden="true" /> Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="icon-button"
                    aria-label={`View details for ${employee.name}`}
                    title="View details"
                    onClick={() => navigate(`/employees/${employee.id}`)}
                  >
                    <Eye size={18} aria-hidden="true" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;
