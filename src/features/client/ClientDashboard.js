import React from "react";
import ClientDashboardView from "./ClientDashboardView";

/**
 * Client Dashboard Component
 * 
 * Wrapper component that uses the shared ClientDashboardView
 * with dashboard-specific configuration.
 */
export default function ClientDashboard() {
  return (
    <ClientDashboardView
      viewMode="dashboard"
      enableMealUpload={true}
      enableShareProgress={true}
      enableDatePicker={true}
      showHeading={false}
    />
  );
}
