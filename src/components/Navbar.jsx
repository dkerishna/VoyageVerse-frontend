import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/useAuth';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <Navbar
                expand="lg"
                className="shadow-lg"
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1030
                }}
            >
                <Container>
                    {/* Left: Logo & Brand */}
                    <Navbar.Brand
                        as={Link}
                        to="/"
                        style={{
                            fontWeight: '800',
                            fontSize: '1.8rem',
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>✈️</span>
                        TravelCompanion
                    </Navbar.Brand>

                    {/* Mobile Toggle */}
                    <Navbar.Toggle
                        aria-controls="basic-navbar-nav"
                        style={{
                            border: 'none',
                            padding: '4px 8px'
                        }}
                    />

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Center: Main Navigation (only show when user is logged in) */}
                        {currentUser && (
                            <Nav className="mx-auto">
                                <Nav.Link
                                    as={Link}
                                    to="/dashboard"
                                    style={{
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        margin: '0 5px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none'
                                    }}
                                    className={location.pathname === '/dashboard' ? 'active-nav' : ''}
                                    onMouseEnter={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.target.style.color = '#667eea';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#2c3e50';
                                        }
                                    }}
                                >
                                    🏠 Dashboard
                                </Nav.Link>

                                <Nav.Link
                                    as={Link}
                                    to="/create-trip"
                                    style={{
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        margin: '0 5px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none'
                                    }}
                                    className={location.pathname === '/create-trip' ? 'active-nav' : ''}
                                    onMouseEnter={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.target.style.color = '#667eea';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#2c3e50';
                                        }
                                    }}
                                >
                                    ➕ Create
                                </Nav.Link>

                                {/* <Nav.Link
                                    as={Link}
                                    to={`/trips/${trip.id}/photos`}
                                    style={{
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        margin: '0 5px',
                                        transition: 'all 0.3s ease',
                                        textDecoration: 'none'
                                    }}
                                    className={location.pathname === '/photos' ? 'active-nav' : ''}
                                    onMouseEnter={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.target.style.color = '#667eea';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!e.target.classList.contains('active-nav')) {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#2c3e50';
                                        }
                                    }}
                                >
                                    📸 Photos
                                </Nav.Link> */}

                                {/* More Dropdown */}
                                <NavDropdown
                                    title={
                                        <span style={{
                                            color: '#2c3e50',
                                            fontWeight: '600',
                                            fontSize: '1rem'
                                        }}>
                                            ⋯ More
                                        </span>
                                    }
                                    id="more-nav-dropdown"
                                    style={{
                                        margin: '0 5px'
                                    }}
                                >
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/account"
                                        style={{
                                            color: '#2c3e50',
                                            fontWeight: '500',
                                            padding: '10px 20px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#2c3e50';
                                        }}
                                    >
                                        👤 My Account
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        as={Link}
                                        to="/contact"
                                        style={{
                                            color: '#2c3e50',
                                            fontWeight: '500',
                                            padding: '10px 20px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#2c3e50';
                                        }}
                                    >
                                        📞 Contact & Help
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        )}

                        {/* Right: Auth Controls */}
                        <Nav className="ms-auto">
                            {currentUser && !isLanding ? (
                                <div className="d-flex align-items-center gap-3">
                                    {/* User Greeting */}
                                    <span
                                        style={{
                                            color: '#2c3e50',
                                            fontSize: '0.95rem',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Welcome, {currentUser.displayName || currentUser.email?.split('@')[0] || 'Traveler'}! 👋
                                    </span>

                                    {/* Logout Button */}
                                    <Button
                                        onClick={onLogout}
                                        style={{
                                            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 10px rgba(255, 107, 107, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 10px rgba(255, 107, 107, 0.3)';
                                        }}
                                    >
                                        🚪 Log Out
                                    </Button>
                                </div>
                            ) : isLanding && (
                                <div className="d-flex gap-2">
                                    <Button
                                        onClick={onLoginClick}
                                        style={{
                                            background: 'transparent',
                                            border: '2px solid #667eea',
                                            color: '#667eea',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = '#667eea';
                                            e.target.style.color = 'white';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#667eea';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        🔑 Log In
                                    </Button>
                                    <Button
                                        onClick={onSignupClick}
                                        style={{
                                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '8px 20px',
                                            borderRadius: '20px',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
                                        }}
                                    >
                                        🚀 Sign Up
                                    </Button>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>

                <style>{`
                    .active-nav {
                        background: linear-gradient(45deg, #667eea, #764ba2) !important;
                        color: white !important;
                    }
                    
                    .navbar-toggler {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    
                    .navbar-toggler:focus {
                        box-shadow: none !important;
                    }
                    
                    .navbar-toggler-icon {
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2844, 62, 80, 0.75%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
                    }
                    
                    .dropdown-menu {
                        background: rgba(255, 255, 255, 0.95) !important;
                        backdrop-filter: blur(20px) !important;
                        border: 1px solid rgba(0, 0, 0, 0.08) !important;
                        border-radius: 15px !important;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
                    }
                    
                    .dropdown-toggle::after {
                        display: none !important;
                    }
                    
                    @media (max-width: 991.98px) {
                        .mx-auto {
                            margin: 1rem 0 !important;
                        }
                        
                        .ms-auto {
                            margin-top: 1rem !important;
                        }
                    }
                `}</style>
            </Navbar>
        </>
    );
}