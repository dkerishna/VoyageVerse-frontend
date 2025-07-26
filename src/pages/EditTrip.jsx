import React, { useEffect, useState } from 'react';
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
        setDestinations([...destinations, {
            name: '',
            description: '',
            destination_type: '',
            address: '',
            visit_date: '',
            visit_time: '',
            price_range: '',
            priority_level: 3,
            isNew: true
        }]);
    };

    const removeDestinationField = async (index) => {
        const dest = destinations[index];
        if (dest.isNew) {
            // Just remove from UI if it's a new destination
            setDestinations(destinations.filter((_, i) => i !== index));
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
                        priority_level: parseInt(dest.priority_level) || 3
                    });
                } else if (!dest.isNew && dest.id) {
                    // Update existing destination
                    await updateDestinationAPI(dest.id, {
                        ...dest,
                        order_index: i + 1,
                        priority_level: parseInt(dest.priority_level) || 3
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
                                                    City
                                                </Form.Label>
                                                <Form.Control
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
                                                    placeholder="e.g., Tokyo"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

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
                                                {destinations.length > 0 && (
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
                                                        Address
                                                    </Form.Label>
                                                    <Form.Control
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
                                                        placeholder="Full address or general location"
                                                    />
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

                <style jsx>{`
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