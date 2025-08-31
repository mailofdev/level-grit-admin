import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import ClientList from "./ClientList";
import ClientDetails from "./ClientDetails";

// ✅ Meal template (6 meals)
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

// Helper: generate random users with different data
function generateClients(count) {
  const names = ["Alex", "Sarah", "Mike", "Emma", "John", "Sophia", "David", "Olivia"];
  const streaks = ["5-day streak", "8-day streak", "12-day streak", "Missed meal"];
  const statuses = ["on-track", "attention"];

  return Array.from({ length: count }, (_, i) => {
    const name = `${names[i % names.length]} ${["Smith", "Johnson", "Chen", "Davis"][i % 4]}`;

    // ✅ Generate slightly different macros for each client
    const calorieTarget = 2200 + Math.floor(Math.random() * 600); // 2200–2800
    const proteinTarget = 150 + Math.floor(Math.random() * 80);   // 150–230
    const carbsTarget = 200 + Math.floor(Math.random() * 150);    // 200–350
    const fatTarget = 60 + Math.floor(Math.random() * 30);        // 60–90

    const consumedCalories = Math.floor(calorieTarget * Math.random());
    const consumedProtein = Math.floor(proteinTarget * Math.random());
    const consumedCarbs = Math.floor(carbsTarget * Math.random());
    const consumedFat = Math.floor(fatTarget * Math.random());

    // ✅ Randomize meals done/not-done
    const meals = mealTemplate.map((meal) => ({
      ...meal,
      done: Math.random() > 0.5,
    }));

    return {
      id: i + 1,
      name,
      streak: streaks[Math.floor(Math.random() * streaks.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      goal: i % 2 === 0 ? "Weight loss" : "Muscle gain",
      startDate: `Jan ${10 + i}, 2024`,
      meals,
      avatar: `https://i.pravatar.cc/50?img=${(i % 70) + 1}`,

      // ✅ unique macros
      macros: {
        calories: { target: calorieTarget, consumed: consumedCalories },
        protein: { target: proteinTarget, consumed: consumedProtein },
        carbs: { target: carbsTarget, consumed: consumedCarbs },
        fat: { target: fatTarget, consumed: consumedFat },
      },
    };
  });
}

export default function Clients({ count = 20 }) {
  const dispatch = useDispatch();
  const clients = useMemo(() => generateClients(count), [count]);

  const [selectedClient, setSelectedClient] = useState(clients[0]);

  return (
    <div className="container-fluid py-4 min-vh-100">
      <h2 className="mb-2 fw-bold">Trainer Dashboard</h2>
      <h6 className="text-muted mb-4">
        Monitor your clients' progress and send personalized guidance
      </h6>

      <div className="row g-4">
        <div className="col-12 col-md-3">
          <ClientList
            clients={clients}
            selectedClient={selectedClient}
            onSelect={setSelectedClient}
          />
        </div>
        <div className="col-12 col-md-9">
          <ClientDetails client={selectedClient} />
        </div>
      </div>
    </div>
  );
}
