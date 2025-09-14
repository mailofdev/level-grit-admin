import { FaUser, FaDumbbell, FaShieldAlt } from "react-icons/fa";

// Function to return the correct icon based on role
const getRoleIcon = (role) => {
  switch (role) {
    case "Trainer":
      return <FaDumbbell size={20} className="text-white" />;
    case "Client":
      return <FaUser size={20} className="text-white" />;
    case "Administrator":
      return <FaShieldAlt size={20} className="text-white" />;
    default:
      return <FaUser size={20} className="text-white" />;
  }
};

export default getRoleIcon;
