/**
 * Role Management Utilities
 * 
 * Centralized role definitions and helper functions for multi-role PWA support.
 * Supports Client (0), Trainer (1), and Administrator (2) roles.
 */

// ============================================
// Role Constants
// ============================================
export const ROLES = {
  CLIENT: 0,
  TRAINER: 1,
  ADMINISTRATOR: 2,
};

// Role string mappings (for backward compatibility with existing API)
export const ROLE_STRINGS = {
  [ROLES.CLIENT]: "Client",
  [ROLES.TRAINER]: "Trainer",
  [ROLES.ADMINISTRATOR]: "Administrator",
};

// Reverse mapping: string to number
export const ROLE_NAMES = {
  "Client": ROLES.CLIENT,
  "Trainer": ROLES.TRAINER,
  "Administrator": ROLES.ADMINISTRATOR,
};

// ============================================
// Role Helper Functions
// ============================================

/**
 * Converts role number to role string
 * @param {number} roleCode - Numeric role code (0, 1, or 2)
 * @returns {string|null} - Role string or null if invalid
 */
export const getRoleString = (roleCode) => {
  return ROLE_STRINGS[roleCode] || null;
};

/**
 * Converts role string to role number
 * @param {string} roleString - Role string ("Client", "Trainer", or "Administrator")
 * @returns {number|null} - Role code or null if invalid
 */
export const getRoleCode = (roleString) => {
  return ROLE_NAMES[roleString] ?? null;
};

/**
 * Normalizes role to number format
 * Handles both string and number inputs
 * @param {string|number} role - Role as string or number
 * @returns {number|null} - Normalized role code or null if invalid
 */
export const normalizeRole = (role) => {
  if (typeof role === "number") {
    return Object.values(ROLES).includes(role) ? role : null;
  }
  if (typeof role === "string") {
    return getRoleCode(role);
  }
  return null;
};

/**
 * Checks if user has a specific role
 * @param {string|number} userRole - User's role (string or number)
 * @param {number} requiredRole - Required role code
 * @returns {boolean} - True if user has the required role
 */
export const hasRole = (userRole, requiredRole) => {
  const normalized = normalizeRole(userRole);
  return normalized === requiredRole;
};

/**
 * Checks if user has any of the specified roles
 * @param {string|number} userRole - User's role (string or number)
 * @param {number[]} allowedRoles - Array of allowed role codes
 * @returns {boolean} - True if user has one of the allowed roles
 */
export const hasAnyRole = (userRole, allowedRoles) => {
  const normalized = normalizeRole(userRole);
  return allowedRoles.includes(normalized);
};

/**
 * Gets user role from decrypted user data
 * @param {Object} user - User object from getDecryptedUser()
 * @returns {number|null} - Role code or null
 */
export const getUserRole = (user) => {
  if (!user) return null;
  return normalizeRole(user.role);
};

/**
 * Checks if user is a Client
 * @param {string|number|Object} roleOrUser - Role code, string, or user object
 * @returns {boolean}
 */
export const isClient = (roleOrUser) => {
  const role = typeof roleOrUser === "object" ? getUserRole(roleOrUser) : normalizeRole(roleOrUser);
  return role === ROLES.CLIENT;
};

/**
 * Checks if user is a Trainer
 * @param {string|number|Object} roleOrUser - Role code, string, or user object
 * @returns {boolean}
 */
export const isTrainer = (roleOrUser) => {
  const role = typeof roleOrUser === "object" ? getUserRole(roleOrUser) : normalizeRole(roleOrUser);
  return role === ROLES.TRAINER;
};

/**
 * Checks if user is an Administrator
 * @param {string|number|Object} roleOrUser - Role code, string, or user object
 * @returns {boolean}
 */
export const isAdministrator = (roleOrUser) => {
  const role = typeof roleOrUser === "object" ? getUserRole(roleOrUser) : normalizeRole(roleOrUser);
  return role === ROLES.ADMINISTRATOR;
};

