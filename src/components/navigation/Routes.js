/**
 * Client Portal Navigation Routes
 * 
 * Defines the navigation menu items for the client portal.
 * Only includes routes relevant to clients/users.
 * 
 * @returns {Array} Array of route objects with label, href, icon, and display locations
 */
import { getDecryptedUser } from "../common/CommonFunctions";

export const getRoutes = () => {
  const user = getDecryptedUser();

  if (!user) return [];

  // Client Portal - Only client dashboard route
  return [
    {
      label: "Dashboard",
      href: "/client-dashboard",
      icon: "bi-speedometer2",
      showIn: ["sidebar", "topbar"],
    }
  ];
};
