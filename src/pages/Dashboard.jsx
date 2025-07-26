import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { getUserTrips } from '../services/api';
import TripCard from '../components/TripCard';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animationComplete, setAnimationComplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await getUserTrips();
                console.log('Fetched trips:', data);
                setTrips(data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
                setTimeout(() => setAnimationComplete(true), 100);
            }
        };

        if (currentUser) fetchTrips();
    }, [currentUser]);

    if (loading) {
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div className="text-center">
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                border: '4px solid rgba(255,255,255,0.3)',
                                borderTop: '4px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 20px'
                            }}
                        />
                        <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '500' }}>
                            Loading your amazing trips...
                        </p>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

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
                                My Trips ✈️
                            </h2>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: '1.1rem',
                                    marginBottom: 0
                                }}
                            >
                                Welcome back, {currentUser?.displayName || currentUser?.name || currentUser?.email?.split('@')[0] || 'Traveler'}! Ready for your next adventure?
                            </p>
                        </div>

                        <Button
                            onClick={() => navigate('/create-trip')}
                            style={{
                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                border: 'none',
                                color: 'white',
                                padding: '12px 25px',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                            }}
                        >
                            + Create New Trip
                        </Button>
                    </div>

                    {/* Trips Section */}
                    {trips.length === 0 ? (
                        <div
                            className="text-center"
                            style={{
                                opacity: animationComplete ? 1 : 0,
                                transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'all 0.8s ease-out 0.3s'
                            }}
                        >
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '30px',
                                    padding: '4rem 2rem',
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}
                            >
                                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🗺️</div>
                                <h3 style={{ color: 'white', marginBottom: '1rem', fontWeight: '600' }}>
                                    Your Adventure Awaits!
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                    You haven't created any trips yet. Start planning your next amazing journey!
                                </p>
                                <Button
                                    onClick={() => navigate('/create-trip')}
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
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Create Your First Trip
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Row>
                            {trips.map((trip, index) => (
                                <Col
                                    md={4}
                                    sm={6}
                                    xs={12}
                                    key={trip.id}
                                    className="mb-4"
                                    style={{
                                        opacity: animationComplete ? 1 : 0,
                                        transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                        transition: `all 0.6s ease-out ${0.2 + index * 0.1}s`
                                    }}
                                >
                                    <div
                                        style={{
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <TripCard trip={trip} />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {/* Stats Section */}
                    {trips.length > 0 && (
                        <Row
                            className="mt-5"
                            style={{
                                opacity: animationComplete ? 1 : 0,
                                transform: animationComplete ? 'translateY(0)' : 'translateY(30px)',
                                transition: 'all 0.8s ease-out 0.8s'
                            }}
                        >
                            <Col md={4} className="mb-3">
                                <div
                                    className="text-center p-4"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
                                    <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {trips.length}
                                    </h4>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
                                        Total Trips
                                    </p>
                                </div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <div
                                    className="text-center p-4"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                                    <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {trips.filter(t => {
                                            const endDate = new Date(t.end_date);
                                            return endDate < new Date();
                                        }).length}
                                    </h4>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
                                        Completed
                                    </p>
                                </div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <div
                                    className="text-center p-4"
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '20px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                    }}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
                                    <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {trips.filter(t => {
                                            const startDate = new Date(t.start_date);
                                            return startDate > new Date();
                                        }).length}
                                    </h4>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 0 }}>
                                        Upcoming
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    )}
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