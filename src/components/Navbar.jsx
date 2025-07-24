import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

export default function AppNavbar({ onLoginClick, onSignupClick }) {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const onLogout = async () => {
        await logout();
        navigate('/');
    };

    const isLanding = location.pathname === '/' || location.pathname === '/';

    return (
        <Navbar bg="light" expand="lg" className="shadow-sm py-3">
            <Container>
                {/* Left: Logo */}
                <Navbar.Brand as={Link} to="/" className="fw-bold">TCA</Navbar.Brand>

                {/* Center: Main navigation */}
                <Nav className="mx-auto">
                    <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/trips/:tripId/photos">Photos</Nav.Link>
                    <Nav.Link as={Link} to="/account">Account</Nav.Link>
                    <Nav.Link as={Link} to="/contact">Contact Us</Nav.Link>
                </Nav>

                {/* Right: Auth controls */}
                <Nav className="ms-auto">
                    {currentUser ? (
                        <Button variant="outline-danger" onClick={onLogout}>
                            Log Out
                        </Button>
                    ) : isLanding && (
                        <>
                            <Button variant="outline-success" className="me-2" onClick={onLoginClick}>
                                Log In
                            </Button>
                            <Button variant="primary" onClick={onSignupClick}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}