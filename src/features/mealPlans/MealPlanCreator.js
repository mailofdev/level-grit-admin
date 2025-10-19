import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, Badge } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaSave, FaUtensils, FaCalculator, FaEye } from 'react-icons/fa';

const MealPlanCreator = ({ clientId, onSave, onCancel }) => {
  const [mealPlan, setMealPlan] = useState({
    name: '',
    description: '',
    duration: 7, // days
    meals: []
  });

  const [currentMeal, setCurrentMeal] = useState({
    name: '',
    time: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    notes: ''
  });

  const [showMealModal, setShowMealModal] = useState(false);
  const [editingMealIndex, setEditingMealIndex] = useState(-1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMealInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMeal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addMeal = () => {
    if (editingMealIndex >= 0) {
      // Edit existing meal
      const updatedMeals = [...mealPlan.meals];
      updatedMeals[editingMealIndex] = { ...currentMeal };
      setMealPlan(prev => ({
        ...prev,
        meals: updatedMeals
      }));
    } else {
      // Add new meal
      setMealPlan(prev => ({
        ...prev,
        meals: [...prev.meals, { ...currentMeal }]
      }));
    }
    
    resetMealForm();
    setShowMealModal(false);
  };

  const editMeal = (index) => {
    setCurrentMeal({ ...mealPlan.meals[index] });
    setEditingMealIndex(index);
    setShowMealModal(true);
  };

  const deleteMeal = (index) => {
    setMealPlan(prev => ({
      ...prev,
      meals: prev.meals.filter((_, i) => i !== index)
    }));
  };

  const resetMealForm = () => {
    setCurrentMeal({
      name: '',
      time: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      notes: ''
    });
    setEditingMealIndex(-1);
  };

  const calculateTotals = () => {
    return mealPlan.meals.reduce((totals, meal) => ({
      calories: totals.calories + (parseFloat(meal.calories) || 0),
      protein: totals.protein + (parseFloat(meal.protein) || 0),
      carbs: totals.carbs + (parseFloat(meal.carbs) || 0),
      fats: totals.fats + (parseFloat(meal.fats) || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const totals = calculateTotals();

  const handleSave = () => {
    if (!mealPlan.name || mealPlan.meals.length === 0) {
      alert('Please provide a meal plan name and add at least one meal.');
      return;
    }
    
    const planData = {
      ...mealPlan,
      clientId,
      totals,
      createdAt: new Date().toISOString()
    };
    
    onSave(planData);
  };

  return (
    <div className="page-container">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="content-wrapper card-health">
              <Card.Header className="text-center py-4">
                <h2 className="fw-bold text-primary mb-3">
                  <FaUtensils className="me-3" />
                  Create Meal Plan
                </h2>
                <p className="text-muted mb-0">Design a personalized nutrition plan for your client</p>
              </Card.Header>
              
              <Card.Body className="p-4">
                <Row className="g-4">
                  {/* Meal Plan Details */}
                  <Col lg={6}>
                    <Card className="card-stats p-3">
                      <h4 className="fw-bold text-primary mb-3">Plan Details</h4>
                      
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Plan Name *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={mealPlan.name}
                          onChange={handleInputChange}
                          placeholder="e.g., Weight Loss Plan, Muscle Gain Plan"
                          className="smooth-transition"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={mealPlan.description}
                          onChange={handleInputChange}
                          placeholder="Describe the goals and approach of this meal plan..."
                          className="smooth-transition"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Duration (Days)</Form.Label>
                        <Form.Control
                          type="number"
                          name="duration"
                          value={mealPlan.duration}
                          onChange={handleInputChange}
                          min="1"
                          max="30"
                          className="smooth-transition"
                        />
                      </Form.Group>

                      <Button 
                        variant="success" 
                        className="w-100 smooth-transition"
                        onClick={() => setShowMealModal(true)}
                      >
                        <FaPlus className="me-2" />
                        Add Meal
                      </Button>
                    </Card>
                  </Col>

                  {/* Nutritional Summary */}
                  <Col lg={6}>
                    <Card className="card-info p-3">
                      <h4 className="fw-bold text-info mb-3">
                        <FaCalculator className="me-2" />
                        Daily Nutritional Summary
                      </h4>
                      
                      <div className="row g-3">
                        <Col xs={6}>
                          <div className="text-center p-3 bg-light rounded">
                            <h5 className="fw-bold text-primary mb-1">{totals.calories.toFixed(0)}</h5>
                            <small className="text-muted">Calories</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-center p-3 bg-light rounded">
                            <h5 className="fw-bold text-success mb-1">{totals.protein.toFixed(1)}g</h5>
                            <small className="text-muted">Protein</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-center p-3 bg-light rounded">
                            <h5 className="fw-bold text-warning mb-1">{totals.carbs.toFixed(1)}g</h5>
                            <small className="text-muted">Carbs</small>
                          </div>
                        </Col>
                        <Col xs={6}>
                          <div className="text-center p-3 bg-light rounded">
                            <h5 className="fw-bold text-danger mb-1">{totals.fats.toFixed(1)}g</h5>
                            <small className="text-muted">Fats</small>
                          </div>
                        </Col>
                      </div>

                      <div className="mt-3">
                        <h6 className="fw-semibold mb-2">Macro Distribution</h6>
                        <div className="progress mb-2" style={{height: '8px'}}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{width: `${(totals.protein * 4 / totals.calories) * 100}%`}}
                          ></div>
                          <div 
                            className="progress-bar bg-warning" 
                            style={{width: `${(totals.carbs * 4 / totals.calories) * 100}%`}}
                          ></div>
                          <div 
                            className="progress-bar bg-danger" 
                            style={{width: `${(totals.fats * 9 / totals.calories) * 100}%`}}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between small text-muted">
                          <span>Protein: {((totals.protein * 4 / totals.calories) * 100).toFixed(1)}%</span>
                          <span>Carbs: {((totals.carbs * 4 / totals.calories) * 100).toFixed(1)}%</span>
                          <span>Fats: {((totals.fats * 9 / totals.calories) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Meals List */}
                {mealPlan.meals.length > 0 && (
                  <div className="mt-4">
                    <h4 className="fw-bold text-primary mb-3">Meals ({mealPlan.meals.length})</h4>
                    <Row className="g-3">
                      {mealPlan.meals.map((meal, index) => (
                        <Col md={6} lg={4} key={index}>
                          <Card className="card-stats hover-shadow smooth-transition">
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-bold mb-0">{meal.name}</h6>
                                <div>
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="me-1"
                                    onClick={() => editMeal(index)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => deleteMeal(index)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </div>
                              
                              <p className="text-muted small mb-2">
                                <strong>Time:</strong> {meal.time}
                              </p>
                              
                              <div className="row g-2 small">
                                <Col xs={6}>
                                  <Badge bg="primary" className="w-100">{meal.calories} cal</Badge>
                                </Col>
                                <Col xs={6}>
                                  <Badge bg="success" className="w-100">{meal.protein}g protein</Badge>
                                </Col>
                                <Col xs={6}>
                                  <Badge bg="warning" className="w-100">{meal.carbs}g carbs</Badge>
                                </Col>
                                <Col xs={6}>
                                  <Badge bg="danger" className="w-100">{meal.fats}g fats</Badge>
                                </Col>
                              </div>
                              
                              {meal.notes && (
                                <p className="text-muted small mt-2 mb-0">
                                  <strong>Notes:</strong> {meal.notes}
                                </p>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="me-3 smooth-transition"
                    onClick={handleSave}
                  >
                    <FaSave className="me-2" />
                    Save Meal Plan
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    size="lg"
                    onClick={onCancel}
                    className="smooth-transition"
                  >
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Meal Modal */}
      <Modal show={showMealModal} onHide={() => {setShowMealModal(false); resetMealForm();}} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUtensils className="me-2" />
            {editingMealIndex >= 0 ? 'Edit Meal' : 'Add New Meal'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Meal Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={currentMeal.name}
                  onChange={handleMealInputChange}
                  placeholder="e.g., Breakfast, Lunch, Snack"
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Time *</Form.Label>
                <Form.Control
                  type="time"
                  name="time"
                  value={currentMeal.time}
                  onChange={handleMealInputChange}
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Calories *</Form.Label>
                <Form.Control
                  type="number"
                  name="calories"
                  value={currentMeal.calories}
                  onChange={handleMealInputChange}
                  placeholder="0"
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Protein (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="protein"
                  value={currentMeal.protein}
                  onChange={handleMealInputChange}
                  placeholder="0"
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Carbs (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="carbs"
                  value={currentMeal.carbs}
                  onChange={handleMealInputChange}
                  placeholder="0"
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Fats (g) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="fats"
                  value={currentMeal.fats}
                  onChange={handleMealInputChange}
                  placeholder="0"
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label className="fw-semibold">Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={currentMeal.notes}
                  onChange={handleMealInputChange}
                  placeholder="Additional notes, ingredients, or instructions..."
                  className="smooth-transition"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShowMealModal(false); resetMealForm();}}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addMeal}>
            {editingMealIndex >= 0 ? 'Update Meal' : 'Add Meal'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MealPlanCreator;
