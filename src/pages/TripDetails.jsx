import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById } from '../services/api';
import { Spinner, Container, Card, Button } from 'react-bootstrap';

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const data = await getTripById(id);
                setTrip(data);
            } catch (err) {
                console.error('Error fetching trip:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
    }, [id]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!trip) {
        return (
            <Container className="text-center mt-5">
                <p>Trip not found.</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                {trip.image_url && (
                    <Card.Img
                        variant="top"
                        src={trip.image_url}
                        alt={trip.title}
                        style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                )}
                <Card.Body>
                    <Card.Title>{trip.title}</Card.Title>
                    <Card.Text>{trip.description}</Card.Text>

                    {/* Optional: Edit button */}
                    <Button variant="warning" onClick={() => navigate(`/edit-trip/${trip.id}`)}>
                        Edit Trip
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}