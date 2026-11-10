import type { EmployeeStatus } from '../../types/employee';

interface StatusBadgeProps {
  status: EmployeeStatus;
}

const labels: Record<EmployeeStatus, string> = {
  IN_ANALYSIS: 'In analysis',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  HIRED: 'Hired',
};

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span className="status-dot" aria-hidden="true" />
      {labels[status]}
    </span>
  );
}

export default StatusBadge;
