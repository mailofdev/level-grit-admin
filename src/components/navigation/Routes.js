// routes.js
import { getDecryptedUser } from "../common/CommonFunctions";

export const getRoutes = () => {
  const user = getDecryptedUser();

  if (!user) return [];

  return [
    ...(user?.role === "Trainer"
      ? [
          {
            label: "Dashboard",
            href: "/trainer-dashboard",
            icon: "bi-speedometer2",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "View Clients",
            href: "/AllClients",
            icon: "bi-people-fill",
            showIn: ["sidebar", "topbar"],
          }
        ]
      : []),
    ...(user?.role === "Administrator"
      ? [
          {
            label: "Dashboard",
            href: "/admin-dashboard",
            icon: "bi-gear-fill",
            showIn: ["sidebar", "topbar"],
          },
        ]
      : []),
         ...(user?.role === "Client"
      ? [
          {
            label: "Dashboard",
            href: "/client-dashboard",
            icon: "bi-speedometer2",
            showIn: ["sidebar", "topbar"],
          }
        ]
      : []),
  ];
};
