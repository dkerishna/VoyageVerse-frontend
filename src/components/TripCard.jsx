import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getPhotosForTrip } from '../services/api';

export default function TripCard({ trip }) {
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const data = await getPhotosForTrip(trip.id);
                setPhotos(data.slice(0, 4)); // show only 4 photos
            } catch (err) {
                console.error('Failed to fetch photos', err);
            }
        };

        fetchPhotos();
    }, [trip.id]);

    return (
        <Card className="shadow-sm mb-4">
            <Row className="g-0">
                <Col md={4} className="d-flex flex-column justify-content-between p-3">
                    {trip.image_url && (
                        <Card.Img
                            src={trip.image_url}
                            alt={trip.title}
                            style={{ height: '180px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                    )}
                    <div className="mt-3">
                        <Card.Title>{trip.title}</Card.Title>
                        <Card.Text>
                            <strong>Location:</strong> {trip.city}, {trip.country}<br />
                            <strong>Dates:</strong> {trip.start_date} to {trip.end_date}
                        </Card.Text>
                        <Button variant="primary" onClick={() => navigate(`/trip/${trip.id}`)}>
                            View Details
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="mt-2"
                            onClick={() => navigate(`/trips/${trip.id}/photos`)}
                        >
                            View All Photos
                        </Button>
                    </div>
                </Col>
                <Col md={8}>
                    <Row className="p-3">
                        {photos.map((photo) => (
                            <Col key={photo.id} xs={6} md={3} className="mb-3">
                                <Image
                                    src={photo.image_url}
                                    alt={photo.caption || 'Trip photo'}
                                    thumbnail
                                    style={{ width: '100%', height: '100px', objectFit: 'cover' }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}