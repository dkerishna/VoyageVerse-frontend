import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/useAuth';
import { createTrip, addDestination } from '../services/api';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CreateTrip = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Trip form state
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tripType, setTripType] = useState('vacation');
    const [budget, setBudget] = useState('');
    const [travelerCount, setTravelerCount] = useState(1);
    const [image, setImage] = useState(null);

    // Destinations state
    const [destinations, setDestinations] = useState([
        {
            name: '',
            description: '',
            destination_type: '',
            address: '',
            location_lat: null,
            location_lng: null,
            visit_date: '',
            visit_time: '',
            price_range: '',
            priority_level: 3
        },
    ]);

    // Google Maps state
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapsApiReady, setMapsApiReady] = useState(false);
    const [selectedCityLocation, setSelectedCityLocation] = useState(null);

    // Refs for Google Maps autocomplete
    const cityAutocompleteRef = useRef(null);
    const destinationRefs = useRef([]);
    const cityMapRef = useRef(null);
    const cityMapInstanceRef = useRef(null);
    const cityMarkerRef = useRef(null);

    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    // Load Google Maps Script with better error handling
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            // Check if already loaded
            if (window.google && window.google.maps && window.google.maps.places) {
                setMapLoaded(true);
                setMapsApiReady(true);
                return;
            }

            // Check if script is already being loaded
            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
            if (existingScript) {
                const checkLoaded = () => {
                    if (window.google && window.google.maps && window.google.maps.places) {
                        setMapLoaded(true);
                        setMapsApiReady(true);
                    } else {
                        setTimeout(checkLoaded, 100);
                    }
                };
                checkLoaded();
                return;
            }

            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
            if (!apiKey) {
                console.error('Google Maps API key not found. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
                setError('Google Maps API key not configured. Please contact support.');
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                // Additional check to ensure all APIs are available
                const checkComplete = () => {
                    if (window.google && window.google.maps && window.google.maps.places && window.google.maps.places.Autocomplete) {
                        setMapLoaded(true);
                        setMapsApiReady(true);
                    } else {
                        setTimeout(checkComplete, 50);
                    }
                };
                checkComplete();
            };

            script.onerror = (error) => {
                console.error('Failed to load Google Maps script:', error);
                setError('Failed to load Google Maps. Please check your internet connection and try again.');
            };

            document.head.appendChild(script);
        };

        loadGoogleMapsScript();
    }, []);

    // Initialize Google Maps for city field with better safety checks
    useEffect(() => {
        if (!mapsApiReady || !mapLoaded || !cityAutocompleteRef.current) return;

        try {
            // Double-check that the API is fully available
            if (!window.google.maps.places.Autocomplete) {
                console.error('Google Maps Places Autocomplete not available');
                return;
            }

            const cityAutocomplete = new window.google.maps.places.Autocomplete(
                cityAutocompleteRef.current,
                {
                    types: ['(cities)'],
                    fields: ['place_id', 'formatted_address', 'geometry', 'name', 'address_components']
                }
            );

            cityAutocomplete.addListener('place_changed', () => {
                const place = cityAutocomplete.getPlace();

                if (place.geometry && place.geometry.location) {
                    const location = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    };

                    // Extract country and city from place
                    let extractedCountry = '';
                    let extractedCity = '';

                    if (place.address_components) {
                        for (const component of place.address_components) {
                            if (component.types.includes('country')) {
                                extractedCountry = component.long_name;
                            }
                            if (component.types.includes('locality') || component.types.includes('administrative_area_level_1')) {
                                extractedCity = component.long_name;
                            }
                        }
                    }

                    setCountry(extractedCountry || country);
                    setCity(extractedCity || place.name || city);
                    setSelectedCityLocation(location);

                    // Update city map
                    if (cityMapInstanceRef.current) {
                        cityMapInstanceRef.current.setCenter(location);
                        cityMapInstanceRef.current.setZoom(10);

                        // Add/update marker
                        if (cityMarkerRef.current) {
                            cityMarkerRef.current.setMap(null);
                        }

                        cityMarkerRef.current = new window.google.maps.Marker({
                            position: location,
                            map: cityMapInstanceRef.current,
                            title: place.name || 'Selected City',
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <circle cx="16" cy="16" r="8" fill="#ffd89b" stroke="white" stroke-width="3"/>
                                    </svg>
                                `),
                                scaledSize: new window.google.maps.Size(32, 32)
                            }
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing city autocomplete:', error);
            setError('Error initializing location search. Please refresh the page.');
        }
    }, [mapsApiReady, mapLoaded, country, city]);

    // Initialize city map with better error handling
    useEffect(() => {
        if (!mapsApiReady || !mapLoaded || !cityMapRef.current) return;

        try {
            const defaultLocation = selectedCityLocation || { lat: 3.1390, lng: 101.6869 };

            cityMapInstanceRef.current = new window.google.maps.Map(cityMapRef.current, {
                center: defaultLocation,
                zoom: selectedCityLocation ? 10 : 2,
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

            if (selectedCityLocation && cityMarkerRef.current) {
                cityMarkerRef.current.setMap(cityMapInstanceRef.current);
            }
        } catch (error) {
            console.error('Error initializing city map:', error);
        }
    }, [mapsApiReady, mapLoaded, selectedCityLocation]);

    // Initialize destination autocomplete for new fields with better error handling
    const initializeDestinationAutocomplete = useCallback((index) => {
        if (!mapsApiReady || !mapLoaded) return;

        setTimeout(() => {
            try {
                const ref = destinationRefs.current[index];
                if (!ref || ref.dataset.autocompleteInitialized) return;

                // Check if API is still available
                if (!window.google?.maps?.places?.Autocomplete) {
                    console.error('Google Maps Places API not available for destination autocomplete');
                    return;
                }

                const autocomplete = new window.google.maps.places.Autocomplete(ref, {
                    fields: ['place_id', 'formatted_address', 'geometry', 'name']
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();

                    if (place.geometry && place.geometry.location) {
                        const location = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };

                        setDestinations(prevDestinations => {
                            const newDestinations = [...prevDestinations];
                            if (newDestinations[index]) {
                                newDestinations[index] = {
                                    ...newDestinations[index],
                                    address: place.formatted_address || place.name,
                                    location_lat: location.lat,
                                    location_lng: location.lng
                                };
                            }
                            return newDestinations;
                        });
                    }
                });

                ref.dataset.autocompleteInitialized = 'true';
            } catch (error) {
                console.error('Error initializing destination autocomplete:', error);
            }
        }, 100);
    }, [mapsApiReady, mapLoaded]);

    // Initialize autocomplete for existing destinations when maps load
    useEffect(() => {
        if (!mapsApiReady || !mapLoaded) return;

        for (let i = 0; i < destinations.length; i++) {
            initializeDestinationAutocomplete(i);
        }
    }, [mapsApiReady, mapLoaded, destinations.length, initializeDestinationAutocomplete]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setUploading(true);
            let imageUrl = '';

            if (image) {
                const imageRef = ref(storage, `trips/${currentUser.uid}/${uuidv4()}-${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            // Create the trip first
            const trip = await createTrip({
                user_firebase_uid: currentUser.uid,
                title,
                notes,
                start_date: startDate,
                end_date: endDate,
                country,
                city,
                trip_type: tripType,
                budget: budget ? parseFloat(budget) : null,
                traveler_count: travelerCount,
                image_url: imageUrl,
            });

            // Add destinations with enhanced data including coordinates
            for (let i = 0; i < destinations.length; i++) {
                const dest = destinations[i];
                if (dest.name.trim()) { // Only add destinations with names
                    await addDestination(trip.id, {
                        ...dest,
                        order_index: i + 1,
                        priority_level: parseInt(dest.priority_level) || 3,
                        location_lat: dest.location_lat,
                        location_lng: dest.location_lng
                    });
                }
            }

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Failed to create trip. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const addDestinationField = () => {
        const newIndex = destinations.length;
        setDestinations([...destinations, {
            name: '',
            description: '',
            destination_type: '',
            address: '',
            location_lat: null,
            location_lng: null,
            visit_date: '',
            visit_time: '',
            price_range: '',
            priority_level: 3
        }]);

        // Initialize autocomplete for the new field
        setTimeout(() => {
            initializeDestinationAutocomplete(newIndex);
        }, 100);
    };

    const removeDestinationField = (index) => {
        if (destinations.length > 1) {
            setDestinations(destinations.filter((_, i) => i !== index));
            // Clean up refs
            destinationRefs.current.splice(index, 1);
        }
    };

    const updateDestination = (index, field, value) => {
        const newDestinations = [...destinations];
        newDestinations[index][field] = value;
        setDestinations(newDestinations);
    };

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
                            ← Back to Trips
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
                            Create New Trip ✈️
                        </h2>
                    </div>

                    {/* Loading indicator for Google Maps */}
                    {!mapsApiReady && !error && (
                        <Alert
                            variant="info"
                            style={{
                                background: 'rgba(13, 202, 240, 0.2)',
                                border: '1px solid rgba(13, 202, 240, 0.3)',
                                color: 'white',
                                borderRadius: '15px',
                                marginBottom: '1rem'
                            }}
                        >
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ marginRight: '10px' }}
                            />
                            Loading location services...
                        </Alert>
                    )}

                    {/* Main Form Card */}
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
                        {error && (
                            <Alert
                                variant="danger"
                                style={{
                                    background: 'rgba(220, 53, 69, 0.2)',
                                    border: '1px solid rgba(220, 53, 69, 0.3)',
                                    color: 'white',
                                    borderRadius: '15px'
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                {/* Left Column - Trip Details */}
                                <Col lg={6}>
                                    <h4
                                        style={{
                                            color: 'white',
                                            marginBottom: '1.5rem',
                                            fontWeight: '600'
                                        }}
                                    >
                                        📋 Trip Details
                                    </h4>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                            Trip Title *
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                padding: '12px 16px'
                                            }}
                                            placeholder="e.g., Amazing Tokyo Adventure"
                                        />
                                    </Form.Group>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    Trip Type
                                                </Form.Label>
                                                <Form.Select
                                                    value={tripType}
                                                    onChange={(e) => setTripType(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                >
                                                    <option value="vacation">🏖️ Vacation</option>
                                                    <option value="business">💼 Business</option>
                                                    <option value="weekend">🌟 Weekend Getaway</option>
                                                    <option value="family">👨‍👩‍👧‍👦 Family Trip</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    Number of Travelers
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={travelerCount}
                                                    onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    Country
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                    placeholder="e.g., Japan"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    City 🗺️
                                                    {!mapsApiReady && (
                                                        <small style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '5px' }}>
                                                            (Loading location search...)
                                                        </small>
                                                    )}
                                                </Form.Label>
                                                <Form.Control
                                                    ref={cityAutocompleteRef}
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                    placeholder={mapsApiReady ? "Search for your destination city..." : "Enter city name..."}
                                                    disabled={!mapsApiReady}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* City Map Preview */}
                                    {mapsApiReady && selectedCityLocation && (
                                        <div className="mb-3">
                                            <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                📍 Destination Preview
                                            </Form.Label>
                                            <div
                                                ref={cityMapRef}
                                                style={{
                                                    height: '200px',
                                                    borderRadius: '15px',
                                                    border: '2px solid rgba(255,255,255,0.3)',
                                                    overflow: 'hidden'
                                                }}
                                            />
                                        </div>
                                    )}

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    Start Date
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    End Date
                                                </Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                            Budget (optional)
                                        </Form.Label>
                                        <Form.Control
                                            type="number"
                                            step="0.01"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                padding: '12px 16px'
                                            }}
                                            placeholder="e.g., 2500.00"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                            Trip Image (optional)
                                        </Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                padding: '12px 16px'
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                            Notes
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                borderRadius: '12px',
                                                color: 'white',
                                                padding: '12px 16px'
                                            }}
                                            placeholder="Any special notes about your trip..."
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Right Column - Destinations */}
                                <Col lg={6}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4
                                            style={{
                                                color: 'white',
                                                fontWeight: '600',
                                                margin: 0
                                            }}
                                        >
                                            📍 Places to Visit
                                        </h4>
                                        <Button
                                            type="button"
                                            onClick={addDestinationField}
                                            style={{
                                                background: 'linear-gradient(45deg, #ffd89b, #19547b)',
                                                border: 'none',
                                                color: 'white',
                                                borderRadius: '12px',
                                                padding: '8px 16px',
                                                fontSize: '0.9rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            + Add Place
                                        </Button>
                                    </div>

                                    <div style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                                        {destinations.map((dest, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '15px',
                                                    padding: '1.5rem',
                                                    marginBottom: '1rem',
                                                    position: 'relative'
                                                }}
                                            >
                                                {destinations.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeDestinationField(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            background: 'rgba(220, 53, 69, 0.3)',
                                                            border: '1px solid rgba(220, 53, 69, 0.5)',
                                                            color: 'white',
                                                            borderRadius: '50%',
                                                            width: '30px',
                                                            height: '30px',
                                                            padding: '0',
                                                            fontSize: '0.8rem'
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                )}

                                                <Form.Group className="mb-3">
                                                    <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                        Place Name *
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={dest.name}
                                                        onChange={(e) => updateDestination(index, 'name', e.target.value)}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid rgba(255,255,255,0.3)',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            padding: '10px 12px'
                                                        }}
                                                        placeholder="e.g., Tokyo Tower, Central Park"
                                                    />
                                                </Form.Group>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                                Type
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                value={dest.destination_type}
                                                                onChange={(e) => updateDestination(index, 'destination_type', e.target.value)}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                    borderRadius: '10px',
                                                                    color: 'white',
                                                                    padding: '10px 12px'
                                                                }}
                                                                placeholder="restaurant, attraction, etc."
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                                Priority
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={dest.priority_level}
                                                                onChange={(e) => updateDestination(index, 'priority_level', e.target.value)}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                    borderRadius: '10px',
                                                                    color: 'white',
                                                                    padding: '10px 12px'
                                                                }}
                                                            >
                                                                <option value={1}>⭐ Must See</option>
                                                                <option value={2}>🌟 High Priority</option>
                                                                <option value={3}>✨ Medium Priority</option>
                                                                <option value={4}>💫 Low Priority</option>
                                                                <option value={5}>🌙 If Time Allows</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Form.Group className="mb-3">
                                                    <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                        Address 🗺️
                                                        {!mapsApiReady && (
                                                            <small style={{ color: 'rgba(255,255,255,0.7)', marginLeft: '5px' }}>
                                                                (Location search loading...)
                                                            </small>
                                                        )}
                                                    </Form.Label>
                                                    <Form.Control
                                                        ref={(el) => destinationRefs.current[index] = el}
                                                        type="text"
                                                        value={dest.address}
                                                        onChange={(e) => updateDestination(index, 'address', e.target.value)}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid rgba(255,255,255,0.3)',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            padding: '10px 12px'
                                                        }}
                                                        placeholder={mapsApiReady ? "Search for specific address or location..." : "Enter address..."}
                                                        disabled={!mapsApiReady}
                                                    />
                                                    {dest.location_lat && dest.location_lng && (
                                                        <small style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                                                            📍 Location saved: {dest.location_lat.toFixed(4)}, {dest.location_lng.toFixed(4)}
                                                        </small>
                                                    )}
                                                </Form.Group>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                                Visit Date
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                value={dest.visit_date}
                                                                onChange={(e) => updateDestination(index, 'visit_date', e.target.value)}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                    borderRadius: '10px',
                                                                    color: 'white',
                                                                    padding: '10px 12px'
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                                Visit Time
                                                            </Form.Label>
                                                            <Form.Control
                                                                type="time"
                                                                value={dest.visit_time}
                                                                onChange={(e) => updateDestination(index, 'visit_time', e.target.value)}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                    borderRadius: '10px',
                                                                    color: 'white',
                                                                    padding: '10px 12px'
                                                                }}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                                Price Range
                                                            </Form.Label>
                                                            <Form.Select
                                                                value={dest.price_range}
                                                                onChange={(e) => updateDestination(index, 'price_range', e.target.value)}
                                                                style={{
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                                    borderRadius: '10px',
                                                                    color: 'white',
                                                                    padding: '10px 12px'
                                                                }}
                                                            >
                                                                <option value="">Select price range</option>
                                                                <option value="$">$ Budget-friendly</option>
                                                                <option value="$$">$$ Moderate</option>
                                                                <option value="$$$">$$$ Expensive</option>
                                                                <option value="$$$$">$$$$ Luxury</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <Form.Group className="mb-0">
                                                    <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                        Description
                                                    </Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        value={dest.description}
                                                        onChange={(e) => updateDestination(index, 'description', e.target.value)}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid rgba(255,255,255,0.3)',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            padding: '10px 12px'
                                                        }}
                                                        placeholder="What makes this place special?"
                                                    />
                                                </Form.Group>
                                            </div>
                                        ))}
                                    </div>
                                </Col>
                            </Row>

                            {/* Submit Button */}
                            <div className="text-center mt-4">
                                <Button
                                    type="submit"
                                    disabled={uploading}
                                    style={{
                                        background: uploading
                                            ? 'rgba(108, 117, 125, 0.3)'
                                            : 'linear-gradient(45deg, #ffd89b, #19547b)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '15px 40px',
                                        fontSize: '1.1rem',
                                        borderRadius: '20px',
                                        fontWeight: '600',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                        transition: 'all 0.3s ease',
                                        minWidth: '200px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!uploading) {
                                            e.target.style.transform = 'translateY(-3px)';
                                            e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!uploading) {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                        }
                                    }}
                                >
                                    {uploading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                style={{ marginRight: '10px' }}
                                            />
                                            Creating Trip...
                                        </>
                                    ) : (
                                        <>
                                            ✨ Create Amazing Trip
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Container>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); }
                        50% { transform: translateY(-20px) rotate(5deg); }
                    }
                    
                    /* Custom scrollbar for destinations */
                    ::-webkit-scrollbar {
                        width: 8px;
                    }
                    
                    ::-webkit-scrollbar-track {
                        background: rgba(255,255,255,0.1);
                        border-radius: 10px;
                    }
                    
                    ::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.3);
                        border-radius: 10px;
                    }
                    
                    ::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.5);
                    }
                    
                    /* Form control focus states */
                    .form-control:focus,
                    .form-select:focus {
                        background: rgba(255,255,255,0.2) !important;
                        border-color: rgba(255,255,255,0.5) !important;
                        box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important;
                        color: white !important;
                    }
                    
                    /* Placeholder text color */
                    .form-control::placeholder {
                        color: rgba(255,255,255,0.6) !important;
                    }
                    
                    /* Select option styling */
                    .form-select option {
                        background: #667eea !important;
                        color: white !important;
                    }
                `}</style>
            </div>
        </>
    );
}

export default CreateTrip;