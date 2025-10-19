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
            href: "/dashboard",
            icon: "bi-speedometer2",
            showIn: ["sidebar", "topbar"],
          },
          {
            label: "View Clients",
            href: "/AllClients",
            icon: "bi-people-fill",
            showIn: ["sidebar", "topbar"],
          },
          // {
          //   label: "Meal Plans",
          //   href: "/meal-plans",
          //   icon: "bi-egg-fried",
          //   showIn: ["sidebar", "topbar"],
          // },
          // {
          //   label: "Progress Tracking",
          //   href: "/progress",
          //   icon: "bi-graph-up",
          //   showIn: ["sidebar", "topbar"],
          // },
          // {
          //   label: "Subscription",
          //   href: "/subscription",
          //   icon: "bi-credit-card",
          //   showIn: ["sidebar", "topbar"],
          // },
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
  ];
};
