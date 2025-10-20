import { Link } from "react-router-dom";
import logo from '../../assets/images/logo3.jpeg'; 
import { getRoutes } from "../navigation/Routes"; 
const BrandLogo = () => {
  const routes = getRoutes(); 
  return (
    <Link to={routes?.[0]?.href} className="navbar-brand fw-bold d-flex align-items-center">
      <img 
        src={logo} 
        alt="Level Grit Logo" 
        style={{ height: "40px",width: "50px" }} 
    />
    {/* Level Grit */}
  </Link>
)
}
export default BrandLogo;
