import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDestinationsByTripId, getPhotosForTrip } from '../services/api';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

export default function TripPhotos() {
    const { tripId } = useParams();
    const [destinations, setDestinations] = useState([]);
    const [photosByDestination, setPhotosByDestination] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dests = await getDestinationsByTripId(tripId);
                setDestinations(dests);

                const allPhotos = await getPhotosForTrip(tripId);

                const grouped = {};
                dests.forEach(dest => {
                    grouped[dest.id] = allPhotos.filter(photo => photo.destination_id === dest.id);
                });

                setPhotosByDestination(grouped);
            } catch (err) {
                console.error('Failed to fetch destinations or photos', err);
            }
        };

        fetchData();
    }, [tripId]);

    return (
        <Container className="mt-4">
            <h2 className="mb-4">All Trip Photos</h2>

            {destinations.map(dest => (
                <Card key={dest.id} className="mb-4 shadow-sm">
                    <Card.Body>
                        <Card.Title>{dest.name}</Card.Title>
                        <Row>
                            {photosByDestination[dest.id]?.length > 0 ? (
                                photosByDestination[dest.id].map(photo => (
                                    <Col key={photo.id} xs={6} md={3} className="mb-3">
                                        <Image
                                            src={photo.image_url}
                                            alt={photo.caption || 'Trip photo'}
                                            thumbnail
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                    </Col>
                                ))
                            ) : (
                                <Col><p>No photos for this destination.</p></Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}