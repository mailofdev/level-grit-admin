import { FaUser, FaDumbbell, FaShieldAlt } from "react-icons/fa";

const ROLE_MAPPINGS = {
  Trainer: {
    icon: <FaDumbbell size={20} className="text-white" />,
    emoji: "🏋️‍♂️"
  },
  Client: {
    icon: <FaUser size={20} className="text-white" />,
    emoji: "👤"
  },
  Administrator: {
    icon: <FaShieldAlt size={20} className="text-white" />,
    emoji: "👨‍💻"
  }
};

const DEFAULT_ROLE = {
  icon: <FaUser size={20} className="text-white" />,
  emoji: "👤"
};

const getRoleIcon = (role, type = 'icon') => {

  const roleMapping = ROLE_MAPPINGS[role] || DEFAULT_ROLE;
  
  if (type === 'emoji') {
    return (
      <span 
        className="text-white text-xl" 
        role="img" 
        aria-label={role || 'User'}
      >
        {roleMapping.emoji}
      </span>
    );
  }
  
  return roleMapping.icon;
};

export default getRoleIcon;