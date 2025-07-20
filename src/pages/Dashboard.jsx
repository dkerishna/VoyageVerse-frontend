import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { getUserTrips } from '../services/api';
import TripCard from '../components/TripCard';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Spinner } from 'react-bootstrap';

export default function Dashboard() {
    const { currentUser } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await getUserTrips();
                console.log('Fetched trips:', data);
                setTrips(data);
            } catch (error) {
                console.error('Failed to fetch trips:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) fetchTrips();
    }, [currentUser]);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading your trips...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Trips</h2>
                <Button onClick={() => navigate('/create-trip')}>+ Create Trip</Button>
            </div>

            {trips.length === 0 ? (
                <p>You have no trips yet. Start by creating one!</p>
            ) : (
                <Row>
                    {trips.map((trip) => (
                        <Col md={4} sm={6} xs={12} key={trip.id} className="mb-4">
                            <TripCard trip={trip} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}