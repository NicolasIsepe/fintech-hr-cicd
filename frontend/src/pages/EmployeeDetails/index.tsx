import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  WalletCards,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ConfirmDialog from '../../components/ConfirmDialog';
import FeedbackMessage from '../../components/FeedbackMessage';
import LoadingState from '../../components/LoadingState';
import StatusBadge from '../../components/StatusBadge';
import { deleteEmployee, getEmployeeById } from '../../services/employeeService';
import type { Employee } from '../../types/employee';
import { formatCurrency } from '../../utils/formatCurrency';
import { getInitials } from '../../utils/getInitials';

interface LocationState {
  success?: string;
}

function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadEmployee = useCallback(async () => {
    if (!id) {
      setError('Employee ID not provided.');
      setLoading(false);
      return;
    }

    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      setError('Invalid employee ID.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setEmployee(await getEmployeeById(parsedId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadEmployee();
  }, [loadEmployee]);

  async function handleConfirmDelete() {
    if (!employee) return;

    try {
      setDeleting(true);
      setDeleteError('');
      await deleteEmployee(employee.id);
      navigate('/employees', {
        state: { success: `${employee.name} was deleted successfully.` },
      });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unexpected error.');
      setDeleting(false);
    }
  }

  if (loading) return <LoadingState label="Loading employee..." />;

  if (error || !employee) {
    return (
      <div className="page-container">
        <FeedbackMessage type="error">{error || 'Employee not found.'}</FeedbackMessage>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate('/employees')}
        >
          Back to employees
        </button>
      </div>
    );
  }

  const success = (location.state as LocationState | null)?.success;

  return (
    <div className="page-container narrow-page">
      <button type="button" className="back-link" onClick={() => navigate('/employees')}>
        <ArrowLeft size={17} aria-hidden="true" /> Back to employees
      </button>

      {success && <FeedbackMessage type="success">{success}</FeedbackMessage>}
      {deleteError && <FeedbackMessage type="error">{deleteError}</FeedbackMessage>}

      <header className="employee-detail-header">
        <div className="employee-detail-identity">
          <span className="employee-avatar employee-avatar-large" aria-hidden="true">
            {getInitials(employee.name)}
          </span>
          <div>
            <div className="employee-name-row">
              <h1>{employee.name}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p>{employee.role} • {employee.department || 'No department'}</p>
          </div>
        </div>

        <div className="detail-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate(`/employees/${employee.id}/edit`)}
          >
            <Pencil size={16} aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={() => setConfirmingDelete(true)}
          >
            <Trash2 size={16} aria-hidden="true" /> Delete
          </button>
        </div>
      </header>

      <section className="content-card details-card">
        <h2>Employee information</h2>
        <div className="details-grid">
          <div className="detail-group">
            <h3>Personal details</h3>
            <div className="detail-item"><Mail size={18} /><div><span>Email</span><strong>{employee.email}</strong></div></div>
            <div className="detail-item"><Phone size={18} /><div><span>Phone</span><strong>{employee.phone || 'Not provided'}</strong></div></div>
            <div className="detail-item"><MapPin size={18} /><div><span>City</span><strong>{employee.city || 'Not provided'}</strong></div></div>
          </div>
          <div className="detail-group">
            <h3>Job details</h3>
            <div className="detail-item"><BriefcaseBusiness size={18} /><div><span>Role</span><strong>{employee.role}</strong></div></div>
            <div className="detail-item"><Building2 size={18} /><div><span>Department</span><strong>{employee.department || 'Not provided'}</strong></div></div>
            <div className="detail-item"><WalletCards size={18} /><div><span>Salary</span><strong>{formatCurrency(employee.salary)}</strong></div></div>
          </div>
        </div>
        <div className="details-meta">ID {employee.id}</div>
      </section>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete employee"
          description={`Are you sure you want to delete ${employee.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          isConfirming={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}

export default EmployeeDetails;
