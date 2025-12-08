// routes.js
import { getDecryptedUser } from "../common/CommonFunctions";
import { ROLES, getUserRole, isTrainer, isClient, isAdministrator } from "../../utils/roles";

export const getRoutes = () => {
  const user = getDecryptedUser();

  if (!user) return [];

  const userRole = getUserRole(user);

  return [
    ...(isTrainer(userRole) || user?.role === "Trainer"
      ? [
          // {
          //   label: "Dashboard",
          //   href: "/trainer-dashboard",
          //   icon: "bi-speedometer2",
          //   showIn: ["sidebar", "topbar"],
          // },
          // {
          //   label: "View Clients",
          //   href: "/AllClients",
          //   icon: "bi-people-fill",
          //   showIn: ["sidebar", "topbar"],
          // }
        ]
      : []),
    ...(isAdministrator(userRole) || user?.role === "Administrator"
      ? [
          {
            label: "Dashboard",
            href: "/admin-dashboard",
            icon: "bi-gear-fill",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
    ...(isClient(userRole) || user?.role === "Client"
      ? [
          // {
          //   label: "Dashboard",
          //   href: "/client-dashboard",
          //   icon: "bi-speedometer2",
          //   showIn: ["sidebar", "topbar"],
          // }
        ]
      : []),
  ];
};
