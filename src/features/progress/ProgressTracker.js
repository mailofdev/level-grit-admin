import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal, Table, ProgressBar } from 'react-bootstrap';
import { FaChartLine, FaWeight, FaRuler, FaCamera, FaPlus, FaEdit, FaTrash, FaCalendar, FaTrophy, FaTrendingUp, FaTrendingDown } from 'react-icons/fa';

const ProgressTracker = ({ clientId, clientName }) => {
  const [progressData, setProgressData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    photos: [],
    notes: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    setProgressData([
      {
        id: 1,
        date: '2024-01-20',
        weight: 75.5,
        bodyFat: 18.5,
        muscleMass: 35.2,
        measurements: {
          chest: 95,
          waist: 82,
          hips: 98,
          arms: 32,
          thighs: 58
        },
        photos: ['photo1.jpg', 'photo2.jpg'],
        notes: 'Feeling stronger and more energetic. Following meal plan consistently.',
        goals: {
          weight: 70,
          bodyFat: 15,
          muscleMass: 38
        }
      },
      {
        id: 2,
        date: '2024-01-13',
        weight: 76.2,
        bodyFat: 19.1,
        muscleMass: 34.8,
        measurements: {
          chest: 94,
          waist: 84,
          hips: 99,
          arms: 31,
          thighs: 59
        },
        photos: ['photo3.jpg'],
        notes: 'Good week overall. Struggled with weekend eating but got back on track.',
        goals: {
          weight: 70,
          bodyFat: 15,
          muscleMass: 38
        }
      },
      {
        id: 3,
        date: '2024-01-06',
        weight: 77.0,
        bodyFat: 19.8,
        muscleMass: 34.2,
        measurements: {
          chest: 93,
          waist: 85,
          hips: 100,
          arms: 30,
          thighs: 60
        },
        photos: ['photo4.jpg', 'photo5.jpg'],
        notes: 'Starting point. Ready to make changes!',
        goals: {
          weight: 70,
          bodyFat: 15,
          muscleMass: 38
        }
      }
    ]);
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('measurements.')) {
      const measurementType = name.split('.')[1];
      setNewEntry(prev => ({
        ...prev,
        measurements: {
          ...prev.measurements,
          [measurementType]: value
        }
      }));
    } else {
      setNewEntry(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddEntry = () => {
    const entry = {
      id: Date.now(),
      ...newEntry,
      weight: parseFloat(newEntry.weight),
      bodyFat: parseFloat(newEntry.bodyFat),
      muscleMass: parseFloat(newEntry.muscleMass),
      measurements: Object.fromEntries(
        Object.entries(newEntry.measurements).map(([key, value]) => [key, parseFloat(value) || 0])
      )
    };
    
    setProgressData(prev => [entry, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      bodyFat: '',
      muscleMass: '',
      measurements: {
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: ''
      },
      photos: [],
      notes: ''
    });
  };

  const calculateProgress = (current, previous) => {
    if (!previous) return { value: 0, trend: 'neutral' };
    const change = current - previous;
    const percentage = (change / previous) * 100;
    return {
      value: Math.abs(percentage),
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
    };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FaTrendingUp className="text-success" />;
      case 'down': return <FaTrendingDown className="text-danger" />;
      default: return <FaChartLine className="text-muted" />;
    }
  };

  const getLatestEntry = () => progressData[0];
  const getPreviousEntry = () => progressData[1];

  const latest = getLatestEntry();
  const previous = getPreviousEntry();

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold text-primary mb-1">Progress Tracking</h1>
                <p className="text-muted mb-0">Monitor {clientName || 'client'}'s fitness journey and achievements</p>
              </div>
              <Button 
                variant="primary" 
                className="smooth-transition"
                onClick={() => setShowAddModal(true)}
              >
                <FaPlus className="me-2" />
                Add Progress Entry
              </Button>
            </div>
          </Col>
        </Row>

        {latest && (
          <>
            {/* Current Stats */}
            <Row className="g-4 mb-4">
              <Col lg={3} md={6}>
                <Card className="card-stats hover-shadow smooth-transition">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                        <FaWeight size={24} />
                      </div>
                      <div>
                        <h3 className="fw-bold text-primary mb-1">{latest.weight} kg</h3>
                        <p className="text-muted mb-1">Current Weight</p>
                        {previous && (
                          <div className="d-flex align-items-center">
                            {getTrendIcon(calculateProgress(latest.weight, previous.weight).trend)}
                            <small className="text-muted ms-1">
                              {calculateProgress(latest.weight, previous.weight).value.toFixed(1)}% vs last week
                            </small>
                          </div>
                        )}
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
                        <h3 className="fw-bold text-success mb-1">{latest.bodyFat}%</h3>
                        <p className="text-muted mb-1">Body Fat</p>
                        {previous && (
                          <div className="d-flex align-items-center">
                            {getTrendIcon(calculateProgress(latest.bodyFat, previous.bodyFat).trend)}
                            <small className="text-muted ms-1">
                              {calculateProgress(latest.bodyFat, previous.bodyFat).value.toFixed(1)}% vs last week
                            </small>
                          </div>
                        )}
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
                        <FaTrophy size={24} />
                      </div>
                      <div>
                        <h3 className="fw-bold text-info mb-1">{latest.muscleMass} kg</h3>
                        <p className="text-muted mb-1">Muscle Mass</p>
                        {previous && (
                          <div className="d-flex align-items-center">
                            {getTrendIcon(calculateProgress(latest.muscleMass, previous.muscleMass).trend)}
                            <small className="text-muted ms-1">
                              {calculateProgress(latest.muscleMass, previous.muscleMass).value.toFixed(1)}% vs last week
                            </small>
                          </div>
                        )}
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
                        <FaRuler size={24} />
                      </div>
                      <div>
                        <h3 className="fw-bold text-warning mb-1">{latest.measurements.waist} cm</h3>
                        <p className="text-muted mb-1">Waist</p>
                        {previous && (
                          <div className="d-flex align-items-center">
                            {getTrendIcon(calculateProgress(latest.measurements.waist, previous.measurements.waist).trend)}
                            <small className="text-muted ms-1">
                              {calculateProgress(latest.measurements.waist, previous.measurements.waist).value.toFixed(1)}% vs last week
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Progress Chart Placeholder */}
            <Row className="mb-4">
              <Col>
                <Card className="content-wrapper hover-shadow smooth-transition">
                  <Card.Header className="bg-transparent border-0 p-4">
                    <h4 className="fw-bold text-primary mb-0">Progress Over Time</h4>
                  </Card.Header>
                  <Card.Body className="p-4 pt-0">
                    <div className="text-center py-5">
                      <FaChartLine size={64} className="text-muted mb-3" />
                      <h5 className="text-muted">Progress Chart</h5>
                      <p className="text-muted">Visual progress tracking will be displayed here</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Progress History */}
        <Row>
          <Col>
            <Card className="content-wrapper hover-shadow smooth-transition">
              <Card.Header className="bg-transparent border-0 p-4">
                <h4 className="fw-bold text-primary mb-0">Progress History</h4>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                {progressData.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <FaChartLine size={48} className="mb-3 text-info" />
                    <h5>No progress data yet</h5>
                    <p>Start tracking progress by adding the first entry.</p>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                      <FaPlus className="me-2" />
                      Add First Entry
                    </Button>
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight (kg)</th>
                          <th>Body Fat (%)</th>
                          <th>Muscle Mass (kg)</th>
                          <th>Measurements</th>
                          <th>Photos</th>
                          <th>Notes</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressData.map((entry, index) => {
                          const prevEntry = progressData[index + 1];
                          return (
                            <tr key={entry.id} className="hover-lift smooth-transition">
                              <td>
                                <div>
                                  <strong>{new Date(entry.date).toLocaleDateString()}</strong>
                                  <br />
                                  <small className="text-muted">
                                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{entry.weight}</strong>
                                  {prevEntry && (
                                    <div className="d-flex align-items-center">
                                      {getTrendIcon(calculateProgress(entry.weight, prevEntry.weight).trend)}
                                      <small className="text-muted ms-1">
                                        {calculateProgress(entry.weight, prevEntry.weight).value.toFixed(1)}%
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{entry.bodyFat}%</strong>
                                  {prevEntry && (
                                    <div className="d-flex align-items-center">
                                      {getTrendIcon(calculateProgress(entry.bodyFat, prevEntry.bodyFat).trend)}
                                      <small className="text-muted ms-1">
                                        {calculateProgress(entry.bodyFat, prevEntry.bodyFat).value.toFixed(1)}%
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div>
                                  <strong>{entry.muscleMass}</strong>
                                  {prevEntry && (
                                    <div className="d-flex align-items-center">
                                      {getTrendIcon(calculateProgress(entry.muscleMass, prevEntry.muscleMass).trend)}
                                      <small className="text-muted ms-1">
                                        {calculateProgress(entry.muscleMass, prevEntry.muscleMass).value.toFixed(1)}%
                                      </small>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="small">
                                  <div>Chest: {entry.measurements.chest}cm</div>
                                  <div>Waist: {entry.measurements.waist}cm</div>
                                  <div>Hips: {entry.measurements.hips}cm</div>
                                </div>
                              </td>
                              <td>
                                <Badge bg="info">{entry.photos.length} photos</Badge>
                              </td>
                              <td>
                                <div style={{maxWidth: '200px'}}>
                                  <p className="text-muted small mb-0" style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {entry.notes}
                                  </p>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button variant="outline-primary" size="sm">
                                    <FaEdit />
                                  </Button>
                                  <Button variant="outline-danger" size="sm">
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

      {/* Add Progress Entry Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaPlus className="me-2" />
            Add Progress Entry
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newEntry.date}
                    onChange={handleInputChange}
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Weight (kg) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="weight"
                    value={newEntry.weight}
                    onChange={handleInputChange}
                    placeholder="75.5"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Body Fat (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="bodyFat"
                    value={newEntry.bodyFat}
                    onChange={handleInputChange}
                    placeholder="18.5"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Muscle Mass (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="muscleMass"
                    value={newEntry.muscleMass}
                    onChange={handleInputChange}
                    placeholder="35.2"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              
              <Col xs={12}>
                <h6 className="fw-bold text-primary mb-3">Body Measurements (cm)</h6>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Chest</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="measurements.chest"
                    value={newEntry.measurements.chest}
                    onChange={handleInputChange}
                    placeholder="95"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Waist</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="measurements.waist"
                    value={newEntry.measurements.waist}
                    onChange={handleInputChange}
                    placeholder="82"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Hips</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="measurements.hips"
                    value={newEntry.measurements.hips}
                    onChange={handleInputChange}
                    placeholder="98"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Arms</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="measurements.arms"
                    value={newEntry.measurements.arms}
                    onChange={handleInputChange}
                    placeholder="32"
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Thighs</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="measurements.thighs"
                    value={newEntry.measurements.thighs}
                    onChange={handleInputChange}
                    placeholder="58"
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
                    value={newEntry.notes}
                    onChange={handleInputChange}
                    placeholder="How is the client feeling? Any observations or comments..."
                    className="smooth-transition"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddEntry}>
            Add Entry
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProgressTracker;
