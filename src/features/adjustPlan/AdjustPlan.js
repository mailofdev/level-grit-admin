import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  Accordion,
  Badge,
  Modal,
  Table,
  Spinner,
} from "react-bootstrap";
import { FaPlus, FaTrash, FaEye, FaSave } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Heading from "../../components/navigation/Heading";
import {
  getMealPlanThunk,
  createOrUpdateMealPlanThunk,
  deleteMealsThunk,
  getMealPlanPreviewThunk,
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

  // State management
  const [meals, setMeals] = useState([]);
  const [assignedDate, setAssignedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [selectedMealIds, setSelectedMealIds] = useState([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Validation flag
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // isView true or false
  const [activeKeys, setActiveKeys] = useState([]);
useEffect(() => {
  if (isView) {
    setActiveKeys(meals.map((_, idx) => idx.toString())); // open all panels
  }
}, [meals, isView]);

  // Initial meal template
  const emptyMeal = {
    mealName: "",
    protein: "",
    fats: "",
    carbs: "",
    calories: "",
    instructions: "",
  };

  // Fetch meal plan when client or date changes
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

      setMeals(
        data?.meals?.length > 0 ? data.meals : [{ ...emptyMeal }]
      );
      setSelectedMealIds([]);
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

  const handleAddMeal = () => {
    setMeals([...meals, { ...emptyMeal }]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveMeal = (index) => {
    const meal = meals[index];
    
    // If meal exists in DB, mark for deletion
    if (meal?.id) {
      setSelectedMealIds((prev) =>
        prev.includes(meal.id)
          ? prev.filter((id) => id !== meal.id)
          : [...prev, meal.id]
      );
    } else {
      // For unsaved meals, remove immediately
      setMeals(meals.filter((_, i) => i !== index));
      setHasUnsavedChanges(true);
    }
  };

  const handleDeleteMeals = async () => {
    if (selectedMealIds.length === 0) {
      showToast("warn", "No Selection", "Please select meals to delete.");
      return;
    }

    // Confirmation
    if (!window.confirm(`Delete ${selectedMealIds.length} meal(s)? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(
        deleteMealsThunk({
          mealIds: selectedMealIds,
          clientId: client.clientId,
          date: assignedDate,
        })
      ).unwrap();

      // Remove deleted meals from state
      setMeals(meals.filter((meal) => !selectedMealIds.includes(meal.id)));
      setSelectedMealIds([]);
      showToast("success", "Deleted", "Meals deleted successfully.");
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Delete Failed", err || "Failed to delete meals.");
    } finally {
      setIsDeleting(false);
    }
  };

  const validateMeals = () => {
    const errors = [];
    const activeMeals = meals.filter((meal) => !selectedMealIds.includes(meal?.id));

    if (activeMeals.length === 0) {
      errors.push("At least one meal is required.");
    }

    activeMeals.forEach((meal, idx) => {
      if (!meal.mealName?.trim()) {
        errors.push(`Meal ${idx + 1}: Name is required.`);
      }
      
      // Check if at least one nutrient is filled
      const hasNutrient = meal.protein || meal.fats || meal.carbs || meal.calories;
      if (!hasNutrient) {
        errors.push(`Meal ${idx + 1}: At least one nutrient value is required.`);
      }

      // Validate numeric values
      ["protein", "fats", "carbs", "calories"].forEach((field) => {
        const value = meal[field];
        if (value && (isNaN(value) || Number(value) < 0)) {
          errors.push(`Meal ${idx + 1}: ${field} must be a positive number.`);
        }
      });
    });

    return errors;
  };

  const handleSave = async () => {
    const errors = validateMeals();
    
    if (errors.length > 0) {
      showToast("error", "Validation Error", errors.join(" "));
      return;
    }

    // Filter out meals marked for deletion
    const mealsToSave = meals.filter((meal) => !selectedMealIds.includes(meal?.id));

    setIsSaving(true);
    try {
      await dispatch(
        createOrUpdateMealPlanThunk({
          clientId: client.clientId,
          date: assignedDate,
          meals: mealsToSave,
        })
      ).unwrap();

      showToast("success", "Saved", "Meal plan saved successfully.");
      setHasUnsavedChanges(false);
      
      // Refresh data to get updated IDs
      await fetchMealPlan();
    } catch (err) {
      console.error("Save error:", err);
      showToast("error", "Save Failed", err || "Failed to save meal plan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!client?.clientId || !assignedDate) {
      showToast("warn", "Missing Data", "Client or date not selected.");
      return;
    }

    setIsLoadingPreview(true);
    try {
      const data = await dispatch(
        getMealPlanPreviewThunk({
          clientId: client.clientId,
          date: assignedDate,
        })
      ).unwrap();

      if (!data?.meals || data.meals.length === 0) {
        showToast("info", "No Data", "No meals found for preview.");
        return;
      }

      setPreviewData(data);
      setShowPreview(true);
    } catch (err) {
      console.error("Preview error:", err);
      showToast("error", "Preview Failed", err || "Failed to load preview.");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        return;
      }
    }
    navigate(-1);
  };

// inside AdjustPlan component

const rightButtons = [
  {
    label: "Add",
    icon: <FaPlus />,
    variant: "btn-outline-primary",
    onClick: handleAddMeal,
    disabled:  isView || isSaving || isDeleting,
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
    disabled:  isView || isSaving || isDeleting || !hasUnsavedChanges,
  },
  // {
  //   label: "Preview",
  //   icon: isLoadingPreview ? (
  //     <Spinner as="span" animation="border" size="sm" />
  //   ) : (
  //     <FaEye />
  //   ),
  //   variant: "btn-info text-white",
  //   onClick: handlePreview,
  //   disabled: isLoadingPreview || isSaving || isDeleting,
  // },
  {
    label: `Delete (${selectedMealIds.length})`,
    icon: isDeleting ? (
      <Spinner as="span" animation="border" size="sm" />
    ) : (
      <FaTrash />
    ),
    variant: "btn-danger",
    onClick: handleDeleteMeals,
    disabled: isView || isDeleting || isSaving || selectedMealIds.length === 0,
  },
  // {
  //   label: "Cancel",
  //   icon: <FaTrash style={{ transform: "rotate(45deg)" }} />, // ❌ or custom cancel icon
  //   variant: "btn-outline-secondary",
  //   onClick: handleCancel,
  //   disabled: isSaving || isDeleting,
  // },
];



  return (
    <div className="container">
      <Toast ref={toast} />
      <Heading pageName="Adjust Plan" sticky={true}  rightContent={rightButtons} />

      <div 
        // className={`d-flex flex-column ${isView ? "disabled-page" : ""}`}
         className="d-flex flex-column"
        style={{
          height: "calc(100vh - 160px)",
          overflow: "hidden",
        }}
      >
        <div
          className="flex-grow-1 overflow-auto"
          style={{ paddingBottom: "20px" }}
        >

          {/* Loading State */}
          {isLoading ? (
                <Loader fullScreen={true} text="Loading meal plan" color="#43a047" />
          ) : (
            <Card className="shadow-sm border-0 rounded-4 p-4 bg-white">
                <Row className="align-items-end mb-2">
                <Col md={4} xs={12}>
                  <Form.Group>
                    <Form.Label>
                      <strong>Date</strong>
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={assignedDate}
                      onChange={(e) => setAssignedDate(e.target.value)}
                      className="rounded-pill"
                      disabled={isView}
                    />
                  </Form.Group>
                </Col>
                <Col md={8} className="text-end">
                  <Badge bg="info" className="fs-6 p-2">
                    Client: <strong>{client?.fullName || "N/A"}</strong>
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge bg="warning" className="fs-6 p-2 ms-2">
                      Unsaved Changes
                    </Badge>
                  )}
                </Col>
              </Row>

              <Form>
                <Accordion activeKey={isView ? activeKeys : undefined} alwaysOpen>
                  {meals.map((meal, index) => (
                    <Accordion.Item
                      eventKey={index.toString()}
                      key={meal.id || `new-${index}`}
                      className={`border rounded mb-3 shadow-sm ${
                        selectedMealIds.includes(meal.id)
                          ? "border-danger border-2"
                          : ""
                      }`}
                    >
                      <Accordion.Header>
                        <div className="d-flex align-items-center justify-content-between w-100">
                          <div>
                            🍽️ <strong>Meal {index + 1}</strong>
                            {meal.mealName && (
                              <span className="ms-2 text-muted">
                                - {meal.mealName}
                              </span>
                            )}
                            {selectedMealIds.includes(meal.id) && (
                              <Badge bg="danger" className="ms-2">
                                Marked for deletion
                              </Badge>
                            )}
                          </div>
                          <div>
                            <Button
                              variant={
                                selectedMealIds.includes(meal.id)
                                  ? "danger"
                                  : "outline-danger"
                              }
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveMeal(index);
                              }}
                              className="me-4"
                              disabled={isView || isSaving || isDeleting}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <Row className="mb-3 gx-3 gy-3">
                          <Col md={4} xs={12}>
                            <Form.Group>
                              <Form.Label>
                                Meal Name <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                value={meal.mealName}
                                onChange={(e) =>
                                  handleChange(index, "mealName", e.target.value)
                                }
                                placeholder="e.g., Pre-Workout"
                                className="rounded-pill shadow-sm"
                                disabled={isView || selectedMealIds.includes(meal.id)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          {["protein", "fats", "carbs", "calories"].map((nutrient) => (
                            <Col md={2} xs={6} key={nutrient}>
                              <Form.Group>
                                <Form.Label className="text-capitalize">
                                  {nutrient} ({nutrient === "calories" ? "kcal" : "g"})
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  value={meal[nutrient]}
                                  onChange={(e) =>
                                    handleChange(index, nutrient, e.target.value)
                                  }
                                  className="rounded-pill shadow-sm"
                                  min="0"
                                  step="0.1"
                                  disabled={isView || selectedMealIds.includes(meal.id)}
                                />
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Meal Instructions</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            value={meal.instructions}
                            onChange={(e) =>
                              handleChange(index, "instructions", e.target.value)
                            }
                            placeholder="e.g., Eat with salad and lemon water"
                            className="rounded-3 shadow-sm"
                            disabled={isView || selectedMealIds.includes(meal.id)}
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

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>📋 Meal Plan Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewData ? (
            <Table striped bordered hover responsive className="text-center">
              <thead className="table-primary">
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Protein (g)</th>
                  <th>Fats (g)</th>
                  <th>Carbs (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                {previewData.meals.map((meal, index) => (
                  <tr key={index}>
                    <td>{meal.no}</td>
                    <td>{meal.name}</td>
                    <td>{meal.protein}</td>
                    <td>{meal.fats}</td>
                    <td>{meal.carbs}</td>
                    <td>{meal.calories}</td>
                    <td>{meal.instructions || "-"}</td>
                  </tr>
                ))}
                <tr className="fw-bold table-light">
                  <td colSpan={2}>Total</td>
                  <td>{previewData.totals.protein}</td>
                  <td>{previewData.totals.fats}</td>
                  <td>{previewData.totals.carbs}</td>
                  <td>{previewData.totals.calories}</td>
                  <td>-</td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <p className="text-muted text-center">No preview available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="rounded-pill"
            onClick={() => setShowPreview(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}