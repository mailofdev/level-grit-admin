import { Link } from "react-router-dom";
import logo from '../../assets/images/logo3.jpeg';  
const BrandLogo = () => (
  <Link to="/dashboard" className="navbar-brand fw-bold d-flex align-items-center">
    <img 
      src={logo} 
      alt="Level Grit Logo" 
      style={{ height: "40px",width: "50px" }} 
    />
    {/* Level Grit */}
  </Link>
);

export default BrandLogo;
