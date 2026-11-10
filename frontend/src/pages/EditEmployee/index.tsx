import { ArrowLeft } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import FeedbackMessage from '../../components/FeedbackMessage';
import LoadingState from '../../components/LoadingState';
import PageHeader from '../../components/PageHeader';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';
import type { EmployeeFormErrors, NewEmployee } from '../../types/employee';
import { hasErrors, normalizeEmployee, validateEmployee } from '../../utils/validateEmployee';

function toFormValue(employee: {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  salary: number;
  city: string;
  status: NewEmployee['status'];
}): NewEmployee {
  const { name, email, phone, role, department, salary, city, status } = employee;
  return { name, email, phone, role, department, salary, city, status };
}

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<NewEmployee | null>(null);
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const parsedId = Number(id);
  const isValidId = Number.isInteger(parsedId) && parsedId > 0;

  const loadEmployee = useCallback(async () => {
    if (!isValidId) {
      setLoadError('Invalid employee ID.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setLoadError('');
      const employee = await getEmployeeById(parsedId);
      setForm(toFormValue(employee));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }, [parsedId, isValidId]);

  useEffect(() => {
    void loadEmployee();
  }, [loadEmployee]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    const normalized = normalizeEmployee(form);
    const validationErrors = validateEmployee(normalized);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      await updateEmployee(parsedId, normalized);
      navigate(`/employees/${parsedId}`, {
        state: { success: 'Employee updated successfully.' },
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState label="Loading employee..." />;

  if (loadError || !form) {
    return (
      <div className="page-container">
        <FeedbackMessage type="error">{loadError || 'Employee not found.'}</FeedbackMessage>
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

  return (
    <div className="page-container narrow-page">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(`/employees/${parsedId}`)}
      >
        <ArrowLeft size={17} aria-hidden="true" /> Back to employee
      </button>

      <PageHeader title="Edit employee" subtitle="Update this employee's information." />

      {errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}

      <section className="content-card form-card">
        <EmployeeForm
          value={form}
          errors={errors}
          submitLabel="Save changes"
          isSubmitting={submitting}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/employees/${parsedId}`)}
        />
      </section>
    </div>
  );
}

export default EditEmployee;
