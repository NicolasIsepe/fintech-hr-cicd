import { ChevronRight, House, UserPlus, Users } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Sidebar() {
  const { pathname } = useLocation();
  // Active for the list itself and any employee record (e.g. /employees/12/edit),
  // but not for /employees/new, which has its own nav item below.
  const isEmployeesActive =
    pathname.startsWith('/employees') && pathname !== '/employees/new';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand" aria-label="Fintech HR">
        <div className="sidebar-brand-text">
          <strong>Fintech</strong>
          <span>HR</span>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="sidebar-section-title">MENU</span>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <House size={19} aria-hidden="true" />
          <span>Overview</span>
        </NavLink>

        <Link
          to="/employees"
          className={`sidebar-link ${isEmployeesActive ? 'sidebar-link-active' : ''}`}
          aria-current={isEmployeesActive ? 'page' : undefined}
        >
          <Users size={19} aria-hidden="true" />
          <span>Employees</span>
        </Link>

        <NavLink
          to="/employees/new"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <UserPlus size={19} aria-hidden="true" />
          <span>New employee</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user" aria-label="HR team, People Operations">
          <div className="sidebar-user-avatar" aria-hidden="true">HR</div>
          <div className="sidebar-user-info">
            <strong>HR Team</strong>
            <span>People Operations</span>
          </div>
          <ChevronRight size={18} aria-hidden="true" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
