import { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import './Landing.css';
import { motion } from 'framer-motion';
import AuthModal from '../components/AuthModal';

export default function Landing() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    return (
        <div className="landing-hero">
            <Container>
                <Row className="align-items-center">
                    {/* LEFT COLUMN */}
                    <Col md={4} className="text-center text-md-start mb-5 mb-md-0">
                        <motion.h1
                            className="display-3 fw-bold"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Travel Companion
                        </motion.h1>

                        <motion.p
                            className="lead mb-4"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Plan, explore, and relive your adventures.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button variant="outline-success" className="me-3" onClick={() => setShowLogin(true)}>
                                Login
                            </Button>
                            <Button variant="outline-primary" onClick={() => setShowSignup(true)}>
                                Sign Up
                            </Button>
                        </motion.div>
                    </Col>

                    {/* RIGHT COLUMN - DEMO */}
                    <Col md={8}>
                        <h3 className="text-white mb-4">See How It Works</h3>
                        <Row>
                            <Col md={6}>
                                <Card bg="secondary" text="light" className="mb-4 shadow-sm">
                                    <Card.Img variant="top" src="/src/assets/paris.jpg" />
                                    <Card.Body>
                                        <Card.Title>My Europe Trip</Card.Title>
                                        <Card.Text>
                                            ✈️ Paris → Rome → Berlin<br />
                                            📅 May 2025
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card bg="secondary" text="light" className="mb-4 shadow-sm">
                                    <Card.Img variant="top" src="/src/assets/bali.jpg" />
                                    <Card.Body>
                                        <Card.Title>Beach Getaway</Card.Title>
                                        <Card.Text>
                                            🏝️ Bali Adventures<br />
                                            📅 August 2025
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            <AuthModal
                show={showLogin || showSignup}
                mode={showSignup ? 'signup' : 'login'}
                handleClose={() => {
                    setShowLogin(false);
                    setShowSignup(false);
                }}
            />
        </div>
    );
}