import { Link, useLocation } from "react-router-dom";
import routes from "../navigation/Routes";

const NavMenu = ({ showIcons = true, onRouteClick }) => {
  const location = useLocation();

  return (
    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
      {routes
        .filter((item) => item.showIn?.includes("topbar"))
        .map((item, idx) => (
          <li className="nav-item" key={idx}>
            <Link
              to={item.href}
              className={`nav-link d-flex align-items-center px-3 py-2 ${
                location.pathname === item.href ? "active" : ""
              } ${item.danger ? "text-danger" : ""}`}
              onClick={() => onRouteClick(item)}
            >
              {showIcons && item.icon && <i className={`bi ${item.icon} me-1`}></i>}
              {item.label}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default NavMenu;
