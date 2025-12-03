import { getRoutes } from "../navigation/Routes";
import { Link, useLocation } from "react-router-dom";
import { memo, useMemo } from "react";

const Sidebar = memo(({ showIcons }) => {
  const location = useLocation();
  const routes = useMemo(() => getRoutes(), []);

  const handleRouteClick = () => {};

  return (
    <nav
      id="sidebarMenu"
      className="bg-light sidebar p-0 shadow min-vh-100 h-100"
    >
      <div className="position-sticky top-0 pt-3">
        <ul className="nav flex-column">
          {routes
            .filter((item) => item.showIn?.includes("sidebar"))
            .map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link
                  to={item.href}
                  className={`nav-link d-flex align-items-center px-3 py-2 ${
                    location.pathname === item.href ? "active" : ""
                  } ${item.danger ? "text-danger" : ""}`}
                  onClick={handleRouteClick}
                >
                  {showIcons && item.icon && (
                    <i className={`bi ${item.icon} me-2`}></i>
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: 250px;
          transition: width 0.3s;
        }

        .nav-link {
          transition: background-color 0.2s ease, color 0.2s ease;
          font-size: 0.95rem;
        }

        .nav-link:hover {
          background-color: var(--color-card-bg-hover);
          color: var(--color-text-dark);
        }

        .nav-link.active {
          font-weight: 600;
          background-color: var(--color-card-bg-alt);
          border-left: 4px solid var(--color-primary);
          color: var(--color-primary);
        }

        @media (max-width: 991.98px) {
          .sidebar { display: none; }
        }
      `}</style>
    </nav>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
