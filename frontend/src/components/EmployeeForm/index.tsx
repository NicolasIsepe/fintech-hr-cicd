import type { ChangeEvent, FormEvent } from 'react';
import type {
  EmployeeFormErrors,
  EmployeeStatus,
  NewEmployee,
} from '../../types/employee';
import FormField from '../FormField';

interface EmployeeFormProps {
  value: NewEmployee;
  errors: EmployeeFormErrors;
  submitLabel: string;
  isSubmitting: boolean;
  onChange: (value: NewEmployee) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

function EmployeeForm({
  value,
  errors,
  submitLabel,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  function updateTextField(
    field: keyof Pick<
      NewEmployee,
      'name' | 'email' | 'phone' | 'role' | 'department' | 'city'
    >,
  ) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: event.target.value });
    };
  }

  return (
    <form className="employee-form" onSubmit={onSubmit} noValidate>
      <section className="form-section" aria-labelledby="personal-data-title">
        <div className="section-heading">
          <h2 id="personal-data-title">Personal details</h2>
          <p>Contact information for the employee.</p>
        </div>

        <div className="form-grid">
          <FormField
            id="name"
            label="Full name"
            value={value.name}
            onChange={updateTextField('name')}
            required
            maxLength={100}
            error={errors.name}
            placeholder="e.g. Ana Souza"
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={value.email}
            onChange={updateTextField('email')}
            required
            maxLength={120}
            error={errors.email}
            placeholder="name@email.com"
          />
          <FormField
            id="phone"
            label="Phone"
            value={value.phone}
            onChange={updateTextField('phone')}
            maxLength={20}
            error={errors.phone}
            placeholder="(11) 99999-9999"
          />
          <FormField
            id="city"
            label="City"
            value={value.city}
            onChange={updateTextField('city')}
            maxLength={80}
            error={errors.city}
            placeholder="e.g. San Francisco"
          />
        </div>
      </section>

      <div className="form-divider" />

      <section className="form-section" aria-labelledby="job-data-title">
        <div className="section-heading">
          <h2 id="job-data-title">Job details</h2>
          <p>Information about the employee's role.</p>
        </div>

        <div className="form-grid">
          <FormField
            id="role"
            label="Role"
            value={value.role}
            onChange={updateTextField('role')}
            required
            maxLength={100}
            error={errors.role}
            placeholder="e.g. Software Engineer"
          />
          <FormField
            id="department"
            label="Department"
            value={value.department}
            onChange={updateTextField('department')}
            maxLength={100}
            error={errors.department}
            placeholder="e.g. Technology"
          />
          <FormField
            id="salary"
            label="Salary"
            type="number"
            min={0}
            step={0.01}
            value={value.salary}
            onChange={(event) =>
              onChange({
                ...value,
                salary: Number(event.target.value),
              })
            }
            error={errors.salary}
          />

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={value.status}
              onChange={(event) =>
                onChange({
                  ...value,
                  status: event.target.value as EmployeeStatus,
                })
              }
            >
              <option value="IN_ANALYSIS">In analysis</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="HIRED">Hired</option>
            </select>
          </div>
        </div>
      </section>

      <div className="form-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;
