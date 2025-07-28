import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getTripById,
    updateTrip,
    getDestinationsByTripId,
    addDestination,
    deleteDestination,
    updateDestination as updateDestinationAPI,
} from '../services/api';
import {
    Container,
    Form,
    Button,
    Spinner,
    Row,
    Col,
    Alert
} from 'react-bootstrap';

export default function EditTrip() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Trip form data
    const [formData, setFormData] = useState({
        title: '',
        notes: '',
        start_date: '',
        end_date: '',
        country: '',
        city: '',
        trip_type: 'vacation',
        budget: '',
        traveler_count: 1,
        is_favorite: false,
        trip_rating: ''
    });

    // Destinations
    const [destinations, setDestinations] = useState([]);

    // Google Maps state
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedCityLocation, setSelectedCityLocation] = useState(null);

    // Refs for Google Maps autocomplete
    const cityAutocompleteRef = useRef(null);
    const destinationRefs = useRef([]);
    const cityMapRef = useRef(null);
    const cityMapInstanceRef = useRef(null);
    const cityMarkerRef = useRef(null);

    // Load Google Maps Script
    useEffect(() => {
        const loadGoogleMapsScript = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setMapLoaded(true);
                return;
            }

            const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
            if (existingScript) {
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
    }, []);

    useEffect(() => {
        const fetchTripAndDestinations = async () => {
            try {
                const trip = await getTripById(id);
                setFormData({
                    title: trip.title || '',
                    notes: trip.notes || '',
                    start_date: trip.start_date?.slice(0, 10) || '',
                    end_date: trip.end_date?.slice(0, 10) || '',
                    country: trip.country || '',
                    city: trip.city || '',
                    trip_type: trip.trip_type || 'vacation',
                    budget: trip.budget || '',
                    traveler_count: trip.traveler_count || 1,
                    is_favorite: trip.is_favorite || false,
                    trip_rating: trip.trip_rating || ''
                });

                const dests = await getDestinationsByTripId(id);
                setDestinations(dests);
            } catch (error) {
                console.error('Error fetching trip or destinations:', error);
                setError('Failed to load trip data');
            } finally {
                setLoading(false);
            }
        };

        fetchTripAndDestinations();
    }, [id]);

    // Initialize Google Maps for city field
    useEffect(() => {
        if (!mapLoaded || !cityAutocompleteRef.current) return;

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

                setFormData(prev => ({
                    ...prev,
                    country: extractedCountry || prev.country,
                    city: extractedCity || place.name || prev.city
                }));
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
    }, [mapLoaded]);

    // Initialize city map
    useEffect(() => {
        if (!mapLoaded || !cityMapRef.current) return;

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
    }, [mapLoaded, selectedCityLocation]);

    // Initialize destination autocomplete for new fields
    const initializeDestinationAutocomplete = useCallback((index) => {
        if (!mapLoaded) return;

        setTimeout(() => {
            const ref = destinationRefs.current[index];
            if (!ref || ref.dataset.autocompleteInitialized) return;

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
        }, 100);
    }, [mapLoaded]);

    // Initialize autocomplete for existing destinations when maps load
    useEffect(() => {
        if (!mapLoaded) return;

        for (let i = 0; i < destinations.length; i++) {
            initializeDestinationAutocomplete(i);
        }
    }, [mapLoaded, destinations.length, initializeDestinationAutocomplete]);

    const handleTripChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            await updateTrip(id, formData);
            setSuccess('Trip updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating trip:', err);
            setError('Failed to update trip');
        } finally {
            setSaving(false);
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
            priority_level: 3,
            isNew: true
        }]);

        // Initialize autocomplete for the new field
        setTimeout(() => {
            initializeDestinationAutocomplete(newIndex);
        }, 100);
    };

    const removeDestinationField = async (index) => {
        const dest = destinations[index];
        if (dest.isNew) {
            // Just remove from UI if it's a new destination
            setDestinations(destinations.filter((_, i) => i !== index));
            // Clean up refs
            destinationRefs.current.splice(index, 1);
        } else {
            // Delete from database if it's an existing destination
            if (window.confirm('Are you sure you want to delete this destination?')) {
                try {
                    await deleteDestination(dest.id);
                    setDestinations((prev) => prev.filter((d) => d.id !== dest.id));
                    setSuccess('Destination deleted successfully!');
                    setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                    console.error('Error deleting destination:', err);
                    setError('Failed to delete destination');
                }
            }
        }
    };

    const updateDestination = (index, field, value) => {
        const newDestinations = [...destinations];
        newDestinations[index][field] = value;
        setDestinations(newDestinations);
    };

    const handleSaveDestinations = async () => {
        try {
            // Save new destinations and update existing ones
            for (let i = 0; i < destinations.length; i++) {
                const dest = destinations[i];
                if (dest.isNew && dest.name.trim()) {
                    // Add new destination
                    await addDestination(id, {
                        ...dest,
                        order_index: i + 1,
                        priority_level: parseInt(dest.priority_level) || 3,
                        location_lat: dest.location_lat,
                        location_lng: dest.location_lng
                    });
                } else if (!dest.isNew && dest.id) {
                    // Update existing destination
                    await updateDestinationAPI(dest.id, {
                        ...dest,
                        order_index: i + 1,
                        priority_level: parseInt(dest.priority_level) || 3,
                        location_lat: dest.location_lat,
                        location_lng: dest.location_lng
                    });
                }
            }

            // Refresh destinations list
            const updated = await getDestinationsByTripId(id);
            setDestinations(updated);
            setSuccess('All destinations saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error saving destinations:', err);
            setError('Failed to save destinations');
        }
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
                            onClick={() => navigate('/trip/:id')}
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
                            Edit Trip ✏️
                        </h2>
                    </div>

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
                        {/* Alerts */}
                        {error && (
                            <Alert
                                variant="danger"
                                style={{
                                    background: 'rgba(220, 53, 69, 0.2)',
                                    border: '1px solid rgba(220, 53, 69, 0.3)',
                                    color: 'white',
                                    borderRadius: '15px'
                                }}
                                onClose={() => setError('')}
                                dismissible
                            >
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert
                                variant="success"
                                style={{
                                    background: 'rgba(40, 167, 69, 0.2)',
                                    border: '1px solid rgba(40, 167, 69, 0.3)',
                                    color: 'white',
                                    borderRadius: '15px'
                                }}
                                onClose={() => setSuccess('')}
                                dismissible
                            >
                                {success}
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
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleTripChange}
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
                                                    name="trip_type"
                                                    value={formData.trip_type}
                                                    onChange={handleTripChange}
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
                                                    name="traveler_count"
                                                    value={formData.traveler_count}
                                                    onChange={handleTripChange}
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
                                                    name="country"
                                                    value={formData.country}
                                                    onChange={handleTripChange}
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
                                                </Form.Label>
                                                <Form.Control
                                                    ref={cityAutocompleteRef}
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleTripChange}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                    placeholder="Search for your destination city..."
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {/* City Map Preview */}
                                    {mapLoaded && selectedCityLocation && (
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
                                                    name="start_date"
                                                    value={formData.start_date}
                                                    onChange={handleTripChange}
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
                                                    name="end_date"
                                                    value={formData.end_date}
                                                    onChange={handleTripChange}
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
                                                    Budget (optional)
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    name="budget"
                                                    value={formData.budget}
                                                    onChange={handleTripChange}
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
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                                    Trip Rating (1-5)
                                                </Form.Label>
                                                <Form.Select
                                                    name="trip_rating"
                                                    value={formData.trip_rating}
                                                    onChange={handleTripChange}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        borderRadius: '12px',
                                                        color: 'white',
                                                        padding: '12px 16px'
                                                    }}
                                                >
                                                    <option value="">No rating</option>
                                                    <option value="1">⭐ 1 Star</option>
                                                    <option value="2">⭐⭐ 2 Stars</option>
                                                    <option value="3">⭐⭐⭐ 3 Stars</option>
                                                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                                                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            name="is_favorite"
                                            checked={formData.is_favorite}
                                            onChange={handleTripChange}
                                            style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                            }}
                                            label="⭐ Mark as Favorite"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label style={{ color: 'white', fontWeight: '500' }}>
                                            Notes
                                        </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleTripChange}
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
                                                key={dest.id || `new-${index}`}
                                                style={{
                                                    background: 'rgba(255,255,255,0.1)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '15px',
                                                    padding: '1.5rem',
                                                    marginBottom: '1rem',
                                                    position: 'relative'
                                                }}
                                            >
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

                                                <Form.Group className="mb-3">
                                                    <Form.Label style={{ color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>
                                                        Place Name *
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={dest.name || ''}
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
                                                                value={dest.destination_type || ''}
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
                                                                value={dest.priority_level || 3}
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
                                                    </Form.Label>
                                                    <Form.Control
                                                        ref={(el) => destinationRefs.current[index] = el}
                                                        type="text"
                                                        value={dest.address || ''}
                                                        onChange={(e) => updateDestination(index, 'address', e.target.value)}
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid rgba(255,255,255,0.3)',
                                                            borderRadius: '10px',
                                                            color: 'white',
                                                            padding: '10px 12px'
                                                        }}
                                                        placeholder="Search for specific address or location..."
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
                                                                value={dest.visit_date?.slice(0, 10) || ''}
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
                                                                value={dest.visit_time || ''}
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
                                                                value={dest.price_range || ''}
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
                                                                <option value="$">$ Moderate</option>
                                                                <option value="$$">$$ Expensive</option>
                                                                <option value="$$">$$ Luxury</option>
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
                                                        value={dest.description || ''}
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

                                        {destinations.length === 0 && (
                                            <div
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'rgba(255,255,255,0.7)',
                                                    padding: '2rem',
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                No destinations added yet. Click "Add Place" to start!
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            {/* Submit Buttons */}
                            <div className="text-center mt-4">
                                <Row>
                                    <Col md={6}>
                                        <Button
                                            type="submit"
                                            disabled={saving}
                                            style={{
                                                background: saving
                                                    ? 'rgba(108, 117, 125, 0.3)'
                                                    : 'linear-gradient(45deg, #ffd89b, #19547b)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '15px 20px',
                                                fontSize: '1.1rem',
                                                borderRadius: '20px',
                                                fontWeight: '600',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                width: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!saving) {
                                                    e.target.style.transform = 'translateY(-3px)';
                                                    e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!saving) {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                                }
                                            }}
                                        >
                                            {saving ? (
                                                <>
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{ marginRight: '10px' }}
                                                    />
                                                    Saving Trip...
                                                </>
                                            ) : (
                                                <>
                                                    💾 Save Trip Changes
                                                </>
                                            )}
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            type="button"
                                            onClick={handleSaveDestinations}
                                            style={{
                                                background: 'rgba(255,255,255,0.2)',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                color: 'white',
                                                padding: '15px 20px',
                                                fontSize: '1.1rem',
                                                borderRadius: '20px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                width: '100%'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = 'rgba(255,255,255,0.25)';
                                                e.target.style.transform = 'translateY(-3px)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = 'rgba(255,255,255,0.2)';
                                                e.target.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            📍 Save All Places
                                        </Button>
                                    </Col>
                                </Row>
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
                    
                    /* Checkbox styling */
                    .form-check-input:checked {
                        background-color: #ffd89b !important;
                        border-color: #ffd89b !important;
                    }
                    
                    .form-check-input:focus {
                        box-shadow: 0 0 0 0.2rem rgba(255, 216, 155, 0.25) !important;
                    }
                `}</style>
            </div>
        </>
    );
}