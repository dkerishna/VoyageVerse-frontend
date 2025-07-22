import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getTripById,
    updateTrip,
    getDestinationsByTripId,
    addDestination,
    deleteDestination,
    updateDestination,
} from '../services/api';
import {
    Container,
    Form,
    Button,
    Spinner,
    Card,
    Row,
    Col,
    Modal,
} from 'react-bootstrap';

export default function EditTrip() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        notes: '',
        start_date: '',
        end_date: '',
        country: '',
        city: '',
    });
    const [destinations, setDestinations] = useState([]);
    const [newDestination, setNewDestination] = useState({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
    });

    const [editingDestination, setEditingDestination] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
                });

                const dests = await getDestinationsByTripId(id);
                setDestinations(dests);
            } catch (error) {
                console.error('Error fetching trip or destinations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTripAndDestinations();
    }, [id]);

    const handleTripChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTripSave = async () => {
        try {
            await updateTrip(id, formData);
            alert('Trip updated!');
        } catch (err) {
            console.error('Error updating trip:', err);
        }
    };

    const handleDestinationChange = (e) => {
        const { name, value } = e.target;
        setNewDestination((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddDestination = async () => {
        try {
            await addDestination(id, newDestination);
            const updated = await getDestinationsByTripId(id);
            setDestinations(updated);
            setNewDestination({ name: '', description: '', latitude: '', longitude: '' });
        } catch (err) {
            console.error('Error adding destination:', err);
        }
    };

    const handleDeleteDestination = async (destId) => {
        if (!window.confirm('Are you sure you want to delete this destination?')) return;

        try {
            await deleteDestination(destId);
            setDestinations((prev) => prev.filter((d) => d.id !== destId));
        } catch (err) {
            console.error('Error deleting destination:', err);
        }
    };

    const handleEditDestination = (dest) => {
        setEditingDestination(dest);
        setShowModal(true);
    };

    const handleUpdateDestination = async () => {
        try {
            await updateDestination(editingDestination.id, editingDestination);
            const updated = await getDestinationsByTripId(id);
            setDestinations(updated);
            setShowModal(false);
            setEditingDestination(null);
        } catch (err) {
            console.error('Error updating destination:', err);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading trip details...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2>Edit Trip</h2>
            <Form>
                {['title', 'country', 'city', 'start_date', 'end_date', 'notes'].map((field) => (
                    <Form.Group key={field} className="mb-3">
                        <Form.Label>{field.replace('_', ' ').toUpperCase()}</Form.Label>
                        <Form.Control
                            type={field.includes('date') ? 'date' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleTripChange}
                        />
                    </Form.Group>
                ))}
                <Button onClick={handleTripSave}>Save Trip</Button>
            </Form>

            <hr />
            <h4>Destinations</h4>

            <Form className="mb-4">
                {['name', 'description', 'latitude', 'longitude'].map((field) => (
                    <Form.Group key={field} className="mb-2">
                        <Form.Label>{field.toUpperCase()}</Form.Label>
                        <Form.Control
                            type="text"
                            name={field}
                            value={newDestination[field]}
                            onChange={handleDestinationChange}
                        />
                    </Form.Group>
                ))}
                <Button onClick={handleAddDestination}>Add Destination</Button>
            </Form>

            <Row>
                {destinations.map((dest) => (
                    <Col md={6} key={dest.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>{dest.name}</Card.Title>
                                <Card.Text>{dest.description}</Card.Text>
                                <Card.Text>
                                    Lat: {dest.latitude}, Lng: {dest.longitude}
                                </Card.Text>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEditDestination(dest)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteDestination(dest.id)}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Destination Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Destination</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingDestination && (
                        <Form>
                            {['name', 'description', 'latitude', 'longitude'].map((field) => (
                                <Form.Group key={field} className="mb-2">
                                    <Form.Label>{field.toUpperCase()}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name={field}
                                        value={editingDestination[field]}
                                        onChange={(e) =>
                                            setEditingDestination((prev) => ({
                                                ...prev,
                                                [field]: e.target.value,
                                            }))
                                        }
                                    />
                                </Form.Group>
                            ))}
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdateDestination}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}