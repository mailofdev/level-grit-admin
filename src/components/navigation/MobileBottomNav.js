import { Link, useLocation, useNavigate } from "react-router-dom";
import { getRoutes } from "./Routes";

const MobileBottomNav = () => {
  const routes = getRoutes();
  const location = useLocation();
  const navigate = useNavigate();

  if (!routes || routes.length === 0) return null;

  // Curate desired order by label; fallback to route order
  const desiredOrder = ["Dashboard", "View Clients", "Messages", "Progress"];
  const byLabel = Object.fromEntries(routes.map(r => [r.label, r]));
  const curated = desiredOrder
    .map(label => byLabel[label])
    .filter(Boolean);
  const finalRoutes = (curated.length ? curated : routes)
    .filter((item) => item.showIn?.includes("topbar") || item.showIn?.includes("sidebar"))
    .slice(0, 4);

  // FAB target: prefer View Clients, else Dashboard, else first route
  const fabTarget = byLabel["View Clients"]?.href || byLabel["Dashboard"]?.href || routes?.[0]?.href || "/";

  return (
    <nav className="mobile-bottom-nav d-lg-none" aria-label="Primary">
      <div className="mobile-bottom-nav__container">
        <ul className="mobile-bottom-nav__list d-flex justify-content-evenly">
          {finalRoutes
            .map((item, idx) => {
              const active = location.pathname === item.href;
              return (
                <li className="mobile-bottom-nav__item" key={idx}>
                  <Link
                    to={item.href}
                    className={`mobile-bottom-nav__link ${active ? "active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.icon && <i className={`bi ${item.icon}`}></i>}
                    <span className="label text-truncate">{item.label}</span>
                    {active && <span className="active-indicator" aria-hidden="true"></span>}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
      {/* <button
        type="button"
        className="fab-primary"
        aria-label="Primary action"
        onClick={() => navigate(fabTarget)}
      >
        <i className="bi bi-plus-lg"></i>
      </button> */}
    </nav>
  );
};

export default MobileBottomNav;


