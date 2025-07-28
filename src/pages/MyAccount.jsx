import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { getUserProfile, saveUserProfile } from '../services/api';

export default function MyAccount() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Refs for Google Maps
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [profileData, setProfileData] = useState({
        displayName: '',
        email: '',
        location: '',
        locationCoords: null,
        travelStyle: '',
        favoriteDestinations: '',
        bio: '',
        joinDate: '',
        profilePicture: ''
    });

    // Load Google Maps Script - Only once per application
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            // Check if Google Maps is already fully loaded
            if (window.google && window.google.maps && window.google.maps.places) {
                setMapLoaded(true);
                return;
            }

            // Check if script is already in the DOM
            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
            if (existingScript) {
                // Script exists, wait for it to load
                const checkLoaded = () => {
                    if (window.google && window.google.maps && window.google.maps.places) {
                        setMapLoaded(true);
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };
                checkLoaded();
                return;
            }

            // Only create script if it doesn't exist
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.error('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;
            script.onload = () => setMapLoaded(true);
            script.onerror = () => console.error('Failed to load Google Maps script');
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, []); // Empty dependency array - only run once

    // Initialize Google Maps and Autocomplete
    useEffect(() => {
        if (!mapLoaded || !isEditing || !autocompleteRef.current || !mapRef.current) {
            return;
        }

        const addMarker = (location) => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }

            markerRef.current = new window.google.maps.Marker({
                position: location,
                map: mapInstanceRef.current,
                title: 'Your Location',
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="8" fill="#667eea" stroke="white" stroke-width="3"/>
                    </svg>
                `),
                    scaledSize: new window.google.maps.Size(32, 32)
                }
            });
        };

        const initializeMap = () => {
            const defaultLocation = selectedLocation || { lat: 3.1390, lng: 101.6869 };

            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: defaultLocation,
                zoom: selectedLocation ? 12 : 6,
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'geometry.fill',
                        stylers: [{ color: '#f5f5f5' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#667eea' }]
                    },
                    {
                        featureType: 'landscape',
                        elementType: 'geometry',
                        stylers: [{ color: '#f9f9f9' }]
                    }
                ]
            });

            if (selectedLocation) {
                addMarker(selectedLocation);
            }
        };

        // const initializeLegacyAutocomplete = () => {
        //     const autocomplete = new window.google.maps.places.Autocomplete(
        //         autocompleteRef.current,
        //         {
        //             types: ['(cities)'],
        //             fields: ['place_id', 'formatted_address', 'geometry', 'name']
        //         }
        //     );

        //     autocomplete.addListener('place_changed', () => {
        //         const place = autocomplete.getPlace();

        //         if (place.geometry && place.geometry.location) {
        //             const location = {
        //                 lat: place.geometry.location.lat(),
        //                 lng: place.geometry.location.lng()
        //             };

        //             setSelectedLocation(location);
        //             setProfileData(prev => ({
        //                 ...prev,
        //                 location: place.formatted_address || place.name,
        //                 locationCoords: location
        //             }));

        //             if (mapInstanceRef.current) {
        //                 mapInstanceRef.current.setCenter(location);
        //                 mapInstanceRef.current.setZoom(12);
        //                 addMarker(location);
        //             }
        //         }
        //     });
        // };

        const initializeAutocomplete = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                // Use only legacy autocomplete (no new gmp-place-autocomplete)
                const autocomplete = new window.google.maps.places.Autocomplete(
                    autocompleteRef.current,
                    {
                        types: ['(cities)'],
                        fields: ['place_id', 'formatted_address', 'geometry', 'name']
                    }
                );

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();

                    if (place.geometry && place.geometry.location) {
                        const location = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };

                        setSelectedLocation(location);
                        setProfileData(prev => ({
                            ...prev,
                            location: place.formatted_address || place.name,
                            locationCoords: location
                        }));

                        if (mapInstanceRef.current) {
                            mapInstanceRef.current.setCenter(location);
                            mapInstanceRef.current.setZoom(12);
                            addMarker(location);
                        }
                    }
                });
            }
        };

        // Now call the functions after they're all declared
        initializeMap();
        initializeAutocomplete();

        // Cleanup function
        return () => {
            if (markerRef.current) {
                markerRef.current.setMap(null);
                markerRef.current = null;
            }
        };
    }, [mapLoaded, isEditing, selectedLocation]);



    useEffect(() => {
        const loadProfileData = async () => {
            if (!currentUser) return;

            try {
                setLoading(true);
                const dbProfile = await getUserProfile();

                const combinedProfile = {
                    displayName: dbProfile?.display_name || currentUser.displayName || '',
                    email: currentUser.email || '',
                    location: dbProfile?.location || '',
                    locationCoords: (dbProfile?.location_lat && dbProfile?.location_lng)
                        ? { lat: parseFloat(dbProfile.location_lat), lng: parseFloat(dbProfile.location_lng) }
                        : null,
                    travelStyle: dbProfile?.travel_style || '',
                    favoriteDestinations: dbProfile?.favorite_destinations || '',
                    bio: dbProfile?.bio || '',
                    joinDate: currentUser.metadata?.creationTime || '',
                    profilePicture: dbProfile?.profile_picture_url || currentUser.photoURL || ''
                };

                setProfileData(combinedProfile);

                if (combinedProfile.locationCoords) {
                    setSelectedLocation(combinedProfile.locationCoords);
                }

            } catch (error) {
                console.error('Error loading profile:', error);
                setErrorMessage('Failed to load profile data');
                setShowError(true);
                setTimeout(() => setShowError(false), 5000);
            } finally {
                setLoading(false);
                setTimeout(() => setAnimationComplete(true), 100);
            }
        };

        loadProfileData();
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await saveUserProfile(profileData);

            setShowSuccess(true);
            setIsEditing(false);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setErrorMessage('Failed to save profile. Please try again.');
            setShowError(true);
            setTimeout(() => setShowError(false), 5000);
        } finally {
            setSaving(false);
        }
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
                            Loading your profile...
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

                    {/* Error Alert */}
                    {showError && (
                        <Alert
                            variant="danger"
                            className="mb-4"
                            style={{
                                background: 'rgba(220, 53, 69, 0.9)',
                                border: 'none',
                                borderRadius: '15px',
                                color: 'white'
                            }}
                        >
                            ❌ {errorMessage}
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
                                                Location 🗺️
                                            </Form.Label>
                                            {isEditing ? (
                                                <Form.Control
                                                    ref={autocompleteRef}
                                                    type="text"
                                                    name="location"
                                                    value={profileData.location}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.9)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '10px',
                                                        padding: '12px 15px',
                                                        color: '#333333'
                                                    }}
                                                    placeholder="Search for your city..."
                                                />
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    value={profileData.location}
                                                    disabled
                                                    style={{
                                                        background: 'rgba(255,255,255,0.6)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '10px',
                                                        padding: '12px 15px'
                                                    }}
                                                />
                                            )}
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

                                    {/* Map Display - Show when editing OR when location exists */}
                                    {mapLoaded && (isEditing || profileData.location) && (
                                        <div className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '600' }}>
                                                📍 {isEditing ? 'Location Preview' : 'Your Location'}
                                            </Form.Label>
                                            <div
                                                ref={mapRef}
                                                style={{
                                                    height: '200px',
                                                    borderRadius: '15px',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    overflow: 'hidden'
                                                }}
                                            />
                                        </div>
                                    )}

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
                                                disabled={saving}
                                                style={{
                                                    background: 'linear-gradient(45deg, #56ab2f, #a8e6cf)',
                                                    border: 'none',
                                                    color: 'white',
                                                    padding: '12px 30px',
                                                    borderRadius: '25px',
                                                    fontWeight: '600',
                                                    transition: 'all 0.3s ease',
                                                    opacity: saving ? 0.7 : 1
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!saving) {
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 8px 20px rgba(86,171,47,0.3)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                {saving ? '💾 Saving...' : '💾 Save Changes'}
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>

                <style>
                    {`
                        @keyframes float {
                            0%, 100% { transform: translateY(0px) rotate(0deg); }
                            50% { transform: translateY(-20px) rotate(5deg); }
                        }
                    `}
                </style>
            </div>
        </>
    );
}