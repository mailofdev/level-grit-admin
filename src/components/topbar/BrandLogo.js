import { Link } from "react-router-dom";
import { memo, useMemo } from "react";
import logo from '../../assets/images/logo3.jpeg'; 
import { getRoutes } from "../navigation/Routes";

const BrandLogo = memo(() => {
  const routes = useMemo(() => getRoutes(), []);
  const homePath = useMemo(() => routes?.[0]?.href || "/", [routes]);
  
  return (
    <Link to={homePath} className="navbar-brand fw-bold d-flex align-items-center" aria-label="Level Grit Home">
      <img 
        src={logo} 
        alt="Level Grit Logo" 
        className="rounded"
        style={{ 
          width: '50px',
          height: '40px',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </Link>
  );
});

BrandLogo.displayName = 'BrandLogo';

export default BrandLogo;
