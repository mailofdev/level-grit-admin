/**
 * Landing Page Tabs Component
 * 
 * Modern tab-based UI for switching between Trainer and Client sections.
 * Provides smooth transitions and polished styling.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDumbbell, FaUser } from "react-icons/fa";
import TrainerSection from "./sections/TrainerSection";
import ClientSection from "./sections/ClientSection";

const LandingPageTabs = () => {
  const [activeTab, setActiveTab] = useState("trainer");

  const tabs = [
    {
      id: "trainer",
      label: "For Trainers",
      icon: FaDumbbell,
      color: "#667eea",
    },
    {
      id: "client",
      label: "For Clients",
      icon: FaUser,
      color: "#43e97b",
    },
  ];

  return (
    <div className="py-5" style={{ marginTop: "80px", minHeight: "calc(100vh - 80px)" }}>
      <div className="container">
        {/* Tab Navigation */}
        <motion.div
          className="d-flex justify-content-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="d-flex rounded-pill p-2 shadow-lg"
            style={{
              backgroundColor: "#f8f9fa",
              border: "2px solid #e9ecef",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const IsSubscriptionPaid = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-semibold"
                  style={{
                    backgroundColor: IsSubscriptionPaid ? tab.color : "transparent",
                    color: IsSubscriptionPaid ? "#fff" : "#6c757d",
                    border: "none",
                    padding: "12px 24px",
                    transition: "all 0.3s ease",
                    minHeight: "50px",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "trainer" ? (
              <TrainerSection />
            ) : (
              <ClientSection />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingPageTabs;

