// src/features/users/UserList.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ClientList from "./ClientList";
import ClientDetails from "./ClientDetails";

const clients = [
  {
    id: 1,
    name: "Alex Johnson",
    streak: "12-day streak",
    status: "on-track",
    goal: "Weight loss",
    startDate: "Jan 15, 2024",
    meals: [
      {
        name: "Meal 1 (Pre-Workout)",
        details:
          "1/2 scoop whey + 30 gm oats with 100 ml milk + 1 apple (1 serving of aristozyme liquid)",
        done: true,
        uploadTime: "2024-01-15T08:00:00Z"
      },
      {
        name: "Meal 2 (Breakfast/Post-Workout)",
        details: "250 ml milk + 2 banana + 2 tbsp peanut butter",
        done: true,
        uploadTime: "2024-01-15T09:00:00Z"
      },
      {
        name: "Meal 3 (Lunch)",
        details:
          "100 gm paneer bhurji/tikka/palak paneer + 3-4 phulka + sabji (1 serving of aristozyme liquid)",
        done: true,
        uploadTime: "2024-01-15T12:00:00Z"
      },
      {
        name: "Meal 4 (Evening Snack)",
        details: "100 gm curd + 1 bowl salad",
        done: false,
      },
      {
        name: "Meal 5 (Dinner)",
        details:
          "100 gm paneer bhurji/tikka/palak paneer + 3-4 phulka OR 1 bowl brown rice + 1 bowl salad (1 serving of aristozyme liquid)",
        done: false,
      },
      {
        name: "Meal 6 (Before Bed)",
        details: "100 gm curd",
        done: false,
      },
    ],
    avatar: "https://i.pravatar.cc/50?img=1",
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    streak: "8-day streak",
    status: "on-track",
    avatar: "https://i.pravatar.cc/50?img=2",
  },
  {
    id: 3,
    name: "Mike Chen",
    streak: "Missed meal",
    status: "attention",
    avatar: "https://i.pravatar.cc/50?img=3",
  },
  {
    id: 4,
    name: "Emma Davis",
    streak: "5-day streak",
    status: "on-track",
    avatar: "https://i.pravatar.cc/50?img=4",
  },
];

export default function UserList() {
  const dispatch = useDispatch();
  const [selectedClient, setSelectedClient] = useState(clients[0]);

  return (
    <div className="container-fluid py-4 min-vh-100">
      {/* Header */}
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
