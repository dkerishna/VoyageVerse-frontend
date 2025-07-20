import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TripCard({ trip }) {
    const navigate = useNavigate();

    return (
        <Card className="shadow-sm h-100">
            {trip.image_url && (
                <Card.Img
                    variant="top"
                    src={trip.image_url}
                    alt={trip.title}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
            )}
            <Card.Body className="d-flex flex-column">
                <Card.Title>{trip.title}</Card.Title>
                <Card.Text>
                    <strong>Date:</strong> {trip.date}
                </Card.Text>
                <Button
                    variant="primary"
                    className="mt-auto"
                    onClick={() => navigate(`/trip/${trip.id}`)}
                >
                    View Details
                </Button>
            </Card.Body>
        </Card>
    );
}