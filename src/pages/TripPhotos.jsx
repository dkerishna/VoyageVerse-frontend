import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDestinationsByTripId, getPhotosForTrip, getTripById } from '../services/api';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';

export default function TripPhotos() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [photosByDestination, setPhotosByDestination] = useState({});
    const [tripPhotos, setTripPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('=== DEBUG ===');
                console.log('tripId from useParams:', tripId);
                console.log('tripId type:', typeof tripId);
                console.log('tripId value:', JSON.stringify(tripId));

                console.log('Fetching data for trip:', tripId);

                // Fetch trip details
                const tripData = await getTripById(tripId);
                console.log('Trip data:', tripData);
                setTrip(tripData);

                // Fetch destinations
                const dests = await getDestinationsByTripId(tripId);
                console.log('Destinations:', dests);
                setDestinations(dests);

                // Fetch all photos
                const allPhotos = await getPhotosForTrip(tripId);
                console.log('All photos:', allPhotos);

                // Group photos by destination
                const grouped = {};

                // Initialize grouped object with empty arrays for each destination
                dests.forEach(dest => {
                    grouped[dest.id] = [];
                });

                // Photos without a destination (general trip photos)
                const photosWithoutDestination = [];

                // Sort photos into appropriate groups
                allPhotos.forEach(photo => {
                    if (photo.destination_id && grouped[photo.destination_id]) {
                        grouped[photo.destination_id].push(photo);
                    } else {
                        // Photo has no destination_id or destination doesn't exist
                        photosWithoutDestination.push(photo);
                    }
                });

                console.log('Grouped photos:', grouped);
                console.log('General trip photos:', photosWithoutDestination);

                setPhotosByDestination(grouped);
                setTripPhotos(photosWithoutDestination);
            } catch (err) {
                console.error('Failed to fetch data', err);
                setError('Failed to load photos. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (tripId) {
            fetchData();
        }
    }, [tripId]);

    const getTotalPhotoCount = () => {
        let count = tripPhotos.length;
        Object.values(photosByDestination).forEach(photos => {
            count += photos.length;
        });
        return count;
    };

    const openPhotoModal = (photo) => {
        setSelectedPhoto(photo);
    };

    const closePhotoModal = () => {
        setSelectedPhoto(null);
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
                            Loading your amazing photos...
                        </p>
                    </div>
                </div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </>
        );
    }

    if (error) {
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
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>Error Loading Photos</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                            {error}
                        </p>
                        <div className="d-flex gap-3 justify-content-center">
                            <Button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px 30px',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}
                            >
                                🔄 Try Again
                            </Button>
                            <Button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    border: '1px solid rgba(255,255,255,0.3)',
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
                </div>
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
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
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
                            <div>
                                <h2
                                    style={{
                                        color: 'white',
                                        fontSize: '2.2rem',
                                        fontWeight: '700',
                                        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        margin: 0,
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    📸 Trip Photos
                                </h2>
                                {trip && (
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '1.1rem',
                                            margin: 0
                                        }}
                                    >
                                        {trip.title} • {getTotalPhotoCount()} photos
                                    </p>
                                )}
                            </div>
                        </div>

                        <Badge
                            style={{
                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                fontSize: '1rem',
                                padding: '10px 20px',
                                borderRadius: '20px'
                            }}
                        >
                            {getTotalPhotoCount()} Total Photos
                        </Badge>
                    </div>

                    {/* General Trip Photos */}
                    {tripPhotos.length > 0 && (
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
                            <div className="d-flex align-items-center mb-3">
                                <h4
                                    style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        margin: 0,
                                        marginRight: '15px'
                                    }}
                                >
                                    🌟 General Trip Photos
                                </h4>
                                <Badge
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        color: 'white'
                                    }}
                                >
                                    {tripPhotos.length} photos
                                </Badge>
                            </div>

                            <Row>
                                {tripPhotos.map((photo) => (
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
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    display: 'block'
                                                }}
                                                onError={(e) => {
                                                    console.error('Failed to load image:', photo.image_url);
                                                    e.target.style.display = 'none';
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
                                                        padding: '10px',
                                                        fontSize: '0.8rem'
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

                    {/* Photos by Destination */}
                    {destinations
                        .filter(dest => photosByDestination[dest.id] && photosByDestination[dest.id].length > 0)
                        .map(dest => (
                            <div
                                key={dest.id}
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
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                        <h4
                                            style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                margin: 0,
                                                marginRight: '15px'
                                            }}
                                        >
                                            📍 {dest.name}
                                        </h4>
                                        <Badge
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                color: 'white'
                                            }}
                                        >
                                            {photosByDestination[dest.id].length} photos
                                        </Badge>
                                    </div>

                                    {dest.destination_type && (
                                        <Badge
                                            style={{
                                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {dest.destination_type}
                                        </Badge>
                                    )}
                                </div>

                                {dest.description && (
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.8)',
                                            fontSize: '0.95rem',
                                            marginBottom: '1.5rem',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        {dest.description}
                                    </p>
                                )}

                                {dest.address && (
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.7)',
                                            fontSize: '0.9rem',
                                            marginBottom: '1.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <span>📍</span> {dest.address}
                                    </p>
                                )}

                                <Row>
                                    {photosByDestination[dest.id].map((photo) => (
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
                                                    alt={photo.caption || 'Destination photo'}
                                                    style={{
                                                        width: '100%',
                                                        height: '150px',
                                                        objectFit: 'cover',
                                                        display: 'block'
                                                    }}
                                                    onError={(e) => {
                                                        console.error('Failed to load image:', photo.image_url);
                                                        e.target.style.display = 'none';
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
                                                            padding: '10px',
                                                            fontSize: '0.8rem'
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
                        ))
                    }

                    {/* No Photos Message */}
                    {getTotalPhotoCount() === 0 && (
                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '25px',
                                padding: '4rem 2rem',
                                textAlign: 'center',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📷</div>
                            <h3 style={{ color: 'white', marginBottom: '1rem', fontWeight: '600' }}>
                                No Photos Yet
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                                Start capturing memories! Photos will appear here as you add them to your trip.
                            </p>
                            <Button
                                onClick={() => navigate(`/trips/${trip.id}/photos`)}
                                style={{
                                    background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px 30px',
                                    borderRadius: '20px',
                                    fontWeight: '600'
                                }}
                            >
                                📤 Upload Photos
                            </Button>
                        </div>
                    )}

                    {/* Debug Information - You can remove this section after testing */}
                    {window.location.hostname === 'localhost' && (
                        <div
                            style={{
                                background: 'rgba(255, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 0, 0, 0.3)',
                                borderRadius: '15px',
                                padding: '1rem',
                                marginTop: '2rem',
                                color: 'white',
                                fontSize: '0.8rem'
                            }}
                        >
                            <strong>Debug Info:</strong><br />
                            Trip ID: {tripId}<br />
                            Destinations: {destinations.length}<br />
                            General photos: {tripPhotos.length}<br />
                            Photos by destination: {JSON.stringify(Object.keys(photosByDestination).reduce((acc, key) => {
                                acc[key] = photosByDestination[key].length;
                                return acc;
                            }, {}), null, 2)}
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