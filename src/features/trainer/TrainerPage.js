import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import { getClientsForTrainer } from '../../api/trainerAPI';
import { getClientDashboardByTrainer } from '../../api/trainerAPI';
import { getDecryptedUser } from '../../components/common/CommonFunctions';
import Loader from '../../components/display/Loader';
import PaymentPopup from '../../components/payments/PaymentPopup';
import { Toast } from 'primereact/toast';

/**
 * PWA-Optimized Mobile-First Trainer Dashboard
 * 
 * Features:
 * - Mobile-first design with social media style
 * - 4 tabs: Total, Inconsistent, Consistent, Inactive
 * - Auto-categorization based on meal logging streaks
 * - Smooth transitions, zero layout shifts
 * - PWA-friendly (no accidental logout)
 */
export default function TrainerPage() {
  const user = getDecryptedUser();
  const navigate = useNavigate();
  
  // State management
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('total');
  const [clientDetails, setClientDetails] = useState({}); // Cache client dashboard data
  const [refreshing, setRefreshing] = useState(false);
  const [pullToRefresh, setPullToRefresh] = useState({ isPulling: false, distance: 0 });
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const didFetchRef = useRef(false);
  const fetchPromisesRef = useRef({});
  const touchStartYRef = useRef(0);
  const scrollContainerRef = useRef(null);
  const toast = useRef(null);

  // Tab definitions
  const tabs = [
    { id: 'total', label: 'Total' },
    { id: 'inconsistent', label: 'Inconsistent' },
    { id: 'consistent', label: 'Consistent' },
    { id: 'inactive', label: 'Inactive' },
  ];

  /**
   */
  const getDaysSinceLastMeal = useCallback((lastMealDate) => {
    if (!lastMealDate) return null;
    const lastMeal = new Date(lastMealDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastMeal.setHours(0, 0, 0, 0);
    const diffTime = today - lastMeal;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  /**
   * Fetch client dashboard data for categorization
   */
  const fetchClientDetails = useCallback(async (clientId) => {
    // Return cached data if available
    if (clientDetails[clientId]) {
      return clientDetails[clientId];
    }

    // Prevent duplicate requests
    if (fetchPromisesRef.current[clientId]) {
      return fetchPromisesRef.current[clientId];
    }

    // Create fetch promise
    const fetchPromise = getClientDashboardByTrainer(clientId)
      .then((data) => {
        // Handle null response (404 - client has no dashboard data yet)
        if (!data) {
          const defaultDetails = {
            currentStreakDays: 0,
            lastMealDate: null,
            hasMealPlan: false,
            meals: [],
          };
          setClientDetails((prev) => ({
            ...prev,
            [clientId]: defaultDetails,
          }));
          delete fetchPromisesRef.current[clientId];
          return defaultDetails;
        }
        
        const details = {
          currentStreakDays: data?.currentStreakDays || data?.streakDays || data?.currentStreak || 0,
          lastMealDate: data?.lastMealDate || data?.lastMealLogDate || data?.lastMeal?.date || null,
          hasMealPlan: (data?.plannedMeals && data.plannedMeals.length > 0) || 
                      (data?.mealPlan && data.mealPlan.length > 0) || false,
          meals: data?.meals || [],
        };
        
        // Cache the result
        setClientDetails((prev) => ({
          ...prev,
          [clientId]: details,
        }));
        
        delete fetchPromisesRef.current[clientId];
        return details;
      })
      .catch((error) => {
        // Only log non-404 errors (404 is expected for newly added clients)
        if (error?.response?.status !== 404 && process.env.NODE_ENV === 'development') {
          console.error(`Error fetching details for client ${clientId}:`, error);
        }
        
        delete fetchPromisesRef.current[clientId];
        // Return default values on error
        const defaultDetails = {
          currentStreakDays: 0,
          lastMealDate: null,
          hasMealPlan: false,
          meals: [],
        };
        // Cache default to prevent repeated failed requests
        setClientDetails((prev) => ({
          ...prev,
          [clientId]: defaultDetails,
        }));
        return defaultDetails;
      });

    fetchPromisesRef.current[clientId] = fetchPromise;
    return fetchPromise;
  }, [clientDetails]);

  /**
   * Categorize client based on meal logging behavior
   * 
   * Logic:
   * - Newly Added → Total Clients (no meal plan assigned yet)
   * - After First Meal Assignment → Inconsistent Clients (has meal plan but streak < 7)
   * - 7-Day Streak Logging → Consistent Clients (streak >= 7)
   * - Break Streak (3 days no logging) → Back to Inconsistent Clients
   * - No Meal Logging for 15+ Days → Inactive Clients
   */
  const categorizeClient = useCallback((client, details) => {
    const { currentStreakDays, lastMealDate, hasMealPlan } = details;
    
    // Newly Added: No meal plan assigned yet
    if (!hasMealPlan) {
      return 'total';
    }

    // Check days since last meal
    const daysSinceLastMeal = getDaysSinceLastMeal(lastMealDate);
    
    // Inactive: No meal logging for 15+ days
    if (daysSinceLastMeal !== null && daysSinceLastMeal >= 15) {
      return 'inactive';
    }

    // Consistent: 7+ day streak
    if (currentStreakDays >= 7) {
      // But check if streak is broken (3 days no logging)
      if (daysSinceLastMeal !== null && daysSinceLastMeal >= 3) {
        return 'inconsistent';
      }
      return 'consistent';
    }

    // Inconsistent: Has meal plan but streak < 7 or broken streak
    return 'inconsistent';
  }, [getDaysSinceLastMeal]);

  /**
   * Fetch all clients and their details
   */
  const fetchClients = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch client list
      const clientsData = await getClientsForTrainer();
      const clientsArray = Array.isArray(clientsData) ? clientsData : [];
      
      setClients(clientsArray);

      // Fetch details for all clients in parallel (with batching to avoid overwhelming)
      // Only fetch if we don't have cached data for that client
      const clientsToFetch = clientsArray.filter((client) => {
        const clientId = client.clientId || client.id;
        return clientId && !clientDetails[clientId];
      });

      const batchSize = 5;
      for (let i = 0; i < clientsToFetch.length; i += batchSize) {
        const batch = clientsToFetch.slice(i, i + batchSize);
        await Promise.all(
          batch.map((client) => {
            const clientId = client.clientId || client.id;
            if (clientId) {
              return fetchClientDetails(clientId);
            }
            return Promise.resolve(null);
          })
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching clients:', error);
      }
      setClients([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchClientDetails, clientDetails]);

  // Initial fetch
  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;
    fetchClients();
  }, [fetchClients]);

  // Auto-refresh every 60 seconds to update categories (reduced frequency for better performance)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchClients(true);
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [fetchClients]);

  // Pull-to-refresh handler
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (touchStartYRef.current === 0) return;
      
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartYRef.current;
      
      if (window.scrollY === 0 && distance > 0) {
        e.preventDefault();
        const pullDistance = Math.min(distance, 100);
        setPullToRefresh({ isPulling: true, distance: pullDistance });
      }
    };

    const handleTouchEnd = () => {
      if (pullToRefresh.isPulling && pullToRefresh.distance > 50) {
        fetchClients(true);
      }
      setPullToRefresh({ isPulling: false, distance: 0 });
      touchStartYRef.current = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullToRefresh, fetchClients]);

  /**
   * Get clients filtered by active tab
   */
  const filteredClients = useMemo(() => {
    if (activeTab === 'total') {
      return clients;
    }

    return clients.filter((client) => {
      const clientId = client.clientId || client.id;
      if (!clientId) return false;

      const details = clientDetails[clientId];
      if (!details) {
        // If details not loaded yet, show in total only
        return activeTab === 'total';
      }

      const category = categorizeClient(client, details);
      return category === activeTab;
    });
  }, [clients, activeTab, clientDetails, categorizeClient]);

  /**
   * Get client category for display
   */
  const getClientCategory = useCallback((client) => {
    const clientId = client.clientId || client.id;
    if (!clientId) return 'total';
    
    const details = clientDetails[clientId];
    if (!details) return 'total';
    
    return categorizeClient(client, details);
  }, [clientDetails, categorizeClient]);

  /**
   * Handle client click - check payment status
   */
  const handleClientClick = useCallback((client) => {
    const isPaid = client.isSubscriptionPaid ?? client.IsSubscriptionPaid ?? true;
    if (isPaid === false) {
      return; // Don't navigate if not paid
    }
    const clientId = client.clientId || client.id;
    if (!clientId) return;
    navigate(`/client-details/${clientId}`, { state: { client } });
  }, [navigate]);

  /**
   * Handle pay now button click
   */
  const handlePayNow = useCallback((client, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedClient(client);
    setShowPaymentPopup(true);
  }, []);

  /**
   * Handle payment success
   */
  const handlePaymentSuccess = useCallback(() => {
    toast.current?.show({
      severity: 'success',
      summary: 'Payment Successful',
      detail: 'Client services have been activated successfully!',
      life: 4000,
    });
    
    // Refresh clients list
    fetchClients(true);
    
    setShowPaymentPopup(false);
    setSelectedClient(null);
  }, [fetchClients]);

  /**
   * Handle add client
   */
  const handleAddClient = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Pass client count to RegisterClientForm to avoid duplicate API call
    navigate('/register-client', { 
      replace: false,
      state: { clientCount: clients.length }
    });
  }, [navigate, clients.length]);

  /**
   * Get initial letter for avatar
   */
  const getInitial = useCallback((name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Loader
        fullScreen={true}
        text="Loading clients..."
        color="var(--color-primary)"
      />
    );
  }

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <PaymentPopup
        show={showPaymentPopup}
        onHide={() => {
          setShowPaymentPopup(false);
          setSelectedClient(null);
        }}
        onSuccess={handlePaymentSuccess}
        clientId={selectedClient?.clientId}
        clientName={selectedClient?.fullName}
        amount={500}
      />
      {/* Hide scrollbar for tabs */}
      <style>{`
        .tabs-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .tabs-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .trainer-page-container {
          min-height: 100vh;
          padding-bottom: env(safe-area-inset-bottom);
          -webkit-overflow-scrolling: touch;
        }
        .trainer-header {
          position: sticky;
          top: 0;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: var(--glass-bg) !important;
        }
        .tab-button {
          flex: 1 1 0;
          min-width: 0;
          min-height: 44px;
          -webkit-tap-highlight-color: transparent;
        }
        .tab-button.active {
          font-weight: 700;
        }
        .tab-button {
          transition: color 0.2s ease;
        }
        .tab-button:hover:not(.active) {
          color: var(--color-text-secondary) !important;
        }
        .client-item {
          min-height: 72px;
          -webkit-tap-highlight-color: transparent;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .client-item:active {
          background-color: var(--color-surface-variant) !important;
          transform: scale(0.98);
        }
        .avatar-circle {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
          color: white;
          font-weight: 600;
        }
        .client-card-locked {
          opacity: 0.6;
          filter: grayscale(0.3);
        }
      `}</style>
      <div
        ref={scrollContainerRef}
        className="trainer-page-container bg-theme"
      >
      {/* Pull-to-refresh indicator */}
      {pullToRefresh.isPulling && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.5rem',
            zIndex: 1000,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
              transform: `translateY(${Math.min(pullToRefresh.distance - 20, 60)}px) rotate(${pullToRefresh.distance * 3.6}deg)`,
              transition: 'transform 0.1s ease',
            }}
          >
            ↻
          </div>
        </div>
      )}
      {/* Header Section */}
      <div className="trainer-header bg-theme px-3" style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}>
        <Container fluid className="px-0">
          {/* Greeting */}
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div className="flex-grow-1" style={{ minWidth: 0 }}>
              <h1 className="fw-bold mb-1 text-theme-dark" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', lineHeight: '1.2' }}>
                Hi, {user?.fullName?.split(' ')[0] || 'Trainer'}
              </h1>
              <p className="mb-0 text-muted small" style={{ fontSize: 'clamp(0.75rem, 3vw, 0.875rem)', lineHeight: '1.4' }}>
                Let's Transform People Effortlessly
              </p>
            </div>
            <Button
              type="button"
              variant="light"
              className="rounded-pill border flex-shrink-0 text-nowrap fw-semibold"
              onClick={handleAddClient}
              style={{ 
                fontSize: 'clamp(0.75rem, 3vw, 0.875rem)'
              }}
            >
              Add Clients
            </Button>
          </div>
        </Container>
      </div>

   {/* Tabs Container */}
   <div className="position-relative w-100 mt-2 bg-theme">
            {/* Tabs */}
            <div
              className="d-flex w-100 tabs-scroll-container bg-theme"
              style={{ gap: 0 }}
              onScroll={(e) => {
                // Prevent scroll bounce on iOS
                if (e.currentTarget.scrollLeft < 0) {
                  e.currentTarget.scrollLeft = 0;
                }
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const count = tab.id === 'total' 
                  ? clients.length 
                  : clients.filter((c) => getClientCategory(c) === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button m-0 p-0 btn border-0 position-relative d-flex align-items-center justify-content-center ${
                      isActive ? 'active fw-bold text-theme-dark' : 'fw-normal text-muted'
                    }`}
                    style={{
                      fontSize: 'clamp(0.7rem, 2.2vw, 0.8rem)',
                      gap: '0.25rem',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <span className="flex-shrink-0">{tab.label}</span>
                    {count > 0 && (
                      <span
                        className="flex-shrink-0"
                        style={{
                          fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                        }}
                      >
                        ({count})
                      </span>
                    )}
                    {/* Active indicator - thick black underline extending slightly beyond text */}
                    {isActive && (
                      <div
                        className="position-absolute bg-theme"
                        style={{
                          bottom: 0,
                          left: '20%',
                          right: '20%',
                          height: '2.5px',
                          backgroundColor: 'var(--color-text-dark)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {/* Separator line below tabs */}
            <div 
              className="position-absolute w-100 border-theme"
              style={{
                bottom: 0,
                height: '1px',
                backgroundColor: 'var(--color-border)',
              }}
            />
          </div>

      {/* Client List - Instagram Style */}
      <div className="bg-theme" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <Container fluid className="px-0">
          {refreshing && (
            <div className="text-center py-2 text-muted small">
              Refreshing...
            </div>
          )}

          {filteredClients.length === 0 ? (
            <div className="text-center py-5 px-3 text-muted">
              <div className="mb-3" style={{ fontSize: '3rem' }}>👥</div>
              <p className="mb-0" style={{ fontSize: '0.9375rem', lineHeight: '1.5' }}>
                {activeTab === 'total'
                  ? 'No clients yet. Add your first client to get started!'
                  : `No ${tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} clients at the moment.`}
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column">
              {filteredClients.map((client, index) => {
                const clientId = client.clientId || client.id;
                const clientName = client.fullName || client.name || 'Unknown Client';
                const initial = getInitial(clientName);
                const isPaid = client.isSubscriptionPaid ?? client.IsSubscriptionPaid ?? true;

                return (
                  <div
                    key={clientId || index}
                    onClick={() => handleClientClick(client)}
                    className={`client-item d-flex align-items-center bg-theme border-bottom border-theme px-3 py-3 ${
                      isPaid !== false ? 'cursor-pointer' : 'client-card-locked'
                    }`}
                    style={{
                      gap: '0.75rem'
                    }}
                  >
                    {/* Avatar - Instagram Style */}
                    <div
                      className="avatar-circle rounded-circle d-flex align-items-center justify-content-center border-0 fw-semibold text-uppercase"
                      style={{
                        fontSize: '1.5rem'
                      }}
                    >
                      {initial}
                    </div>

                    {/* Client Info */}
                    <div className="flex-grow-1 d-flex align-items-center justify-content-between" style={{ minWidth: 0 }}>
                      <p className="mb-0 fw-semibold text-theme-dark text-truncate" style={{ fontSize: '0.9375rem', lineHeight: '1.4' }}>
                        {clientName}
                      </p>
                      {isPaid === false && (
                        <button
                          className="btn btn-primary btn-sm rounded-pill fw-semibold flex-shrink-0 ms-2"
                          onClick={(e) => handlePayNow(client, e)}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.75rem',
                            minHeight: '28px'
                          }}
                        >
                          Pay ₹500
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </div>
    </div>
    </>
  );
}
