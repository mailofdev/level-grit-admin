import routes from "../navigation/Routes";
import { Link } from "react-router-dom";

const Sidebar = ({showIcons}) => {
  const handleRouteClick = (item) => { 
  };

  return (
    <nav
      id="sidebarMenu"
      className="collapse d-lg-block bg-light sidebar p-0 shadow min-vh-100"
    >
      <div className="position-sticky top-0 pt-3">
        <ul className="nav flex-column">
          {routes
            .filter((item) => item.showIn?.includes("sidebar"))
            .map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link
                  to={item.href}
                  className={`nav-link d-flex align-items-center px-3 py-2  ${item.danger ? "text-danger" : ""}`}
                  onClick={() => handleRouteClick(item)}
                >
                  {showIcons && item.icon && <i className={`bi ${item.icon} me-2`}></i>}
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Sidebar styling */}
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
          background-color: #e9ecef;
          color: #000;
        }

        .nav-link.active {
          font-weight: 600;
          background-color: #dee2e6;
          border-left: 4px solid #0d6efd;
          color: #0d6efd;
        }

        @media (max-width: 991.98px) {
          .sidebar {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Sidebar;
