import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import FeedbackMessage from '../../components/FeedbackMessage';
import PageHeader from '../../components/PageHeader';
import { createEmployee } from '../../services/employeeService';
import type { EmployeeFormErrors, NewEmployee } from '../../types/employee';
import { hasErrors, normalizeEmployee, validateEmployee } from '../../utils/validateEmployee';

const INITIAL_FORM: NewEmployee = {
  name: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  salary: 0,
  city: '',
  status: 'IN_ANALYSIS',
};

function CreateEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState<NewEmployee>(INITIAL_FORM);
  const [errors, setErrors] = useState<EmployeeFormErrors>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalized = normalizeEmployee(form);
    const validationErrors = validateEmployee(normalized);
    setErrors(validationErrors);

    if (hasErrors(validationErrors)) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      const created = await createEmployee(normalized);
      navigate(`/employees/${created.id}`, {
        state: { success: 'Employee created successfully.' },
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Unexpected error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container narrow-page">
      <button type="button" className="back-link" onClick={() => navigate('/employees')}>
        <ArrowLeft size={17} aria-hidden="true" /> Back to employees
      </button>

      <PageHeader title="New employee" subtitle="Register a new employee record." />

      {errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}

      <section className="content-card form-card">
        <EmployeeForm
          value={form}
          errors={errors}
          submitLabel="Save employee"
          isSubmitting={submitting}
          onChange={setForm}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
        />
      </section>
    </div>
  );
}

export default CreateEmployee;
