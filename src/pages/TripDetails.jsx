import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, getPhotosForTrip, getDestinationsByTripId } from '../services/api';
import { Spinner, Container, Button, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import PhotoUploader from '../components/PhotoUploader';

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const tripData = await getTripById(id);
                setTrip(tripData);

                const photosData = await getPhotosForTrip(id);
                setPhotos(photosData.slice(0, 8)); // Show first 8 photos

                const destinationsData = await getDestinationsByTripId(id);
                setDestinations(destinationsData);
            } catch (err) {
                console.error('Error fetching trip data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    const getTripStatus = () => {
        if (!trip) return { status: 'unknown', color: '#6c757d', emoji: '❓' };

        const today = new Date();
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);

        if (today < startDate) return { status: 'upcoming', color: '#4dabf7', emoji: '⏳' };
        if (today > endDate) return { status: 'completed', color: '#51cf66', emoji: '✅' };
        return { status: 'ongoing', color: '#ff8787', emoji: '✈️' };
    };

    const getDaysInfo = () => {
        if (!trip) return '';

        const today = new Date();
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);

        if (today < startDate) {
            const days = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
            return `${days} days to go`;
        }
        if (today > endDate) {
            const days = Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
            return `${days} days ago`;
        }
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        return `${daysLeft} days left`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTripDuration = () => {
        if (!trip) return '';
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return `${days} day${days > 1 ? 's' : ''}`;
    };

    const getProgressPercentage = () => {
        if (destinations.length === 0) return 0;
        const completed = destinations.filter(d => d.is_completed).length;
        return Math.round((completed / destinations.length) * 100);
    };

    const openPhotoModal = (photo) => {
        setSelectedPhoto(photo);
    };

    const closePhotoModal = () => {
        setSelectedPhoto(null);
    };

    const getTripTypeIcon = (type) => {
        const icons = {
            vacation: '🏖️',
            business: '💼',
            weekend: '🌟',
            family: '👨‍👩‍👧‍👦'
        };
        return icons[type] || '✈️';
    };

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
                            Loading trip details...
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

    if (!trip) {
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
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '25px',
                            padding: '3rem',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Trip Not Found</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                            The trip you're looking for doesn't exist or has been removed.
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                border: 'none',
                                color: 'white',
                                padding: '12px 30px',
                                borderRadius: '20px',
                                fontWeight: '600'
                            }}
                        >
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    const tripStatus = getTripStatus();

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
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
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

                <Container style={{ position: 'relative', zIndex: 2 }}>
                    {/* Header */}
                    <div className="d-flex align-items-center mb-4">
                        <Button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                borderRadius: '15px',
                                padding: '10px 20px',
                                marginRight: '20px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255,255,255,0.2)';
                            }}
                        >
                            ← Back to Dashboard
                        </Button>
                        <h2
                            style={{
                                color: 'white',
                                fontSize: '2.2rem',
                                fontWeight: '700',
                                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                margin: 0
                            }}
                        >
                            Trip Details 🗺️
                        </h2>
                    </div>

                    {/* Hero Section */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '25px',
                            overflow: 'hidden',
                            marginBottom: '2rem',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                            position: 'relative'
                        }}
                    >
                        {/* Hero Image */}
                        {trip.image_url && (
                            <div
                                style={{
                                    height: '300px',
                                    backgroundImage: `url(${trip.image_url})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    position: 'relative'
                                }}
                            >
                                {/* Overlay */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        padding: '2rem'
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-end">
                                        <div>
                                            <h1
                                                style={{
                                                    color: 'white',
                                                    fontSize: '2.5rem',
                                                    fontWeight: '800',
                                                    marginBottom: '0.5rem',
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                                                }}
                                            >
                                                {trip.title}
                                            </h1>
                                            <p
                                                style={{
                                                    color: 'rgba(255,255,255,0.9)',
                                                    fontSize: '1.2rem',
                                                    margin: 0,
                                                    textShadow: '0 2px 10px rgba(0,0,0,0.7)'
                                                }}
                                            >
                                                📍 {trip.city}, {trip.country}
                                            </p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {trip.is_favorite && (
                                                <Badge
                                                    style={{
                                                        background: 'rgba(255, 215, 0, 0.3)',
                                                        border: '2px solid rgba(255, 215, 0, 0.5)',
                                                        color: 'white',
                                                        padding: '8px 12px',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    ⭐ Favorite
                                                </Badge>
                                            )}
                                            <Badge
                                                style={{
                                                    background: `${tripStatus.color}30`,
                                                    border: `2px solid ${tripStatus.color}60`,
                                                    color: 'white',
                                                    padding: '8px 12px',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {tripStatus.emoji} {tripStatus.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trip Info Section */}
                        <div style={{ padding: '2rem' }}>
                            {!trip.image_url && (
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h1
                                            style={{
                                                color: 'white',
                                                fontSize: '2.5rem',
                                                fontWeight: '800',
                                                marginBottom: '0.5rem'
                                            }}
                                        >
                                            {trip.title}
                                        </h1>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.8)',
                                                fontSize: '1.2rem',
                                                margin: 0
                                            }}
                                        >
                                            📍 {trip.city}, {trip.country}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {trip.is_favorite && (
                                            <Badge
                                                style={{
                                                    background: 'rgba(255, 215, 0, 0.3)',
                                                    border: '1px solid rgba(255, 215, 0, 0.5)',
                                                    color: 'white',
                                                    padding: '8px 12px'
                                                }}
                                            >
                                                ⭐ Favorite
                                            </Badge>
                                        )}
                                        <Badge
                                            style={{
                                                background: `${tripStatus.color}30`,
                                                border: `1px solid ${tripStatus.color}60`,
                                                color: 'white',
                                                padding: '8px 12px'
                                            }}
                                        >
                                            {tripStatus.emoji} {tripStatus.status}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Trip Stats Grid */}
                            <Row className="mb-4">
                                <Col md={3} className="mb-3">
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                            {getTripTypeIcon(trip.trip_type)}
                                        </div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {trip.trip_type?.charAt(0).toUpperCase() + trip.trip_type?.slice(1) || 'Trip'}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                            {trip.traveler_count} traveler{trip.traveler_count > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {getTripDuration()}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                            {getDaysInfo()}
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {destinations.length}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                            Destinations
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <div
                                        style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }}
                                    >
                                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                                        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {trip.budget ? `$${trip.budget.toLocaleString()}` : 'No budget'}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                            Budget
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Trip Dates */}
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '15px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                <h5 style={{ color: 'white', marginBottom: '1rem', fontWeight: '600' }}>
                                    📅 Trip Schedule
                                </h5>
                                <Row>
                                    <Col md={6}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                                Departure
                                            </div>
                                            <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                                {formatDate(trip.start_date)}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div>
                                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                                                Return
                                            </div>
                                            <div style={{ color: 'white', fontWeight: '600', fontSize: '1.1rem' }}>
                                                {formatDate(trip.end_date)}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            {/* Progress Section */}
                            {destinations.length > 0 && (
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 style={{ color: 'white', margin: 0, fontWeight: '600' }}>
                                            🎯 Trip Progress
                                        </h5>
                                        <span style={{ color: 'white', fontWeight: '600' }}>
                                            {getProgressPercentage()}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        now={getProgressPercentage()}
                                        style={{
                                            height: '12px',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                        {destinations.filter(d => d.is_completed).length} of {destinations.length} destinations completed
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {trip.notes && (
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <h5 style={{ color: 'white', marginBottom: '1rem', fontWeight: '600' }}>
                                        📝 Notes
                                    </h5>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: '1.6' }}>
                                        {trip.notes}
                                    </p>
                                </div>
                            )}

                            {/* Rating */}
                            {trip.trip_rating && (
                                <div
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        marginBottom: '1.5rem',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        textAlign: 'center'
                                    }}
                                >
                                    <h5 style={{ color: 'white', marginBottom: '1rem', fontWeight: '600' }}>
                                        ⭐ Trip Rating
                                    </h5>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                        {'⭐'.repeat(trip.trip_rating)}
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {trip.trip_rating} out of 5 stars
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="d-flex gap-3 flex-wrap">
                                <Button
                                    onClick={() => navigate(`/edit-trip/${trip.id}`)}
                                    style={{
                                        background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '12px 25px',
                                        borderRadius: '15px',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                >
                                    ✏️ Edit Trip
                                </Button>
                                <Button
                                    onClick={() => navigate(`/trips/${trip.id}/photos`)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        padding: '12px 25px',
                                        borderRadius: '15px',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.25)';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    📸 View All Photos
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Photo Upload Section */}
                    <div
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '25px',
                            padding: '2rem',
                            marginBottom: '2rem',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                        }}
                    >
                        <h4
                            style={{
                                color: 'white',
                                marginBottom: '1.5rem',
                                fontWeight: '600'
                            }}
                        >
                            📤 Upload Photos
                        </h4>
                        <PhotoUploader
                            tripId={id}
                            onUploadSuccess={async () => {
                                const photosData = await getPhotosForTrip(id);
                                setPhotos(photosData.slice(0, 8));
                            }}
                        />
                    </div>

                    {/* Recent Photos */}
                    {photos.length > 0 && (
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '25px',
                                padding: '2rem',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4
                                    style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        margin: 0
                                    }}
                                >
                                    📸 Recent Photos
                                </h4>
                                <Button
                                    onClick={() => navigate(`/trips/${trip.id}/photos`)}
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        padding: '8px 16px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    View All →
                                </Button>
                            </div>

                            <Row>
                                {photos.map((photo) => (
                                    <Col key={photo.id} xs={6} md={3} lg={2} className="mb-3">
                                        <div
                                            style={{
                                                position: 'relative',
                                                borderRadius: '15px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                border: '2px solid rgba(255,255,255,0.2)'
                                            }}
                                            onClick={() => openPhotoModal(photo)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <img
                                                src={photo.image_url}
                                                alt={photo.caption || 'Trip photo'}
                                                style={{
                                                    width: '100%',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                            />
                                            {photo.caption && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                        color: 'white',
                                                        padding: '8px',
                                                        fontSize: '0.75rem',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {photo.caption}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    )}
                </Container>

                {/* Photo Modal */}
                {selectedPhoto && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            cursor: 'pointer'
                        }}
                        onClick={closePhotoModal}
                    >
                        <div
                            style={{
                                position: 'relative',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '20px',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closePhotoModal}
                                style={{
                                    position: 'absolute',
                                    top: '15px',
                                    right: '15px',
                                    background: 'rgba(255,255,255,0.2)',
                                    border: 'none',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    zIndex: 10000,
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'rgba(255,255,255,0.2)';
                                }}
                            >
                                ×
                            </button>

                            <img
                                src={selectedPhoto.image_url}
                                alt={selectedPhoto.caption || 'Photo'}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    objectFit: 'contain',
                                    borderRadius: '15px'
                                }}
                            />

                            {selectedPhoto.caption && (
                                <div
                                    style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        marginTop: '20px',
                                        fontSize: '1.1rem',
                                        fontWeight: '500'
                                    }}
                                >
                                    {selectedPhoto.caption}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    
                    .progress-bar {
                        background: linear-gradient(45deg, #ffd89b, #19547b) !important;
                        transition: width 0.6s ease !important;
                    }
                `}</style>
            </div>
        </>
    );
}