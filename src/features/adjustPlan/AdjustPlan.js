import { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Accordion,
  Badge,
  Modal,
  Spinner,
} from "react-bootstrap";
import { FaTrash, FaSave, FaCalendar, FaPlus } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import AnimatedCard from "../../components/common/AnimatedCard";
import {
  getMealPlanThunk,
  createOrUpdateMealPlanThunk,
  deleteMealsThunk,
} from "./adjustPlanThunks";
import { useDispatch } from "react-redux";
import Loader from "../../components/display/Loader";

export default function AdjustPlan() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  
  // Get clientId from URL params (primary) or location state (fallback)
  const clientIdFromUrl = params?.clientId;
  const clientFromState = location.state?.client;
  const clientId = clientIdFromUrl || clientFromState?.clientId;
  
  // Create client object if we only have clientId
  const client = clientFromState || (clientId ? { clientId } : null);
  const isView = location.state?.isView;
  const initialDate = location.state?.initialDate;
  const toast = useRef(null);
  
  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('AdjustPlan Debug:', {
      clientIdFromUrl,
      clientFromState,
      finalClientId: clientId,
      client,
      params,
      locationState: location.state,
    });
  }

  const [meals, setMeals] = useState([]);
  const [assignedDate, setAssignedDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  const isToday = assignedDate === new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isView) {
      setActiveKeys(meals.map((_, idx) => idx.toString()));
    }
  }, [meals, isView]);

  const emptyMeal = {
    mealName: "",
    protein: "",
    fats: "",
    carbs: "",
    calories: "",
    instructions: "",
  };

  useEffect(() => {
    if (!clientId) {
      showToast("error", "Error", "No client selected. Redirecting...");
      setTimeout(() => navigate(-1), 2000);
      return;
    }
    if (assignedDate) {
      fetchMealPlan();
    }
  }, [clientId, assignedDate]);

  const fetchMealPlan = async () => {
    setIsLoading(true);
    try {
      const data = await dispatch(
        getMealPlanThunk({
          clientId: clientId,
          date: assignedDate,
        })
      ).unwrap();

      setMeals(data?.meals?.length > 0 ? data.meals : [{ ...emptyMeal }]);
      setHasUnsavedChanges(false);
    } catch (err) {
      // Error fetching meal plan
      showToast("error", "Error", err || "Failed to fetch meal plan.");
      setMeals([{ ...emptyMeal }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (severity, summary, detail) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const handleChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setMeals(updatedMeals);
    setHasUnsavedChanges(true);
  };

  const handleDateChangeRequest = () => {
    if (hasUnsavedChanges) {
      showToast("warn", "Unsaved Changes", "Please save or discard changes before changing the date.");
      return;
    }
    setShowDatePickerModal(true);
  };

  const handleDateChange = (newDate) => {
    const today = new Date().toISOString().split("T")[0];
    setAssignedDate(newDate);
    setShowDatePickerModal(false);

    if (newDate !== today && !isView) {
      showToast("warn", "Read-only Mode", "You can only edit today's plan.");
    }
  };

  const handleAddMeal = () => {
    if (!isToday) return;
    setMeals([...meals, { ...emptyMeal }]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveMeal = (index) => {
    setMealToDelete(index);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteMeal = async () => {
    if (mealToDelete === null) return;
    const meal = meals[mealToDelete];
    if (meal?.id) {
      setIsDeleting(true);
      try {
        await dispatch(
          deleteMealsThunk({
            mealIds: [meal.id],
            clientId: clientId,
            date: assignedDate,
          })
        ).unwrap();

        setMeals(meals.filter((_, i) => i !== mealToDelete));
        showToast("success", "Deleted", "Meal deleted successfully.");
        setHasUnsavedChanges(false);
      } catch (err) {
        // Error deleting meals
        showToast("error", "Delete Failed", err || "Failed to delete meal.");
      } finally {
        setIsDeleting(false);
        setShowDeleteConfirmModal(false);
        setMealToDelete(null);
      }
    } else {
      setMeals(meals.filter((_, i) => i !== mealToDelete));
      setHasUnsavedChanges(true);
      setShowDeleteConfirmModal(false);
      setMealToDelete(null);
      showToast("success", "Removed", "Unsaved meal removed.");
    }
  };

  const validateMeals = () => {
    const errors = [];

    if (meals.length === 0) {
      errors.push("At least one meal is required.");
    }

    meals.forEach((meal, idx) => {
      if (!meal.mealName?.trim()) {
        errors.push(`Meal ${idx + 1}: Meal Name is required.`);
      }
      if (!meal.instructions?.trim()) {
        errors.push(`Meal ${idx + 1}: Instructions are required.`);
      }

      ["protein", "fats", "carbs", "calories"].forEach((field) => {
        const value = meal[field];
        if (!value || isNaN(value) || Number(value) <= 0) {
          errors.push(`Meal ${idx + 1}: ${field} must be a positive number.`);
        }
      });
    });

    return errors;
  };

  const handleSave = async () => {
    if (!isToday) {
      showToast("warn", "Read-only Mode", "You can only save today's plan.");
      return;
    }

    const errors = validateMeals();
    if (errors.length > 0) {
      showToast("error", "Validation Error", errors.join(" "));
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        createOrUpdateMealPlanThunk({
          clientId: clientId,
          date: assignedDate,
          meals: meals,
        })
      ).unwrap();

      showToast("success", "Saved", "Meal plan saved successfully.");
      setHasUnsavedChanges(false);
      await fetchMealPlan();
    } catch (err) {
      // Error saving meal plan
      showToast("error", "Save Failed", err || "Failed to save meal plan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) setShowSaveConfirmModal(true);
    else navigate(-1);
  };

  const handleSaveAndGoBack = async () => {
    await handleSave();
    setShowSaveConfirmModal(false);
    setTimeout(() => navigate(-1), 500);
  };

  const handleDontSaveAndGoBack = () => {
    setShowSaveConfirmModal(false);
    navigate(-1);
  };

  const rightButtons = [
    {
      label: "Add",
      icon: <FaPlus />,
      variant: "btn-outline-primary",
      onClick: handleAddMeal,
      disabled: isView || isSaving || isDeleting || !isToday,
    },
    {
      label: "Save",
      icon: isSaving ? (
        <Spinner as="span" animation="border" size="sm" />
      ) : (
        <FaSave />
      ),
      variant: "btn-success",
      onClick: handleSave,
      disabled: isView || isSaving || isDeleting || !hasUnsavedChanges || !isToday,
    },
  ];

  const headingProps = {
    pageName: "Plan",
    onBack: handleBack,
    rightContent: isView ? (
      <div className="fw-semibold text-muted text-end">
        <div className="d-none d-md-block">{client?.fullName || "N/A"}</div>
        <small className="text-muted">
          {new Date(assignedDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </small>
      </div>
    ) : (
      rightButtons
    ),
  };

  return (
    <div className="container-fluid px-2 px-md-3 py-3 py-md-4">
      <Toast ref={toast} />
      <Heading {...headingProps} />
      
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 140px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto pb-3">
          {isLoading ? (
            <Loader fullScreen={true} text="Loading meal plan" color="#43a047" />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
                <Card className="border-0 rounded-4 p-2 p-md-4" style={{
                  backgroundColor: "var(--color-card-bg)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}>
              {/* Header - Row 1: Username */}
              <div className="mb-2">
                <h4 className="fw-bold mb-0" style={{ 
                  fontSize: "clamp(1rem, 3vw, 1.25rem)",
                  color: "var(--color-text-dark)",
                  lineHeight: "1.3"
                }}>{client?.fullName || "N/A"}</h4>
              </div>

              {/* Row 2: Date and Date Picker Button */}
              <div className="d-flex align-items-center justify-content-between gap-2 mb-3 p-2 rounded-3" style={{
                backgroundColor: "var(--color-card-bg-alt)"
              }}>
                <div className="d-flex align-items-center gap-2">
                  <FaCalendar style={{ 
                    color: "var(--color-primary)",
                    fontSize: "1rem"
                  }} />
                  <div>
                    <div className="fw-bold" style={{ 
                      fontSize: "0.9rem",
                      color: "var(--color-text-dark)"
                    }}>
                      {new Date(assignedDate).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  {!isToday && (
                    <Badge className="rounded-pill" style={{
                      backgroundColor: "rgba(108, 117, 125, 0.1)",
                      color: "var(--color-text-secondary)",
                      fontSize: "0.7rem",
                      padding: "0.25rem 0.5rem"
                    }}>
                      🔒 Read-only
                    </Badge>
                  )}
                  {hasUnsavedChanges && (
                    <Badge className="rounded-pill" style={{
                      backgroundColor: "rgba(255, 193, 7, 0.1)",
                      color: "var(--color-warning)",
                      fontSize: "0.7rem",
                      padding: "0.25rem 0.5rem"
                    }}>
                      ⚠️ Unsaved
                    </Badge>
                  )}
                  {!isView && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleDateChangeRequest}
                      className="rounded-pill"
                      disabled={isSaving || isDeleting}
                      style={{
                        minHeight: "36px",
                        fontSize: "0.75rem",
                        padding: "0.375rem 0.75rem"
                      }}
                    >
                      <FaCalendar className="me-1" /> 
                      <span className="d-none d-sm-inline">Change </span>Date
                    </Button>
                  )}
                </div>
              </div>

              {/* Mobile-Optimized Accordion */}
              <Form>
                <Accordion activeKey={isView ? activeKeys : undefined} alwaysOpen>
                  {meals.map((meal, index) => (
                    <Accordion.Item
                      eventKey={index.toString()}
                      key={meal.id || `new-${index}`}
                      className="border rounded-3 mb-3"
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-center justify-content-between w-100 pe-2">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2">
                              <span>🍽️</span>
                              <strong className="fs-6">Meal {index + 1}</strong>
                            </div>
                            {meal.mealName && (
                              <div className="text-muted small mt-1 text-truncate">
                                {meal.mealName}
                              </div>
                            )}
                          </div>
                          {!isView && isToday && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMeal(index);
                              }}
                              className="me-2 rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px", minHeight: "44px", minWidth: "44px" }}
                              disabled={isSaving || isDeleting}
                            >
                              <FaTrash size={14} />
                            </Button>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="p-2 p-md-3">
                        {/* Meal Name - Full Width on Mobile */}
                        <Row className="mb-3 gx-2 gx-md-3 gy-3">
                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label className="fw-semibold small">Meal Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={meal.mealName}
                                onChange={(e) =>
                                  handleChange(index, "mealName", e.target.value)
                                }
                                placeholder="e.g., Pre-Workout"
                                className="rounded-3"
                                style={{ minHeight: "44px" }}
                                disabled={isView || !isToday}
                              />
                            </Form.Group>
                          </Col>

                          {/* Nutrients - 2 per row on mobile, 4 in a row on desktop */}
                          {["protein", "fats", "carbs", "calories"].map((nutrient) => (
                            <Col xs={6} md={3} key={nutrient}>
                              <Form.Group>
                                <Form.Label className="fw-semibold small text-capitalize">
                                  {nutrient}
                                  <small className="text-muted ms-1">
                                    ({nutrient === "calories" ? "kcal" : "g"})
                                  </small>
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={meal[nutrient]}
                                  onChange={(e) =>
                                    handleChange(index, nutrient, e.target.value)
                                  }
                                  className="rounded-3"
                                  style={{ minHeight: "44px" }}
                                  min="0"
                                  step="0.1"
                                  disabled={isView || !isToday}
                                  inputMode="decimal"
                                />
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                        
                        {/* Instructions */}
                        <Form.Group className="mb-2">
                          <Form.Label className="fw-semibold small">📝 Meal Instructions *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={meal.instructions}
                            onChange={(e) =>
                              handleChange(index, "instructions", e.target.value)
                            }
                            placeholder="e.g., Eat with salad and lemon water"
                            className="rounded-3"
                            style={{ minHeight: "100px" }}
                            disabled={isView || !isToday}
                          />
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Form>
                </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Date Picker Modal - Centered */}
      <Modal
        show={showDatePickerModal}
        onHide={() => setShowDatePickerModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton style={{ 
          borderBottomColor: "var(--color-border)",
          backgroundColor: "var(--color-card-bg)"
        }}>
          <Modal.Title style={{ 
            fontSize: "1.1rem",
            color: "var(--color-text-dark)"
          }}>📅 Select Date</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ 
          backgroundColor: "var(--color-card-bg)"
        }}>
          <div className="mb-3 p-3 rounded-3" style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)"
          }}>
            <div className="d-flex align-items-start gap-2">
              <span style={{ fontSize: "1.2rem" }}>ℹ️</span>
              <div style={{ fontSize: "0.875rem", color: "var(--color-text-dark)" }}>
                <strong>Select a date to view or edit meal plans.</strong>
                <div className="mt-1" style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                  You can select any date to check old meals or plan future meals. Only today's date allows editing.
                </div>
              </div>
            </div>
          </div>
          <Form.Group>
            <Form.Label className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
              Select Date
            </Form.Label>
            <Form.Control
              type="date"
              value={assignedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-3"
              style={{ 
                minHeight: "44px", 
                fontSize: "16px",
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-input-bg)",
                color: "var(--color-text-dark)"
              }}
            />
          </Form.Group>
        </Modal.Body>
      </Modal>

      {/* Save Confirmation Modal - Mobile Optimized */}
      <Modal 
        show={showSaveConfirmModal} 
        onHide={() => setShowSaveConfirmModal(false)} 
        centered
        backdrop="static"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>💾 Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          <p className="mb-0 fs-6">
            You have unsaved changes. Would you like to save them before leaving?
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 flex-column flex-sm-row gap-2">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4 w-100 w-sm-auto"
            style={{ minHeight: "44px" }}
            onClick={handleDontSaveAndGoBack}
            disabled={isSaving}
          >
            Don't Save
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4 w-100 w-sm-auto"
            style={{ minHeight: "44px" }}
            onClick={handleSaveAndGoBack}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="me-2" />
                Save & Exit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal - Mobile Optimized */}
      <Modal 
        show={showDeleteConfirmModal} 
        onHide={() => setShowDeleteConfirmModal(false)} 
        centered
        backdrop="static"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>🗑️ Delete Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3 p-md-4">
          <p className="mb-0 fs-6">
            Are you sure you want to delete <strong>Meal {mealToDelete !== null ? mealToDelete + 1 : ''}</strong>
            {mealToDelete !== null && meals[mealToDelete]?.mealName ? 
              ` (${meals[mealToDelete].mealName})` : ''}? 
            {meals[mealToDelete]?.id ? ' This action cannot be undone.' : ''}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 flex-column flex-sm-row gap-2">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4 w-100 w-sm-auto"
            style={{ minHeight: "44px" }}
            onClick={() => {
              setShowDeleteConfirmModal(false);
              setMealToDelete(null);
            }}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="rounded-pill px-4 w-100 w-sm-auto"
            style={{ minHeight: "44px" }}
            onClick={confirmDeleteMeal}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              <>
                <FaTrash className="me-2" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}