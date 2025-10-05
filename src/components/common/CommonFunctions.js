import { FaUser, FaDumbbell, FaShieldAlt } from "react-icons/fa";
import { decryptToken } from "../../utils/crypto";
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

export const getDecryptedUser = () => {
  const encryptedAuth = sessionStorage.getItem("auth_data");
  if (!encryptedAuth) return null;

  try {
    const decrypted = decryptToken(encryptedAuth);
    const parsed = JSON.parse(decrypted);
    return parsed?.userInfo || null;
  } catch (error) {
    console.error("Failed to decrypt auth_data:", error);
    return null;
  }
};
