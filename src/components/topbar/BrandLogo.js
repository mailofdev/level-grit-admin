import { Link } from "react-router-dom";
import { memo, useMemo } from "react";
import { getRoutes } from "../navigation/Routes";
import Logo from "../common/Logo";

const BrandLogo = memo(() => {
  const routes = useMemo(() => getRoutes(), []);
  const homePath = useMemo(() => routes?.[0]?.href || "/", [routes]);
  
  return (
    <Link 
      to={homePath} 
      className="navbar-brand fw-bold d-flex align-items-center text-decoration-none" 
      aria-label="Level Grit Home"
      style={{ lineHeight: 1 }}
    >
      <Logo variant="navbar" animated={true} />
    </Link>
  );
});

BrandLogo.displayName = 'BrandLogo';

export default BrandLogo;
