import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

export default function ContactUs() {
    const navigate = useNavigate();
    const [animationComplete, setAnimationComplete] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        urgency: 'medium'
    });

    useEffect(() => {
        setTimeout(() => setAnimationComplete(true), 100);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Here you would typically send the email via your backend
        console.log('Sending contact form:', formData);

        // For demo purposes, just show success message
        setShowSuccess(true);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            urgency: 'medium'
        });

        setTimeout(() => setShowSuccess(false), 5000);
    };

    const urgencyOptions = [
        { value: 'low', label: 'Low - General inquiry', color: '#56ab2f' },
        { value: 'medium', label: 'Medium - Need assistance', color: '#ffd89b' },
        { value: 'high', label: 'High - Urgent issue', color: '#ff6b6b' }
    ];

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email Support',
            description: 'Get help via email within 24 hours',
            contact: 'support@travelcompanion.com',
            action: 'mailto:support@travelcompanion.com'
        },
        {
            icon: '📞',
            title: 'Phone Support',
            description: 'Call us during business hours',
            contact: '+60 14-969 6953',
            action: 'tel:+60149696953'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            description: 'Chat with our support team',
            contact: 'Available 9 AM - 6 PM MYT',
            action: '#'
        }
    ];

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated background elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 8s ease-in-out infinite'
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '20%',
                        right: '10%',
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animation: 'float 6s ease-in-out infinite reverse'
                    }}
                />

                <Container style={{ position: 'relative', zIndex: 2, paddingTop: '2rem', paddingBottom: '4rem' }}>
                    {/* Header Section */}
                    <div
                        className="text-center mb-5"
                        style={{
                            opacity: animationComplete ? 1 : 0,
                            transform: animationComplete ? 'translateY(0)' : 'translateY(-30px)',
                            transition: 'all 0.8s ease-out'
                        }}
                    >
                        <h2
                            style={{
                                color: 'white',
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                marginBottom: '0.5rem',
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                            }}
                        >
                            Contact Us 💬
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '1.2rem',
                                marginBottom: '2rem'
                            }}
                        >
                            We're here to help make your travel planning experience amazing
                        </p>

                        <Button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '2px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                padding: '12px 25px',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.3)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>

                    {/* Success Alert */}
                    {showSuccess && (
                        <Alert
                            variant="success"
                            className="mb-4"
                            style={{
                                background: 'rgba(40, 167, 69, 0.9)',
                                border: 'none',
                                borderRadius: '15px',
                                color: 'white',
                                textAlign: 'center'
                            }}
                        >
                            ✅ Your message has been sent! We'll get back to you within 24 hours.
                        </Alert>
                    )}

                    <Row>
                        {/* Contact Methods */}
                        <Col lg={4} className="mb-4">
                            <div
                                style={{
                                    opacity: animationComplete ? 1 : 0,
                                    transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.6s ease-out 0.2s'
                                }}
                            >
                                {/* HQ Information */}
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '25px',
                                        padding: '2rem',
                                        marginBottom: '2rem',
                                        textAlign: 'center'
                                    }}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                                    <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '1rem' }}>
                                        Our Headquarters
                                    </h5>
                                    <div style={{ color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                                        <p style={{ marginBottom: '0.5rem' }}>📍 B-1-11, IOI Boulevard</p>
                                        <p style={{ marginBottom: '0.5rem' }}>Jalan Kenari 5</p>
                                        <p style={{ marginBottom: '1rem' }}>47100 Puchong, Selangor</p>
                                        <p style={{ marginBottom: '0.5rem' }}>🇲🇾 Malaysia</p>
                                    </div>
                                </div>

                                {/* Contact Methods */}
                                <h5 style={{ color: 'white', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
                                    Get In Touch
                                </h5>

                                {contactMethods.map((method, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '20px',
                                            padding: '1.5rem',
                                            marginBottom: '1rem',
                                            cursor: method.action !== '#' ? 'pointer' : 'default',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => {
                                            if (method.action !== '#') {
                                                window.open(method.action, '_blank');
                                            }
                                        }}
                                        onMouseEnter={(e) => {
                                            if (method.action !== '#') {
                                                e.currentTarget.style.transform = 'translateY(-3px)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                            {method.icon}
                                        </div>
                                        <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            {method.title}
                                        </h6>
                                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            {method.description}
                                        </p>
                                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: 0, fontWeight: '500' }}>
                                            {method.contact}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Col>

                        {/* Contact Form */}
                        <Col lg={8}>
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '25px',
                                    padding: '2rem',
                                    opacity: animationComplete ? 1 : 0,
                                    transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.6s ease-out 0.4s'
                                }}
                            >
                                <h5 style={{ color: 'white', marginBottom: '2rem', fontWeight: '700' }}>
                                    Send us a Message
                                </h5>

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Your Name *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                                placeholder="Enter your full name"
                                            />
                                        </Col>

                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Email Address *
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                                placeholder="Enter your email"
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={8} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Subject *
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                                placeholder="What's this about?"
                                            />
                                        </Col>

                                        <Col md={4} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Priority Level
                                            </Form.Label>
                                            <Form.Select
                                                name="urgency"
                                                value={formData.urgency}
                                                onChange={handleInputChange}
                                                style={{
                                                    background: 'rgba(255,255,255,0.9)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                            >
                                                {urgencyOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>

                                    <div className="mb-4">
                                        <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                            Message *
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={6}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                background: 'rgba(255,255,255,0.9)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '10px',
                                                padding: '12px 15px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Please describe your issue or question in detail. The more information you provide, the better we can help you!"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>
                                            * Required fields
                                        </p>

                                        <Button
                                            type="submit"
                                            style={{
                                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '12px 30px',
                                                borderRadius: '25px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1.1rem'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 8px 20px rgba(255,216,155,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        >
                                            📤 Send Message
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>

                    {/* FAQ Section */}
                    <Row className="mt-5">
                        <Col lg={12}>
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '25px',
                                    padding: '2rem',
                                    opacity: animationComplete ? 1 : 0,
                                    transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.6s ease-out 0.6s'
                                }}
                            >
                                <h5 style={{ color: 'white', marginBottom: '2rem', fontWeight: '700', textAlign: 'center' }}>
                                    Frequently Asked Questions
                                </h5>

                                <Row>
                                    <Col md={6} className="mb-3">
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                                            <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                ❓ How do I create a new trip?
                                            </h6>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
                                                Go to your Dashboard and click the "Create New Trip" button to start planning your adventure.
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                                            <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                📸 How do I upload photos?
                                            </h6>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
                                                Visit any trip detail page and use the photo uploader to add memories to your destinations.
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                                            <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                🔒 Is my data secure?
                                            </h6>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
                                                Yes! We use Firebase authentication and secure cloud storage to protect your information.
                                            </p>
                                        </div>
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                                            <h6 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                💰 Is TravelCompanion free?
                                            </h6>
                                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
                                                Yes! All core features are completely free. Create unlimited trips and store unlimited memories.
                                            </p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                `}</style>
            </div>
        </>
    );
}