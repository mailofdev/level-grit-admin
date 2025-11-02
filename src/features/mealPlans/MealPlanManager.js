import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Modal, Table } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUtensils, FaCalendar, FaUser, FaChartLine } from 'react-icons/fa';
import MealPlanCreator from './MealPlanCreator';

const MealPlanManager = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setMealPlans([
      {
        id: 1,
        name: 'Weight Loss Plan',
        clientName: 'Sarah Johnson',
        clientId: 1,
        duration: 14,
        meals: [
          { name: 'Breakfast', time: '08:00', calories: 350, protein: 25, carbs: 30, fats: 12 },
          { name: 'Lunch', time: '13:00', calories: 450, protein: 35, carbs: 40, fats: 15 },
          { name: 'Dinner', time: '19:00', calories: 400, protein: 30, carbs: 35, fats: 18 }
        ],
        totals: { calories: 1200, protein: 90, carbs: 105, fats: 45 },
        createdAt: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        name: 'Muscle Gain Plan',
        clientName: 'Mike Chen',
        clientId: 2,
        duration: 21,
        meals: [
          { name: 'Breakfast', time: '07:00', calories: 500, protein: 40, carbs: 50, fats: 15 },
          { name: 'Snack', time: '10:00', calories: 200, protein: 15, carbs: 20, fats: 8 },
          { name: 'Lunch', time: '13:00', calories: 600, protein: 50, carbs: 60, fats: 20 },
          { name: 'Dinner', time: '19:00', calories: 550, protein: 45, carbs: 55, fats: 18 }
        ],
        totals: { calories: 1850, protein: 150, carbs: 185, fats: 61 },
        createdAt: '2024-01-10',
        status: 'active'
      },
      {
        id: 3,
        name: 'Maintenance Plan',
        clientName: 'Emily Davis',
        clientId: 3,
        duration: 7,
        meals: [
          { name: 'Breakfast', time: '08:30', calories: 400, protein: 20, carbs: 45, fats: 15 },
          { name: 'Lunch', time: '12:30', calories: 500, protein: 30, carbs: 50, fats: 20 },
          { name: 'Dinner', time: '18:30', calories: 450, protein: 25, carbs: 40, fats: 18 }
        ],
        totals: { calories: 1350, protein: 75, carbs: 135, fats: 53 },
        createdAt: '2024-01-20',
        status: 'completed'
      }
    ]);
  }, []);

  const handleCreatePlan = (clientId) => {
    setSelectedClient(clientId);
    setShowCreator(true);
  };

  const handleSavePlan = (planData) => {
    const newPlan = {
      id: Date.now(),
      ...planData,
      clientName: `Client ${planData.clientId}`, // Replace with actual client name
      status: 'active'
    };
    setMealPlans(prev => [newPlan, ...prev]);
    setShowCreator(false);
    setSelectedClient(null);
  };

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setShowViewModal(true);
  };

  const handleEditPlan = (plan) => {
    // Navigate to edit mode or open edit modal
    // Edit meal plan
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      setMealPlans(prev => prev.filter(plan => plan.id !== planId));
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      completed: 'primary',
      paused: 'warning',
      draft: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const calculateMacroDistribution = (totals) => {
    const proteinPercent = ((totals.protein * 4) / totals.calories) * 100;
    const carbsPercent = ((totals.carbs * 4) / totals.calories) * 100;
    const fatsPercent = ((totals.fats * 9) / totals.calories) * 100;
    
    return { proteinPercent, carbsPercent, fatsPercent };
  };

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold text-primary mb-1">Meal Plan Manager</h1>
                <p className="text-muted mb-0">Create and manage personalized nutrition plans for your clients</p>
              </div>
              <Button 
                variant="primary" 
                className="smooth-transition"
                onClick={() => handleCreatePlan(null)}
              >
                <FaPlus className="me-2" />
                Create New Plan
              </Button>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col lg={3} md={6}>
            <Card className="card-stats hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaUtensils size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-primary mb-1">{mealPlans.length}</h3>
                    <p className="text-muted mb-0">Total Plans</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-health hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaChartLine size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-success mb-1">
                      {mealPlans.filter(plan => plan.status === 'active').length}
                    </h3>
                    <p className="text-muted mb-0">Active Plans</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-info hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaUser size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-info mb-1">
                      {new Set(mealPlans.map(plan => plan.clientId)).size}
                    </h3>
                    <p className="text-muted mb-0">Clients with Plans</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-stats hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaCalendar size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-warning mb-1">
                      {mealPlans.reduce((sum, plan) => sum + plan.duration, 0)}
                    </h3>
                    <p className="text-muted mb-0">Total Days</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Meal Plans Table */}
        <Row>
          <Col>
            <Card className="content-wrapper hover-shadow smooth-transition">
              <Card.Header className="bg-transparent border-0 p-4">
                <h4 className="fw-bold text-primary mb-0">All Meal Plans</h4>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                {mealPlans.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <FaUtensils size={48} className="mb-3 text-info" />
                    <h5>No meal plans created yet</h5>
                    <p>Start by creating your first meal plan for a client.</p>
                    <Button variant="primary" onClick={() => handleCreatePlan(null)}>
                      <FaPlus className="me-2" />
                      Create First Plan
                    </Button>
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Plan Name</th>
                          <th>Client</th>
                          <th>Duration</th>
                          <th>Meals</th>
                          <th>Daily Calories</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mealPlans.map((plan) => {
                          const macroDist = calculateMacroDistribution(plan.totals);
                          return (
                            <tr key={plan.id} className="hover-lift smooth-transition">
                              <td>
                                <div>
                                  <h6 className="fw-bold mb-1">{plan.name}</h6>
                                  <small className="text-muted">{plan.description || 'No description'}</small>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                                    {plan.clientName.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <span className="fw-semibold">{plan.clientName}</span>
                                </div>
                              </td>
                              <td>
                                <Badge bg="info">{plan.duration} days</Badge>
                              </td>
                              <td>
                                <span className="fw-semibold">{plan.meals.length} meals</span>
                              </td>
                              <td>
                                <div>
                                  <span className="fw-bold text-primary">{plan.totals.calories}</span>
                                  <div className="progress mt-1" style={{height: '4px', width: '60px'}}>
                                    <div className="progress-bar bg-success" style={{width: `${macroDist.proteinPercent}%`}}></div>
                                    <div className="progress-bar bg-warning" style={{width: `${macroDist.carbsPercent}%`}}></div>
                                    <div className="progress-bar bg-danger" style={{width: `${macroDist.fatsPercent}%`}}></div>
                                  </div>
                                </div>
                              </td>
                              <td>{getStatusBadge(plan.status)}</td>
                              <td>
                                <small className="text-muted">
                                  {new Date(plan.createdAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    onClick={() => handleViewPlan(plan)}
                                    title="View Plan"
                                  >
                                    <FaEye />
                                  </Button>
                                  <Button 
                                    variant="outline-success" 
                                    size="sm"
                                    onClick={() => handleEditPlan(plan)}
                                    title="Edit Plan"
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDeletePlan(plan.id)}
                                    title="Delete Plan"
                                  >
                                    <FaTrash />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Meal Plan Creator Modal */}
      {showCreator && (
        <Modal show={showCreator} onHide={() => setShowCreator(false)} size="xl" centered>
          <Modal.Body className="p-0">
            <MealPlanCreator
              clientId={selectedClient}
              onSave={handleSavePlan}
              onCancel={() => setShowCreator(false)}
            />
          </Modal.Body>
        </Modal>
      )}

      {/* View Plan Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUtensils className="me-2" />
            {selectedPlan?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="fw-bold">Client: {selectedPlan.clientName}</h6>
                  <h6 className="fw-bold">Duration: {selectedPlan.duration} days</h6>
                  <h6 className="fw-bold">Status: {getStatusBadge(selectedPlan.status)}</h6>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold">Daily Nutritional Summary</h6>
                  <div className="row g-2">
                    <Col xs={6}>
                      <Badge bg="primary" className="w-100 p-2">{selectedPlan.totals.calories} calories</Badge>
                    </Col>
                    <Col xs={6}>
                      <Badge bg="success" className="w-100 p-2">{selectedPlan.totals.protein}g protein</Badge>
                    </Col>
                    <Col xs={6}>
                      <Badge bg="warning" className="w-100 p-2">{selectedPlan.totals.carbs}g carbs</Badge>
                    </Col>
                    <Col xs={6}>
                      <Badge bg="danger" className="w-100 p-2">{selectedPlan.totals.fats}g fats</Badge>
                    </Col>
                  </div>
                </Col>
              </Row>

              <h6 className="fw-bold mb-3">Meals ({selectedPlan.meals.length})</h6>
              <Row className="g-3">
                {selectedPlan.meals.map((meal, index) => (
                  <Col md={6} key={index}>
                    <Card className="card-stats">
                      <Card.Body className="p-3">
                        <h6 className="fw-bold mb-2">{meal.name} - {meal.time}</h6>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            setShowViewModal(false);
            handleEditPlan(selectedPlan);
          }}>
            <FaEdit className="me-2" />
            Edit Plan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MealPlanManager;
