import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmployeeTable from '../../components/EmployeeTable';
import FeedbackMessage from '../../components/FeedbackMessage';
import LoadingState from '../../components/LoadingState';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import SearchFilters from '../../components/SearchFilters';
import { useEmployeeList } from '../../hooks/useEmployeeList';
import { deleteEmployee } from '../../services/employeeService';
import type { Employee } from '../../types/employee';

interface LocationState {
  success?: string;
}

const ITEMS_PER_PAGE = 8;

function Employees() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
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
  } = useEmployeeList({ pageSize: ITEMS_PER_PAGE });

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  async function handleConfirmDelete() {
    if (!employeeToDelete) return;

    try {
      setDeleting(true);
      setDeleteError('');
      await deleteEmployee(employeeToDelete.id);
      setDeleteSuccess(`${employeeToDelete.name} was deleted successfully.`);
      setEmployeeToDelete(null);
      await reload();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setDeleting(false);
    }
  }

  const routerSuccess = (location.state as LocationState | null)?.success;

  return (
    <div className="page-container">
      <PageHeader
        title="Employees"
        subtitle="Browse and manage all registered employees."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate('/employees/new')}
          >
            <Plus size={17} aria-hidden="true" /> New employee
          </button>
        }
      />

      {routerSuccess && <FeedbackMessage type="success">{routerSuccess}</FeedbackMessage>}
      {deleteSuccess && <FeedbackMessage type="success">{deleteSuccess}</FeedbackMessage>}
      {(error || deleteError) && (
        <FeedbackMessage type="error">{deleteError || error}</FeedbackMessage>
      )}

      <section className="content-card">
        <SearchFilters
          search={search}
          status={statusFilter}
          role={roleFilter}
          roles={roles}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onRoleChange={setRoleFilter}
        />

        <div className="list-meta"><strong>{filteredEmployees.length} employees</strong></div>

        {loading ? (
          <LoadingState label="Loading employees..." />
        ) : (
          <>
            <EmployeeTable
              employees={pageItems}
              onEdit={(employee) => navigate(`/employees/${employee.id}/edit`)}
              onDelete={(employee) => {
                setDeleteError('');
                setEmployeeToDelete(employee);
              }}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
              onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            />
          </>
        )}
      </section>

      {employeeToDelete && (
        <ConfirmDialog
          title="Delete employee"
          description={`Are you sure you want to delete ${employeeToDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          isConfirming={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setEmployeeToDelete(null)}
        />
      )}
    </div>
  );
}

export default Employees;
