import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/companies', label: 'Companies' },
  { to: '/beneficiaries', label: 'Beneficiaries' },
  { to: '/cases', label: 'Cases' }
];

export function AppLayout(): JSX.Element {
  return (
    <div className="app-shell">
      <header className="app-header">Case Management App</header>
      <div className="app-body">
        <aside className="sidebar">
          <nav>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
