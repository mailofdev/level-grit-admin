import { Link, useLocation } from "react-router-dom";
import { getRoutes } from "./Routes";

const MobileBottomNav = () => {
  const routes = getRoutes();
  const location = useLocation();

  if (!routes || routes.length === 0) return null;

  return (
    <nav className="mobile-bottom-nav d-lg-none">
      <ul className="mobile-bottom-nav__list">
        {routes
          .filter((item) => item.showIn?.includes("topbar") || item.showIn?.includes("sidebar"))
          .slice(0, 4)
          .map((item, idx) => {
            const active = location.pathname === item.href;
            return (
              <li className="mobile-bottom-nav__item" key={idx}>
                <Link to={item.href} className={`mobile-bottom-nav__link ${active ? "active" : ""}`}>
                  {item.icon && <i className={`bi ${item.icon}`}></i>}
                  <span className="label">{item.label}</span>
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;


