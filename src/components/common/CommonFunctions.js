/**
 * Common Utility Functions
 * 
 * Shared utility functions used across multiple components.
 * Provides role-based UI helpers and user data retrieval.
 */

import { FaUser, FaDumbbell, FaShieldAlt } from "react-icons/fa";
import { decryptToken } from "../../utils/crypto";
import { getRoleString, normalizeRole } from "../../utils/roles";

// ============================================
// Role Mappings Configuration
// ============================================
/**
 * Maps user roles to their corresponding icons and emojis
 * Used for displaying role-specific UI elements throughout the app
 */
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

/**
 * Default role mapping when role is not recognized
 */
const DEFAULT_ROLE = {
  icon: <FaUser size={20} className="text-white" />,
  emoji: "👤"
};

// ============================================
// Role Icon Helper Function
// ============================================
/**
 * Returns the appropriate icon or emoji for a given user role
 * 
 * @param {string|number} role - User role (Trainer, Client, Administrator) or role code (0, 1, 2)
 * @param {string} type - Display type: 'icon' (React component) or 'emoji' (string)
 * @returns {React.ReactNode|string} - Icon component or emoji string
 * 
 * @example
 * getRoleIcon('Trainer', 'icon') // Returns <FaDumbbell />
 * getRoleIcon(1, 'emoji') // Returns "🏋️‍♂️"
 * getRoleIcon('Client', 'emoji') // Returns "👤"
 */
const getRoleIcon = (role, type = 'icon') => {
  // Normalize role to string if it's a number
  const roleString = typeof role === 'number' ? getRoleString(role) : role;
  const roleMapping = ROLE_MAPPINGS[roleString] || DEFAULT_ROLE;
  
  if (type === 'emoji') {
    return (
      <span 
        className="text-white text-xl" 
        role="img" 
        aria-label={roleString || 'User'}
      >
        {roleMapping.emoji}
      </span>
    );
  }
  
  return roleMapping.icon;
};

export default getRoleIcon;

// ============================================
// User Data Retrieval Function
// ============================================
/**
 * Retrieves and decrypts user information from session storage
 * 
 * Security:
 * - Uses encrypted session storage for sensitive data
 * - Handles decryption errors gracefully
 * - Returns null if data is invalid or missing
 * 
 * @returns {Object|null} - Decrypted user info object or null if unavailable
 * 
 * @example
 * const user = getDecryptedUser();
 * if (user) {
 *   console.log(user.fullName, user.role);
 * }
 */
export const getDecryptedUser = () => {
  const encryptedAuth = sessionStorage.getItem("auth_data");
  if (!encryptedAuth) return null;

  try {
    const decrypted = decryptToken(encryptedAuth);
    const parsed = JSON.parse(decrypted);
    return parsed?.userInfo || null;
  } catch (error) {
    // Failed to decrypt auth_data - invalid or corrupted
    // Return null to allow app to handle gracefully
    return null;
  }
};
