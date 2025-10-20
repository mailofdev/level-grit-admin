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
import { FaTrash, FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
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
  const client = location.state?.client;
  const isView = location.state?.isView;
  const toast = useRef(null);

  const [meals, setMeals] = useState([]);
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [mealToDelete, setMealToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);

  // ✅ Compute if assigned date is today
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
    if (!client?.clientId) {
      showToast("error", "Error", "No client selected. Redirecting...");
      setTimeout(() => navigate(-1), 2000);
      return;
    }
    if (assignedDate) {
      fetchMealPlan();
    }
  }, [client?.clientId, assignedDate]);

  const fetchMealPlan = async () => {
    setIsLoading(true);
    try {
      const data = await dispatch(
        getMealPlanThunk({
          clientId: client.clientId,
          date: assignedDate,
        })
      ).unwrap();

      setMeals(data?.meals?.length > 0 ? data.meals : [{ ...emptyMeal }]);
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Fetch error:", err);
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

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    setAssignedDate(newDate);

    if (newDate !== today) {
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
            clientId: client.clientId,
            date: assignedDate,
          })
        ).unwrap();

        setMeals(meals.filter((_, i) => i !== mealToDelete));
        showToast("success", "Deleted", "Meal deleted successfully.");
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error("Delete error:", err);
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

  // ✅ Updated validation (all fields required)
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
          clientId: client.clientId,
          date: assignedDate,
          meals: meals,
        })
      ).unwrap();

      showToast("success", "Saved", "Meal plan saved successfully.");
      setHasUnsavedChanges(false);
      await fetchMealPlan();
    } catch (err) {
      console.error("Save error:", err);
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
      variant: "btn-outline-primary",
      onClick: handleAddMeal,
      disabled: isView || isSaving || isDeleting || !isToday,
    },
    {
      label: "Save",
      icon: isSaving ? (
        <Spinner as="span" animation="border" size="sm" />
      ) : (
        ""
      ),
      variant: "btn-success",
      onClick: handleSave,
      disabled: isView || isSaving || isDeleting || !hasUnsavedChanges || !isToday,
    },
  ];

  const headingProps = {
    // pageName: `Plan for ${client?.fullName || 'N/A'}`,
    pageName: "Plan",
    onBack: handleBack,
    rightContent: isView ? (
      <div className="fw-semibold text-muted text-end">
        <div>{client?.fullName || "N/A"}</div>
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
    <div className="container">
      <Toast ref={toast} />
      <Heading {...headingProps} />
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 160px)", overflow: "hidden" }}>
        <div className="flex-grow-1 overflow-auto" style={{ paddingBottom: "20px" }}>
          {isLoading ? (
            <Loader fullScreen={true} text="Loading meal plan" color="#43a047" />
          ) : (
            <Card className="shadow-sm border-0 rounded-4 p-4 bg-white">
              {!isView && (
                // <Row className="align-items-end mb-4">
                //   <Col md={4} xs={12}>
                //     <Form.Group>
                //       <Form.Label className="fw-semibold">📅 Date</Form.Label>
                //       <Form.Control
                //         type="date"
                //         value={assignedDate}
                //         onChange={handleDateChange}
                //         className="rounded-3 shadow-sm"
                //         disabled={isView}
                //       />
                //     </Form.Group>
                //   </Col>
                //   <Col md={8} className="text-end">
                //     <Badge bg="info" className="fs-6 p-2 px-3 rounded-pill shadow-sm">
                //       👤 Client: <strong>{client?.fullName || "N/A"}</strong>
                //     </Badge>
                //     {!isToday && (
                //       <Badge bg="secondary" className="fs-6 p-2 px-3 ms-2 rounded-pill shadow-sm">
                //         🔒 Read-only
                //       </Badge>
                //     )}
                //     {hasUnsavedChanges && (
                //       <Badge bg="warning" className="fs-6 p-2 px-3 ms-2 rounded-pill shadow-sm">
                //         ⚠️ Unsaved Changes
                //       </Badge>
                //     )}
                //   </Col>
                // </Row>
                <></>
              )}

              {/* Accordion */}
              <Form>
                <Accordion activeKey={isView ? activeKeys : undefined} alwaysOpen>
                  {meals.map((meal, index) => (
                    <Accordion.Item
                      eventKey={index.toString()}
                      key={meal.id || `new-${index}`}
                      className="border rounded-3 mb-3 shadow-sm"
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            🍽️ <strong>Meal {index + 1}</strong>
                            {meal.mealName && (
                              <span className="ms-2 text-muted">- {meal.mealName}</span>
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
                              className="me-4 rounded-circle"
                              style={{ width: "36px", height: "36px" }}
                              disabled={isSaving || isDeleting}
                            >
                              <FaTrash />
                            </Button>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-3 gx-3 gy-3">
                          <Col md={4} xs={12}>
                            <Form.Group>
                              <Form.Label>Meal Name *</Form.Label>
                              <Form.Control
                                type="text"
                                value={meal.mealName}
                                onChange={(e) =>
                                  handleChange(index, "mealName", e.target.value)
                                }
                                placeholder="e.g., Pre-Workout"
                                className="rounded-3 shadow-sm"
                                disabled={isView || !isToday}
                              />
                            </Form.Group>
                          </Col>

                          {["protein", "fats", "carbs", "calories"].map((nutrient) => (
                            <Col md={2} xs={6} key={nutrient}>
                              <Form.Group>
                                <Form.Label className="text-capitalize">
                                  {nutrient} ({nutrient === "calories" ? "kcal" : "g"}) *
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={meal[nutrient]}
                                  onChange={(e) =>
                                    handleChange(index, nutrient, e.target.value)
                                  }
                                  className="rounded-3 shadow-sm"
                                  min="0"
                                  step="0.1"
                                  disabled={isView || !isToday}
                                />
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>📝 Meal Instructions *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={meal.instructions}
                            onChange={(e) =>
                              handleChange(index, "instructions", e.target.value)
                            }
                            placeholder="e.g., Eat with salad and lemon water"
                            className="rounded-3 shadow-sm"
                            disabled={isView || !isToday}
                          />
                        </Form.Group>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Form>
            </Card>
          )}
        </div>
      </div>

      {/* Save Confirmation Modal */}
      <Modal 
        show={showSaveConfirmModal} 
        onHide={() => setShowSaveConfirmModal(false)} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>💾 Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="mb-0 fs-6">
            You have unsaved changes. Would you like to save them before leaving?
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4"
            onClick={handleDontSaveAndGoBack}
            disabled={isSaving}
          >
            Don't Save
          </Button>
          <Button
            variant="success"
            className="rounded-pill px-4"
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

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteConfirmModal} 
        onHide={() => setShowDeleteConfirmModal(false)} 
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>🗑️ Delete Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="mb-0 fs-6">
            Are you sure you want to delete <strong>Meal {mealToDelete !== null ? mealToDelete + 1 : ''}</strong>
            {mealToDelete !== null && meals[mealToDelete]?.mealName ? 
              ` (${meals[mealToDelete].mealName})` : ''}? 
            {meals[mealToDelete]?.id ? ' This action cannot be undone.' : ''}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            variant="outline-secondary"
            className="rounded-pill px-4"
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
            className="rounded-pill px-4"
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
