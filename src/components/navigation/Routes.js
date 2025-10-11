import { getDecryptedUser } from "../common/CommonFunctions";

const user = getDecryptedUser();

const routes = [

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

export default routes;
