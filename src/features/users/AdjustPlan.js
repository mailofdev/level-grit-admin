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
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/navigation/Heading";

export default function AdjustPlan() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState(
    Array.from({ length: 4 }, () => ({
      name: "",
      protein: "",
      fats: "",
      carbs: "",
      calories: "",
      meal: "",
    }))
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedMeals = [...meals];
    updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    setMeals(updatedMeals);
  };

  const handleAddMeal = () => {
    setMeals([
      ...meals,
      { name: "", protein: "", fats: "", carbs: "", calories: "", meal: "" },
    ]);
  };

  const handleRemoveMeal = () => {
    if (meals.length > 1) {
      setMeals(meals.slice(0, -1));
    }
  };

  const handleSave = () => {
    alert("Plan saved successfully ✅ (check console for data)");
    console.log(meals);
    navigate(-1);
  };

  const totals = meals.reduce(
    (acc, meal) => {
      acc.protein += Number(meal.protein) || 0;
      acc.fats += Number(meal.fats) || 0;
      acc.carbs += Number(meal.carbs) || 0;
      acc.calories += Number(meal.calories) || 0;
      return acc;
    },
    { protein: 0, fats: 0, carbs: 0, calories: 0 }
  );

  return (
    <div className="container py-4">
      <Heading pageName="Adjust Plan" sticky={true} />

      <div className="d-flex justify-content-end gap-2 my-3 flex-wrap">
        <Button variant="outline-primary" onClick={handleAddMeal} className="rounded-pill">
          <FaPlus /> Add Meal
        </Button>
        <Button variant="outline-danger" onClick={handleRemoveMeal} className="rounded-pill">
          <FaMinus /> Remove Meal
        </Button>
      </div>

      <Card className="shadow-sm border-0 rounded-4 p-4 bg-white">
        <Form>
          <Accordion alwaysOpen>
            {meals.map((meal, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>🍽️ Meal {index + 1}</Accordion.Header>
                <Accordion.Body>
                  <Row className="mb-3 gx-3 gy-3">
                    <Col md={4} xs={12}>
                      <Form.Group>
                        <Form.Label>Meal Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={meal.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Pre-Workout"
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} xs={6}>
                      <Form.Group>
                        <Form.Label>Protein (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.protein}
                          onChange={(e) =>
                            handleChange(index, "protein", e.target.value)
                          }
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} xs={6}>
                      <Form.Group>
                        <Form.Label>Fats (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.fats}
                          onChange={(e) =>
                            handleChange(index, "fats", e.target.value)
                          }
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} xs={6}>
                      <Form.Group>
                        <Form.Label>Carbs (g)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.carbs}
                          onChange={(e) =>
                            handleChange(index, "carbs", e.target.value)
                          }
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} xs={6}>
                      <Form.Group>
                        <Form.Label>Calories (kcal)</Form.Label>
                        <Form.Control
                          type="number"
                          value={meal.calories}
                          onChange={(e) =>
                            handleChange(index, "calories", e.target.value)
                          }
                          className="rounded-pill"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Meal Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={meal.meal}
                      onChange={(e) =>
                        handleChange(index, "meal", e.target.value)
                      }
                      placeholder="e.g., Eat with salad and lemon water"
                      className="rounded-3"
                    />
                  </Form.Group>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <div className="d-flex justify-content-end gap-3 mt-4 flex-wrap">
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="rounded-pill px-4">
              Cancel
            </Button>
            <Button
              variant="info"
              className="text-white rounded-pill px-4"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
            <Button variant="success" onClick={handleSave} className="rounded-pill px-4">
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
                <th>Calories (kcal)</th>
                <th>Meal Instructions</th>
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
                  <td>{meal.calories}</td>
                  <td>{meal.meal}</td>
                </tr>
              ))}
              <tr className="fw-bold table-light">
                <td colSpan={2}>Total</td>
                <td>{totals.protein}</td>
                <td>{totals.fats}</td>
                <td>{totals.carbs}</td>
                <td>{totals.calories}</td>
                <td>-</td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)} className="rounded-pill">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
