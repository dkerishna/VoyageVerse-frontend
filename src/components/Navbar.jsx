import { useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

export default function AppNavbar() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [showAuthModal, setShowAuthModal] = useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Travel Companion</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            {currentUser ? (
                                <>
                                    <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
                                    <Button variant="outline-light" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline-light" onClick={() => setShowAuthModal(true)}>
                                    Login / Sign Up
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <AuthModal show={showAuthModal} handleClose={() => setShowAuthModal(false)} />
        </>
    );
}