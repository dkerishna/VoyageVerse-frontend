import { useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import AppFooter from '../components/Footer';

export default function Landing() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.loginEmail.value;
        const password = e.target.loginPassword.value;
        try {
            await login(email, password);
            setShowLogin(false);
            navigate('/dashboard');
        } catch (err) {
            alert(err.message || 'Login failed.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.signupEmail.value;
        const password = e.target.signupPassword.value;
        try {
            await signup(email, password);
            setShowSignup(false);
            navigate('/dashboard');
        } catch (err) {
            alert(err.message || 'Signup failed.');
        }
    };

    // Handle demo interactions - show signup modal for non-authenticated users
    const handleDemoInteraction = () => {
        setShowSignup(true);
    };

    // Enhanced trip data with more examples
    const tripCards = [
        {
            title: "European Adventure",
            destination: "Paris → Rome → Berlin",
            date: "May 2025",
            emoji: "✈️",
            image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        },
        {
            title: "Tropical Paradise",
            destination: "Bali & Lombok",
            date: "August 2025",
            emoji: "🏝️",
            image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"
        },
        {
            title: "Mountain Escape",
            destination: "Swiss Alps",
            date: "December 2024",
            emoji: "🏔️",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        },
        {
            title: "City Lights",
            destination: "Tokyo & Kyoto",
            date: "March 2025",
            emoji: "🌸",
            image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #fd79a8 0%, #e84393 100%)"
        },
        {
            title: "Desert Adventure",
            destination: "Morocco Explorer",
            date: "October 2025",
            emoji: "🐪",
            image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73273?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)"
        },
        {
            title: "Northern Lights",
            destination: "Iceland & Norway",
            date: "February 2025",
            emoji: "🌌",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"
        },
        {
            title: "Safari Dreams",
            destination: "Kenya & Tanzania",
            date: "June 2025",
            emoji: "🦁",
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)"
        },
        {
            title: "Greek Islands",
            destination: "Santorini & Mykonos",
            date: "September 2025",
            emoji: "🏛️",
            image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #74b9ff 0%, #00cec9 100%)"
        },
        {
            title: "Amazon Explorer",
            destination: "Brazil Rainforest",
            date: "November 2025",
            emoji: "🌿",
            image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=400&h=250&fit=crop",
            gradient: "linear-gradient(135deg, #00b894 0%, #00a085 100%)"
        }
    ];

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <div
                className="landing-hero"
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    // overflow: 'hidden',
                }}
            >
                {/* Animated background elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        right: '10%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 8s ease-in-out infinite reverse'
                    }}
                />

                <div className="container" style={{
                    position: 'relative', zIndex: 2,
                    // flex: 1, // allow to grow/shrink
                    // overflowY: 'auto', // scroll if needed, 
                    paddingTop: 'clamp(60px, 8vh, 100px)',
                    paddingLeft: 'clamp(15px, 5vw, 50px)',
                    paddingRight: 'clamp(15px, 5vw, 50px)', paddingBottom: '4rem'
                }}>
                    {/* Hero Section */}
                    <div className="row align-items-center mb-5">
                        {/* LEFT COLUMN */}
                        <div className="col-lg-4 col-md-12 text-center text-lg-start mb-4 mb-lg-0">
                            <div
                                style={{
                                    opacity: 0,
                                    transform: 'translateX(-50px)',
                                    animation: 'slideInLeft 0.8s ease-out 0.2s forwards'
                                }}
                            >
                                <h1
                                    className="fw-bold mb-3 mb-lg-4"
                                    style={{
                                        color: 'white',
                                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        lineHeight: '1.1',
                                        fontSize: 'clamp(2rem, 8vw, 4rem)'
                                    }}
                                >
                                    VoyageVerse<br />
                                    <span
                                        style={{
                                            background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        Travel Companion
                                    </span>
                                </h1>
                            </div>

                            <div
                                style={{
                                    opacity: 0,
                                    transform: 'translateX(-50px)',
                                    animation: 'slideInLeft 0.8s ease-out 0.4s forwards'
                                }}
                            >
                                <p
                                    className="lead mb-4"
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '1.3rem',
                                        lineHeight: '1.6'
                                    }}
                                >
                                    Plan unforgettable journeys, explore hidden gems, and preserve your most precious travel memories forever.
                                </p>
                            </div>

                            <div
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(30px)',
                                    animation: 'slideInUp 0.6s ease-out 0.6s forwards'
                                }}
                            >
                                <button
                                    className="btn me-3"
                                    onClick={() => setShowLogin(true)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        padding: '12px 30px',
                                        fontSize: '1.1rem',
                                        borderRadius: '50px',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.3)';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => setShowSignup(true)}
                                    style={{
                                        background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '12px 30px',
                                        fontSize: '1.1rem',
                                        borderRadius: '50px',
                                        transition: 'all 0.3s ease',
                                        fontWeight: '600'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    Get Started
                                </button>
                            </div>
                        </div>

                        {/* RIGHT COLUMN - DEMO */}
                        <div className="col-lg-8 col-md-12 mt-4 mt-lg-0">
                            <div
                                style={{
                                    opacity: 0,
                                    transform: 'translateX(50px)',
                                    animation: 'slideInRight 0.8s ease-out 0.3s forwards'
                                }}
                            >
                                <h3 className="text-white mb-4 text-center" style={{ fontSize: '2rem', fontWeight: '700' }}>
                                    ✨ Discover Amazing Journeys
                                </h3>
                                <p className="text-center text-white mb-4" style={{ opacity: 0.8 }}>
                                    Join thousands of travelers exploring the world
                                </p>
                            </div>

                            <div className="row">
                                {tripCards.map((trip, index) => (
                                    <div key={index} className="col-sm-6 col-md-6 col-lg-4 mb-3 mb-md-4">
                                        <div
                                            className="card h-100 shadow-lg"
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                backdropFilter: 'blur(20px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '20px',
                                                transition: 'all 0.3s ease',
                                                opacity: 0,
                                                transform: 'translateY(30px)',
                                                animation: `slideInUp 0.6s ease-out ${0.5 + index * 0.1}s forwards`,
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-15px)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height: 'clamp(120px, 20vw, 180px)',
                                                    background: `${trip.gradient}, url(${trip.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundBlendMode: 'overlay',
                                                    position: 'relative',
                                                    borderRadius: '20px 20px 0 0'
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '15px',
                                                        right: '15px',
                                                        fontSize: '2rem',
                                                        transition: 'transform 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'scale(1.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                    }}
                                                >
                                                    {trip.emoji}
                                                </div>
                                            </div>
                                            <div className="card-body" style={{ padding: '1.5rem' }}>
                                                <h5
                                                    className="card-title"
                                                    style={{
                                                        color: 'white',
                                                        fontSize: '1.3rem',
                                                        fontWeight: '700',
                                                        marginBottom: '0.5rem'
                                                    }}
                                                >
                                                    {trip.title}
                                                </h5>
                                                <p
                                                    className="card-text"
                                                    style={{
                                                        color: 'rgba(255,255,255,0.8)',
                                                        fontSize: '0.95rem',
                                                        lineHeight: '1.5'
                                                    }}
                                                >
                                                    📍 {trip.destination}<br />
                                                    📅 {trip.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Call-to-action section */}
                            <div
                                className="text-center mt-4"
                                style={{
                                    opacity: 0,
                                    transform: 'translateY(30px)',
                                    animation: `slideInUp 0.6s ease-out ${0.5 + tripCards.length * 0.1}s forwards`
                                }}
                            >
                                <button
                                    className="btn"
                                    onClick={handleDemoInteraction}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        padding: '12px 30px',
                                        fontSize: '1.1rem',
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.3)';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    + Create Your Own Trip
                                </button>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.9rem',
                                        marginTop: '1rem',
                                        marginBottom: 0
                                    }}
                                >
                                    Sign up to start planning your adventure!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div
                        className="row text-center mt-5"
                        style={{
                            opacity: 0,
                            transform: 'translateY(50px)',
                            animation: 'slideInUp 0.8s ease-out 1.2s forwards'
                        }}
                    >
                        <div className="col-md-4 mb-4">
                            <div
                                className="p-4"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                                <h5 style={{ color: 'white', fontWeight: '600' }}>Smart Planning</h5>
                                <p style={{ color: 'rgba(255,255,255,0.8)' }}>AI-powered itinerary suggestions tailored to you</p>
                                <p style={{ color: 'rgba(255, 59, 59, 0.8)' }}>Coming Soon!</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div
                                className="p-4"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                                <h5 style={{ color: 'white', fontWeight: '600' }}>Memory Keeper</h5>
                                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Preserve your travel moments beautifully</p>
                                <p style={{ color: 'rgba(255, 59, 59, 0.8)' }}>Coming Soon!</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div
                                className="p-4"
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                                <h5 style={{ color: 'white', fontWeight: '600' }}>Hidden Gems</h5>
                                <p style={{ color: 'rgba(255,255,255,0.8)' }}>Discover off-the-beaten-path destinations</p>
                                <p style={{ color: 'rgba(255, 59, 59, 0.8)' }}>Coming Soon!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login Modal */}
                {showLogin && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div
                                className="modal-content"
                                style={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    className="modal-header"
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    <h5 className="modal-title">Welcome Back</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowLogin(false)}
                                    ></button>
                                </div>
                                <div className="modal-body" style={{ padding: '2rem' }}>
                                    <form onSubmit={handleLogin}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                name="loginEmail"
                                                id="loginEmail"
                                                className="form-control"
                                                required
                                                style={{
                                                    borderRadius: '10px',
                                                    border: '2px solid #e9ecef',
                                                    padding: '12px 15px',
                                                    fontSize: '1rem'
                                                }}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Password</label>
                                            <input
                                                type="password"
                                                name="loginPassword"
                                                id="loginPassword"
                                                className="form-control"
                                                required
                                                style={{
                                                    borderRadius: '10px',
                                                    border: '2px solid #e9ecef',
                                                    padding: '12px 15px',
                                                    fontSize: '1rem'
                                                }}
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn w-100"
                                            style={{
                                                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '12px',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: 'white'
                                            }}
                                        >
                                            Sign In
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Signup Modal */}
                {showSignup && (
                    <div
                        className="modal show d-block"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div
                                className="modal-content"
                                style={{
                                    borderRadius: '20px',
                                    border: 'none',
                                    overflow: 'hidden'
                                }}
                            >
                                <div
                                    className="modal-header"
                                    style={{
                                        background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    <h5 className="modal-title">Start Your Journey</h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowSignup(false)}
                                    ></button>
                                </div>
                                <div className="modal-body" style={{ padding: '2rem' }}>
                                    <form onSubmit={handleSignup}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">Email Address</label>
                                            <input
                                                type="email"
                                                name="signupEmail"
                                                id="signupEmail"
                                                className="form-control"
                                                required
                                                style={{
                                                    borderRadius: '10px',
                                                    border: '2px solid #e9ecef',
                                                    padding: '12px 15px',
                                                    fontSize: '1rem'
                                                }}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">Password</label>
                                            <input
                                                type="password"
                                                name="signupPassword"
                                                id="signupPassword"
                                                className="form-control"
                                                required
                                                style={{
                                                    borderRadius: '10px',
                                                    border: '2px solid #e9ecef',
                                                    padding: '12px 15px',
                                                    fontSize: '1rem'
                                                }}
                                                placeholder="Create a password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn w-100"
                                            style={{
                                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                                border: 'none',
                                                borderRadius: '10px',
                                                padding: '12px',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: 'white'
                                            }}
                                        >
                                            Create Account
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <AppFooter />

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    
                    @keyframes slideInLeft {
                        from {
                            opacity: 0;
                            transform: translateX(-50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideInRight {
                        from {
                            opacity: 0;
                            transform: translateX(50px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                    
                    @keyframes slideInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </>
    );
}