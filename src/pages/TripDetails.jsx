import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, getPhotosForTrip } from '../services/api';
import { Spinner, Container, Card, Button, Row, Col, Image } from 'react-bootstrap';
import PhotoUploader from '../components/PhotoUploader';

export default function TripDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const tripData = await getTripById(id);
                setTrip(tripData);

                const photosData = await getPhotosForTrip(id);
                setPhotos(photosData);
            } catch (err) {
                console.error('Error fetching trip or photos:', err);
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

                    <Button variant="warning" onClick={() => navigate(`/edit-trip/${trip.id}`)}>
                        Edit Trip
                    </Button>
                </Card.Body>
            </Card>

            <div className="mt-4">
                <h4>Upload Photos</h4>
                <PhotoUploader
                    tripId={id}
                    onUploadSuccess={async () => {
                        const photosData = await getPhotosForTrip(id);
                        setPhotos(photosData);
                    }}
                />
            </div>

            <div className="mt-4">
                <h4>Trip Photos</h4>
                {photos.length > 0 ? (
                    <Row>
                        {photos.map(photo => (
                            <Col key={photo.id} xs={6} md={4} lg={3} className="mb-4">
                                <Image
                                    src={photo.image_url}
                                    alt={photo.caption || 'Trip photo'}
                                    thumbnail
                                    style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                                />
                                {photo.caption && (
                                    <div className="mt-1 text-muted text-center small">{photo.caption}</div>
                                )}
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No photos uploaded for this trip yet.</p>
                )}
            </div>
        </Container>
    );
}