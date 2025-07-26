import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function AppFooter() {
    const currentYear = new Date().getFullYear();

    const handleSocialClick = (platform) => {
        // Dummy function - just shows an alert for now
        console.log(`Clicked ${platform} - this is a dummy link`);
    };

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <footer
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                    marginTop: 'auto',
                    padding: '3rem 0 2rem 0'
                }}
            >
                <Container>
                    <Row>
                        {/* Brand Section */}
                        <Col lg={4} md={6} className="mb-4">
                            <div
                                style={{
                                    fontWeight: '800',
                                    fontSize: '1.5rem',
                                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>✈️</span>
                                TravelCompanion
                            </div>
                            <p
                                style={{
                                    color: '#6c757d',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                Your ultimate travel planning companion. Create amazing trips,
                                organize destinations, and capture memories all in one place.
                            </p>

                            {/* Social Media Icons */}
                            <div className="d-flex gap-3">
                                <button
                                    onClick={() => handleSocialClick('Facebook')}
                                    style={{
                                        background: 'linear-gradient(45deg, #4267B2, #3b5998)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(66, 103, 178, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(66, 103, 178, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(66, 103, 178, 0.3)';
                                    }}
                                >
                                    <i className="bi bi-facebook"></i>
                                </button>

                                <button
                                    onClick={() => handleSocialClick('Instagram')}
                                    style={{
                                        background: 'linear-gradient(45deg, #E4405F, #833AB4, #F77737)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(228, 64, 95, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(228, 64, 95, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(228, 64, 95, 0.3)';
                                    }}
                                >
                                    <i class="bi bi-instagram"></i>
                                </button>

                                <button
                                    onClick={() => handleSocialClick('TikTok')}
                                    style={{
                                        background: 'linear-gradient(45deg, #000000, #333333)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                                    }}
                                >
                                    <i class="bi bi-tiktok"></i>
                                </button>

                                <button
                                    onClick={() => handleSocialClick('Twitter')}
                                    style={{
                                        background: 'linear-gradient(45deg, #000000, #333333)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '45px',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
                                    }}
                                >
                                    <i class="bi bi-twitter-x"></i>
                                </button>
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col lg={2} md={6} className="mb-4">
                            <h6
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Quick Links
                            </h6>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to="/dashboard"
                                        style={{
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to="/create-trip"
                                        style={{
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Create Trip
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to="/photos"
                                        style={{
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        My Photos
                                    </Link>
                                </li>
                            </ul>
                        </Col>

                        {/* Support */}
                        <Col lg={2} md={6} className="mb-4">
                            <h6
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Support
                            </h6>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to="/contact"
                                        style={{
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => handleSocialClick('Help Center')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Help Center
                                    </button>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to="/account"
                                        style={{
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        My Account
                                    </Link>
                                </li>
                            </ul>
                        </Col>

                        {/* Legal */}
                        <Col lg={2} md={6} className="mb-4">
                            <h6
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Legal
                            </h6>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => handleSocialClick('Privacy Policy')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => handleSocialClick('Terms of Service')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Terms of Service
                                    </button>
                                </li>
                                <li style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => handleSocialClick('Cookie Policy')}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c757d',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem',
                                            transition: 'color 0.3s ease',
                                            cursor: 'pointer',
                                            padding: 0,
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#667eea';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#6c757d';
                                        }}
                                    >
                                        Cookie Policy
                                    </button>
                                </li>
                            </ul>
                        </Col>

                        {/* Newsletter Signup */}
                        <Col lg={2} md={6} className="mb-4">
                            <h6
                                style={{
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    marginBottom: '1rem'
                                }}
                            >
                                Stay Updated
                            </h6>
                            <p
                                style={{
                                    color: '#6c757d',
                                    fontSize: '0.85rem',
                                    marginBottom: '1rem',
                                    lineHeight: '1.4'
                                }}
                            >
                                Get travel tips and updates delivered to your inbox.
                            </p>
                            <div className="d-flex flex-column gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={{
                                        border: '1px solid #dee2e6',
                                        borderRadius: '8px',
                                        padding: '8px 12px',
                                        fontSize: '0.85rem',
                                        background: 'rgba(255,255,255,0.8)'
                                    }}
                                    readOnly
                                />
                                <button
                                    onClick={() => handleSocialClick('Newsletter')}
                                    style={{
                                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Subscribe
                                </button>
                            </div>
                        </Col>
                    </Row>

                    {/* Bottom Section */}
                    <hr style={{ margin: '2rem 0 1.5rem 0', border: 'none', borderTop: '1px solid #dee2e6' }} />

                    <Row className="align-items-center">
                        <Col md={6}>
                            <p
                                style={{
                                    color: '#6c757d',
                                    fontSize: '0.9rem',
                                    margin: 0
                                }}
                            >
                                © {currentYear} TravelCompanion. All rights reserved.
                            </p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <p
                                style={{
                                    color: '#6c757d',
                                    fontSize: '0.85rem',
                                    margin: 0
                                }}
                            >
                                Made with ❤️ for travelers worldwide
                            </p>
                        </Col>
                    </Row>
                </Container>
            </footer>
        </>
    );
}