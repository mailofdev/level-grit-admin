import React, { useState } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Table,
  Modal,
  Card,
  Accordion,
} from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdjustPlan() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState(
    Array.from({ length: 6 }, () => ({
      name: "",
      protein: "",
      fats: "",
      carbs: "",
      instructions: "",
    }))
  );
  const [showPreview, setShowPreview] = useState(false);

  // ✅ Handle input change
  const handleChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setMeals(updatedMeals);
  };

  // ✅ Save handler
  const handleSave = () => {
    console.log("Saved meals:", meals);
    alert("Plan saved successfully ✅ (check console for data)");
    navigate(-1);
  };

  // ✅ Calculate totals for preview
  const totals = meals.reduce(
    (acc, meal) => {
      acc.protein += Number(meal.protein) || 0;
      acc.fats += Number(meal.fats) || 0;
      acc.carbs += Number(meal.carbs) || 0;
      return acc;
    },
    { protein: 0, fats: 0, carbs: 0 }
  );

  return (
    <div className="container py-4">
      {/* Header */}
       <div className="d-flex align-items-center mb-4">
             <button
               className="btn btn-outline-secondary btn-sm me-2"
               onClick={() => navigate(-1)}
             >
               <FaArrowLeft className="me-1" /> Back
             </button>
             <h4 className="mb-0">Adjust Plan</h4>
           </div>

      {/* Meals Form */}
      <Card className="shadow-sm border-0 rounded-4 p-4">
        <Form>
          <Accordion alwaysOpen>
            {meals.map((meal, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>🍽️ Meal {index + 1}</Accordion.Header>
                <Accordion.Body>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Meal Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={meal.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Pre-Workout"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Protein (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.protein}
                          onChange={(e) =>
                            handleChange(index, "protein", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Fats (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.fats}
                          onChange={(e) =>
                            handleChange(index, "fats", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Carbs (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.carbs}
                          onChange={(e) =>
                            handleChange(index, "carbs", e.target.value)
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group>
                    <Form.Label>Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={meal.instructions}
                      onChange={(e) =>
                        handleChange(index, "instructions", e.target.value)
                      }
                      placeholder="e.g., Eat with salad and lemon water"
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-3">
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="info"
              className="text-white"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
            <Button variant="success" onClick={handleSave}>
              Save Plan
            </Button>
          </div>
        </Form>
      </Card>

      {/* Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>📋 Meal Plan Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover responsive className="text-center">
            <thead className="table-primary">
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Protein (g)</th>
                <th>Fats (g)</th>
                <th>Carbs (g)</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{meal.name}</td>
                  <td>{meal.protein}</td>
                  <td>{meal.fats}</td>
                  <td>{meal.carbs}</td>
                  <td>{meal.instructions}</td>
                </tr>
              ))}
              <tr className="fw-bold table-light">
                <td colSpan={2}>Total</td>
                <td>{totals.protein}</td>
                <td>{totals.fats}</td>
                <td>{totals.carbs}</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
