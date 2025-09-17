import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { decryptToken } from "../../utils/crypto";

// ✅ Decrypt user function
const getDecryptedUser = () => {
  const encryptedUserData = sessionStorage.getItem("user");
  if (!encryptedUserData) return null;
  try {
    const parsed = JSON.parse(encryptedUserData);
    const decrypted = decryptToken(parsed);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
};

// ✅ Meal template
const mealTemplate = [
  {
    name: "Meal 1 (Pre-Workout)",
    details: "1/2 scoop whey + 30 gm oats + 100 ml milk",
    done: true,
    uploadTime: "2024-01-15T08:00:00Z",
  },
  {
    name: "Meal 2 (Breakfast)",
    details: "2 bananas + peanut butter",
    done: true,
    uploadTime: "2024-01-15T09:00:00Z",
  },
  {
    name: "Meal 3 (Lunch)",
    details: "100 gm paneer + 3 phulka + sabji",
    done: true,
    uploadTime: "2024-01-15T12:00:00Z",
  },
  {
    name: "Meal 4 (Evening Snack)",
    details: "100 gm curd + 1 bowl salad",
    done: false,
  },
  {
    name: "Meal 5 (Dinner)",
    details: "100 gm paneer + 3 phulka OR 1 bowl brown rice + salad",
    done: false,
  },
  {
    name: "Meal 6 (Before Bed)",
    details: "100 gm curd",
    done: false,
  },
];

// ✅ Generate random clients
function generateClients(count) {
  const names = [
    "Alex",
    "Sarah",
    "Mike",
    "Emma",
    "John",
    "Sophia",
    "David",
    "Olivia",
  ];
  const streaks = [
    "5-day streak",
    "8-day streak",
    "12-day streak",
    "Missed meal",
  ];
  const statuses = ["on-track", "attention"];

  return Array.from({ length: count }, (_, i) => {
    const name = `${names[i % names.length]} ${
      ["Smith", "Johnson", "Chen", "Davis"][i % 4]
    }`;
    const calorieTarget = 2200 + Math.floor(Math.random() * 600);
    const proteinTarget = 150 + Math.floor(Math.random() * 80);
    const carbsTarget = 200 + Math.floor(Math.random() * 150);
    const fatTarget = 60 + Math.floor(Math.random() * 30);
    const consumedCalories = Math.floor(calorieTarget * Math.random());
    const consumedProtein = Math.floor(proteinTarget * Math.random());
    const consumedCarbs = Math.floor(carbsTarget * Math.random());
    const consumedFat = Math.floor(fatTarget * Math.random());
    const meals = mealTemplate.map((meal) => ({
      ...meal,
      done: Math.random() > 0.5,
    }));

    return {
      id: i + 1,
      fullName: name,
      email: `${name.split(" ").join("").toLowerCase()}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 1000000000)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      streak: streaks[Math.floor(Math.random() * streaks.length)],
      goal: i % 2 === 0 ? "Weight loss" : "Muscle gain",
      startDate: `Jan ${10 + i}, 2024`,
      meals,
      macros: {
        calories: { target: calorieTarget, consumed: consumedCalories },
        protein: { target: proteinTarget, consumed: consumedProtein },
        carbs: { target: carbsTarget, consumed: consumedCarbs },
        fat: { target: fatTarget, consumed: consumedFat },
      },
    };
  });
}

export default function AllClients() {
  const decryptedUser = getDecryptedUser();
  const user = decryptedUser || {};
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;
  const clients = useMemo(() => generateClients(20), []);

  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = clients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const handleClientClick = (client) => {
    navigate(`/client-details/${client.id}`, { state: { client } });
  };

  const handleAddClient = () => {
    navigate("/register-client");
  };

  return (
    <div className="container-fluid p-3" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Sticky Header */}
      <div className="shadow-sm p-3 bg-white rounded-3 mb-3 sticky-top" style={{ top: "0", zIndex: 1000 }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
          <div>
            <strong className="fs-5">Welcome, {user.fullName}</strong>
            <div className="text-muted small">Clients: {clients.length}</div>
          </div>
          <div className="small mb-2 mb-md-0">
            <span className="text-success">{clients.filter(c => c.status === "on-track").length} on track</span>,{" "}
            <span className="text-warning">{clients.filter(c => c.status === "attention").length} need attention</span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAddClient}>
            Add Client
          </button>
        </div>
      </div>

      {/* Grid Layout for Desktop/Tablets */}
      <div className="row g-3 d-none d-md-flex">
        {currentClients.map(client => (
          <div key={client.id} className="col-12 col-sm-6 col-md-4">
            <div
              className={`card h-100 shadow-sm rounded-3 ${
                client.status === "on-track"
                ? "bg-light-green br-light-green text-white"
                : "bg-light-orange br-light-orange text-white"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleClientClick(client)}
            >
              <div className="card-body">
                <h5 className="card-title mb-2">{client.fullName}</h5>
                <p className="mb-1 small"><strong>Goal:</strong> {client.goal}</p>
                <p className="mb-1 small"><strong>Start:</strong> {client.startDate}</p>
                <p className="mb-1 small"><strong>Streak:</strong> {client.streak}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Layout for Mobile */}
      <div className="d-md-none mt-3">
        <div className="list-group">
          {currentClients.map(client => (
            <button
              key={client.id}
              className={`list-group-item list-group-item-action ${
                  client.status === "on-track"
                ? "bg-light-green br-light-green text-white"
                : "bg-light-orange br-light-orange text-white"
              }`}
              onClick={() => handleClientClick(client)}
            >
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6 className="mb-0">{client.fullName}</h6>
                <small>{client.streak}</small>
              </div>
              <small><strong>Goal:</strong> {client.goal}</small><br />
              <small><strong>Start:</strong> {client.startDate}</small><br />
            </button>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Prev
        </button>
        <span className="small text-muted">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}
