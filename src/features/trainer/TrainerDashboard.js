import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { FaUsers, FaUtensils, FaChartLine, FaComments, FaPlus, FaEye, FaEdit, FaBell, FaDumbbell, FaHeartbeat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    mealPlans: 0,
    unreadMessages: 0
  });

  const [recentClients, setRecentClients] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setStats({
      totalClients: 24,
      activeClients: 18,
      mealPlans: 45,
      unreadMessages: 7
    });

    setRecentClients([
      { id: 1, name: 'Sarah Johnson', lastActive: '2 hours ago', progress: 85, status: 'active' },
      { id: 2, name: 'Mike Chen', lastActive: '1 day ago', progress: 72, status: 'active' },
      { id: 3, name: 'Emily Davis', lastActive: '3 days ago', progress: 90, status: 'active' },
      { id: 4, name: 'David Wilson', lastActive: '1 week ago', progress: 45, status: 'inactive' }
    ]);

    setUpcomingTasks([
      { id: 1, type: 'meal_plan', client: 'Sarah Johnson', due: 'Today', priority: 'high' },
      { id: 2, type: 'check_in', client: 'Mike Chen', due: 'Tomorrow', priority: 'medium' },
      { id: 3, type: 'progress_review', client: 'Emily Davis', due: 'In 2 days', priority: 'low' }
    ]);
  }, []);

  const getTaskIcon = (type) => {
    switch (type) {
      case 'meal_plan': return <FaUtensils className="text-success" />;
      case 'check_in': return <FaComments className="text-primary" />;
      case 'progress_review': return <FaChartLine className="text-info" />;
      default: return <FaBell className="text-warning" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="page-container">
      <Container fluid className="py-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="fw-bold text-primary mb-1">Trainer Dashboard</h1>
                <p className="text-muted mb-0">Welcome back! Here's what's happening with your clients.</p>
              </div>
              <div>
                <Button 
                  variant="primary" 
                  className="me-2 smooth-transition"
                  onClick={() => navigate('/register-client')}
                >
                  <FaPlus className="me-2" />
                  Add New Client
                </Button>
                <Button 
                  variant="outline-primary" 
                  className="smooth-transition"
                  onClick={() => navigate('/AllClients')}
                >
                  <FaUsers className="me-2" />
                  View All Clients
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="g-4 mb-4">
          <Col lg={3} md={6}>
            <Card className="card-stats h-100 hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaUsers size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-primary mb-1">{stats.totalClients}</h3>
                    <p className="text-muted mb-0">Total Clients</p>
                    <small className="text-success">
                      <FaChartLine className="me-1" />
                      +12% this month
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-health h-100 hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaHeartbeat size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-success mb-1">{stats.activeClients}</h3>
                    <p className="text-muted mb-0">Active Clients</p>
                    <small className="text-success">
                      <FaChartLine className="me-1" />
                      {Math.round((stats.activeClients / stats.totalClients) * 100)}% engagement
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-info h-100 hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaUtensils size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-info mb-1">{stats.mealPlans}</h3>
                    <p className="text-muted mb-0">Active Meal Plans</p>
                    <small className="text-info">
                      <FaChartLine className="me-1" />
                      +5 this week
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6}>
            <Card className="card-stats h-100 hover-shadow smooth-transition">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                    <FaComments size={24} />
                  </div>
                  <div>
                    <h3 className="fw-bold text-warning mb-1">{stats.unreadMessages}</h3>
                    <p className="text-muted mb-0">Unread Messages</p>
                    <small className="text-warning">
                      <FaBell className="me-1" />
                      Needs attention
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Recent Clients */}
          <Col lg={8}>
            <Card className="content-wrapper hover-shadow smooth-transition">
              <Card.Header className="bg-transparent border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="fw-bold text-primary mb-0">
                    <FaUsers className="me-2" />
                    Recent Client Activity
                  </h4>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/AllClients')}
                  >
                    View All
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                {recentClients.map((client) => (
                  <div key={client.id} className="d-flex align-items-center justify-content-between p-3 border-bottom hover-lift smooth-transition">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-1">{client.name}</h6>
                        <p className="text-muted small mb-1">Last active: {client.lastActive}</p>
                        <div className="d-flex align-items-center">
                          <ProgressBar 
                            now={client.progress} 
                            variant="success" 
                            className="me-2" 
                            style={{width: '100px', height: '6px'}}
                          />
                          <small className="text-muted">{client.progress}% progress</small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <Badge bg={client.status === 'active' ? 'success' : 'secondary'} className="me-2">
                        {client.status}
                      </Badge>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => navigate(`/client-details/${client.id}`)}
                      >
                        <FaEye />
                      </Button>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming Tasks */}
          <Col lg={4}>
            <Card className="content-wrapper hover-shadow smooth-transition">
              <Card.Header className="bg-transparent border-0 p-4">
                <h4 className="fw-bold text-primary mb-0">
                  <FaBell className="me-2" />
                  Upcoming Tasks
                </h4>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="d-flex align-items-center p-3 border-bottom hover-lift smooth-transition">
                    <div className="me-3">
                      {getTaskIcon(task.type)}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{task.client}</h6>
                      <p className="text-muted small mb-1">
                        {task.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <small className="text-muted">Due: {task.due}</small>
                    </div>
                    <Badge bg={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                
                <div className="text-center mt-3">
                  <Button variant="outline-primary" size="sm">
                    View All Tasks
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="content-wrapper hover-shadow smooth-transition mt-4">
              <Card.Header className="bg-transparent border-0 p-4">
                <h4 className="fw-bold text-primary mb-0">Quick Actions</h4>
              </Card.Header>
              <Card.Body className="p-4 pt-0">
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-success" 
                    className="smooth-transition"
                    onClick={() => navigate('/register-client')}
                  >
                    <FaPlus className="me-2" />
                    Add New Client
                  </Button>
                  <Button 
                    variant="outline-info" 
                    className="smooth-transition"
                  >
                    <FaUtensils className="me-2" />
                    Create Meal Plan
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    className="smooth-transition"
                  >
                    <FaDumbbell className="me-2" />
                    Design Workout
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="smooth-transition"
                  >
                    <FaComments className="me-2" />
                    Send Message
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Alert */}
        {stats.unreadMessages > 0 && (
          <Row className="mt-4">
            <Col>
              <Alert variant="info" className="d-flex align-items-center">
                <FaBell className="me-3" />
                <div className="flex-grow-1">
                  <strong>You have {stats.unreadMessages} unread messages</strong>
                  <p className="mb-0">Check your client communications to stay updated.</p>
                </div>
                <Button variant="outline-info" size="sm">
                  View Messages
                </Button>
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default TrainerDashboard;
