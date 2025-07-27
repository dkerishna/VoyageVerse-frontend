import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';

export default function MyAccount() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [profileData, setProfileData] = useState({
        displayName: '',
        email: '',
        location: '',
        travelStyle: '',
        favoriteDestinations: '',
        bio: '',
        joinDate: '',
        profilePicture: ''
    });

    useEffect(() => {
        // Initialize profile data from Firebase user
        if (currentUser) {
            setProfileData({
                displayName: currentUser.displayName || '',
                email: currentUser.email || '',
                location: '', // These would come from your database if stored
                travelStyle: '',
                favoriteDestinations: '',
                bio: '',
                joinDate: currentUser.metadata?.creationTime || '',
                profilePicture: currentUser.photoURL || ''
            });
        }
        setTimeout(() => setAnimationComplete(true), 100);
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        // Here you would typically save to your backend/database
        console.log('Saving profile data:', profileData);

        // For demo purposes, just show success message
        setShowSuccess(true);
        setIsEditing(false);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const formatJoinDate = (dateString) => {
        if (!dateString) return 'Recently';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const travelStyles = [
        'Adventure Seeker', 'Luxury Traveler', 'Budget Backpacker',
        'Cultural Explorer', 'Beach Lover', 'Mountain Enthusiast',
        'City Explorer', 'Solo Traveler', 'Family Traveler', 'Food Tourist'
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
                        className="d-flex justify-content-between align-items-center mb-5"
                        style={{
                            opacity: animationComplete ? 1 : 0,
                            transform: animationComplete ? 'translateY(0)' : 'translateY(-30px)',
                            transition: 'all 0.8s ease-out'
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    color: 'white',
                                    fontSize: '2.5rem',
                                    fontWeight: '800',
                                    marginBottom: '0.5rem',
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                            >
                                My Account 👤
                            </h2>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '1.1rem',
                                    marginBottom: 0
                                }}
                            >
                                Manage your profile and travel preferences
                            </p>
                        </div>

                        <div className="d-flex gap-3">
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

                            <Button
                                onClick={handleLogout}
                                style={{
                                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px 25px',
                                    fontSize: '1.1rem',
                                    borderRadius: '50px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 12px 35px rgba(255,107,107,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(255,107,107,0.3)';
                                }}
                            >
                                Logout
                            </Button>
                        </div>
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
                                color: 'white'
                            }}
                        >
                            ✅ Profile updated successfully!
                        </Alert>
                    )}

                    <Row>
                        {/* Profile Card */}
                        <Col lg={4} className="mb-4">
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '25px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    opacity: animationComplete ? 1 : 0,
                                    transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.6s ease-out 0.2s'
                                }}
                            >
                                {/* Profile Picture */}
                                <div
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: profileData.profilePicture
                                            ? `url(${profileData.profilePicture})`
                                            : 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        margin: '0 auto 1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '3rem',
                                        color: 'white',
                                        border: '4px solid rgba(255,255,255,0.3)'
                                    }}
                                >
                                    {!profileData.profilePicture && '👤'}
                                </div>

                                <h4 style={{ color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>
                                    {profileData.displayName || currentUser?.email?.split('@')[0] || 'Travel Explorer'}
                                </h4>

                                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1rem' }}>
                                    {profileData.email}
                                </p>

                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        padding: '1rem',
                                        marginBottom: '1.5rem'
                                    }}
                                >
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                        📍 {profileData.location || 'Location not set'}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                        ✈️ {profileData.travelStyle || 'Travel style not set'}
                                    </p>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                                        📅 Member since {formatJoinDate(profileData.joinDate)}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    style={{
                                        background: isEditing
                                            ? 'linear-gradient(45deg, #ff6b6b, #ee5a52)'
                                            : 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '10px 25px',
                                        borderRadius: '25px',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                </Button>
                            </div>
                        </Col>

                        {/* Profile Form */}
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
                                    Profile Information
                                </h5>

                                <Form>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Display Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="displayName"
                                                value={profileData.displayName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                style={{
                                                    background: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                                placeholder="Enter your display name"
                                            />
                                        </Col>

                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Email Address
                                            </Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={profileData.email}
                                                disabled
                                                style={{
                                                    background: 'rgba(255,255,255,0.4)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Location
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                style={{
                                                    background: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                                placeholder="e.g., New York, USA"
                                            />
                                        </Col>

                                        <Col md={6} className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                Travel Style
                                            </Form.Label>
                                            <Form.Select
                                                name="travelStyle"
                                                value={profileData.travelStyle}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                style={{
                                                    background: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    borderRadius: '10px',
                                                    padding: '12px 15px'
                                                }}
                                            >
                                                <option value="">Select your travel style</option>
                                                {travelStyles.map(style => (
                                                    <option key={style} value={style}>{style}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>

                                    <div className="mb-3">
                                        <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                            Favorite Destinations
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="favoriteDestinations"
                                            value={profileData.favoriteDestinations}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            style={{
                                                background: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '10px',
                                                padding: '12px 15px'
                                            }}
                                            placeholder="e.g., Paris, Tokyo, Bali"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                            Bio
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            style={{
                                                background: isEditing ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '10px',
                                                padding: '12px 15px',
                                                resize: 'vertical'
                                            }}
                                            placeholder="Tell us about your travel experiences and what you love about exploring the world..."
                                        />
                                    </div>

                                    {isEditing && (
                                        <div className="d-flex gap-3">
                                            <Button
                                                onClick={handleSave}
                                                style={{
                                                    background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '12px 30px',
                                                    borderRadius: '25px',
                                                    fontWeight: '600',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 8px 20px rgba(86,171,47,0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                💾 Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                `}</style>
            </div>
        </>
    );
}