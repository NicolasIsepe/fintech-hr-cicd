import { BriefcaseBusiness, Check, Clock3, Plus, Users, X } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeTable from '../../components/EmployeeTable';
import FeedbackMessage from '../../components/FeedbackMessage';
import LoadingState from '../../components/LoadingState';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';
import SearchFilters from '../../components/SearchFilters';
import { useEmployeeList } from '../../hooks/useEmployeeList';

const ITEMS_PER_PAGE = 5;

function Dashboard() {
  const navigate = useNavigate();
  const {
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
  } = useEmployeeList({ pageSize: ITEMS_PER_PAGE });

  const metrics = useMemo(
    () => ({
      total: employees.length,
      inAnalysis: employees.filter((item) => item.status === 'IN_ANALYSIS').length,
      approved: employees.filter((item) => item.status === 'APPROVED').length,
      rejected: employees.filter((item) => item.status === 'REJECTED').length,
      hired: employees.filter((item) => item.status === 'HIRED').length,
    }),
    [employees],
  );

  return (
    <div className="page-container">
      <PageHeader
        title="Overview"
        subtitle="Track your workforce and quickly find employees."
        action={
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate('/employees/new')}
          >
            <Plus size={17} aria-hidden="true" />
            New employee
          </button>
        }
      />

      <section className="metrics-grid" aria-label="Workforce indicators">
        <article className="metric-card">
          <span className="metric-icon metric-green"><Users size={20} /></span>
          <div><strong>{metrics.total}</strong><span>Total</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon metric-amber"><Clock3 size={20} /></span>
          <div><strong>{metrics.inAnalysis}</strong><span>In analysis</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon metric-blue"><Check size={20} /></span>
          <div><strong>{metrics.approved}</strong><span>Approved</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon metric-red"><X size={20} /></span>
          <div><strong>{metrics.rejected}</strong><span>Rejected</span></div>
        </article>
        <article className="metric-card">
          <span className="metric-icon metric-green"><BriefcaseBusiness size={20} /></span>
          <div><strong>{metrics.hired}</strong><span>Hired</span></div>
        </article>
      </section>

      {error && <FeedbackMessage type="error">{error}</FeedbackMessage>}

      <section className="content-card" aria-labelledby="employee-list-title">
        <h2 id="employee-list-title" className="sr-only">Employee list</h2>

        <SearchFilters
          search={search}
          status={statusFilter}
          role={roleFilter}
          roles={roles}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
          onRoleChange={setRoleFilter}
        />

        <div className="list-meta">
          <strong>{filteredEmployees.length} employees</strong>
        </div>

        {loading ? (
          <LoadingState label="Loading employees..." />
        ) : (
          <>
            <EmployeeTable employees={pageItems} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
              onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            />
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
