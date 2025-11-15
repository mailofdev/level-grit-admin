import React from "react";
import { useParams, useLocation } from "react-router-dom";
import ClientDashboardView from "../client/ClientDashboardView";

/**
 * Client Details Component
 * 
 * Wrapper component that uses the shared ClientDashboardView
 * with details-specific configuration (view-only for trainers).
 */
export default function ClientDetails() {
  const params = useParams();
  const location = useLocation();
  
  // Get clientId from URL params (primary) or location state (fallback)
  const clientIdFromUrl = params?.clientId;
  const clientFromState = location.state?.client;
  const clientId = clientIdFromUrl || clientFromState?.clientId;

  return (
    <ClientDashboardView
      viewMode="details"
      clientId={clientId}
      enableMealUpload={false}
      enableShareProgress={false}
      enableDatePicker={true}
      showHeading={true}
    />
  );
}
