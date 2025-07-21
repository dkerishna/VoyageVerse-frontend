import React, { useState } from 'react';
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

    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [image, setImage] = useState(null);
    const [destinations, setDestinations] = useState([
        { name: '', description: '', latitude: '', longitude: '' },
    ]);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

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
                image_url: imageUrl,
            });

            // Add destinations
            for (const dest of destinations) {
                await addDestination(trip.id, dest);
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
        setDestinations([...destinations, { name: '', description: '', latitude: '', longitude: '' }]);
    };

    const updateDestination = (index, field, value) => {
        const newDestinations = [...destinations];
        newDestinations[index][field] = value;
        setDestinations(newDestinations);
    };

    return (
        <Container className="my-4">
            <Button variant="secondary" onClick={() => navigate('/dashboard')} className="mb-3">
                ← Back to Dashboard
            </Button>

            <Card>
                <Card.Body>
                    <h2 className="mb-4">Create New Trip</h2>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="title" className="mb-3">
                                    <Form.Label>Trip Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="notes" className="mb-3">
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="country" className="mb-3">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="city" className="mb-3">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="startDate" className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="endDate" className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="image" className="mb-3">
                                    <Form.Label>Trip Image (optional)</Form.Label>
                                    <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <h5>Destinations</h5>
                                {destinations.map((dest, index) => (
                                    <Card key={index} className="mb-3 p-3">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Destination Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={dest.name}
                                                onChange={(e) => updateDestination(index, 'name', e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                value={dest.description}
                                                onChange={(e) => updateDestination(index, 'description', e.target.value)}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label>Latitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={dest.latitude}
                                                onChange={(e) => updateDestination(index, 'latitude', e.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-2">
                                            <Form.Label>Longitude</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={dest.longitude}
                                                onChange={(e) => updateDestination(index, 'longitude', e.target.value)}
                                            />
                                        </Form.Group>
                                    </Card>
                                ))}

                                <Button variant="outline-primary" onClick={addDestinationField}>
                                    + Add Destination
                                </Button>
                            </Col>
                        </Row>

                        <Button type="submit" className="mt-4" disabled={uploading}>
                            {uploading ? <Spinner animation="border" size="sm" /> : 'Create Trip'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CreateTrip;